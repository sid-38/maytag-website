"use client"

import * as React from "react"
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar-rac"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function toCalendarDate(d: Date): CalendarDate {
  return new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
}

/** Local midnight for the given calendar day (date-only; no separate time picker). */
function calendarDateToLocalMidnight(cal: CalendarDate): Date {
  return new Date(cal.year, cal.month - 1, cal.day, 0, 0, 0, 0)
}

export interface NewDateTimePickerProps {
  value?: Date | null
  onChange?: (date: Date | null) => void
  /** Earliest selectable calendar day (local). Defaults to today. */
  minDate?: CalendarDate
  datePlaceholder?: string
  dateLabel?: React.ReactNode
  disabled?: boolean
  className?: string
}

export function NewDateTimePicker({
  value,
  onChange,
  minDate,
  datePlaceholder = "Select date",
  dateLabel = "Date",
  disabled = false,
  className,
}: NewDateTimePickerProps) {
  const [dateOpen, setDateOpen] = React.useState(false)
  const calendarValue = value ? toCalendarDate(value) : null
  const minValue = minDate ?? today(getLocalTimeZone())

  const handleDateChange = (cal: CalendarDate | null) => {
    if (!cal) {
      onChange?.(null)
      setDateOpen(false)
      return
    }
    onChange?.(calendarDateToLocalMidnight(cal))
    setDateOpen(false)
  }

  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className ?? ""}`}>
      <div className="flex flex-col flex-1">
        <label htmlFor="date" className="block text-sm font-semibold text-black mb-1">
          {dateLabel}
        </label>
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              disabled={disabled}
              className="w-full sm:w-auto justify-between text-base font-normal border border-gray-300 rounded px-4 py-2.5 min-h-[46px] focus:border-[#00bfb3] focus:ring-[#00bfb3]/30 focus:outline-none"
            >
              {value ? value.toLocaleDateString() : datePlaceholder}
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0 border border-gray-300 rounded-lg shadow-lg bg-white" align="center">
            <Calendar
              value={calendarValue}
              onChange={handleDateChange}
              minValue={minValue}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
