'use client'

import { useEffect, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getInvitationTemplateUi, invitationTemplates } from '@/lib/templates'
import type { InvitationTemplateId } from '@/lib/templates'

type TemplateSwitcherProps = {
    activeTemplate: InvitationTemplateId
}

export default function TemplateSwitcher({ activeTemplate }: TemplateSwitcherProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const [pendingTemplate, setPendingTemplate] = useState<InvitationTemplateId | null>(null)
    const ui = getInvitationTemplateUi(activeTemplate)
    const showLoader = isPending || pendingTemplate !== null

    useEffect(() => {
        if (!pendingTemplate || pendingTemplate !== activeTemplate) {
            return
        }

        const timeout = window.setTimeout(() => {
            setPendingTemplate(null)
        }, 450)

        return () => window.clearTimeout(timeout)
    }, [activeTemplate, pendingTemplate])

    const selectTemplate = (template: InvitationTemplateId) => {
        if (template === activeTemplate || showLoader) {
            return
        }

        const nextParams = new URLSearchParams(searchParams.toString())
        nextParams.set('template', template)
        setPendingTemplate(template)
        startTransition(() => {
            router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false })
        })
    }

    return (
        <>
            {showLoader ? (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/18 px-4 backdrop-blur-[2px]" aria-live="polite" aria-busy="true">
                    <div className={`flex items-center gap-3 rounded-2xl border px-5 py-4 backdrop-blur-2xl ${ui.switcher}`}>
                        <div className="relative h-8 w-8">
                            <div className="absolute inset-0 rounded-full border-2 border-current opacity-20" />
                            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-current" />
                        </div>
                        <span className="font-cairo text-sm font-bold">جار تحميل التصميم...</span>
                    </div>
                </div>
            ) : null}

            <div className="fixed left-1/2 top-4 z-[80] w-[calc(100vw-1.5rem)] max-w-5xl -translate-x-1/2">
                <div className={`scrollbar-none flex gap-2 overflow-x-auto rounded-2xl border p-2 backdrop-blur-2xl ${ui.switcher}`}>
                    {invitationTemplates.map((template) => {
                        const isActive = template.id === activeTemplate
                        const isLoading = pendingTemplate === template.id

                        return (
                            <button
                                key={template.id}
                                type="button"
                                onClick={() => selectTemplate(template.id)}
                                disabled={showLoader}
                                className={`min-h-9 shrink-0 rounded-xl px-3 py-2 font-montserrat text-xs font-bold transition-all duration-200 ${
                                    isActive
                                        ? ui.switcherActive
                                        : ui.switcherIdle
                                } ${showLoader ? 'cursor-wait opacity-70' : ''}`}
                                title={template.description}
                            >
                                <span className="inline-flex min-w-12 items-center justify-center gap-2">
                                    {isLoading ? (
                                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    ) : null}
                                    {template.shortName}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
