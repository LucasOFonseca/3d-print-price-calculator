export interface Filament {
  id: string
  nome: string
  pesoRolo: number // em gramas
  valorRolo: number // em R$
  custoPorGrama: number // calculado
}

export interface Embalagem {
  id: string
  nome: string
  quantidade: number // unidades no pacote
  valorPacote: number // valor do pacote em R$
  custoPorUnidade: number // calculado
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
  incluirPosProcessamento: boolean
  embalagemId: string
  incluirEmbalagem: boolean
}

export interface CalculationResult {
  custoFilamento: number
  custoEnergia: number
  desgasteImpressora: number
  maoDeObra: number
  custoEmbalagem: number
  custoTotal: number
  lucro: number
  precoFinal: number
}

export interface Orcamento {
  id: string
  nome: string
  data: string
  printJob: PrintJob
  result: CalculationResult
}

export interface AppConfig {
  filamentos: Filament[]
  embalagens?: Embalagem[]
  energia: EnergyConfig
  impressora: PrinterConfig
  maoDeObra: LaborConfig
  lucro: ProfitConfig
}

export type SettingsTab = 'filamentos' | 'energia' | 'impressora' | 'mao-de-obra' | 'lucro' | 'embalagens'
