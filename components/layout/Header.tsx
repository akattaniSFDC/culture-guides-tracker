"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
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
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only render theme-dependent content after mounting to avoid hydration mismatches
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="backdrop-blur-xl bg-white/70 dark:bg-black/70 shadow-lg shadow-black/5 dark:shadow-white/5">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20 md:h-22 lg:h-24">
            {/* Logo */}
            <motion.div
              className="flex items-center cursor-pointer py-2"
              onClick={() => onTabChange("home")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src="/salesforce-logo.png"
                alt="Salesforce Logo"
                width={140}
                height={60}
                className="object-contain h-12 w-auto sm:h-14 md:h-16 lg:h-18"
                priority
              />
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => onTabChange(item.id)}
                    className={`relative px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg hover:shadow-xl"
                        : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    {item.label}
                    {activeTab === item.id && (
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 -z-10"
                        layoutId="activeTab"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Button>
                </motion.div>
              ))}
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              {/* Theme Toggle */}
              {mounted && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="rounded-xl bg-gray-100/80 dark:bg-gray-800/50 hover:bg-gray-200/80 dark:hover:bg-gray-700/50 hidden sm:flex border-0 shadow-sm"
                  >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-700 dark:text-gray-300" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-700 dark:text-gray-300" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </motion.div>
              )}

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="rounded-xl bg-gray-100/80 dark:bg-gray-800/50 hover:bg-gray-200/80 dark:hover:bg-gray-700/50 border-0 shadow-sm"
                  >
                    {isMobileMenuOpen ? (
                      <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    ) : (
                      <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    )}
                  </Button>
                </motion.div>
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
            className="lg:hidden backdrop-blur-xl bg-white/70 dark:bg-black/70">
            <nav className="px-3 sm:px-4 py-3 sm:py-4 space-y-3">
              {navItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => {
                      onTabChange(item.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`w-full justify-start rounded-xl text-sm sm:text-base font-medium transition-all duration-300 ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                        : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    {item.label}
                  </Button>
                </motion.div>
              ))}
              
              {/* Mobile Theme Toggle */}
              {mounted && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="w-full justify-start rounded-xl text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/50 sm:hidden transition-all duration-300"
                  >
                    <div className="flex items-center">
                      <Sun className="h-4 w-4 mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-4 w-4 ml-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="ml-6">Toggle theme</span>
                    </div>
                  </Button>
                </motion.div>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}
