"use client"

import { 
  Download, 
  Spool, 
  Zap, 
  Printer, 
  UserRound, 
  TrendingUp 
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'

interface ExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExportModal({ open, onOpenChange }: ExportModalProps) {
  const { config } = useAppStore()

  const handleExport = () => {
    const dataStr = JSON.stringify(config, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `configuracoes-impressao-3d-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    onOpenChange(false)
  }

  const summaryItems = [
    {
      icon: Spool,
      label: 'Quantidade de Filamentos',
      value: `${config.filamentos.length} filamento${config.filamentos.length !== 1 ? 's' : ''}`
    },
    {
      icon: Zap,
      label: 'Configurações de Energia',
      value: `R$ ${config.energia.valorKwh}/kWh, ${config.energia.consumoImpressora}W`
    },
    {
      icon: Printer,
      label: 'Configurações de Impressora',
      value: `R$ ${config.impressora.custoDesgastePorHora}/h de desgaste`
    },
    {
      icon: UserRound,
      label: 'Configurações de Mão de Obra',
      value: `R$ ${config.maoDeObra.valorHoraTrabalho}/h`
    },
    {
      icon: TrendingUp,
      label: 'Configurações de Lucro',
      value: `${config.lucro.margemLucroPadrao}% de margem padrão`
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Exportar Configurações
          </DialogTitle>
          <DialogDescription>
            Exporte suas configurações para backup ou uso em outro dispositivo
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="mb-3 text-sm font-medium text-foreground">
              O arquivo incluirá:
            </p>
            <div className="space-y-3">
              {summaryItems.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Baixar Arquivo JSON
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
