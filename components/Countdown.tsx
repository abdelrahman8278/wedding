'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function Countdown() {
    const target = new Date('2026-08-12').getTime()
    const [time, setTime] = useState(target - Date.now())
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const interval = setInterval(() => {
            setTime(target - Date.now())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    if (!mounted) return null

    const days = Math.max(0, Math.floor(time / (1000 * 60 * 60 * 24)))
    const hours = Math.max(0, Math.floor((time / (1000 * 60 * 60)) % 24))
    const minutes = Math.max(0, Math.floor((time / (1000 * 60)) % 60))
    const seconds = Math.max(0, Math.floor((time / 1000) % 60))

    const timeBlocks = [
        { label: 'Days', value: days },
        { label: 'Hours', value: hours },
        { label: 'Mins', value: minutes },
        { label: 'Secs', value: seconds },
    ]

    return (
        <div className="flex justify-center gap-3 sm:gap-4 my-8">
            {timeBlocks.map((block, idx) => (
                <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                    className="flex flex-col items-center"
                >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/60 backdrop-blur-md border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-serif text-pink-900 relative">
                        <span className="relative z-10">{block.value.toString().padStart(2, '0')}</span>
                    </div>
                    <span className="mt-3 text-xs sm:text-sm font-semibold text-pink-900/70 uppercase tracking-widest">
                        {block.label}
                    </span>
                </motion.div>
            ))}
        </div>
    )
}