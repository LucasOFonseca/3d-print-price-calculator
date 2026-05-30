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
  Package
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppStore } from '@/lib/store'

export function ResultsSummary() {
  const { result, resetPrintJob, printJob, config, saveQuote } = useAppStore()
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
        <div className="rounded-xl bg-primary p-4">
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
      </CardContent>
    </Card>
  )
}
