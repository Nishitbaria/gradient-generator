import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CuratedGradients } from "@/components/curated-gradients"
import { Suspense } from "react"
import type { Metadata } from "next"

// Dynamically import components that aren't needed for initial render
// This helps reduce the initial bundle size for mobile devices
const GradientGenerator = dynamic(() => import("@/components/gradient-generator"), {
  ssr: true,
  loading: () => (
    <div className="w-full max-w-4xl mx-auto animate-pulse">
      <div className="h-64 bg-gray-800/50 rounded-2xl mb-8"></div>
    </div>
  ),
})

// Import the client components wrapper
const ClientComponents = dynamic(() => import("@/components/client-components"), {
  ssr: true,
})

export const metadata: Metadata = {
  title: "Create Beautiful CSS Gradients",
  description: "Interactive tool to create, customize, and export beautiful Tailwind CSS gradients for your web projects. Features real-time preview, accessibility checking, and multiple export options.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Create Beautiful CSS Gradients with Tailwind",
    description: "Interactive tool to create, customize, and export beautiful Tailwind CSS gradients for your web projects.",
    url: "https://gradient.nishitbaria.tech",
  },
  twitter: {
    creator: "@nishitbaria",
  },
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-linear-to-br gradient-from-gray-950 gradient-to-black flex flex-col items-center justify-center p-4 py-24 md:py-32 pb-32 md:pb-40">
        <Suspense
          fallback={
            <div className="w-full max-w-4xl mx-auto animate-pulse">
              <div className="h-64 bg-gray-800/50 rounded-2xl mb-8"></div>
            </div>
          }
        >
          <GradientGenerator />
        </Suspense>

        <div className="w-full py-8 md:py-12"></div>

        <CuratedGradients />
      </main>
      <Footer />
      <ClientComponents />
    </>
  )
}

