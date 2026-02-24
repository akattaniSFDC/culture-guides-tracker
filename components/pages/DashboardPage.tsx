"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Users, Calendar, TrendingUp, Loader2, Trash2 } from "lucide-react"

interface LeaderboardEntry {
  name: string
  points: number
  activities: number
  lastActivity: string
  slackHandle: string
}

function getCurrentQuarter(): string {
  const now = new Date()
  const quarter = Math.ceil((now.getMonth() + 1) / 3)
  return `Q${quarter}-${now.getFullYear()}`
}

function generateQuarterOptions(): string[] {
  const startYear = 2026
  const startQ = 1
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentQ = Math.ceil((now.getMonth() + 1) / 3)

  const options: string[] = []
  for (let y = startYear; y <= currentYear; y++) {
    const maxQ = y === currentYear ? currentQ : 4
    const minQ = y === startYear ? startQ : 1
    for (let q = minQ; q <= maxQ; q++) {
      options.push(`Q${q}-${y}`)
    }
  }
  return options.reverse()
}

const AnimatedCounter = ({ value }: { value: number }) => {
  return (
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold">
      {value.toLocaleString()}
    </motion.span>
  )
}

export default function DashboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<string>('local_storage')
  const [selectedQuarter, setSelectedQuarter] = useState<string>(getCurrentQuarter())
  const [availableQuarters, setAvailableQuarters] = useState<string[]>(generateQuarterOptions())

  useEffect(() => {
    fetchDashboardData(selectedQuarter)
  }, [selectedQuarter])

  const fetchDashboardData = async (quarter: string) => {
    try {
      setLoading(true)

      const leaderboardResponse = await fetch(`/api/activities?type=leaderboard&quarter=${quarter}`)
      const leaderboardResult = await leaderboardResponse.json()

      const activitiesResponse = await fetch(`/api/activities?limit=20&quarter=${quarter}`)
      const activitiesResult = await activitiesResponse.json()

      if (leaderboardResult.success) {
        setLeaderboardData(leaderboardResult.data)
        setDataSource(leaderboardResult.source)

        if (leaderboardResult.quarters?.length > 0) {
          const merged = new Set([...generateQuarterOptions(), ...leaderboardResult.quarters])
          setAvailableQuarters(
            Array.from(merged).sort((a, b) => {
              const [qa, ya] = a.replace('Q', '').split('-').map(Number)
              const [qb, yb] = b.replace('Q', '').split('-').map(Number)
              return ya !== yb ? yb - ya : qb - qa
            })
          )
        }
      }

      if (activitiesResult.success) {
        setActivities(activitiesResult.data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearAllData = async () => {
    if (confirm(`Are you sure you want to clear all data for ${selectedQuarter}? This action cannot be undone.`)) {
      try {
        setLoading(true)

        const response = await fetch(`/api/clear-data?quarter=${selectedQuarter}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          setLeaderboardData([])
          setActivities([])
          await fetchDashboardData(selectedQuarter)
          console.log(`✅ Data cleared for ${selectedQuarter}`)
        } else {
          console.error('❌ Failed to clear data')
          alert('Failed to clear data. Please try again.')
        }
      } catch (error) {
        console.error('❌ Error clearing data:', error)
        alert('Failed to clear data. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const maxPoints = leaderboardData.length > 0 ? Math.max(...leaderboardData.map((u) => u.points)) : 1

  const totalActiveCultures = leaderboardData.length
  const totalPoints = leaderboardData.reduce((sum, user) => sum + user.points, 0)
  const totalEvents = activities.length
  const avgPoints = totalActiveCultures > 0 ? Math.round(totalPoints / totalActiveCultures) : 0

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 min-h-screen">
      {/* Header with Quarter Selector and Clear Data Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select quarter" />
            </SelectTrigger>
            <SelectContent>
              {availableQuarters.map((q) => (
                <SelectItem key={q} value={q}>
                  {q}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={clearAllData}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 border-red-200 dark:border-red-800"
          >
            <Trash2 className="w-4 h-4" />
            Clear Data
          </Button>

          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className={`w-2 h-2 rounded-full ${dataSource === 'google_sheets' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
            {dataSource === 'google_sheets' ? 'Google Sheets' : 'Local Storage'}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500 dark:text-gray-400" />
          <span className="ml-2 text-gray-500 dark:text-gray-400">Loading dashboard data...</span>
        </div>
      ) : (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, label: "Active Culture Guides", value: totalActiveCultures, color: "text-sky-400" },
              { icon: Trophy, label: "Total Points Earned", value: totalPoints, color: "text-orange-500" },
              { icon: Calendar, label: "Activities Logged", value: totalEvents, color: "text-yellow-500" },
              { icon: TrendingUp, label: "Avg Points per Guide", value: avgPoints, color: "text-green-500" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border border-gray-200 dark:border-blue-500/20 bg-white/90 dark:bg-card/70 backdrop-blur-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          <AnimatedCounter value={stat.value} />
                        </p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border border-gray-200 dark:border-blue-500/20 bg-white/90 dark:bg-card/70 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Leaderboard
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">Top Culture Guides by points earned ({selectedQuarter})</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {leaderboardData.length > 0 ? (
                      leaderboardData.map((user, index) => (
                        <motion.div
                          key={user.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5"
                        >
                          <div className="flex-shrink-0">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm text-white ${
                              index === 0 ? 'bg-yellow-500' : 
                              index === 1 ? 'bg-gray-400' : 
                              index === 2 ? 'bg-amber-600' : 
                              'bg-gradient-to-r from-orange-500 to-pink-500'
                            }`}>
                              {index + 1}
                            </div>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {user.activities} activities • {user.slackHandle}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-gray-900 dark:text-white">{user.points}</p>
                            <Progress value={(user.points / maxPoints) * 100} className="w-20 h-2" />
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No activities logged yet</p>
                        <p className="text-sm">Start logging activities to see the leaderboard!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activities */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border border-gray-200 dark:border-blue-500/20 bg-white/90 dark:bg-card/70 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Calendar className="w-5 h-5 text-green-500" />
                    Recent Activities
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">Latest contributions from Culture Guides ({selectedQuarter})</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.length > 0 ? (
                      activities.slice(0, 8).map((activity, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                            {activity.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate text-gray-900 dark:text-white">{activity.eventName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {activity.name} • {activity.points} points
                            </p>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No recent activities</p>
                        <p className="text-sm">Activities will appear here once logged</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </div>
  )
}
