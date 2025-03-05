import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CuratedGradients } from "@/components/curated-gradients"
import { Suspense } from "react"

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

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-950 to-black flex flex-col items-center justify-center p-4 py-32 pb-40">
        <Suspense
          fallback={
            <div className="w-full max-w-4xl mx-auto animate-pulse">
              <div className="h-64 bg-gray-800/50 rounded-2xl mb-8"></div>
            </div>
          }
        >
          <GradientGenerator />
        </Suspense>

        <CuratedGradients />
      </main>
      <Footer />
      <ClientComponents />
    </>
  )
}

