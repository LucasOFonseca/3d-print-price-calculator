"use client"

import { 
  Spool, 
  Clock, 
  FileText,
  Paintbrush,
  Wrench,
  Sparkles
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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

  const selectedFilament = config.filamentos.find(f => f.id === printJob.filamentoId)

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
              value={printJob.filamentoId}
              onValueChange={(value) => setPrintJob({ filamentoId: value })}
            >
              <SelectTrigger id="filamento" className="w-full">
                <SelectValue placeholder="Selecione um filamento" />
              </SelectTrigger>
              <SelectContent>
                {config.filamentos.map((filament) => (
                  <SelectItem key={filament.id} value={filament.id}>
                    {filament.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedFilament && (
              <div className="mt-2 rounded-lg bg-muted/50 p-3">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Custo/g</span>
                    <p className="font-medium">{formatCurrency(selectedFilament.custoPorGrama)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Peso do rolo</span>
                    <p className="font-medium">{selectedFilament.pesoRolo}g</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Valor do rolo</span>
                    <p className="font-medium">{formatCurrency(selectedFilament.valorRolo)}</p>
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
              value={printJob.materialUtilizado}
              onChange={(e) => setPrintJob({ materialUtilizado: parseFloat(e.target.value) || 0 })}
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
              hours={printJob.tempoImpressaoHoras}
              minutes={printJob.tempoImpressaoMinutos}
              onHoursChange={(hours) => setPrintJob({ tempoImpressaoHoras: hours })}
              onMinutesChange={(minutes) => setPrintJob({ tempoImpressaoMinutos: minutes })}
            />
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes" className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Observações
            </Label>
            <Textarea
              id="observacoes"
              placeholder="Informações adicionais sobre a peça"
              value={printJob.observacoes}
              onChange={(e) => setPrintJob({ observacoes: e.target.value })}
              className="min-h-[80px] resize-none"
            />
          </div>
      </CardContent>
    </Card>
  )
}

export function PostProcessingForm() {
  const { printJob, setPrintJob } = useAppStore()

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Paintbrush className="h-4 w-4 text-primary" />
          </div>
          Pos-processamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tempo de Pintura */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Paintbrush className="h-4 w-4 text-muted-foreground" />
            Pintura
          </Label>
          <TimeInput
            hours={printJob.tempoPinturaHoras}
            minutes={printJob.tempoPinturaMinutos}
            onHoursChange={(hours) => setPrintJob({ tempoPinturaHoras: hours })}
            onMinutesChange={(minutes) => setPrintJob({ tempoPinturaMinutos: minutes })}
          />
        </div>

        {/* Tempo de Montagem */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-muted-foreground" />
            Montagem
          </Label>
          <TimeInput
            hours={printJob.tempoMontagemHoras}
            minutes={printJob.tempoMontagemMinutos}
            onHoursChange={(hours) => setPrintJob({ tempoMontagemHoras: hours })}
            onMinutesChange={(minutes) => setPrintJob({ tempoMontagemMinutos: minutes })}
          />
        </div>

        {/* Tempo de Acabamento */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            Acabamento
          </Label>
          <TimeInput
            hours={printJob.tempoAcabamentoHoras}
            minutes={printJob.tempoAcabamentoMinutos}
            onHoursChange={(hours) => setPrintJob({ tempoAcabamentoHoras: hours })}
            onMinutesChange={(minutes) => setPrintJob({ tempoAcabamentoMinutos: minutes })}
          />
        </div>
      </CardContent>
    </Card>
  )
}
