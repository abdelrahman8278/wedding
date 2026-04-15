'use client'

import { useEffect, useState } from 'react'
import FlipDigit from './FlipDigit'

function getTimeLeft(targetDate: Date) {
  const total = targetDate.getTime() - new Date().getTime()

  const days = Math.max(0, Math.floor(total / (1000 * 60 * 60 * 24)))
  const hours = Math.max(0, Math.floor((total / (1000 * 60 * 60)) % 24))
  const minutes = Math.max(0, Math.floor((total / 1000 / 60) % 60))
  const seconds = Math.max(0, Math.floor((total / 1000) % 60))

  return { days, hours, minutes, seconds }
}

export default function Countdown({ date }: { date?: string }) {
  const targetDate = date ? new Date(date) : new Date('2026-12-31T18:00:00')
  const [time, setTime] = useState(getTimeLeft(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getTimeLeft(targetDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex flex-col items-center gap-6 text-pink-900 my-10">
      <h2 className="text-2xl font-playfair font-bold tracking-wide">
        باقي على يومنا الجميل 💍
      </h2>

      <div className="flex gap-4 sm:gap-6">
        <TimeBox label="Days" value={time.days} />
        <TimeBox label="Hours" value={time.hours} />
        <TimeBox label="Min" value={time.minutes} />
        <TimeBox label="Sec" value={time.seconds} />
      </div>
    </div>
  )
}

function TimeBox({ label, value }: { label: string; value: number }) {
  const digits = String(value).padStart(2, '0')

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        <FlipDigit value={Number(digits[0])} />
        <FlipDigit value={Number(digits[1])} />
      </div>
      <span className="text-[10px] sm:text-xs font-montserrat font-bold uppercase tracking-wider opacity-60">
        {label}
      </span>
    </div>
  )
}