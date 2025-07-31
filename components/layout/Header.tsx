"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Menu, X } from "lucide-react"
import Image from "next/image"

interface HeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
  theme: string
  onThemeToggle: () => void
}

const navItems = [
  { id: "home", label: "Home" },
  { id: "log-activity", label: "Log Activity" },
  { id: "dashboard", label: "Dashboard" },
  { id: "resources", label: "Resources & AI" },
]

export default function Header({ activeTab, onTabChange, theme, onThemeToggle }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="liquid-glass border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => onTabChange("home")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm p-1">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/culture%20guides%20logo%20final%20%285%29-OOLxLVuOUIgay94WCkkbiUlJr0FMn1.png"
                  alt="Culture Guides Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Culture Guides
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  onClick={() => onTabChange(item.id)}
                  className={`relative px-4 py-2 rounded-full transition-all duration-300 ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                      : "text-foreground/80 hover:text-foreground hover:bg-white/10"
                  }`}
                >
                  {item.label}
                  {activeTab === item.id && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 -z-10"
                      layoutId="activeTab"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Button>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onThemeToggle}
                className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm"
              >
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden liquid-glass border-t border-white/10"
          >
            <nav className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  onClick={() => {
                    onTabChange(item.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full justify-start rounded-full ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                      : "text-foreground/80 hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Button>
              ))}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}
