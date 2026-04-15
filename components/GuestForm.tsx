'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

export default function GuestForm({ invitationId }: any) {

    const [name, setName] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async () => {
        if (!name.trim() || !message.trim()) return
        setLoading(true)

        await supabase.from('guest_messages').insert([
            { invitation_id: invitationId, name, message }
        ])

        setLoading(false)
        setSent(true)
        setName('')
        setMessage('')

        setTimeout(() => setSent(false), 4000)
    }

    return (
        <div className="mt-10 w-full">
            {/* Section Title */}
            <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-pink-200" />
                <p className="font-montserrat uppercase tracking-[0.3em] text-pink-500 text-xs font-bold">
                    رسالتك لنا
                </p>
                <div className="h-px flex-1 bg-pink-200" />
            </div>

            <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] space-y-4">
                <input
                    dir="rtl"
                    placeholder="اسمك"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/70 border border-pink-100 rounded-2xl px-5 py-3 text-pink-900 placeholder:text-pink-300 font-cairo text-sm outline-none focus:ring-2 focus:ring-pink-200 transition"
                />

                <textarea
                    dir="rtl"
                    rows={3}
                    placeholder="رسالتك للعروسين..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white/70 border border-pink-100 rounded-2xl px-5 py-3 text-pink-900 placeholder:text-pink-300 font-cairo text-sm outline-none focus:ring-2 focus:ring-pink-200 transition resize-none"
                />

                <motion.button
                    onClick={handleSubmit}
                    disabled={loading || !name || !message}
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.02 }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 text-white font-montserrat font-bold text-sm tracking-wider shadow-md hover:shadow-pink-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? '...' : 'إرسال ❤️'}
                </motion.button>

                {/* Success Toast */}
                <AnimatePresence>
                    {sent && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="text-center text-pink-600 font-cairo text-sm pt-1"
                        >
                            تم إرسال رسالتك بنجاح 🌸
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}