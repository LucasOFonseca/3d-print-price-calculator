"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppConfig, Filament, PrintJob, CalculationResult, Embalagem } from './types'

const defaultFilaments: Filament[] = [
  {
    id: '1',
    nome: 'PLA Branco',
    pesoRolo: 1000,
    valorRolo: 89.90,
    custoPorGrama: 0.0899
  },
  {
    id: '2',
    nome: 'PLA Preto',
    pesoRolo: 1000,
    valorRolo: 89.90,
    custoPorGrama: 0.0899
  },
  {
    id: '3',
    nome: 'PETG Azul',
    pesoRolo: 1000,
    valorRolo: 119.90,
    custoPorGrama: 0.1199
  }
]

const defaultEmbalagens: Embalagem[] = [
  {
    id: '1',
    nome: 'Caixa de Papelão Padrão',
    quantidade: 10,
    valorPacote: 35.00,
    custoPorUnidade: 3.50
  },
  {
    id: '2',
    nome: 'Saco Bolha Grande',
    quantidade: 50,
    valorPacote: 45.00,
    custoPorUnidade: 0.90
  }
]

const defaultConfig: AppConfig = {
  filamentos: defaultFilaments,
  embalagens: defaultEmbalagens,
  energia: {
    valorKwh: 0.85,
    consumoImpressora: 150
  },
  impressora: {
    custoDesgastePorHora: 1.50
  },
  maoDeObra: {
    valorHoraTrabalho: 30.00
  },
  lucro: {
    margemLucroPadrao: 35
  }
}

const defaultPrintJob: PrintJob = {
  filamentoId: '1',
  materialUtilizado: 250,
  tempoImpressaoHoras: 12,
  tempoImpressaoMinutos: 30,
  tempoPinturaHoras: 1,
  tempoPinturaMinutos: 0,
  tempoMontagemHoras: 0,
  tempoMontagemMinutos: 30,
  tempoAcabamentoHoras: 0,
  tempoAcabamentoMinutos: 45,
  usarMargemPadrao: true,
  margemLucro: 35,
  observacoes: '',
  incluirPosProcessamento: true,
  embalagemId: '1',
  incluirEmbalagem: false
}

interface AppState {
  config: AppConfig
  printJob: PrintJob
  currentScreen: 'calculator' | 'settings'
  settingsTab: 'filamentos' | 'energia' | 'impressora' | 'mao-de-obra' | 'lucro' | 'embalagens'
  showImportModal: boolean
  showExportModal: boolean
  
  // Actions
  setConfig: (config: AppConfig) => void
  updateFilament: (filament: Filament) => void
  addFilament: (filament: Omit<Filament, 'id' | 'custoPorGrama'>) => void
  deleteFilament: (id: string) => void
  updateEmbalagem: (embalagem: Embalagem) => void
  addEmbalagem: (embalagem: Omit<Embalagem, 'id' | 'custoPorUnidade'>) => void
  deleteEmbalagem: (id: string) => void
  updateEnergyConfig: (config: Partial<AppConfig['energia']>) => void
  updatePrinterConfig: (config: Partial<AppConfig['impressora']>) => void
  updateLaborConfig: (config: Partial<AppConfig['maoDeObra']>) => void
  updateProfitConfig: (config: Partial<AppConfig['lucro']>) => void
  setPrintJob: (job: Partial<PrintJob>) => void
  resetPrintJob: () => void
  setCurrentScreen: (screen: 'calculator' | 'settings') => void
  setSettingsTab: (tab: 'filamentos' | 'energia' | 'impressora' | 'mao-de-obra' | 'lucro' | 'embalagens') => void
  setShowImportModal: (show: boolean) => void
  setShowExportModal: (show: boolean) => void
  restoreDefaults: () => void
  importConfig: (config: AppConfig) => void
  calculateResult: () => CalculationResult
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      printJob: defaultPrintJob,
      currentScreen: 'calculator',
      settingsTab: 'filamentos',
      showImportModal: false,
      showExportModal: false,

      setConfig: (config) => set({ config }),
      
      updateFilament: (filament) => set((state) => ({
        config: {
          ...state.config,
          filamentos: state.config.filamentos.map((f) =>
            f.id === filament.id ? filament : f
          )
        }
      })),

      addFilament: (filament) => set((state) => {
        const custoPorGrama = filament.valorRolo / filament.pesoRolo
        const newFilament: Filament = {
          ...filament,
          id: Date.now().toString(),
          custoPorGrama
        }
        return {
          config: {
            ...state.config,
            filamentos: [...state.config.filamentos, newFilament]
          }
        }
      }),

      deleteFilament: (id) => set((state) => ({
        config: {
          ...state.config,
          filamentos: state.config.filamentos.filter((f) => f.id !== id)
        }
      })),

      updateEmbalagem: (embalagem) => set((state) => ({
        config: {
          ...state.config,
          embalagens: (state.config.embalagens || []).map((e) =>
            e.id === embalagem.id ? embalagem : e
          )
        }
      })),

      addEmbalagem: (embalagem) => set((state) => {
        const custoPorUnidade = embalagem.valorPacote / embalagem.quantidade
        const newEmbalagem: Embalagem = {
          ...embalagem,
          id: Date.now().toString(),
          custoPorUnidade
        }
        return {
          config: {
            ...state.config,
            embalagens: [...(state.config.embalagens || []), newEmbalagem]
          }
        }
      }),

      deleteEmbalagem: (id) => set((state) => ({
        config: {
          ...state.config,
          embalagens: (state.config.embalagens || []).filter((e) => e.id !== id)
        }
      })),

      updateEnergyConfig: (energia) => set((state) => ({
        config: {
          ...state.config,
          energia: { ...state.config.energia, ...energia }
        }
      })),

      updatePrinterConfig: (impressora) => set((state) => ({
        config: {
          ...state.config,
          impressora: { ...state.config.impressora, ...impressora }
        }
      })),

      updateLaborConfig: (maoDeObra) => set((state) => ({
        config: {
          ...state.config,
          maoDeObra: { ...state.config.maoDeObra, ...maoDeObra }
        }
      })),

      updateProfitConfig: (lucro) => set((state) => ({
        config: {
          ...state.config,
          lucro: { ...state.config.lucro, ...lucro }
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
          embalagens: config.embalagens || []
        }
      }),

      calculateResult: () => {
        const state = get()
        const { config, printJob } = state
        
        // Find selected filament
        const filament = config.filamentos.find(f => f.id === printJob.filamentoId)
        if (!filament) {
          return {
            custoFilamento: 0,
            custoEnergia: 0,
            desgasteImpressora: 0,
            maoDeObra: 0,
            custoEmbalagem: 0,
            custoTotal: 0,
            lucro: 0,
            precoFinal: 0
          }
        }

        // Calculate printing time in hours
        const tempoImpressao = printJob.tempoImpressaoHoras + (printJob.tempoImpressaoMinutos / 60)
        
        // Calculate post-processing time in hours
        const tempoPosProcessamento = printJob.incluirPosProcessamento !== false
          ? (printJob.tempoPinturaHoras + printJob.tempoPinturaMinutos / 60) +
            (printJob.tempoMontagemHoras + printJob.tempoMontagemMinutos / 60) +
            (printJob.tempoAcabamentoHoras + printJob.tempoAcabamentoMinutos / 60)
          : 0

        // Calculate costs
        const custoFilamento = printJob.materialUtilizado * filament.custoPorGrama
        
        // Energy cost: (W / 1000) * hours * R$/kWh
        const custoEnergia = (config.energia.consumoImpressora / 1000) * tempoImpressao * config.energia.valorKwh
        
        // Printer depreciation
        const desgasteImpressora = tempoImpressao * config.impressora.custoDesgastePorHora
        
        // Labor: printing time (monitoring) + post-processing time
        const maoDeObra = (tempoImpressao * 0.1 + tempoPosProcessamento) * config.maoDeObra.valorHoraTrabalho

        // Custo de embalagem
        const embalagens = config.embalagens || []
        const embalagem = embalagens.find(e => e.id === printJob.embalagemId)
        const custoEmbalagem = (printJob.incluirEmbalagem && embalagem) ? embalagem.custoPorUnidade : 0

        // Total cost
        const custoTotal = custoFilamento + custoEnergia + desgasteImpressora + maoDeObra + custoEmbalagem

        // Profit margin
        const margemLucro = printJob.usarMargemPadrao 
          ? config.lucro.margemLucroPadrao 
          : printJob.margemLucro

        // Final calculations
        const lucro = custoTotal * (margemLucro / 100)
        const precoFinal = custoTotal + lucro

        return {
          custoFilamento,
          custoEnergia,
          desgasteImpressora,
          maoDeObra,
          custoEmbalagem,
          custoTotal,
          lucro,
          precoFinal
        }
      }
    }),
    {
      name: '3d-print-calculator-storage',
      partialize: (state) => ({ 
        config: state.config,
        printJob: state.printJob 
      })
    }
  )
)
