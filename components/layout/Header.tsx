"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Image from "next/image"

interface HeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navItems = [
  { id: "home", label: "Home" },
  { id: "log-activity", label: "Log Activity" },
  { id: "dashboard", label: "Dashboard" },
  { id: "resources", label: "Resources & AI" },
]

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20 md:h-22 lg:h-24">
            {/* Logo */}
            <motion.div
              className="flex items-center cursor-pointer"
              onClick={() => onTabChange("home")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/culture%20guides%20logo%20final%20%285%29-OOLxLVuOUIgay94WCkkbiUlJr0FMn1.png"
                alt="Culture Guides Logo"
                width={120}
                height={120}
                className="object-contain w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36"
              />
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  onClick={() => onTabChange(item.id)}
                  className={`relative px-4 py-2 rounded-full transition-all duration-300 ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                      : "text-foreground/80 hover:text-foreground hover:bg-gray-100"
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

            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="rounded-full bg-gray-100 hover:bg-gray-200"
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
            className="lg:hidden bg-white border-t border-gray-200">
          >
            <nav className="px-3 sm:px-4 py-3 sm:py-4 space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  onClick={() => {
                    onTabChange(item.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full justify-start rounded-full text-sm sm:text-base ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                      : "text-foreground/80 hover:bg-gray-100"
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
