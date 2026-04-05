"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface CountdownProps {
  endDate: Date
  startDate?: Date
  className?: string
  gradientColors?: string[]
  gradientSpeedSec?: number
  labelClassName?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const DEFAULT_COLORS = ["#ff8a3d", "#ff9f4d", "#ffc27d"]

function RollingValue({
  value,
  pad = 2,
  gradientColors = DEFAULT_COLORS,
  gradientSpeedSec = 6,
}: {
  value: number
  pad?: number
  gradientColors?: string[]
  gradientSpeedSec?: number
}) {
  const display = useMemo(() => value.toString().padStart(pad, "0"), [value, pad])

  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(90deg, ${gradientColors.join(", ")})`,
    backgroundSize: "200% 200%",
    animation: `gradientShift ${gradientSpeedSec}s ease infinite`,
    WebkitBackgroundClip: "text",
    color: "transparent",
  }

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
              className="absolute inset-0 text-center"
              style={{ lineHeight: "1.2em", ...gradientStyle }}
            >
              {ch}
            </motion.span>
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

export default function LandingCountdown({
  endDate,
  startDate,
  className,
  gradientColors = DEFAULT_COLORS,
  gradientSpeedSec = 6,
  labelClassName = "text-sm text-white/70",
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

  const numberClasses = "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tighter"

  return (
    <div className={`flex items-center justify-center gap-3 sm:gap-4 ${className || ""}`}>
      <div className="flex flex-col items-center">
        <div className={numberClasses}>
          <RollingValue
            value={timeLeft.days}
            pad={Math.max(2, timeLeft.days.toString().length)}
            gradientColors={gradientColors}
            gradientSpeedSec={gradientSpeedSec}
          />
        </div>
        <span className={labelClassName}>Days</span>
      </div>
      <div className="text-xl sm:text-2xl font-bold text-white/80">:</div>
      <div className="flex flex-col items-center">
        <div className={numberClasses}>
          <RollingValue value={timeLeft.hours} gradientColors={gradientColors} gradientSpeedSec={gradientSpeedSec} />
        </div>
        <span className={labelClassName}>Hours</span>
      </div>
      <div className="text-xl sm:text-2xl font-bold text-white/80">:</div>
      <div className="flex flex-col items-center">
        <div className={numberClasses}>
          <RollingValue value={timeLeft.minutes} gradientColors={gradientColors} gradientSpeedSec={gradientSpeedSec} />
        </div>
        <span className={labelClassName}>Minutes</span>
      </div>
      <div className="text-xl sm:text-2xl font-bold text-white/80">:</div>
      <div className="flex flex-col items-center">
        <div className={numberClasses}>
          <RollingValue value={timeLeft.seconds} gradientColors={gradientColors} gradientSpeedSec={gradientSpeedSec} />
        </div>
        <span className={labelClassName}>Seconds</span>
      </div>
    </div>
  )
}

// Keyframes for gradientShift if not already present
if (typeof document !== "undefined" && !document.getElementById("gradient-text-keyframes")) {
  const style = document.createElement("style")
  style.id = "gradient-text-keyframes"
  style.innerHTML = `@keyframes gradientShift {0% {background-position: 0% 50%;}50% {background-position: 100% 50%;}100% {background-position: 0% 50%;}}`
  document.head.appendChild(style)
}
