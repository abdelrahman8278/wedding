'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Envelope({ onOpen }: { onOpen: () => void }) {
    const [isOpened, setIsOpened] = useState(false)

    const handleClick = () => {
        if (isOpened) return
        setIsOpened(true)
        setTimeout(() => {
            onOpen()
        }, 3000)
    }

    return (
        <motion.div 
            className="relative w-[320px] sm:w-[440px] h-[220px] sm:h-[280px] cursor-pointer"
            onClick={handleClick}
            exit={{ 
                opacity: 0, 
                scale: 1.1, 
                rotateX: 20,
                y: -100,
                transition: { duration: 1, ease: [0.43, 0.13, 0.23, 0.96] } 
            }}
            style={{ perspective: 2000 }}
        >
            {/* Real 3D Shadow */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] h-10 bg-black/10 blur-2xl rounded-full scale-y-50"></div>

            {/* Envelope Back */}
            <div className="absolute inset-0 bg-pink-100/90 rounded-2xl shadow-2xl border border-white/30" />

            {/* Inner card preview - Animated */}
            <motion.div 
                layoutId="invitation-card"
                initial={{ y: 0 }}
                animate={isOpened ? { y: -180, zIndex: 25, scale: 0.8 } : { y: 0 }}
                transition={{ duration: 2.2, delay: 0.6, type: "tween", ease: "easeInOut" }}
                className="absolute inset-[10px] sm:inset-[15px] bg-white rounded-xl shadow-inner flex flex-col items-center justify-center overflow-hidden z-[5] border border-pink-50"
            >
                <div className="text-pink-400 text-3xl sm:text-4xl font-playfair opacity-40">A & E</div>
                <div className="w-12 h-0.5 bg-pink-100 rounded-full mt-2"></div>
            </motion.div>

            {/* Flaps with Gold Accents */}
            <div className="absolute inset-0 bg-pink-200/95 rounded-2xl z-10 pointer-events-none" style={{ clipPath: 'polygon(0 0, 50% 50%, 0 100%)' }} />
            <div className="absolute inset-0 bg-pink-200/95 rounded-2xl z-10 pointer-events-none" style={{ clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)' }} />

            {/* Bottom Flap */}
            <div className="absolute inset-0 bg-pink-50 rounded-2xl z-20 pointer-events-none shadow-[0_-5px_15px_rgba(0,0,0,0.03)] border-b border-pink-100" style={{ clipPath: 'polygon(0 100%, 50% 55%, 100% 100%)' }} />

            {/* Top Flap (Animated) */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-b from-pink-300 to-pink-400 rounded-2xl z-30 origin-top shadow-xl border-t border-white/20"
                style={{ clipPath: 'polygon(0 0, 100% 0, 50% 55%)' }}
                initial={{ rotateX: 0 }}
                animate={isOpened ? { rotateX: 160, zIndex: 0 } : { rotateX: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            />

            {/* Wax Seal */}
            <motion.div 
                initial={{ scale: 1 }}
                animate={isOpened ? { scale: 0.2, opacity: 0, y: 20 } : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute z-40 w-16 h-16 sm:w-20 sm:h-20 left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            >
                {/* Seal Base */}
                <div className="absolute inset-0 bg-red-700 rounded-full shadow-lg border-2 border-red-900 rotate-12"></div>
                <div className="absolute inset-1 bg-red-600 rounded-full border border-red-800/50"></div>
                
                <span className="relative z-10 text-pink-100 text-[10px] sm:text-[11px] font-cairo font-bold tracking-tight text-center leading-tight drop-shadow-md">
                    افتح<br/>الدعوة
                </span>
            </motion.div>
            <motion.div 
                animate={isOpened ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
                className="absolute -bottom-16 left-0 w-full text-center"
            >
                <span className="text-pink-700/60 font-montserrat uppercase tracking-[0.3em] text-[10px] sm:text-xs">
                    Press to Reveal
                </span>
            </motion.div>
        </motion.div>
    )
}