"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Users, Heart, Sparkles } from "lucide-react"
import Image from "next/image"

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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
      {/* Hero Section */}
      <section className="relative">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image src="/hero-bg.jpg" alt="Culture Guides Background" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-blue-900/80 to-orange-900/90" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center py-24 md:py-32 px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Logo with enhanced visibility */}
              <div className="relative">
                <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 p-4 shadow-2xl">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/culture%20guides%20logo%20final%20%285%29-OOLxLVuOUIgay94WCkkbiUlJr0FMn1.png"
                    alt="Culture Guides Logo"
                    width={96}
                    height={96}
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse" />
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                  Culture Guides{" "}
                  <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-shimmer">
                    Rockstar
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                  Earn points, make an impact, and celebrate Salesforce culture through meaningful contributions.
                </p>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => onNavigate("log-activity")}
                  size="lg"
                  className="px-12 py-4 text-lg font-bold bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-full shadow-2xl border-0 backdrop-blur-sm"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Logging Activities
                </Button>
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
          <Card className="liquid-glass border-0 shadow-2xl p-8 md:p-12">
            <CardHeader className="text-center space-y-4">
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                How It Works
              </CardTitle>
              <CardDescription className="text-xl max-w-2xl mx-auto text-muted-foreground">
                Earn points by participating in cultural events and initiatives. Your contributions make a huge
                difference!
              </CardDescription>
            </CardHeader>

            <CardContent className="mt-16">
              <div className="grid md:grid-cols-3 gap-8">
                {activityTypes.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    whileHover={{ y: -10 }}
                  >
                    <Card className="liquid-glass border-0 shadow-xl p-8 text-center group hover:shadow-2xl transition-all duration-500">
                      <CardContent className="pt-6 space-y-6">
                        {/* Icon */}
                        <div
                          className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${activity.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          <activity.icon className="w-10 h-10 text-white" />
                        </div>

                        {/* Points */}
                        <div className="space-y-2">
                          <div className="text-6xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                            {activity.points}
                          </div>
                          <div className="text-sm font-bold text-muted-foreground tracking-wider">POINTS</div>
                        </div>

                        {/* Content */}
                        <div className="space-y-3">
                          <h3 className="text-2xl font-bold">{activity.role}</h3>
                          <p className="text-muted-foreground leading-relaxed">{activity.description}</p>
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
