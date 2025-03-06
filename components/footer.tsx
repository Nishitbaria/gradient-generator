"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { Github, Twitter } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface TextHoverEffectProps {
  children: React.ReactNode
  className?: string
}

export function TextHoverEffect({ children, className }: TextHoverEffectProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn("relative overflow-hidden inline-block", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "transition-transform duration-300 ease-in-out",
          isHovered ? "-translate-y-full" : "translate-y-0"
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "absolute top-0 left-0 transition-transform duration-300 ease-in-out text-primary",
          isHovered ? "translate-y-0" : "translate-y-full"
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-app-background dark:bg-black border-t border-app-card-border dark:border-white/10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="text-app-foreground/70 dark:text-white/70 text-sm">
            © {new Date().getFullYear()} GradientLab. All rights reserved.
          </div>

          <div className="flex items-center gap-2">
            <span className="text-app-foreground/70 dark:text-white/70 text-sm">
              Built by
            </span>
            <TextHoverEffect className="text-sm font-medium mr-2">
              Nishitbaria
            </TextHoverEffect>

            <Link
              href="https://github.com/Nishitbaria"
              target="_blank"
              rel="noopener noreferrer"
              className="text-app-foreground/70 hover:text-primary dark:text-white/70 dark:hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </Link>

            <Link
              href="https://twitter.com/nishitbaria1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-app-foreground/70 hover:text-primary dark:text-white/70 dark:hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

