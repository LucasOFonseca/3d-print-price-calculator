"use client"

import { Input } from '@/components/ui/input'

interface TimeInputProps {
  hours: number
  minutes: number
  onHoursChange: (hours: number) => void
  onMinutesChange: (minutes: number) => void
}

export function TimeInput({ hours, minutes, onHoursChange, onMinutesChange }: TimeInputProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <div className="relative">
          <Input
            type="number"
            min="0"
            max="999"
            value={hours}
            onChange={(e) => onHoursChange(Math.max(0, parseInt(e.target.value) || 0))}
            className="pr-8"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            h
          </span>
        </div>
      </div>
      <span className="text-muted-foreground">:</span>
      <div className="flex-1">
        <div className="relative">
          <Input
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => onMinutesChange(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
            className="pr-10"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            min
          </span>
        </div>
      </div>
    </div>
  )
}
