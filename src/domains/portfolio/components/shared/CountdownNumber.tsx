"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface CountdownProps {
  endDate: Date
  startDate?: Date
  className?: string
  numberClassName?: string
  labelClassName?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function RollingValue({ value, pad = 2, numberClassName }: { value: number; pad?: number; numberClassName?: string }) {
  const display = useMemo(() => value.toString().padStart(pad, "0"), [value, pad])
  return (
    <div className="flex gap-0.5 leading-none">
      {display.split("").map((ch, idx) => (
        <div key={`${idx}-${ch}`} className="relative w-[0.8em] h-[1.2em] overflow-hidden">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={ch}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={`absolute inset-0 text-center ${numberClassName ?? ""}`}
              style={{ lineHeight: "1.2em" }}
            >
              {ch}
            </motion.span>
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

export default function CountdownNumber({
  endDate,
  startDate,
  className,
  numberClassName = "text-white",
  labelClassName = "text-sm text-white/80",
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const start = startDate ? new Date(startDate) : new Date()
      const end = new Date(endDate)
      const diff = end.getTime() - start.getTime()

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((diff / 1000 / 60) % 60)
        const seconds = Math.floor((diff / 1000) % 60)
        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    intervalRef.current = window.setInterval(calculateTimeLeft, 1000)
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [endDate, startDate])

  const numberClasses = `text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter ${numberClassName}`

  return (
    <div className={`flex items-center justify-center gap-4 ${className || ""}`}>
      <div className="flex flex-col items-center">
        <div className={numberClasses}>
          <RollingValue value={timeLeft.days} pad={Math.max(2, timeLeft.days.toString().length)} numberClassName={numberClasses} />
        </div>
        <span className={labelClassName}>Days</span>
      </div>
      <div className="text-2xl font-bold">:</div>
      <div className="flex flex-col items-center">
        <div className={numberClasses}>
          <RollingValue value={timeLeft.hours} numberClassName={numberClasses} />
        </div>
        <span className={labelClassName}>Hours</span>
      </div>
      <div className="text-2xl font-bold">:</div>
      <div className="flex flex-col items-center">
        <div className={numberClasses}>
          <RollingValue value={timeLeft.minutes} numberClassName={numberClasses} />
        </div>
        <span className={labelClassName}>Minutes</span>
      </div>
      <div className="text-2xl font-bold">:</div>
      <div className="flex flex-col items-center">
        <div className={numberClasses}>
          <RollingValue value={timeLeft.seconds} numberClassName={numberClasses} />
        </div>
        <span className={labelClassName}>Seconds</span>
      </div>
    </div>
  )
}
