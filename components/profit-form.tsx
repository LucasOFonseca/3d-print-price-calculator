"use client"

import { TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useAppStore } from '@/lib/store'

export function ProfitForm() {
  const { config, printJob, setPrintJob } = useAppStore()

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          Lucro
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Toggle margem padrão */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
          <div className="space-y-0.5">
            <Label htmlFor="usar-margem-padrao" className="text-sm font-medium">
              Utilizar margem padrão
            </Label>
            <p className="text-xs text-muted-foreground">
              Margem configurada: {config.lucro.margemLucroPadrao}%
            </p>
          </div>
          <Switch
            id="usar-margem-padrao"
            checked={printJob.usarMargemPadrao}
            onCheckedChange={(checked) => {
              setPrintJob({ 
                usarMargemPadrao: checked,
                margemLucro: checked ? config.lucro.margemLucroPadrao : printJob.margemLucro
              })
            }}
          />
        </div>

        {/* Margem de lucro customizada */}
        {!printJob.usarMargemPadrao && (
          <div className="space-y-2">
            <Label htmlFor="margem-lucro">Margem de lucro (%)</Label>
            <div className="relative">
              <Input
                id="margem-lucro"
                type="number"
                min="0"
                max="1000"
                step="1"
                value={printJob.margemLucro}
                onChange={(e) => setPrintJob({ margemLucro: parseFloat(e.target.value) || 0 })}
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
