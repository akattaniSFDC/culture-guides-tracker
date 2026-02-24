"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Users, Heart, Sparkles } from "lucide-react"
import Image from "next/image"
import GlareHover from "@/components/ui/GlareHover"

interface HomePageProps {
  onNavigate: (page: string) => void
}

const activityTypes = [
  {
    id: "project-manager",
    role: "Project Manager",
    points: 100,
    description: "Lead and coordinate cultural initiatives",
    gradient: "from-purple-500 to-pink-500",
    icon: Star,
  },
  {
    id: "committee-member",
    role: "Committee Member",
    points: 50,
    description: "Actively participate in planning committees",
    gradient: "from-blue-500 to-cyan-500",
    icon: Users,
  },
  {
    id: "on-site-help",
    role: "On-site Help",
    points: 25,
    description: "Provide support during events and activities",
    gradient: "from-green-500 to-emerald-500",
    icon: Heart,
  },
]

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-12 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-900/60 via-purple-900/50 to-indigo-900/60 backdrop-blur-sm border border-blue-500/20">
          {/* Content */}
          <div className="relative z-10 text-center py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Salesforce Logo */}
              <div className="relative mb-3 sm:mb-4">
                <div className="mx-auto w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 xl:w-56 xl:h-56 flex items-center justify-center">
                  <Image
                    src="/culture-guides-logo.png"
                    alt="Culture Guides Logo"
                    width={200}
                    height={200}
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-tight">
                  Culture Guides{" "}
                  <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-shimmer">
                    Rockstar
                  </span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white max-w-3xl mx-auto leading-relaxed px-2">
                  Log activities . Earn points . Lead change
                </p>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <GlareHover
                  glareColor="#ffffff"
                  glareOpacity={0.4}
                  duration={0.8}
                  className="rounded-xl"
                >
                  <Button
                    onClick={() => onNavigate("log-activity")}
                    size="lg"
                    className="relative overflow-hidden px-8 sm:px-12 md:px-16 py-4 sm:py-5 text-base sm:text-lg font-bold bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl shadow-2xl border-0 backdrop-blur-sm transition-all duration-300 group"
                  >
                    {/* Animated key press effect */}
                    <motion.div
                      className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                      initial={{ y: "100%" }}
                      whileHover={{ y: "0%" }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    />
                    
                    {/* Key border effect */}
                    <div className="absolute inset-0 left-auto top-auto border-2 border-white/30 rounded-xl group-hover:border-white/50 transition-colors duration-300" />
                    
                    {/* Button content */}
                    <div className="relative z-10 flex items-center justify-center">
                      <span className="tracking-wide">Start Now</span>
                    </div>
                    
                    {/* Bottom shadow (key depth effect) */}
                    <div className="absolute bottom-0 left-2 right-2 h-1 bg-black/20 rounded-b-xl transform group-hover:h-0.5 transition-all duration-200" />
                  </Button>
                </GlareHover>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="liquid-glass border border-gray-200 dark:border-blue-500/20 shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 bg-white/90 dark:bg-card/70 backdrop-blur-md">
            <CardHeader className="text-center space-y-4">
              <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                How It Works
              </CardTitle>
              <CardDescription className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-400 px-2">
                Earn points by participating in cultural events and initiatives. Your contributions make a huge
                difference!
              </CardDescription>
            </CardHeader>

            <CardContent className="mt-8 sm:mt-12 md:mt-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {activityTypes.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    whileHover={{ y: -10 }}
                  >
                    <Card className="liquid-glass border border-gray-200 dark:border-blue-500/10 shadow-xl p-4 sm:p-6 md:p-8 text-center group hover:shadow-2xl transition-all duration-500 bg-white/90 dark:bg-card/70 backdrop-blur-md hover:border-gray-300 dark:hover:border-blue-400/30">
                      <CardContent className="pt-6 space-y-6">
                        {/* Icon */}
                        <div
                          className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 mx-auto rounded-2xl bg-gradient-to-r ${activity.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          <activity.icon 
                            className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white transition-all duration-300 ${
                              activity.id === 'project-manager' 
                                ? 'group-hover:animate-spin-slow' 
                                : activity.id === 'committee-member'
                                ? 'group-hover:animate-bounce'
                                : activity.id === 'on-site-help'
                                ? 'group-hover:animate-heartbeat'
                                : ''
                            }`} 
                          />
                        </div>

                        {/* Points */}
                        <div className="space-y-2">
                          <div className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                            {activity.points}
                          </div>
                          <div className="text-sm font-bold text-gray-500 dark:text-gray-400 tracking-wider">POINTS</div>
                        </div>

                        {/* Content */}
                        <div className="space-y-3">
                          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{activity.role}</h3>
                          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">{activity.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}
