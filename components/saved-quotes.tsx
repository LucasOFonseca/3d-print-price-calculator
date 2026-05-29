"use client"

import { Trash2, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'

export function SavedQuotes() {
  const { quotes, deleteQuote, loadQuote, config } = useAppStore()

  if (!quotes || quotes.length === 0) {
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

  const getFilamentName = (id: string) => {
    const filament = config.filaments.find(f => f.id === id)
    return filament ? filament.name : 'Desconhecido'
  }

  const formatTime = (hours: number, minutes: number) => {
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
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
              {quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">{quote.name}</TableCell>
                  <TableCell>{formatDate(quote.date)}</TableCell>
                  <TableCell>{getFilamentName(quote.printJob.filamentId)}</TableCell>
                  <TableCell>{quote.printJob.materialUsed}g</TableCell>
                  <TableCell>
                    {formatTime(quote.printJob.printTimeHours, quote.printJob.printTimeMinutes)}
                  </TableCell>
                  <TableCell>{formatCurrency(quote.result.totalCost)}</TableCell>
                  <TableCell className="font-bold text-primary">
                    {formatCurrency(quote.result.finalPrice)}
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        loadQuote(quote.id)
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
                      onClick={() => deleteQuote(quote.id)}
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
