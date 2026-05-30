"use client"

import { useEffect, useState } from 'react'
import { Header } from './header'
import { PrintDataForm, PostProcessingForm, PackagingForm } from './print-data-form'
import { ProfitForm } from './profit-form'
import { ResultsSummary } from './results-summary'
import { SavedQuotes } from './saved-quotes'
import { SettingsScreen } from './settings-screen'
import { ImportModal } from './import-modal'
import { ExportModal } from './export-modal'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api-client'

export function Calculator() {
  const [mounted, setMounted] = useState(false)
  const { 
    currentScreen, 
    showImportModal, 
    showExportModal, 
    setShowImportModal, 
    setShowExportModal,
    printJob,
    config,
    calculateResult
  } = useAppStore()

  useEffect(() => {
    async function hydrate() {
      try {
        const [configRes, quotesRes] = await Promise.all([
          api.get('/config'),
          api.get('/quotes'),
        ])
        const configData = configRes.data.data
        const firstFilamentId = configData?.filaments?.[0]?.id
        const firstPackagingId = configData?.packaging?.[0]?.id

        useAppStore.setState({
          config: configData,
          quotes: quotesRes.data.data,
          printJob: {
            ...useAppStore.getState().printJob,
            ...(firstFilamentId ? { filamentId: firstFilamentId } : {}),
            ...(firstPackagingId ? { packagingId: firstPackagingId } : {}),
          }
        })
      } catch (err) {
        console.error('Hydration error:', err)
      } finally {
        setMounted(true)
      }
    }
    hydrate()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      calculateResult()
    }, 300)
    return () => clearTimeout(timer)
  }, [printJob, config, calculateResult])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {currentScreen === 'calculator' ? (
        <main className="container mx-auto px-4 py-6 lg:px-8 lg:py-8">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            {/* Left column - Print Data & Post-processing */}
            <div className="space-y-6">
              <PrintDataForm />
              <PostProcessingForm />
              <PackagingForm />
            </div>

            {/* Right column - Profit & Results */}
            <div className="space-y-6">
              <ProfitForm />
              <div className="lg:sticky lg:top-24">
                <ResultsSummary />
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <SavedQuotes />
          </div>
        </main>
      ) : (
        <SettingsScreen />
      )}

      {/* Modals */}
      <ImportModal open={showImportModal} onOpenChange={setShowImportModal} />
      <ExportModal open={showExportModal} onOpenChange={setShowExportModal} />
    </div>
  )
}
