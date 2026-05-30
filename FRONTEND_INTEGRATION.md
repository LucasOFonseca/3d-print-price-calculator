# Frontend Integration Guide

> **Sprint 4 — Migration from Zustand localStorage to API calls**

This guide walks through migrating the existing Next.js frontend from persisting state in `localStorage` (via Zustand's `persist` middleware) to fetching and mutating data through the NestJS REST API.

---

## 1. Prerequisites

- Backend running at `http://localhost:3001` (or set `NEXT_PUBLIC_API_URL`)
- All 19 API endpoints available (verify at `http://localhost:3001/api/docs`)

---

## 2. Axios Client Setup

Create a shared Axios instance that all API calls will use:

```typescript
// lib/api-client.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
})
```

No authentication headers are required — all endpoints are open.

> **Note:** All successful API responses are wrapped in `{ success: true, data: <payload> }`. Error responses follow `{ success: false, message: string, statusCode: number }`.

---

## 3. Remove Zustand `persist` Middleware

Find your store definition and remove the `persist` wrapper. Before:

```typescript
// BEFORE — with localStorage persistence
export const useAppStore = create(
  persist(
    (set, get) => ({
      // ...store definition
    }),
    { name: 'app-store' }
  )
)
```

After:

```typescript
// AFTER — plain Zustand store, no localStorage
export const useAppStore = create<AppStore>((set, get) => ({
  // ...store definition
}))
```

---

## 4. Initial Hydration Pattern

On application start, fetch config and quotes from the server and populate the Zustand store. Place this in your top-level layout or a dedicated provider component:

```typescript
// app/layout.tsx (or providers/AppProvider.tsx)
'use client'

import { useEffect } from 'react'
import { api } from '@/lib/api-client'
import { useAppStore } from '@/store/app-store'

export function AppProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    async function hydrate() {
      const [configRes, quotesRes] = await Promise.all([
        api.get('/config'),
        api.get('/quotes'),
      ])
      useAppStore.setState({
        config: configRes.data.data,
        quotes: quotesRes.data.data,
      })
    }
    hydrate()
  }, [])

  return <>{children}</>
}
```

---

## 5. Zustand Store Action → API Endpoint Mapping

Replace each Zustand action's local mutation with an API call followed by a state update.

| Store Action | HTTP Method & Endpoint | Notes |
|---|---|---|
| `addFilament` | `POST /filaments` | Response includes server-calculated `costPerGram` |
| `updateFilament` | `PATCH /filaments/:id` | `costPerGram` recalculated server-side |
| `deleteFilament` | `DELETE /filaments/:id` | |
| `addPackaging` | `POST /packaging` | Response includes server-calculated `costPerUnit` |
| `updatePackaging` | `PATCH /packaging/:id` | `costPerUnit` recalculated server-side |
| `deletePackaging` | `DELETE /packaging/:id` | |
| `updateEnergyConfig` | `PATCH /config/energy` | |
| `updatePrinterConfig` | `PATCH /config/printer` | |
| `updateLaborConfig` | `PATCH /config/labor` | |
| `updateProfitConfig` | `PATCH /config/profit` | |
| `calculateResult` | `POST /calculator/calculate` | Pass current `printJob` state as body |
| `saveQuote` | `POST /quotes` | Body: `{ name: string, printJob: PrintJob }` |
| `deleteQuote` | `DELETE /quotes/:id` | |
| `loadQuote` | `POST /quotes/:id/load` | Returns `PrintJob` — set into Zustand `printJob` |
| `importConfig` | `POST /config/import` | Atomic — rolls back all changes on any failure |
| `restoreDefaults` | `POST /config/restore-defaults` | Atomic — resets configs + filaments + packaging |

---

## 6. Migrated Action Examples

### addFilament

```typescript
addFilament: async (data: CreateFilamentPayload) => {
  const res = await api.post('/filaments', data)
  const newFilament = res.data.data
  set((state) => ({
    config: {
      ...state.config,
      filaments: [...state.config.filaments, newFilament],
    },
  }))
},
```

### updateFilament

```typescript
updateFilament: async (id: string, data: UpdateFilamentPayload) => {
  const res = await api.patch(`/filaments/${id}`, data)
  const updated = res.data.data
  set((state) => ({
    config: {
      ...state.config,
      filaments: state.config.filaments.map((f) => (f.id === id ? updated : f)),
    },
  }))
},
```

### calculateResult

```typescript
calculateResult: async () => {
  const { printJob } = get()
  const res = await api.post('/calculator/calculate', printJob)
  set({ result: res.data.data })
},
```

### saveQuote

```typescript
saveQuote: async (name: string) => {
  const { printJob } = get()
  const res = await api.post('/quotes', { name, printJob })
  const newQuote = res.data.data
  set((state) => ({ quotes: [newQuote, ...state.quotes] }))
},
```

### loadQuote

```typescript
loadQuote: async (id: string) => {
  const res = await api.post(`/quotes/${id}/load`)
  set({ printJob: res.data.data })
},
```

### importConfig

```typescript
importConfig: async (json: ConfigExport) => {
  const res = await api.post('/config/import', json)
  set({ config: res.data.data })
},
```

### restoreDefaults

```typescript
restoreDefaults: async () => {
  const res = await api.post('/config/restore-defaults')
  set({ config: res.data.data })
},
```

---

## 7. API Response Shape Reference

### `GET /api/config`
```json
{
  "success": true,
  "data": {
    "energy":    { "id": "singleton", "kwhPrice": 0.85, "printerConsumption": 150 },
    "printer":   { "id": "singleton", "wearCostPerHour": 1.50 },
    "labor":     { "id": "singleton", "hourlyRate": 30.00 },
    "profit":    { "id": "singleton", "defaultProfitMargin": 35 },
    "filaments": [ { "id": "uuid", "name": "PLA Branco", "spoolWeight": 1000, "spoolPrice": 89.90, "costPerGram": 0.0899 } ],
    "packaging": [ { "id": "uuid", "name": "Caixa de Papelão Padrão", "quantity": 10, "packagePrice": 35.00, "costPerUnit": 3.50 } ]
  }
}
```

### `POST /api/calculator/calculate` (response)
```json
{
  "success": true,
  "data": {
    "filamentCost": 10.00,
    "energyCost":   0.40,
    "printerWear":  4.00,
    "laborCost":    6.00,
    "packagingCost": 0.00,
    "totalCost":    20.40,
    "profit":       10.20,
    "finalPrice":   30.60
  }
}
```

### `GET /api/quotes` (response item)
```json
{
  "id": "uuid",
  "name": "Quote Alpha",
  "date": "2026-05-30T03:00:00.000Z",
  "printJob": {
    "filamentId": "uuid",
    "filamentName": "PLA Branco",
    "materialUsed": 100,
    "printTimeHours": 2,
    "printTimeMinutes": 0,
    "includePostProcessing": false,
    "packagingId": null,
    "packagingName": null,
    "includePackaging": false,
    "useDefaultMargin": true,
    "profitMargin": 35
  },
  "result": {
    "filamentCost": 8.99,
    "energyCost":   0.26,
    "printerWear":  3.00,
    "laborCost":    6.00,
    "packagingCost": 0,
    "totalCost":    18.25,
    "profit":       6.39,
    "finalPrice":   24.64
  }
}
```

---

## 8. Error Handling

All error responses follow a consistent shape. Handle them in a shared Axios interceptor:

```typescript
// lib/api-client.ts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? 'Unexpected error'
    const status  = error.response?.data?.statusCode ?? 500
    // surface to UI (toast, error boundary, etc.)
    console.error(`API Error ${status}:`, message)
    return Promise.reject(error)
  }
)
```

Common status codes:

| Code | Meaning |
|---|---|
| `200` | Success (GET, PATCH, DELETE) |
| `201` | Created (POST) |
| `400` | Validation error — check `message` field |
| `404` | Resource not found |
| `429` | Rate limit exceeded (120 req/min) — back off and retry |

---

## 9. Rate Limiting

The API enforces **120 requests per 60 seconds** per IP. The frontend should:
- Debounce rapid user interactions (e.g., calculator recalculations).
- Show a user-friendly message on `429` responses.
- Not poll the API — use event-driven patterns instead.

---

## 10. Full API Endpoint List

All endpoints are prefixed with `/api`. See live docs at `http://localhost:3001/api/docs`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/config` | Get complete config (energy + printer + labor + profit + filaments + packaging) |
| `PATCH` | `/config/energy` | Update energy config singleton |
| `PATCH` | `/config/printer` | Update printer config singleton |
| `PATCH` | `/config/labor` | Update labor config singleton |
| `PATCH` | `/config/profit` | Update profit config singleton |
| `GET` | `/config/export` | Export config as JSON |
| `POST` | `/config/import` | Import config (atomic) |
| `POST` | `/config/restore-defaults` | Restore all defaults (atomic) |
| `GET` | `/filaments` | List all filaments |
| `GET` | `/filaments/:id` | Get single filament |
| `POST` | `/filaments` | Create filament |
| `PATCH` | `/filaments/:id` | Update filament |
| `DELETE` | `/filaments/:id` | Delete filament |
| `GET` | `/packaging` | List all packaging |
| `GET` | `/packaging/:id` | Get single packaging |
| `POST` | `/packaging` | Create packaging |
| `PATCH` | `/packaging/:id` | Update packaging |
| `DELETE` | `/packaging/:id` | Delete packaging |
| `POST` | `/calculator/calculate` | Perform stateless price calculation |
| `GET` | `/quotes` | List all quotes (newest-first) |
| `POST` | `/quotes` | Save a quote snapshot |
| `GET` | `/quotes/:id` | Get quote by id |
| `DELETE` | `/quotes/:id` | Delete a quote |
| `POST` | `/quotes/:id/load` | Load PrintJob from a saved quote |
| `GET` | `/health` | Health check (DB status) |
