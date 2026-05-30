"use client"

import { useState } from 'react'
import { 
  Spool, 
  Zap, 
  Printer, 
  UserRound, 
  TrendingUp,
  Save,
  RotateCcw,
  Package,
  Calculator
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppStore } from '@/lib/store'

export function ResultsSummary() {
  const { 
    result, 
    resetPrintJob, 
    printJob, 
    config, 
    saveQuote,
    calculateResult,
    isCalculating,
    lastCalculatedPrintJob,
    lastCalculatedConfig
  } = useAppStore()

  const isCalculated = 
    lastCalculatedPrintJob !== null &&
    lastCalculatedConfig !== null &&
    JSON.stringify(printJob) === JSON.stringify(lastCalculatedPrintJob) &&
    JSON.stringify(config) === JSON.stringify(lastCalculatedConfig);
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [quoteName, setQuoteName] = useState('')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    saveQuote(quoteName || `Orçamento ${new Date().toLocaleDateString()}`)
    setShowSaveDialog(false)
    setQuoteName('')
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const currentMargin = printJob.useDefaultMargin 
    ? config.profit.defaultProfitMargin 
    : printJob.profitMargin

  const costItems = [
    {
      icon: Spool,
      label: 'Custo do Filamento',
      value: result.filamentCost,
      color: 'text-blue-600'
    },
    {
      icon: Zap,
      label: 'Custo de Energia',
      value: result.energyCost,
      color: 'text-yellow-600'
    },
    {
      icon: Printer,
      label: 'Desgaste da Impressora',
      value: result.printerWear,
      color: 'text-gray-600'
    },
    {
      icon: UserRound,
      label: 'Mão de Obra',
      value: result.laborCost,
      color: 'text-green-600'
    }
  ]

  if (printJob.includePackaging && (result.packagingCost || 0) > 0) {
    costItems.push({
      icon: Package,
      label: 'Embalagem',
      value: result.packagingCost,
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
        {!isCalculated ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 animate-pulse">
              <Calculator className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Cálculo Pendente</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              Altere os parâmetros do modelo 3D ao lado e clique no botão abaixo para calcular o preço.
            </p>
            <Button 
              className="w-full min-h-11 text-base font-medium shadow-md animate-shimmer" 
              size="lg"
              onClick={() => calculateResult()}
              disabled={isCalculating}
            >
              {isCalculating ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Calculando...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-5 w-5" />
                  Calcular Preço
                </>
              )}
            </Button>
          </div>
        ) : (
          <>
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
                  {formatCurrency(result.totalCost)}
                </span>
              </div>

              {/* Lucro */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Lucro ({currentMargin}%)
                  </span>
                </div>
                <span className="text-base font-semibold tabular-nums text-primary">
                  {formatCurrency(result.profit)}
                </span>
              </div>
            </div>

            {/* Preço Final */}
            <div className="rounded-xl bg-primary p-4 animate-fade-in">
              <div className="text-center">
                <p className="text-sm font-medium text-primary-foreground/80">Preço Final</p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-primary-foreground">
                  {formatCurrency(result.finalPrice)}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 pt-2 sm:flex-row">
              <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <DialogTrigger asChild>
                  <Button className="flex-1 min-h-10" size="lg">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Orçamento
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handleSave}>
                    <DialogHeader>
                      <DialogTitle>Salvar Orçamento</DialogTitle>
                      <DialogDescription>
                        Dê um nome para este orçamento para facilitar a identificação depois.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Nome do orçamento</Label>
                        <Input
                          id="name"
                          placeholder="Ex: Peça Cliente X"
                          value={quoteName}
                          onChange={(e) => setQuoteName(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Salvar</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="lg" onClick={resetPrintJob} className="flex-1 min-h-10">
                <RotateCcw className="mr-2 h-4 w-4" />
                Novo Cálculo
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
