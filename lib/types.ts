export interface Filament {
  id: string;
  name: string;
  spoolWeight: number; // in grams
  spoolPrice: number; // in R$
  costPerGram: number; // calculated
}

export interface Packaging {
  id: string;
  name: string;
  quantity: number; // units per package
  packagePrice: number; // package price in R$
  costPerUnit: number; // calculated
}

export interface EnergyConfig {
  kwhPrice: number; // R$ per kWh
  printerConsumption: number; // Watts
}

export interface PrinterConfig {
  wearCostPerHour: number; // R$
}

export interface LaborConfig {
  hourlyRate: number; // R$
}

export interface ProfitConfig {
  defaultProfitMargin: number; // percentage
}

export interface FilamentEntry {
  filamentId: string;
  materialUsed: number; // grams
}

export interface PrintJob {
  filamentId: string;
  materialUsed: number; // grams (legacy / primary, kept for backward compat)
  filaments: FilamentEntry[];
  printTimeHours: number;
  printTimeMinutes: number;
  paintTimeHours: number;
  paintTimeMinutes: number;
  assemblyTimeHours: number;
  assemblyTimeMinutes: number;
  finishingTimeHours: number;
  finishingTimeMinutes: number;
  useDefaultMargin: boolean;
  profitMargin: number;
  includePostProcessing: boolean;
  packagingIds: string[];
  includePackaging: boolean;
}

export interface CalculationResult {
  filamentCost: number;
  energyCost: number;
  printerWear: number;
  laborCost: number;
  packagingCost: number;
  totalCost: number;
  profit: number;
  finalPrice: number;
}

export interface Quote {
  id: string;
  name: string;
  date: string;
  printJob: PrintJob;
  result: CalculationResult;
}

export interface AppConfig {
  filaments: Filament[];
  packaging?: Packaging[];
  energy: EnergyConfig;
  printer: PrinterConfig;
  labor: LaborConfig;
  profit: ProfitConfig;
}

export type SettingsTab =
  | "filaments"
  | "energy"
  | "printer"
  | "labor"
  | "profit"
  | "packaging";
