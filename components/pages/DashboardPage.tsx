"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Users, Calendar, TrendingUp } from "lucide-react"

const leaderboardData = [
  {
    rank: 1,
    name: "Sarah Chen",
    points: 425,
    activity: "Project Manager • Last event: Culture Connect SF",
    avatar: "/placeholder.svg?height=100&width=100&text=SC",
  },
  {
    rank: 2,
    name: "Marcus Johnson",
    points: 375,
    activity: "Committee Member • Last event: Ohana Appreciation Week",
    avatar: "/placeholder.svg?height=100&width=100&text=MJ",
  },
  {
    rank: 3,
    name: "Elena Rodriguez",
    points: 350,
    activity: "Project Manager • Last event: Innovation Showcase",
    avatar: "/placeholder.svg?height=100&width=100&text=ER",
  },
  {
    rank: 4,
    name: "David Kim",
    points: 275,
    activity: "Committee Member • Last event: V2MOM Workshop",
    avatar: "/placeholder.svg?height=100&width=100&text=DK",
  },
  {
    rank: 5,
    name: "Priya Patel",
    points: 225,
    activity: "On-site Help • Last event: Mindfulness Monday",
    avatar: "/placeholder.svg?height=100&width=100&text=PP",
  },
]

const AnimatedCounter = ({ value }: { value: number }) => {
  return (
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold">
      {value.toLocaleString()}
    </motion.span>
  )
}

export default function DashboardPage() {
  const maxPoints = Math.max(...leaderboardData.map((u) => u.points))

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Users, label: "Active Culture Guides", value: 247, color: "text-sky-400" },
          { icon: Trophy, label: "Total Points Earned", value: 15420, color: "text-orange-500" },
          { icon: Calendar, label: "Events This Quarter", value: 89, color: "text-yellow-500" },
          { icon: TrendingUp, label: "Avg Points per Guide", value: 62, color: "text-green-500" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="liquid-glass border-0 shadow-xl p-6 transform hover:-translate-y-2 transition-transform duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <stat.icon className={`w-10 h-10 ${stat.color}`} />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">
                      <AnimatedCounter value={stat.value} />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Leaderboard */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="liquid-glass border-0 shadow-2xl p-8 md:p-12">
          <CardHeader>
            <CardTitle className="text-4xl font-bold flex items-center gap-3">
              <Trophy className="w-10 h-10 text-yellow-500" />
              Q4 2024 Leaderboard
            </CardTitle>
            <CardDescription className="text-lg">Celebrating our top Culture Guides contributors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {leaderboardData.map((person, index) => (
              <motion.div
                key={person.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center space-x-6 p-6 rounded-2xl hover:bg-white/5 transition-colors duration-300 group"
              >
                <div
                  className={`text-2xl font-bold w-12 text-center ${
                    person.rank === 1
                      ? "text-yellow-500"
                      : person.rank === 2
                        ? "text-gray-400"
                        : person.rank === 3
                          ? "text-amber-600"
                          : "text-muted-foreground"
                  }`}
                >
                  {person.rank}
                </div>

                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {person.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <div className="flex-1">
                  <p className="text-xl font-semibold">{person.name}</p>
                  <p className="text-muted-foreground">{person.activity}</p>
                </div>

                <div className="text-right space-y-2">
                  <p className="text-2xl font-bold text-orange-500">{person.points}</p>
                  <div className="w-40">
                    <Progress value={(person.points / maxPoints) * 100} className="h-3 bg-white/10" />
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
