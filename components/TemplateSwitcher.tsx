'use client'

import { useEffect, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getInvitationTemplateUi, invitationTemplates } from '@/lib/templates'
import type { InvitationTemplateId } from '@/lib/templates'

type TemplateSwitcherProps = {
    activeTemplate: InvitationTemplateId
    activeMode?: string
}

export default function TemplateSwitcher({ activeTemplate, activeMode }: TemplateSwitcherProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const [pendingTemplate, setPendingTemplate] = useState<InvitationTemplateId | null>(null)
    const ui = getInvitationTemplateUi(activeTemplate)
    const isLoading = isPending || pendingTemplate !== null

    useEffect(() => {
        if (!pendingTemplate || pendingTemplate !== activeTemplate) return
        const t = window.setTimeout(() => setPendingTemplate(null), 250)
        return () => window.clearTimeout(t)
    }, [activeTemplate, pendingTemplate])

    const selectTemplate = (template: InvitationTemplateId) => {
        if (template === activeTemplate || isLoading) return
        const next = new URLSearchParams(searchParams.toString())
        next.set('template', template)
        setPendingTemplate(template)
        startTransition(() => {
            router.replace(`${pathname}?${next.toString()}`, { scroll: false })
        })
    }

    const prefetchTemplate = (template: InvitationTemplateId) => {
        if (template === activeTemplate) return
        const next = new URLSearchParams(searchParams.toString())
        next.set('template', template)
        router.prefetch(`${pathname}?${next.toString()}`)
    }

    return (
        <div className="fixed left-1/2 top-4 z-[80] w-[calc(100vw-1.5rem)] max-w-5xl -translate-x-1/2">
            <div className={`scrollbar-none flex gap-2 overflow-x-auto rounded-2xl border p-2 backdrop-blur-2xl ${ui.switcher}`}>
                {invitationTemplates.map((template) => {
                    const isActive = template.id === activeTemplate
                    const isTemplateLoading = pendingTemplate === template.id

                    return (
                        <button
                            key={template.id}
                            type="button"
                            onClick={() => selectTemplate(template.id)}
                            onMouseEnter={() => prefetchTemplate(template.id)}
                            disabled={isLoading}
                            className={`min-h-9 shrink-0 rounded-xl px-3 py-2 font-montserrat text-xs font-bold transition-all duration-200 ${
                                isActive ? ui.switcherActive : ui.switcherIdle
                            } ${isLoading ? 'cursor-wait' : ''}`}
                            title={template.description}
                        >
                            <span className="inline-flex min-w-12 items-center justify-center gap-1.5">
                                {isTemplateLoading && (
                                    <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                )}
                                {template.shortName}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
