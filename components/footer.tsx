"use client"
import { motion } from "framer-motion"
import { MonitorSmartphone, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export function Footer() {
  const { theme, setTheme } = useTheme()

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
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 hover:bg-app-muted/50 dark:hover:bg-white/5 ${
                theme === "system"
                  ? "bg-app-muted/50 dark:bg-white/10 text-app-foreground dark:text-white"
                  : "text-app-foreground/70 dark:text-white/70 hover:text-app-foreground dark:hover:text-white"
              }`}
              onClick={() => setTheme("system")}
              aria-label="System theme"
            >
              <MonitorSmartphone className="h-4 w-4" />
              <span className="sr-only">System theme</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 hover:bg-app-muted/50 dark:hover:bg-white/5 ${
                theme === "light"
                  ? "bg-app-muted/50 dark:bg-white/10 text-app-foreground dark:text-white"
                  : "text-app-foreground/70 dark:text-white/70 hover:text-app-foreground dark:hover:text-white"
              }`}
              onClick={() => setTheme("light")}
              aria-label="Light theme"
            >
              <Sun className="h-4 w-4" />
              <span className="sr-only">Light theme</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 hover:bg-app-muted/50 dark:hover:bg-white/5 ${
                theme === "dark"
                  ? "bg-app-muted/50 dark:bg-white/10 text-app-foreground dark:text-white"
                  : "text-app-foreground/70 dark:text-white/70 hover:text-app-foreground dark:hover:text-white"
              }`}
              onClick={() => setTheme("dark")}
              aria-label="Dark theme"
            >
              <Moon className="h-4 w-4" />
              <span className="sr-only">Dark theme</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

