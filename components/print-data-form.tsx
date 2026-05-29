"use client"

import { 
  Spool, 
  Clock, 
  Paintbrush,
  Wrench,
  Sparkles,
  Package
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppStore } from '@/lib/store'
import { TimeInput } from './time-input'

export function PrintDataForm() {
  const { config, printJob, setPrintJob } = useAppStore()

  const selectedFilament = config.filaments.find(f => f.id === printJob.filamentId)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Spool className="h-4 w-4 text-primary" />
            </div>
            Dados da Impressão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filamento */}
          <div className="space-y-2">
            <Label htmlFor="filamento">Filamento</Label>
            <Select
              value={printJob.filamentId}
              onValueChange={(value) => setPrintJob({ filamentId: value })}
            >
              <SelectTrigger id="filamento" className="w-full">
                <SelectValue placeholder="Selecione um filamento" />
              </SelectTrigger>
              <SelectContent>
                {config.filaments.map((filament) => (
                  <SelectItem key={filament.id} value={filament.id}>
                    {filament.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedFilament && (
              <div className="mt-2 rounded-lg bg-muted/50 p-3">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Custo/g</span>
                    <p className="font-medium">{formatCurrency(selectedFilament.costPerGram)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Peso do rolo</span>
                    <p className="font-medium">{selectedFilament.spoolWeight}g</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Valor do rolo</span>
                    <p className="font-medium">{formatCurrency(selectedFilament.spoolPrice)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Material Utilizado */}
          <div className="space-y-2">
            <Label htmlFor="material">Quantidade utilizada (g)</Label>
            <Input
              id="material"
              type="number"
              min="0"
              step="0.1"
              value={printJob.materialUsed}
              onChange={(e) => setPrintJob({ materialUsed: parseFloat(e.target.value) || 0 })}
              placeholder="250"
            />
          </div>

          {/* Tempo de Impressão */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Tempo de Impressão
            </Label>
            <TimeInput
              hours={printJob.printTimeHours}
              minutes={printJob.printTimeMinutes}
              onHoursChange={(hours) => setPrintJob({ printTimeHours: hours })}
              onMinutesChange={(minutes) => setPrintJob({ printTimeMinutes: minutes })}
            />
          </div>
      </CardContent>
    </Card>
  )
}

export function PostProcessingForm() {
  const { printJob, setPrintJob } = useAppStore()

  const isEnabled = printJob.includePostProcessing !== false

  return (
    <Card className={`border-border/50 shadow-sm transition-all duration-200 ${!isEnabled ? 'opacity-70' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${isEnabled ? 'bg-primary/10' : 'bg-muted'}`}>
            <Paintbrush className={`h-4 w-4 transition-colors ${isEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          Pós-processamento
        </CardTitle>
        <Switch
          checked={isEnabled}
          onCheckedChange={(checked) => setPrintJob({ includePostProcessing: checked })}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        {isEnabled ? (
          <>
            {/* Tempo de Pintura */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Paintbrush className="h-4 w-4 text-muted-foreground" />
                Pintura
              </Label>
              <TimeInput
                hours={printJob.paintTimeHours}
                minutes={printJob.paintTimeMinutes}
                onHoursChange={(hours) => setPrintJob({ paintTimeHours: hours })}
                onMinutesChange={(minutes) => setPrintJob({ paintTimeMinutes: minutes })}
              />
            </div>

            {/* Tempo de Montagem */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                Montagem
              </Label>
              <TimeInput
                hours={printJob.assemblyTimeHours}
                minutes={printJob.assemblyTimeMinutes}
                onHoursChange={(hours) => setPrintJob({ assemblyTimeHours: hours })}
                onMinutesChange={(minutes) => setPrintJob({ assemblyTimeMinutes: minutes })}
              />
            </div>

            {/* Tempo de Acabamento */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                Acabamento
              </Label>
              <TimeInput
                hours={printJob.finishingTimeHours}
                minutes={printJob.finishingTimeMinutes}
                onHoursChange={(hours) => setPrintJob({ finishingTimeHours: hours })}
                onMinutesChange={(minutes) => setPrintJob({ finishingTimeMinutes: minutes })}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center text-sm text-muted-foreground">
            <p>O pós-processamento está desativado.</p>
            <p className="text-xs text-muted-foreground/75 mt-1">
              Ative para incluir os custos e tempos de pintura, montagem e acabamento.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function PackagingForm() {
  const { config, printJob, setPrintJob } = useAppStore()

  const isEnabled = printJob.includePackaging === true
  const packagingList = config.packaging || []
  
  const activePackagingId = printJob.packagingId || (packagingList.length > 0 ? packagingList[0].id : '')
  const selectedPackaging = packagingList.find(p => p.id === activePackagingId)

  const handleSelectChange = (value: string) => {
    setPrintJob({ packagingId: value })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <Card className={`border-border/50 shadow-sm transition-all duration-200 ${!isEnabled ? 'opacity-70' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${isEnabled ? 'bg-primary/10' : 'bg-muted'}`}>
            <Package className={`h-4 w-4 transition-colors ${isEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          Embalagem
        </CardTitle>
        <Switch
          checked={isEnabled}
          onCheckedChange={(checked) => {
            const nextJob: Partial<typeof printJob> = { includePackaging: checked }
            if (checked && !printJob.packagingId && packagingList.length > 0) {
              nextJob.packagingId = packagingList[0].id
            }
            setPrintJob(nextJob)
          }}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        {isEnabled ? (
          <div className="space-y-2">
            <Label htmlFor="embalagem">Selecionar Embalagem</Label>
            {packagingList.length > 0 ? (
              <>
                <Select
                  value={activePackagingId}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger id="embalagem" className="w-full">
                    <SelectValue placeholder="Selecione uma embalagem" />
                  </SelectTrigger>
                  <SelectContent>
                    {packagingList.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedPackaging && (
                  <div className="mt-2 rounded-lg bg-muted/50 p-3">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Custo/Unid</span>
                        <p className="font-medium">{formatCurrency(selectedPackaging.costPerUnit)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Qtd Pacote</span>
                        <p className="font-medium">{selectedPackaging.quantity} un</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Valor Pacote</span>
                        <p className="font-medium">{formatCurrency(selectedPackaging.packagePrice)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground text-center">
                Nenhuma embalagem cadastrada. <br />
                Vá em configurações para cadastrar.
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center text-sm text-muted-foreground">
            <p>A embalagem está desativada.</p>
            <p className="text-xs text-muted-foreground/75 mt-1">
              Ative para incluir o custo da embalagem no orçamento.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
