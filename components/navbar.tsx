"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Github, Menu, X, Twitter, ExternalLink, Palette, BookOpen, Info } from "lucide-react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Added meaningful navigation items
  const navLinks = [
    { name: "Home", href: "/", icon: <Palette className="h-4 w-4 mr-2" /> },
    { name: "Documentation", href: "#", icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { name: "About", href: "#", icon: <Info className="h-4 w-4 mr-2" /> },
  ]

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-app-background/90 dark:bg-black/30 backdrop-blur-xl border-b border-app-card-border dark:border-white/10"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-linear-to-br gradient-from-gray-700 gradient-via-gray-500 gradient-to-gray-900"></div>
            <span className="font-heading font-bold text-app-foreground dark:text-white text-xl">GradientLab</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center text-app-muted-foreground dark:text-gray-300 hover:text-app-foreground dark:hover:text-white transition-colors"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="text-app-muted-foreground dark:text-gray-300 hover:text-app-foreground dark:hover:text-white hover:bg-app-muted/50 dark:hover:bg-white/10"
                asChild
              >
                <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="text-app-muted-foreground dark:text-gray-300 hover:text-app-foreground dark:hover:text-white hover:bg-app-muted/50 dark:hover:bg-white/10"
                asChild
              >
                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="bg-primary hover:bg-primary/90 text-white"
                size="sm"
              >
                Get Started
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-app-muted-foreground dark:text-gray-300 hover:text-app-foreground dark:hover:text-white hover:bg-app-muted/50 dark:hover:bg-white/10"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-app-card/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-app-card-border dark:border-white/10"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center py-2 text-gray-300 hover:text-white transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="pt-4 flex gap-4"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-app-muted-foreground dark:text-gray-300 hover:text-app-foreground dark:hover:text-white hover:bg-app-muted/50 dark:hover:bg-white/10"
                    asChild
                  >
                    <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                      <Github className="h-5 w-5" />
                      <span className="sr-only">GitHub</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-app-muted-foreground dark:text-gray-300 hover:text-app-foreground dark:hover:text-white hover:bg-app-muted/50 dark:hover:bg-white/10"
                    asChild
                  >
                    <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-5 w-5" />
                      <span className="sr-only">Twitter</span>
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navLinks.length + 1) * 0.1 }}
                  className="pt-2"
                >
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white" asChild>
                    <Link href="#" className="flex items-center justify-center gap-1">
                      <span>Get Started</span>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

