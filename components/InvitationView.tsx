'use client'

import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Envelope from './Envelope'
import InvitationCard from './InvitationCard'

import Link from 'next/link'

export default function InvitationView({ data }: any) {

    const [open, setOpen] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const handleOpen = () => {
        setOpen(true)
        audioRef.current?.play().catch(() => { })
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-yellow-50 relative">

            <audio ref={audioRef} loop src="/music.mp3" />

            <AnimatePresence mode="wait">
                {!open ? (
                    <Envelope key="env" onOpen={handleOpen} />
                ) : (
                    <InvitationCard
                        key="card"
                        id={data.id}
                        groom={data.groom}
                        bride={data.bride}
                        message={data.message}
                        date={data.wedding_date}
                        location_name={data.location_name}
                        location_city={data.location_city}
                    />
                )}
            </AnimatePresence>

            {/* Floating button for messages */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed bottom-6 right-6 z-[60]"
            >
                <Link href={`/${data.slug}/messages`} className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-pink-200 px-5 py-3 rounded-full shadow-lg hover:shadow-pink-200/50 transition-all duration-300 group">
                    <span className="text-xl group-hover:scale-125 transition-transform duration-300">💌</span>
                    <span className="font-cairo text-sm font-bold text-pink-600">رسائل الضيوف</span>
                </Link>
            </motion.div>

        </main>
    )
}