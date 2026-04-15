'use client'

import { motion, AnimatePresence } from 'framer-motion'

export default function FlipDigit({ value }: { value: number }) {
  return (
    <div className="relative w-9 h-14 sm:w-12 sm:h-18 bg-pink-900 rounded-xl overflow-hidden shadow-2xl border border-pink-700/50 flex items-center justify-center">
      {/* Decorative center line */}
      <div className="absolute w-full h-[2px] bg-black/40 top-1/2 -translate-y-1/2 z-20" />
      
      {/* Subtle top/bottom shadow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none z-10" />

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={value}
          initial={{ y: 25, opacity: 0, rotateX: -90 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          exit={{ y: -25, opacity: 0, rotateX: 90 }}
          transition={{ 
            duration: 0.4, 
            ease: [0.4, 0, 0.2, 1],
            opacity: { duration: 0.2 }
          }}
          className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tighter"
        >
          {value}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
