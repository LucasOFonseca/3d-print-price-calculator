"use client"

import { 
  Spool, 
  Zap, 
  Printer, 
  UserRound, 
  TrendingUp,
  Save,
  RotateCcw,
  Package
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'

export function ResultsSummary() {
  const { calculateResult, resetPrintJob, printJob, config } = useAppStore()
  const result = calculateResult()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const margemAtual = printJob.usarMargemPadrao 
    ? config.lucro.margemLucroPadrao 
    : printJob.margemLucro

  const costItems = [
    {
      icon: Spool,
      label: 'Custo do Filamento',
      value: result.custoFilamento,
      color: 'text-blue-600'
    },
    {
      icon: Zap,
      label: 'Custo de Energia',
      value: result.custoEnergia,
      color: 'text-yellow-600'
    },
    {
      icon: Printer,
      label: 'Desgaste da Impressora',
      value: result.desgasteImpressora,
      color: 'text-gray-600'
    },
    {
      icon: UserRound,
      label: 'Mão de Obra',
      value: result.maoDeObra,
      color: 'text-green-600'
    }
  ]

  if (printJob.incluirEmbalagem && (result.custoEmbalagem || 0) > 0) {
    costItems.push({
      icon: Package,
      label: 'Embalagem',
      value: result.custoEmbalagem,
      color: 'text-purple-600'
    })
  }

  return (
    <Card className="border-2 border-primary/20 bg-card shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Resumo do Orçamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cost breakdown */}
        <div className="space-y-3">
          {costItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-lg bg-muted/30 p-3"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-background ${item.color}`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </div>
              <span className="text-sm font-semibold tabular-nums">
                {formatCurrency(item.value)}
              </span>
            </div>
          ))}
        </div>

        {/* Separator */}
        <div className="border-t border-border pt-3">
          {/* Custo Total */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-muted-foreground">Custo Total</span>
            <span className="text-base font-semibold tabular-nums">
              {formatCurrency(result.custoTotal)}
            </span>
          </div>

          {/* Lucro */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Lucro ({margemAtual}%)
              </span>
            </div>
            <span className="text-base font-semibold tabular-nums text-primary">
              {formatCurrency(result.lucro)}
            </span>
          </div>
        </div>

        {/* Preço Final */}
        <div className="rounded-xl bg-primary p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-primary-foreground/80">Preço Final</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-primary-foreground">
              {formatCurrency(result.precoFinal)}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 pt-2 sm:flex-row">
          <Button className="flex-1" size="lg">
            <Save className="mr-2 h-4 w-4" />
            Salvar Orçamento
          </Button>
          <Button variant="outline" size="lg" onClick={resetPrintJob} className="flex-1">
            <RotateCcw className="mr-2 h-4 w-4" />
            Novo Cálculo
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
