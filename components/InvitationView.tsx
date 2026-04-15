'use client'

import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Envelope from './Envelope'
import InvitationCard from './InvitationCard'

export default function InvitationView({ data }: any) {

    const [open, setOpen] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const handleOpen = () => {
        setOpen(true)
        audioRef.current?.play().catch(() => { })
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-yellow-50">

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

        </main>
    )
}