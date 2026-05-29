"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppConfig, Filament, PrintJob, CalculationResult, Packaging, Quote } from './types'

const defaultFilaments: Filament[] = [
  {
    id: '1',
    name: 'PLA Branco',
    spoolWeight: 1000,
    spoolPrice: 89.90,
    costPerGram: 0.0899
  },
  {
    id: '2',
    name: 'PLA Preto',
    spoolWeight: 1000,
    spoolPrice: 89.90,
    costPerGram: 0.0899
  },
  {
    id: '3',
    name: 'PETG Azul',
    spoolWeight: 1000,
    spoolPrice: 119.90,
    costPerGram: 0.1199
  }
]

const defaultPackaging: Packaging[] = [
  {
    id: '1',
    name: 'Caixa de Papelão Padrão',
    quantity: 10,
    packagePrice: 35.00,
    costPerUnit: 3.50
  },
  {
    id: '2',
    name: 'Saco Bolha Grande',
    quantity: 50,
    packagePrice: 45.00,
    costPerUnit: 0.90
  }
]

const defaultConfig: AppConfig = {
  filaments: defaultFilaments,
  packaging: defaultPackaging,
  energy: {
    kwhPrice: 0.85,
    printerConsumption: 150
  },
  printer: {
    wearCostPerHour: 1.50
  },
  labor: {
    hourlyRate: 30.00
  },
  profit: {
    defaultProfitMargin: 35
  }
}

const defaultPrintJob: PrintJob = {
  filamentId: '1',
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
  notes: '',
  includePostProcessing: true,
  packagingId: '1',
  includePackaging: false
}

interface AppState {
  config: AppConfig
  printJob: PrintJob
  currentScreen: 'calculator' | 'settings'
  settingsTab: 'filaments' | 'energy' | 'printer' | 'labor' | 'profit' | 'packaging'
  showImportModal: boolean
  showExportModal: boolean
  quotes: Quote[]
  
  // Actions
  setConfig: (config: AppConfig) => void
  updateFilament: (filament: Filament) => void
  addFilament: (filament: Omit<Filament, 'id' | 'costPerGram'>) => void
  deleteFilament: (id: string) => void
  updatePackaging: (packaging: Packaging) => void
  addPackaging: (packaging: Omit<Packaging, 'id' | 'costPerUnit'>) => void
  deletePackaging: (id: string) => void
  updateEnergyConfig: (config: Partial<AppConfig['energy']>) => void
  updatePrinterConfig: (config: Partial<AppConfig['printer']>) => void
  updateLaborConfig: (config: Partial<AppConfig['labor']>) => void
  updateProfitConfig: (config: Partial<AppConfig['profit']>) => void
  setPrintJob: (job: Partial<PrintJob>) => void
  resetPrintJob: () => void
  setCurrentScreen: (screen: 'calculator' | 'settings') => void
  setSettingsTab: (tab: 'filaments' | 'energy' | 'printer' | 'labor' | 'profit' | 'packaging') => void
  setShowImportModal: (show: boolean) => void
  setShowExportModal: (show: boolean) => void
  restoreDefaults: () => void
  importConfig: (config: AppConfig) => void
  calculateResult: () => CalculationResult
  saveQuote: (name: string) => void
  loadQuote: (id: string) => void
  deleteQuote: (id: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      printJob: defaultPrintJob,
      currentScreen: 'calculator',
      settingsTab: 'filaments',
      showImportModal: false,
      showExportModal: false,
      quotes: [],

      setConfig: (config) => set({ config }),
      
      updateFilament: (filament) => set((state) => ({
        config: {
          ...state.config,
          filaments: state.config.filaments.map((f) =>
            f.id === filament.id ? filament : f
          )
        }
      })),

      addFilament: (filament) => set((state) => {
        const costPerGram = filament.spoolPrice / filament.spoolWeight
        const newFilament: Filament = {
          ...filament,
          id: Date.now().toString(),
          costPerGram
        }
        return {
          config: {
            ...state.config,
            filaments: [...state.config.filaments, newFilament]
          }
        }
      }),

      deleteFilament: (id) => set((state) => ({
        config: {
          ...state.config,
          filaments: state.config.filaments.filter((f) => f.id !== id)
        }
      })),

      updatePackaging: (packaging) => set((state) => ({
        config: {
          ...state.config,
          packaging: (state.config.packaging || []).map((p) =>
            p.id === packaging.id ? packaging : p
          )
        }
      })),

      addPackaging: (packaging) => set((state) => {
        const costPerUnit = packaging.packagePrice / packaging.quantity
        const newPackaging: Packaging = {
          ...packaging,
          id: Date.now().toString(),
          costPerUnit
        }
        return {
          config: {
            ...state.config,
            packaging: [...(state.config.packaging || []), newPackaging]
          }
        }
      }),

      deletePackaging: (id) => set((state) => ({
        config: {
          ...state.config,
          packaging: (state.config.packaging || []).filter((p) => p.id !== id)
        }
      })),

      updateEnergyConfig: (energy) => set((state) => ({
        config: {
          ...state.config,
          energy: { ...state.config.energy, ...energy }
        }
      })),

      updatePrinterConfig: (printer) => set((state) => ({
        config: {
          ...state.config,
          printer: { ...state.config.printer, ...printer }
        }
      })),

      updateLaborConfig: (labor) => set((state) => ({
        config: {
          ...state.config,
          labor: { ...state.config.labor, ...labor }
        }
      })),

      updateProfitConfig: (profit) => set((state) => ({
        config: {
          ...state.config,
          profit: { ...state.config.profit, ...profit }
        }
      })),

      setPrintJob: (job) => set((state) => ({
        printJob: { ...state.printJob, ...job }
      })),

      resetPrintJob: () => set({ printJob: defaultPrintJob }),

      setCurrentScreen: (currentScreen) => set({ currentScreen }),
      
      setSettingsTab: (settingsTab) => set({ settingsTab }),

      setShowImportModal: (showImportModal) => set({ showImportModal }),

      setShowExportModal: (showExportModal) => set({ showExportModal }),

      restoreDefaults: () => set({ config: defaultConfig }),

      importConfig: (config) => set({
        config: {
          ...config,
          packaging: config.packaging || []
        }
      }),

      calculateResult: () => {
        const state = get()
        const { config, printJob } = state
        
        // Find selected filament
        const filament = config.filaments.find(f => f.id === printJob.filamentId)
        if (!filament) {
          return {
            filamentCost: 0,
            energyCost: 0,
            printerWear: 0,
            laborCost: 0,
            packagingCost: 0,
            totalCost: 0,
            profit: 0,
            finalPrice: 0
          }
        }

        // Calculate printing time in hours
        const printTime = printJob.printTimeHours + (printJob.printTimeMinutes / 60)
        
        // Calculate post-processing time in hours
        const postProcessingTime = printJob.includePostProcessing !== false
          ? (printJob.paintTimeHours + printJob.paintTimeMinutes / 60) +
            (printJob.assemblyTimeHours + printJob.assemblyTimeMinutes / 60) +
            (printJob.finishingTimeHours + printJob.finishingTimeMinutes / 60)
          : 0

        // Calculate costs
        const filamentCost = printJob.materialUsed * filament.costPerGram
        
        // Energy cost: (W / 1000) * hours * R$/kWh
        const energyCost = (config.energy.printerConsumption / 1000) * printTime * config.energy.kwhPrice
        
        // Printer depreciation
        const printerWear = printTime * config.printer.wearCostPerHour
        
        // Labor: printing time (monitoring) + post-processing time
        const laborCost = (printTime * 0.1 + postProcessingTime) * config.labor.hourlyRate

        // Packaging cost
        const packagingList = config.packaging || []
        const pkg = packagingList.find(p => p.id === printJob.packagingId)
        const packagingCost = (printJob.includePackaging && pkg) ? pkg.costPerUnit : 0

        // Total cost
        const totalCost = filamentCost + energyCost + printerWear + laborCost + packagingCost

        // Profit margin
        const profitMargin = printJob.useDefaultMargin 
          ? config.profit.defaultProfitMargin 
          : printJob.profitMargin

        // Final calculations
        const profit = totalCost * (profitMargin / 100)
        const finalPrice = totalCost + profit

        return {
          filamentCost,
          energyCost,
          printerWear,
          laborCost,
          packagingCost,
          totalCost,
          profit,
          finalPrice
        }
      },

      saveQuote: (name: string) => {
        const state = get()
        const result = state.calculateResult()
        
        const newQuote: Quote = {
          id: Date.now().toString(),
          name,
          date: new Date().toISOString(),
          printJob: { ...state.printJob },
          result
        }

        set((state) => ({
          quotes: [newQuote, ...(state.quotes || [])]
        }))

        state.resetPrintJob()
      },

      deleteQuote: (id: string) => set((state) => ({
        quotes: (state.quotes || []).filter((q) => q.id !== id)
      })),

      loadQuote: (id: string) => {
        const state = get()
        const quote = (state.quotes || []).find((q) => q.id === id)
        if (quote) {
          set({ printJob: { ...quote.printJob } })
        }
      }
    }),
    {
      name: '3d-print-calculator-storage',
      partialize: (state) => ({ 
        config: state.config,
        printJob: state.printJob,
        quotes: state.quotes
      })
    }
  )
)
