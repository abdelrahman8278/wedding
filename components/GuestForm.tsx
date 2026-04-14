'use client'

import { useState } from 'react'

export default function GuestForm() {
    const [name, setName] = useState('')
    const [msg, setMsg] = useState('')
    const [messages, setMessages] = useState<any[]>([])

    const submit = () => {
        if (!name || !msg) return
        setMessages([...messages, { name, msg }])
        setName('')
        setMsg('')
    }

    return (
        <div className="mt-6">
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="border p-2 w-full mb-2 rounded"
            />

            <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Your Message"
                className="border p-2 w-full mb-2 rounded"
            />

            <button
                onClick={submit}
                className="bg-pink-500 text-white px-4 py-2 rounded"
            >
                Send ❤️
            </button>

            <div className="mt-4 space-y-2">
                {messages.map((m, i) => (
                    <div key={i} className="bg-white/50 p-2 rounded">
                        <strong>{m.name}</strong>: {m.msg}
                    </div>
                ))}
            </div>
        </div>
    )
}