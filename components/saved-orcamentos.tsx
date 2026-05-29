"use client"

import { Trash2, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'

export function SavedOrcamentos() {
  const { orcamentos, deleteOrcamento, loadOrcamento, config } = useAppStore()

  if (!orcamentos || orcamentos.length === 0) {
    return null
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFilamentoName = (id: string) => {
    const filamento = config.filamentos.find(f => f.id === id)
    return filamento ? filamento.nome : 'Desconhecido'
  }

  const formatTime = (horas: number, minutos: number) => {
    if (horas > 0) {
      return `${horas}h ${minutos}m`
    }
    return `${minutos}m`
  }

  return (
    <Card className="mt-8 border-2 border-primary/20 bg-card shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Orçamentos Salvos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Filamento</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Tempo</TableHead>
                <TableHead>Custo Total</TableHead>
                <TableHead>Preço Final</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orcamentos.map((orcamento) => (
                <TableRow key={orcamento.id}>
                  <TableCell className="font-medium">{orcamento.nome}</TableCell>
                  <TableCell>{formatDate(orcamento.data)}</TableCell>
                  <TableCell>{getFilamentoName(orcamento.printJob.filamentoId)}</TableCell>
                  <TableCell>{orcamento.printJob.materialUtilizado}g</TableCell>
                  <TableCell>
                    {formatTime(orcamento.printJob.tempoImpressaoHoras, orcamento.printJob.tempoImpressaoMinutos)}
                  </TableCell>
                  <TableCell>{formatCurrency(orcamento.result.custoTotal)}</TableCell>
                  <TableCell className="font-bold text-primary">
                    {formatCurrency(orcamento.result.precoFinal)}
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        loadOrcamento(orcamento.id)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className="text-primary hover:bg-primary/10 hover:text-primary"
                      title="Carregar Orçamento"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteOrcamento(orcamento.id)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      title="Excluir Orçamento"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
