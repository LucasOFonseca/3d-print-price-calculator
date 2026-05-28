"use client"

import { useState } from 'react'
import { 
  ArrowLeft,
  Spool,
  Zap,
  Printer,
  UserRound,
  TrendingUp,
  Save,
  RotateCcw,
  Plus,
  Pencil,
  Trash2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useAppStore } from '@/lib/store'
import type { Filament } from '@/lib/types'

export function SettingsScreen() {
  const { 
    config, 
    settingsTab, 
    setSettingsTab, 
    setCurrentScreen,
    updateFilament,
    addFilament,
    deleteFilament,
    updateEnergyConfig,
    updatePrinterConfig,
    updateLaborConfig,
    updateProfitConfig,
    restoreDefaults
  } = useAppStore()

  const [filamentModal, setFilamentModal] = useState<{
    open: boolean
    mode: 'add' | 'edit'
    filament: Partial<Filament>
  }>({
    open: false,
    mode: 'add',
    filament: { nome: '', pesoRolo: 1000, valorRolo: 0 }
  })

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    filamentId: string | null
  }>({
    open: false,
    filamentId: null
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const handleSaveFilament = () => {
    const { filament, mode } = filamentModal
    if (!filament.nome || !filament.pesoRolo || !filament.valorRolo) return

    if (mode === 'add') {
      addFilament({
        nome: filament.nome,
        pesoRolo: filament.pesoRolo,
        valorRolo: filament.valorRolo
      })
    } else if (filament.id) {
      const custoPorGrama = filament.valorRolo / filament.pesoRolo
      updateFilament({
        id: filament.id,
        nome: filament.nome,
        pesoRolo: filament.pesoRolo,
        valorRolo: filament.valorRolo,
        custoPorGrama
      })
    }

    setFilamentModal({
      open: false,
      mode: 'add',
      filament: { nome: '', pesoRolo: 1000, valorRolo: 0 }
    })
  }

  const handleDeleteFilament = () => {
    if (deleteDialog.filamentId) {
      deleteFilament(deleteDialog.filamentId)
    }
    setDeleteDialog({ open: false, filamentId: null })
  }

  const calculatedCostPerGram = filamentModal.filament.pesoRolo && filamentModal.filament.valorRolo
    ? filamentModal.filament.valorRolo / filamentModal.filament.pesoRolo
    : 0

  return (
    <main className="container mx-auto px-4 py-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentScreen('calculator')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie filamentos, custos e preferências
            </p>
          </div>
        </div>
      </div>

      <Tabs value={settingsTab} onValueChange={(v) => setSettingsTab(v as typeof settingsTab)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 gap-1 lg:grid-cols-5 h-auto p-1">
          <TabsTrigger value="filamentos" className="flex items-center gap-2 text-xs sm:text-sm py-2">
            <Spool className="h-4 w-4" />
            <span className="hidden sm:inline">Filamentos</span>
            <span className="sm:hidden">Filam.</span>
          </TabsTrigger>
          <TabsTrigger value="energia" className="flex items-center gap-2 text-xs sm:text-sm py-2">
            <Zap className="h-4 w-4" />
            Energia
          </TabsTrigger>
          <TabsTrigger value="impressora" className="flex items-center gap-2 text-xs sm:text-sm py-2">
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Impressora</span>
            <span className="sm:hidden">Impr.</span>
          </TabsTrigger>
          <TabsTrigger value="mao-de-obra" className="flex items-center gap-2 text-xs sm:text-sm py-2">
            <UserRound className="h-4 w-4" />
            <span className="hidden sm:inline">Mão de Obra</span>
            <span className="sm:hidden">M.O.</span>
          </TabsTrigger>
          <TabsTrigger value="lucro" className="flex items-center gap-2 text-xs sm:text-sm py-2 col-span-2 lg:col-span-1">
            <TrendingUp className="h-4 w-4" />
            Lucro
          </TabsTrigger>
        </TabsList>

        {/* Filamentos Tab */}
        <TabsContent value="filamentos" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Spool className="h-5 w-5 text-primary" />
                  Filamentos Cadastrados
                </CardTitle>
                <CardDescription>
                  Gerencie os tipos de filamento disponíveis para cálculo
                </CardDescription>
              </div>
              <Button 
                onClick={() => setFilamentModal({
                  open: true,
                  mode: 'add',
                  filament: { nome: '', pesoRolo: 1000, valorRolo: 0 }
                })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Filamento
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="text-right">Peso do Rolo (g)</TableHead>
                      <TableHead className="text-right">Valor do Rolo</TableHead>
                      <TableHead className="text-right">Custo por Grama</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {config.filamentos.map((filament) => (
                      <TableRow key={filament.id}>
                        <TableCell className="font-medium">{filament.nome}</TableCell>
                        <TableCell className="text-right">{filament.pesoRolo}g</TableCell>
                        <TableCell className="text-right">{formatCurrency(filament.valorRolo)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(filament.custoPorGrama)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setFilamentModal({
                                open: true,
                                mode: 'edit',
                                filament: { ...filament }
                              })}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteDialog({
                                open: true,
                                filamentId: filament.id
                              })}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Energia Tab */}
        <TabsContent value="energia" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Configurações de Energia
              </CardTitle>
              <CardDescription>
                Configure o custo de energia elétrica e consumo da impressora
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="valor-kwh">Valor do kWh (R$)</Label>
                  <Input
                    id="valor-kwh"
                    type="number"
                    min="0"
                    step="0.01"
                    value={config.energia.valorKwh}
                    onChange={(e) => updateEnergyConfig({ valorKwh: parseFloat(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Consulte sua conta de luz para obter o valor correto
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consumo-impressora">Consumo Médio da Impressora (W)</Label>
                  <Input
                    id="consumo-impressora"
                    type="number"
                    min="0"
                    step="1"
                    value={config.energia.consumoImpressora}
                    onChange={(e) => updateEnergyConfig({ consumoImpressora: parseFloat(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Potência média de consumo durante a impressão
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Impressora Tab */}
        <TabsContent value="impressora" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Printer className="h-5 w-5 text-primary" />
                Configurações da Impressora
              </CardTitle>
              <CardDescription>
                Configure o custo de desgaste e depreciação do equipamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custo-desgaste">Custo de Desgaste por Hora (R$)</Label>
                <Input
                  id="custo-desgaste"
                  type="number"
                  min="0"
                  step="0.01"
                  value={config.impressora.custoDesgastePorHora}
                  onChange={(e) => updatePrinterConfig({ custoDesgastePorHora: parseFloat(e.target.value) || 0 })}
                  className="max-w-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Este valor representa a depreciação do equipamento e custos de manutenção preventiva. 
                  Considere o valor de compra da impressora, vida útil estimada e custos de peças de reposição.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mão de Obra Tab */}
        <TabsContent value="mao-de-obra" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="h-5 w-5 text-primary" />
                Configurações de Mão de Obra
              </CardTitle>
              <CardDescription>
                Configure o valor da hora de trabalho para serviços manuais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="valor-hora">Valor da Hora de Trabalho (R$)</Label>
                <Input
                  id="valor-hora"
                  type="number"
                  min="0"
                  step="0.01"
                  value={config.maoDeObra.valorHoraTrabalho}
                  onChange={(e) => updateLaborConfig({ valorHoraTrabalho: parseFloat(e.target.value) || 0 })}
                  className="max-w-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Inclui tempo de pós-processamento: pintura, montagem, acabamento e supervisão da impressão
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lucro Tab */}
        <TabsContent value="lucro" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Configurações de Lucro
              </CardTitle>
              <CardDescription>
                Configure a margem de lucro padrão para os orçamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="margem-padrao">Margem de Lucro Padrão (%)</Label>
                <div className="relative max-w-xs">
                  <Input
                    id="margem-padrao"
                    type="number"
                    min="0"
                    max="1000"
                    step="1"
                    value={config.lucro.margemLucroPadrao}
                    onChange={(e) => updateProfitConfig({ margemLucroPadrao: parseFloat(e.target.value) || 0 })}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Esta margem será aplicada automaticamente em novos orçamentos
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer Actions */}
      <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
        <Button variant="outline" onClick={restoreDefaults}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Restaurar Padrões
        </Button>
        <Button onClick={() => setCurrentScreen('calculator')}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>

      {/* Add/Edit Filament Modal */}
      <Dialog open={filamentModal.open} onOpenChange={(open) => setFilamentModal(prev => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {filamentModal.mode === 'add' ? 'Cadastrar Filamento' : 'Editar Filamento'}
            </DialogTitle>
            <DialogDescription>
              {filamentModal.mode === 'add' 
                ? 'Adicione um novo tipo de filamento ao sistema'
                : 'Altere as informações do filamento selecionado'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="filament-nome">Nome do Filamento</Label>
              <Input
                id="filament-nome"
                value={filamentModal.filament.nome || ''}
                onChange={(e) => setFilamentModal(prev => ({
                  ...prev,
                  filament: { ...prev.filament, nome: e.target.value }
                }))}
                placeholder="Ex: PLA Branco"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filament-peso">Peso do Rolo (g)</Label>
              <Input
                id="filament-peso"
                type="number"
                min="0"
                value={filamentModal.filament.pesoRolo || ''}
                onChange={(e) => setFilamentModal(prev => ({
                  ...prev,
                  filament: { ...prev.filament, pesoRolo: parseFloat(e.target.value) || 0 }
                }))}
                placeholder="1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filament-valor">Valor do Rolo (R$)</Label>
              <Input
                id="filament-valor"
                type="number"
                min="0"
                step="0.01"
                value={filamentModal.filament.valorRolo || ''}
                onChange={(e) => setFilamentModal(prev => ({
                  ...prev,
                  filament: { ...prev.filament, valorRolo: parseFloat(e.target.value) || 0 }
                }))}
                placeholder="89.90"
              />
            </div>
            <div className="rounded-lg bg-muted p-3">
              <Label className="text-xs text-muted-foreground">Custo por Grama (calculado)</Label>
              <p className="text-lg font-semibold text-foreground">
                {formatCurrency(calculatedCostPerGram)}
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setFilamentModal(prev => ({ ...prev, open: false }))}>
              Cancelar
            </Button>
            <Button onClick={handleSaveFilament}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Filamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este filamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFilament} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
