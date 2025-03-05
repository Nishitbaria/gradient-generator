"use client"

import { cn } from "@/lib/utils"

interface GradientPreviewProps {
  type: string
  gradientClass: string
  cssGradient: string
}

export function GradientPreview({ type, gradientClass, cssGradient }: GradientPreviewProps) {
  // Use inline styles for the gradient in Tailwind v4
  switch (type) {
    case "card":
      return (
        <div className="w-full rounded-xl overflow-hidden">
          <div
            className="w-full rounded-lg overflow-hidden shadow-lg"
            style={{ background: cssGradient }}
          >
            <div className="p-6 h-64 flex flex-col justify-between backdrop-blur-[2px]">
              <div>
                <h3 className="text-white font-bold text-xl mb-2">Card Title</h3>
                <p className="text-white/80 max-w-md">
                  This is how your gradient would look as a card background. Card components are perfect for showcasing
                  content in a clean, contained unit.
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-md transition-colors">
                  Confirm
                </button>
              </div>
            </div>
          </div>
          <div className="mt-3 p-3 border border-white/10 rounded-lg bg-gray-800/50">
            <p className="text-xs text-gray-400">
              <span className="font-medium text-white/70">Cards</span> are versatile containers that work well with
              gradients as backgrounds. They're commonly used for product listings, blog posts, or content grouping.
            </p>
          </div>
        </div>
      )

    case "button":
      return (
        <div className="w-full rounded-xl overflow-hidden">
          <div className="p-8 flex flex-col items-center justify-center bg-gray-900/70 rounded-lg border border-white/5 h-64 gap-8">
            <div className="flex gap-4 items-center">
              <button
                className="px-6 py-3 rounded-md text-white font-medium shadow-lg transition-transform hover:scale-105"
                style={{ background: cssGradient }}
              >
                Primary Button
              </button>

              <button className="px-6 py-3 rounded-md text-white font-medium border-2 border-white/20 transition-colors hover:border-white/40">
                Secondary
              </button>
            </div>

            <div className="flex gap-4">
              <button
                className="px-3 py-1.5 rounded-md text-white font-medium text-sm shadow-md transition-transform hover:scale-105"
                style={{ background: cssGradient }}
              >
                Small
              </button>

              <button
                className="px-5 py-2.5 rounded-md text-white font-medium shadow-md transition-transform hover:scale-105"
                style={{ background: cssGradient }}
              >
                Medium
              </button>

              <button
                className="px-8 py-4 rounded-md text-white font-bold shadow-xl transition-transform hover:scale-105"
                style={{ background: cssGradient }}
              >
                Large
              </button>
            </div>
          </div>
          <div className="mt-3 p-3 border border-white/10 rounded-lg bg-gray-800/50">
            <p className="text-xs text-gray-400">
              <span className="font-medium text-white/70">Buttons</span> with gradient backgrounds can create
              eye-catching call-to-action elements that draw user attention and increase engagement.
            </p>
          </div>
        </div>
      )

    case "navbar":
      return (
        <div className="w-full rounded-xl overflow-hidden">
          <div
            className="w-full rounded-lg shadow-lg overflow-hidden"
            style={{ background: cssGradient }}
          >
            <div className="px-6 py-4 flex justify-between items-center backdrop-blur-[2px]">
              <div className="font-bold text-white text-xl">Logo</div>
              <div className="hidden md:flex gap-6">
                <a href="#" className="text-white/90 hover:text-white transition-colors">
                  Home
                </a>
                <a href="#" className="text-white/90 hover:text-white transition-colors">
                  Features
                </a>
                <a href="#" className="text-white/90 hover:text-white transition-colors">
                  Pricing
                </a>
                <a href="#" className="text-white/90 hover:text-white transition-colors">
                  Contact
                </a>
              </div>
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-md transition-colors">
                Sign Up
              </button>
            </div>
          </div>
          <div className="mt-3 p-3 border border-white/10 rounded-lg bg-gray-800/50">
            <p className="text-xs text-gray-400">
              <span className="font-medium text-white/70">Navigation bars</span> with gradients create a strong brand
              identity and visual anchor for your website. They work well when you want to add personality to your
              site's header.
            </p>
          </div>
        </div>
      )

    case "hero":
      return (
        <div className="w-full rounded-xl overflow-hidden">
          <div
            className="w-full h-64 rounded-lg overflow-hidden shadow-lg"
            style={{ background: cssGradient }}
          >
            <div className="h-full flex flex-col items-center justify-center p-8 backdrop-blur-[2px]">
              <h2 className="text-white font-bold text-3xl mb-3">Welcome to Our Platform</h2>
              <p className="text-white/90 max-w-md mb-5">
                This is how your gradient would look as a hero section background. Add your compelling copy here to
                engage visitors.
              </p>
              <div className="flex gap-3">
                <button className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-md transition-colors">
                  Get Started
                </button>
                <button className="px-5 py-2.5 bg-white text-gray-900 rounded-md hover:bg-white/90 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>
          <div className="mt-3 p-3 border border-white/10 rounded-lg bg-gray-800/50">
            <p className="text-xs text-gray-400">
              <span className="font-medium text-white/70">Hero sections</span> are perfect for gradients as they create
              visual impact at the top of a page. They help establish mood and direct attention to your main message.
            </p>
          </div>
        </div>
      )

    default:
      return null
  }
}

