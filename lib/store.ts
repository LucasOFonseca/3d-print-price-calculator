"use client";

import { create } from "zustand";
import { api } from "@/lib/api-client";
import type {
  AppConfig,
  Filament,
  PrintJob,
  CalculationResult,
  Packaging,
  Quote,
} from "./types";

// Helper debounce function
function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

const defaultFilaments: Filament[] = [
  {
    id: "1",
    name: "PLA Branco",
    spoolWeight: 1000,
    spoolPrice: 89.9,
    costPerGram: 0.0899,
  },
  {
    id: "2",
    name: "PLA Preto",
    spoolWeight: 1000,
    spoolPrice: 89.9,
    costPerGram: 0.0899,
  },
  {
    id: "3",
    name: "PETG Azul",
    spoolWeight: 1000,
    spoolPrice: 119.9,
    costPerGram: 0.1199,
  },
];

const defaultPackaging: Packaging[] = [
  {
    id: "1",
    name: "Caixa de Papelão Padrão",
    quantity: 10,
    packagePrice: 35.0,
    costPerUnit: 3.5,
  },
  {
    id: "2",
    name: "Saco Bolha Grande",
    quantity: 50,
    packagePrice: 45.0,
    costPerUnit: 0.9,
  },
];

const defaultConfig: AppConfig = {
  filaments: defaultFilaments,
  packaging: defaultPackaging,
  energy: {
    kwhPrice: 0.85,
    printerConsumption: 150,
  },
  printer: {
    wearCostPerHour: 1.5,
  },
  labor: {
    hourlyRate: 30.0,
  },
  profit: {
    defaultProfitMargin: 35,
  },
};

const defaultPrintJob: PrintJob = {
  filamentId: "1",
  materialUsed: 250,
  printTimeHours: 12,
  printTimeMinutes: 30,
  paintTimeHours: 1,
  paintTimeMinutes: 0,
  assemblyTimeHours: 0,
  assemblyTimeMinutes: 30,
  finishingTimeHours: 0,
  finishingTimeMinutes: 45,
  useDefaultMargin: true,
  profitMargin: 35,
  includePostProcessing: true,
  packagingId: "1",
  includePackaging: false,
};

const defaultResult: CalculationResult = {
  filamentCost: 0,
  energyCost: 0,
  printerWear: 0,
  laborCost: 0,
  packagingCost: 0,
  totalCost: 0,
  profit: 0,
  finalPrice: 0,
};

interface AppState {
  config: AppConfig;
  printJob: PrintJob;
  currentScreen: "calculator" | "settings";
  settingsTab:
    | "filaments"
    | "energy"
    | "printer"
    | "labor"
    | "profit"
    | "packaging";
  showImportModal: boolean;
  showExportModal: boolean;
  quotes: Quote[];
  result: CalculationResult;

  // Actions
  setConfig: (config: AppConfig) => void;
  updateFilament: (filament: Filament) => Promise<void>;
  addFilament: (
    filament: Omit<Filament, "id" | "costPerGram">,
  ) => Promise<void>;
  deleteFilament: (id: string) => Promise<void>;
  updatePackaging: (packaging: Packaging) => Promise<void>;
  addPackaging: (
    packaging: Omit<Packaging, "id" | "costPerUnit">,
  ) => Promise<void>;
  deletePackaging: (id: string) => Promise<void>;
  updateEnergyConfig: (config: Partial<AppConfig["energy"]>) => Promise<void>;
  updatePrinterConfig: (config: Partial<AppConfig["printer"]>) => Promise<void>;
  updateLaborConfig: (config: Partial<AppConfig["labor"]>) => Promise<void>;
  updateProfitConfig: (config: Partial<AppConfig["profit"]>) => Promise<void>;
  setPrintJob: (job: Partial<PrintJob>) => void;
  resetPrintJob: () => void;
  setCurrentScreen: (screen: "calculator" | "settings") => void;
  setSettingsTab: (
    tab: "filaments" | "energy" | "printer" | "labor" | "profit" | "packaging",
  ) => void;
  setShowImportModal: (show: boolean) => void;
  setShowExportModal: (show: boolean) => void;
  restoreDefaults: () => Promise<void>;
  importConfig: (config: AppConfig) => Promise<void>;
  calculateResult: () => Promise<void>;
  saveQuote: (name: string) => Promise<void>;
  loadQuote: (id: string) => Promise<void>;
  deleteQuote: (id: string) => Promise<void>;
}

// Debounced API patch helpers for config singletons
const debouncedPatchEnergy = debounce(async (get: () => AppState, set: any) => {
  try {
    const { config } = get();
    const res = await api.patch("/config/energy", config.energy);
    set((state: AppState) => ({
      config: {
        ...state.config,
        energy: res.data.data,
      },
    }));
  } catch (err) {
    console.error("Failed to update energy config:", err);
  }
}, 500);

const debouncedPatchPrinter = debounce(
  async (get: () => AppState, set: any) => {
    try {
      const { config } = get();
      const res = await api.patch("/config/printer", config.printer);
      set((state: AppState) => ({
        config: {
          ...state.config,
          printer: res.data.data,
        },
      }));
    } catch (err) {
      console.error("Failed to update printer config:", err);
    }
  },
  500,
);

const debouncedPatchLabor = debounce(async (get: () => AppState, set: any) => {
  try {
    const { config } = get();
    const res = await api.patch("/config/labor", config.labor);
    set((state: AppState) => ({
      config: {
        ...state.config,
        labor: res.data.data,
      },
    }));
  } catch (err) {
    console.error("Failed to update labor config:", err);
  }
}, 500);

const debouncedPatchProfit = debounce(async (get: () => AppState, set: any) => {
  try {
    const { config } = get();
    const res = await api.patch("/config/profit", config.profit);
    set((state: AppState) => ({
      config: {
        ...state.config,
        profit: res.data.data,
      },
    }));
  } catch (err) {
    console.error("Failed to update profit config:", err);
  }
}, 500);

export const useAppStore = create<AppState>((set, get) => ({
  config: defaultConfig,
  printJob: defaultPrintJob,
  currentScreen: "calculator",
  settingsTab: "filaments",
  showImportModal: false,
  showExportModal: false,
  quotes: [],
  result: defaultResult,

  setConfig: (config) => set({ config }),

  updateFilament: async (filament) => {
    const { id, ...data } = filament;
    const res = await api.patch(`/filaments/${id}`, data);
    const updated = res.data.data;
    set((state) => ({
      config: {
        ...state.config,
        filaments: state.config.filaments.map((f) =>
          f.id === id ? updated : f,
        ),
      },
    }));
  },

  addFilament: async (filament) => {
    const res = await api.post("/filaments", filament);
    const newFilament = res.data.data;
    set((state) => ({
      config: {
        ...state.config,
        filaments: [...state.config.filaments, newFilament],
      },
    }));
  },

  deleteFilament: async (id) => {
    await api.delete(`/filaments/${id}`);
    set((state) => ({
      config: {
        ...state.config,
        filaments: state.config.filaments.filter((f) => f.id !== id),
      },
    }));
  },

  updatePackaging: async (packaging) => {
    const { id, ...data } = packaging;
    const res = await api.patch(`/packaging/${id}`, data);
    const updated = res.data.data;
    set((state) => ({
      config: {
        ...state.config,
        packaging: (state.config.packaging || []).map((p) =>
          p.id === id ? updated : p,
        ),
      },
    }));
  },

  addPackaging: async (packaging) => {
    const res = await api.post("/packaging", packaging);
    const newPackaging = res.data.data;
    set((state) => ({
      config: {
        ...state.config,
        packaging: [...(state.config.packaging || []), newPackaging],
      },
    }));
  },

  deletePackaging: async (id) => {
    await api.delete(`/packaging/${id}`);
    set((state) => ({
      config: {
        ...state.config,
        packaging: (state.config.packaging || []).filter((p) => p.id !== id),
      },
    }));
  },

  updateEnergyConfig: async (energy) => {
    set((state) => ({
      config: {
        ...state.config,
        energy: { ...state.config.energy, ...energy },
      },
    }));
    debouncedPatchEnergy(get, set);
  },

  updatePrinterConfig: async (printer) => {
    set((state) => ({
      config: {
        ...state.config,
        printer: { ...state.config.printer, ...printer },
      },
    }));
    debouncedPatchPrinter(get, set);
  },

  updateLaborConfig: async (labor) => {
    set((state) => ({
      config: {
        ...state.config,
        labor: { ...state.config.labor, ...labor },
      },
    }));
    debouncedPatchLabor(get, set);
  },

  updateProfitConfig: async (profit) => {
    set((state) => ({
      config: {
        ...state.config,
        profit: { ...state.config.profit, ...profit },
      },
    }));
    debouncedPatchProfit(get, set);
  },

  setPrintJob: (job) =>
    set((state) => ({
      printJob: { ...state.printJob, ...job },
    })),

  resetPrintJob: () => set({ printJob: defaultPrintJob }),

  setCurrentScreen: (currentScreen) => set({ currentScreen }),

  setSettingsTab: (settingsTab) => set({ settingsTab }),

  setShowImportModal: (showImportModal) => set({ showImportModal }),

  setShowExportModal: (showExportModal) => set({ showExportModal }),

  restoreDefaults: async () => {
    const res = await api.post("/config/restore-defaults");
    set({ config: res.data.data });
  },

  importConfig: async (config) => {
    const res = await api.post("/config/import", config);
    set({ config: res.data.data });
  },

  calculateResult: async () => {
    const { printJob } = get();
    try {
      const res = await api.post("/calculator/calculate", printJob);
      set({ result: res.data.data });
    } catch (err) {
      console.error("Failed to calculate result:", err);
    }
  },

  saveQuote: async (name: string) => {
    const { printJob } = get();
    try {
      const res = await api.post("/quotes", { name, printJob });
      const newQuote = res.data.data;
      set((state) => ({
        quotes: [newQuote, ...(state.quotes || [])],
      }));
      get().resetPrintJob();
    } catch (err) {
      console.error("Failed to save quote:", err);
    }
  },

  deleteQuote: async (id: string) => {
    try {
      await api.delete(`/quotes/${id}`);
      set((state) => ({
        quotes: (state.quotes || []).filter((q) => q.id !== id),
      }));
    } catch (err) {
      console.error("Failed to delete quote:", err);
    }
  },

  loadQuote: async (id: string) => {
    try {
      const res = await api.post(`/quotes/${id}/load`);
      set({ printJob: res.data.data });
    } catch (err) {
      console.error("Failed to load quote:", err);
    }
  },
}));
