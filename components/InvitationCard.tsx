'use client'

import { motion } from 'framer-motion'
import Countdown from './Countdown'
import GuestForm from './GuestForm'

export default function InvitationCard() {
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    }

    return (
        <motion.div
            layoutId="invitation-card"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative bg-white/70 backdrop-blur-3xl border border-white/40 p-10 sm:p-14 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] w-full max-w-2xl text-center z-50 mx-4 overflow-hidden"
        >
            {/* Ornamental Corners */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-pink-200/50 rounded-tl-[3rem] m-4"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-pink-200/50 rounded-br-[3rem] m-4"></div>

            {/* Background Soft Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-pink-50/50 to-transparent pointer-events-none"></div>

            <div className="relative z-10">
                <motion.div variants={itemVariants} className="mb-8">
                    <p className="font-montserrat uppercase tracking-[0.4em] text-pink-500 text-xs sm:text-sm font-bold mb-2">
                        Wedding Invitation
                    </p>
                    <div className="w-12 h-0.5 bg-pink-100 mx-auto"></div>
                </motion.div>

                <motion.h1 variants={itemVariants} className="text-6xl sm:text-8xl font-playfair mb-8 text-pink-900 leading-tight">
                    Abdelrahman <br />
                    <span className="text-4xl sm:text-5xl italic block my-3 text-pink-300 font-serif">&</span>
                    Esraa
                </motion.h1>

                <motion.div variants={itemVariants} className="mb-10">
                    <p className="font-cairo text-xl sm:text-3xl text-pink-700/90 leading-relaxed dir-rtl mb-6">
                        يسرّنا دعوتكم لحضور حفلنا، وتشريفنا بوجودكم لإكمال فرحتنا
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-8 bg-pink-200"></div>
                        <div className="w-2 h-2 rounded-full bg-pink-300"></div>
                        <div className="h-px w-8 bg-pink-200"></div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-3 mb-12">
                    <p className="font-montserrat text-lg text-pink-800/60 font-medium italic">
                        The joy of our wedding is incomplete <br className="hidden sm:block" /> without your presence.
                    </p>
                    <p className="font-playfair text-3xl font-bold text-pink-900 tracking-wider pt-4">
                        Wednesday, 12 August 2026
                    </p>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Countdown />
                </motion.div>

                <motion.div variants={itemVariants} className="mt-14 relative group">
                    <div className="absolute -inset-4 bg-pink-50/50 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-white/50 p-8 rounded-[2rem] border border-white/80 shadow-sm overflow-hidden">
                        <h2 className="font-playfair font-bold text-2xl text-pink-900 mb-2 tracking-wide">
                            Reviera Hall
                        </h2>
                        <p className="font-montserrat text-pink-800/60 tracking-widest text-sm mb-8">Cairo, Egypt</p>

                        <div className="relative rounded-2xl overflow-hidden shadow-md border border-white/50">
                            <iframe
                                className="w-full h-48 filter grayscale-[0.3] contrast-[1.1] hover:grayscale-0 transition-all duration-700"
                                src="https://maps.google.com/maps?q=cairo&output=embed"
                            />
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-12">
                    <GuestForm />
                </motion.div>
            </div>
        </motion.div>
    )
}