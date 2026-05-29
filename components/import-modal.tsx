"use client"

import { useState, useCallback } from 'react'
import { Upload, FileCheck, FileWarning, FileJson } from 'lucide-react'
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
import type { AppConfig } from '@/lib/types'

interface ImportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ValidationState = 'idle' | 'valid' | 'invalid'

export function ImportModal({ open, onOpenChange }: ImportModalProps) {
  const { importConfig } = useAppStore()
  const [file, setFile] = useState<File | null>(null)
  const [validationState, setValidationState] = useState<ValidationState>('idle')
  const [parsedConfig, setParsedConfig] = useState<AppConfig | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const validateConfig = (config: unknown): config is AppConfig => {
    if (!config || typeof config !== 'object') return false
    
    const c = config as Record<string, unknown>
    
    // Check required properties
    if (!Array.isArray(c.filamentos)) return false
    if (!c.energia || typeof c.energia !== 'object') return false
    if (!c.impressora || typeof c.impressora !== 'object') return false
    if (!c.maoDeObra || typeof c.maoDeObra !== 'object') return false
    if (!c.lucro || typeof c.lucro !== 'object') return false

    // Validate filaments
    for (const filament of c.filamentos) {
      if (!filament.id || !filament.nome || typeof filament.pesoRolo !== 'number' || typeof filament.valorRolo !== 'number') {
        return false
      }
    }

    // Validate embalagens (optional for backward compatibility)
    if (c.embalagens !== undefined) {
      if (!Array.isArray(c.embalagens)) return false
      for (const emb of c.embalagens) {
        if (!emb.id || !emb.nome || typeof emb.quantidade !== 'number' || typeof emb.valorPacote !== 'number') {
          return false
        }
      }
    }

    // Validate energia
    const energia = c.energia as Record<string, unknown>
    if (typeof energia.valorKwh !== 'number' || typeof energia.consumoImpressora !== 'number') {
      return false
    }

    // Validate impressora
    const impressora = c.impressora as Record<string, unknown>
    if (typeof impressora.custoDesgastePorHora !== 'number') {
      return false
    }

    // Validate maoDeObra
    const maoDeObra = c.maoDeObra as Record<string, unknown>
    if (typeof maoDeObra.valorHoraTrabalho !== 'number') {
      return false
    }

    // Validate lucro
    const lucro = c.lucro as Record<string, unknown>
    if (typeof lucro.margemLucroPadrao !== 'number') {
      return false
    }

    return true
  }

  const handleFileChange = useCallback((selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null)
      setValidationState('idle')
      setParsedConfig(null)
      setErrorMessage('')
      return
    }

    if (!selectedFile.name.endsWith('.json')) {
      setFile(selectedFile)
      setValidationState('invalid')
      setErrorMessage('O arquivo deve ter extensão .json')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const parsed = JSON.parse(content)
        
        if (validateConfig(parsed)) {
          setFile(selectedFile)
          setValidationState('valid')
          setParsedConfig(parsed)
          setErrorMessage('')
        } else {
          setFile(selectedFile)
          setValidationState('invalid')
          setParsedConfig(null)
          setErrorMessage('Estrutura do arquivo inválida')
        }
      } catch {
        setFile(selectedFile)
        setValidationState('invalid')
        setParsedConfig(null)
        setErrorMessage('Erro ao ler o arquivo JSON')
      }
    }
    reader.readAsText(selectedFile)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    handleFileChange(droppedFile)
  }, [handleFileChange])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleImport = () => {
    if (parsedConfig) {
      importConfig(parsedConfig)
      onOpenChange(false)
      resetState()
    }
  }

  const resetState = () => {
    setFile(null)
    setValidationState('idle')
    setParsedConfig(null)
    setErrorMessage('')
  }

  const handleClose = () => {
    onOpenChange(false)
    resetState()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Importar Configurações
          </DialogTitle>
          <DialogDescription>
            Selecione um arquivo JSON exportado anteriormente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Drop zone */}
          <div
            className={`relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
              isDragOver
                ? 'border-primary bg-primary/5'
                : validationState === 'valid'
                ? 'border-green-500 bg-green-50'
                : validationState === 'invalid'
                ? 'border-destructive bg-destructive/5'
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
            
            {validationState === 'idle' && (
              <>
                <FileJson className="mb-2 h-10 w-10 text-muted-foreground" />
                <p className="text-center text-sm font-medium">
                  Arraste e solte seu arquivo aqui
                </p>
                <p className="text-center text-xs text-muted-foreground">
                  ou clique para selecionar
                </p>
              </>
            )}
            
            {validationState === 'valid' && file && (
              <>
                <FileCheck className="mb-2 h-10 w-10 text-green-600" />
                <p className="text-center text-sm font-medium text-green-700">
                  Arquivo válido
                </p>
                <p className="text-center text-xs text-muted-foreground">
                  {file.name}
                </p>
              </>
            )}
            
            {validationState === 'invalid' && (
              <>
                <FileWarning className="mb-2 h-10 w-10 text-destructive" />
                <p className="text-center text-sm font-medium text-destructive">
                  {errorMessage}
                </p>
                {file && (
                  <p className="text-center text-xs text-muted-foreground">
                    {file.name}
                  </p>
                )}
              </>
            )}
          </div>

          {/* File summary when valid */}
          {validationState === 'valid' && parsedConfig && (
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs font-medium text-muted-foreground">Conteúdo do arquivo:</p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>{parsedConfig.filamentos.length} filamentos</li>
                <li>{(parsedConfig.embalagens || []).length} embalagens</li>
                <li>Configurações de energia</li>
                <li>Configurações de impressora</li>
                <li>Configurações de mão de obra</li>
                <li>Margem de lucro: {parsedConfig.lucro.margemLucroPadrao}%</li>
              </ul>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleImport}
            disabled={validationState !== 'valid'}
          >
            Importar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
