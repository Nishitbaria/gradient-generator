"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { Github, Twitter, Mail, Heart } from "lucide-react"
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
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <h3 className="font-heading text-lg font-semibold mb-3 text-app-foreground dark:text-white">GradientLab</h3>
            <p className="text-app-foreground/80 dark:text-white/80 text-sm max-w-xs">
              Create beautiful Tailwind CSS gradients with ease. Perfect for your next web project.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-3 text-app-foreground dark:text-white">Links</h3>
            <ul className="space-y-2">

              <li>
                <Link href="https://github.com/Nishitbaria" className="text-app-foreground/80 dark:text-white/80 hover:text-primary dark:hover:text-primary transition-colors text-sm">
                  Github
                </Link>
              </li>
              <li>
                <Link href="https://x.com/Nishitbaria1" className="text-app-foreground/80 dark:text-white/80 hover:text-primary dark:hover:text-primary transition-colors text-sm">
                  X
                </Link>
              </li>
              <li>
                <Link href="https://www.linkedin.com/in/nishitbaria/" className="text-app-foreground/80 dark:text-white/80 hover:text-primary dark:hover:text-primary transition-colors text-sm">
                  LinkedIn
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-3 text-app-foreground dark:text-white">Contact</h3>
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4 text-app-foreground/70 dark:text-white/70" />
              <a href="mailto:nishitbaria@gmail.com" className="text-app-foreground/80 dark:text-white/80 hover:text-primary dark:hover:text-primary transition-colors text-sm">
                nishitbaria@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-app-card-border dark:border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-app-foreground/70 dark:text-white/70 text-sm">
            © {new Date().getFullYear()} GradientLab. All rights reserved.
          </div>

          <div className="flex items-center gap-2">
            <span className="text-app-foreground/70 dark:text-white/70 text-sm">
              Made with
            </span>
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-app-foreground/70 dark:text-white/70 text-sm">
              by
            </span>
            <TextHoverEffect className="text-sm font-medium">
              Nishitbaria
            </TextHoverEffect>
          </div>
        </div>
      </div>
    </footer>
  )
}

