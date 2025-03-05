'use client'

import dynamic from 'next/dynamic'

const OfflineStatus = dynamic(() => import("@/components/offline-status").then((mod) => mod.OfflineStatus), {
    ssr: false,
})

const InstallPrompt = dynamic(() => import("@/components/install-prompt").then((mod) => mod.InstallPrompt), {
    ssr: false,
})

export default function ClientComponents() {
    return (
        <>
            <OfflineStatus />
            <InstallPrompt />
        </>
    )
} 