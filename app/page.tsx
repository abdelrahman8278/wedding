'use client'

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Envelope from '../components/Envelope'
import InvitationCard from '../components/InvitationCard'

export default function Home() {
    const [open, setOpen] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const handleOpen = () => {
        setOpen(true)
        if (audioRef.current) {
            audioRef.current.play().catch(err => console.log("Audio play blocked:", err))
        }
    }

    // Floating particles component
    const Particles = () => (
        <div className="fixed inset-0 pointer-events-none z-0">
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-pink-300/30 rounded-full blur-[1px]"
                    initial={{ 
                        x: Math.random() * 100 + "%", 
                        y: "110%", 
                        opacity: 0,
                        scale: Math.random() * 0.5 + 0.5
                    }}
                    animate={{ 
                        y: "-10%", 
                        opacity: [0, 1, 1, 0],
                        x: (Math.random() * 20 - 10) + 50 + "%"
                    }}
                    transition={{ 
                        duration: Math.random() * 10 + 10, 
                        repeat: Infinity, 
                        delay: Math.random() * 10,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    )

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-yellow-50 overflow-hidden relative">
            <audio ref={audioRef} loop src="/music.mp3" />
            
            <Particles />
            
            <AnimatePresence mode="wait">
                {!open && (
                    <Envelope key="envelope" onOpen={handleOpen} />
                )}
                {open && (
                    <InvitationCard key="card" />
                )}
            </AnimatePresence>
        </main>
    )
}