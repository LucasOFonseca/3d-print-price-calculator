"use client"

import { Settings, Upload, Download, Printer, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'

export function Header() {
  const { setCurrentScreen, setShowImportModal, setShowExportModal, currentScreen } = useAppStore()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Printer className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-foreground">
              Calculadora de Preço para Impressão 3D
            </h1>
            <p className="text-xs text-muted-foreground">
              Calcule custos, lucro e preço final de venda
            </p>
          </div>
          <div className="sm:hidden">
            <h1 className="text-base font-semibold text-foreground">
              Calculadora 3D
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentScreen === 'calculator' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImportModal(true)}
                className="hidden sm:flex"
              >
                <Upload className="mr-2 h-4 w-4" />
                Importar JSON
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExportModal(true)}
                className="hidden sm:flex"
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar JSON
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowImportModal(true)}
                className="sm:hidden"
              >
                <Upload className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowExportModal(true)}
                className="sm:hidden"
              >
                <Download className="h-4 w-4" />
              </Button>
            </>
          )}
          
          <Button
            variant={currentScreen === 'settings' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setCurrentScreen(currentScreen === 'settings' ? 'calculator' : 'settings')}
          >
            {currentScreen === 'settings' ? <Calculator className="mr-2 h-4 w-4" /> : <Settings className="mr-2 h-4 w-4" />}
            <span className="hidden sm:inline">
              {currentScreen === 'settings' ? 'Calculadora' : 'Configurações'}
            </span>
          </Button>
        </div>
      </div>
    </header>
  )
}
