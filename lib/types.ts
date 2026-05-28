export interface Filament {
  id: string
  nome: string
  pesoRolo: number // em gramas
  valorRolo: number // em R$
  custoPorGrama: number // calculado
}

export interface EnergyConfig {
  valorKwh: number // R$ por kWh
  consumoImpressora: number // Watts
}

export interface PrinterConfig {
  custoDesgastePorHora: number // R$
}

export interface LaborConfig {
  valorHoraTrabalho: number // R$
}

export interface ProfitConfig {
  margemLucroPadrao: number // percentual
}

export interface PrintJob {
  filamentoId: string
  materialUtilizado: number // gramas
  tempoImpressaoHoras: number
  tempoImpressaoMinutos: number
  tempoPinturaHoras: number
  tempoPinturaMinutos: number
  tempoMontagemHoras: number
  tempoMontagemMinutos: number
  tempoAcabamentoHoras: number
  tempoAcabamentoMinutos: number
  usarMargemPadrao: boolean
  margemLucro: number
  observacoes: string
}

export interface CalculationResult {
  custoFilamento: number
  custoEnergia: number
  desgasteImpressora: number
  maoDeObra: number
  custoTotal: number
  lucro: number
  precoFinal: number
}

export interface AppConfig {
  filamentos: Filament[]
  energia: EnergyConfig
  impressora: PrinterConfig
  maoDeObra: LaborConfig
  lucro: ProfitConfig
}

export type SettingsTab = 'filamentos' | 'energia' | 'impressora' | 'mao-de-obra' | 'lucro'
