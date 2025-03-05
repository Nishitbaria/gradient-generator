"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trash2 } from "lucide-react"

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-app-background dark:bg-black border-t border-app-card-border dark:border-white/10"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-app-foreground/70 dark:text-white/70 text-sm">
            © {new Date().getFullYear()} GradientLab. All rights reserved.
          </p>
          <Link href="/clear-storage.html" target="_blank">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-xs text-white/70 hover:text-white"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear Storage
            </Button>
          </Link>
        </div>
      </div>
    </motion.footer>
  )
}

