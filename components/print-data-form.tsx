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
      </CardContent>
    </Card>
  )
}

export function PostProcessingForm() {
  const { printJob, setPrintJob } = useAppStore()

  const isEnabled = printJob.incluirPosProcessamento !== false

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
          onCheckedChange={(checked) => setPrintJob({ incluirPosProcessamento: checked })}
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

  const isEnabled = printJob.incluirEmbalagem === true
  const embalagens = config.embalagens || []
  
  const activeEmbalagemId = printJob.embalagemId || (embalagens.length > 0 ? embalagens[0].id : '')
  const selectedEmbalagem = embalagens.find(e => e.id === activeEmbalagemId)

  const handleSelectChange = (value: string) => {
    setPrintJob({ embalagemId: value })
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
            const nextJob: Partial<typeof printJob> = { incluirEmbalagem: checked }
            if (checked && !printJob.embalagemId && embalagens.length > 0) {
              nextJob.embalagemId = embalagens[0].id
            }
            setPrintJob(nextJob)
          }}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        {isEnabled ? (
          <div className="space-y-2">
            <Label htmlFor="embalagem">Selecionar Embalagem</Label>
            {embalagens.length > 0 ? (
              <>
                <Select
                  value={activeEmbalagemId}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger id="embalagem" className="w-full">
                    <SelectValue placeholder="Selecione uma embalagem" />
                  </SelectTrigger>
                  <SelectContent>
                    {embalagens.map((emb) => (
                      <SelectItem key={emb.id} value={emb.id}>
                        {emb.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedEmbalagem && (
                  <div className="mt-2 rounded-lg bg-muted/50 p-3">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Custo/Unid</span>
                        <p className="font-medium">{formatCurrency(selectedEmbalagem.custoPorUnidade)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Qtd Pacote</span>
                        <p className="font-medium">{selectedEmbalagem.quantidade} un</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Valor Pacote</span>
                        <p className="font-medium">{formatCurrency(selectedEmbalagem.valorPacote)}</p>
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
