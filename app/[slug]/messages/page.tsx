'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function MessagesPage({ params }: any) {

    const [password, setPassword] = useState('')
    const [messages, setMessages] = useState<any[]>([])
    const [allowed, setAllowed] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const checkPassword = async () => {
        if (!password) return
        setLoading(true)
        setError(false)

        const { data } = await supabase
            .from('invitations')
            .select('*')
            .eq('slug', params.slug)
            .single()

        if (data?.access_password === password) {
            const { data: msgs } = await supabase
                .from('guest_messages')
                .select('*')
                .eq('invitation_id', data.id)
                .order('created_at', { ascending: false })

            setMessages(msgs || [])
            setAllowed(true)
        } else {
            setError(true)
        }

        setLoading(false)
    }

    if (!allowed) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-yellow-50 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed top-6 left-6 z-50"
                >
                    <Link href={`/${params.slug}`} className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-pink-100 px-4 py-2 rounded-full shadow-sm hover:shadow-pink-200/50 transition-all duration-300 group">
                        <span className="text-lg group-hover:-translate-x-1 transition-transform duration-300">⬅️</span>
                        <span className="font-cairo text-sm text-pink-600">العودة للدعوة</span>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="w-full max-w-sm bg-white/70 backdrop-blur-3xl border border-white/40 rounded-[2.5rem] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.1)] p-10 text-center"
                >
                    {/* Lock Icon */}
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-3xl shadow-inner">
                        🔒
                    </div>

                    <p className="font-montserrat uppercase tracking-[0.3em] text-pink-500 text-xs font-bold mb-2">
                        منطقة خاصة
                    </p>
                    <h1 className="font-playfair text-2xl text-pink-900 font-bold mb-6">
                        رسائل الضيوف
                    </h1>

                    <div className="space-y-3">
                        <input
                            dir="rtl"
                            type="password"
                            placeholder="كلمة المرور"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(false) }}
                            onKeyDown={(e) => e.key === 'Enter' && checkPassword()}
                            className="w-full bg-white/70 border border-pink-100 rounded-2xl px-5 py-3 text-pink-900 placeholder:text-pink-300 font-cairo text-sm outline-none focus:ring-2 focus:ring-pink-200 transition"
                        />

                        <AnimatePresence>
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-rose-400 font-cairo text-sm"
                                >
                                    كلمة المرور غير صحيحة ❌
                                </motion.p>
                            )}
                        </AnimatePresence>

                        <motion.button
                            onClick={checkPassword}
                            disabled={loading || !password}
                            whileTap={{ scale: 0.97 }}
                            whileHover={{ scale: 1.02 }}
                            className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 text-white font-montserrat font-bold text-sm tracking-wider shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? '...' : 'دخول'}
                        </motion.button>
                    </div>
                </motion.div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-yellow-50 px-4 py-14 relative">
            
            {/* Back Button */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed top-6 left-6 z-50"
            >
                <Link href={`/${params.slug}`} className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-pink-100 px-4 py-2 rounded-full shadow-sm hover:shadow-pink-200/50 transition-all duration-300 group">
                    <span className="text-lg group-hover:-translate-x-1 transition-transform duration-300">⬅️</span>
                    <span className="font-cairo text-sm text-pink-600">العودة للدعوة</span>
                </Link>
            </motion.div>

            <div className="max-w-2xl mx-auto">

                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <p className="font-montserrat uppercase tracking-[0.4em] text-pink-500 text-xs font-bold mb-2">
                        رسائل الضيوف
                    </p>
                    <h1 className="font-playfair text-4xl text-pink-900 font-bold">
                        كلمات من القلب 💌
                    </h1>
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <div className="h-px w-16 bg-pink-200" />
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-300" />
                        <div className="h-px w-16 bg-pink-200" />
                    </div>
                </motion.div>

                {/* Messages */}
                {messages.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-pink-400 font-cairo text-lg py-20"
                    >
                        لا توجد رسائل بعد 🌸
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg, i) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08, duration: 0.4 }}
                                className="bg-white/60 backdrop-blur-md border border-white/70 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
                                dir="rtl"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-200 to-rose-200 flex items-center justify-center text-pink-700 font-bold font-serif text-lg shadow-inner">
                                        {msg.name?.charAt(0)}
                                    </div>
                                    <h3 className="font-cairo font-bold text-pink-900 text-sm">
                                        {msg.name}
                                    </h3>
                                </div>
                                <p className="font-cairo text-pink-700/80 leading-relaxed text-sm">
                                    {msg.message}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}