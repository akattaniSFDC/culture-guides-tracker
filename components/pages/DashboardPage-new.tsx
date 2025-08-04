"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Users, Calendar, TrendingUp, Loader2 } from "lucide-react"

interface LeaderboardEntry {
  name: string
  points: number
  activities: number
  lastActivity: string
  slackHandle: string
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

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch leaderboard
      const leaderboardResponse = await fetch('/api/activities?type=leaderboard')
      const leaderboardResult = await leaderboardResponse.json()
      
      // Fetch recent activities
      const activitiesResponse = await fetch('/api/activities?limit=20')
      const activitiesResult = await activitiesResponse.json()
      
      if (leaderboardResult.success) {
        setLeaderboardData(leaderboardResult.data)
        setDataSource(leaderboardResult.source)
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

  const maxPoints = leaderboardData.length > 0 ? Math.max(...leaderboardData.map((u) => u.points)) : 1

  // Calculate stats from real data
  const totalActiveCultures = leaderboardData.length
  const totalPoints = leaderboardData.reduce((sum, user) => sum + user.points, 0)
  const totalEvents = activities.length
  const avgPoints = totalActiveCultures > 0 ? Math.round(totalPoints / totalActiveCultures) : 0

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-background min-h-screen">
      {/* Data Source Indicator */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className={`w-2 h-2 rounded-full ${dataSource === 'google_sheets' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
          {dataSource === 'google_sheets' ? 'Google Sheets' : 'Local Storage'}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading dashboard data...</span>
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
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-bold">
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Leaderboard
                  </CardTitle>
                  <CardDescription>Top Culture Guides by points earned</CardDescription>
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
                          className="flex items-center gap-4 p-4 rounded-lg border"
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
                            <p className="font-semibold truncate">{user.name}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {user.activities} activities • {user.slackHandle}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{user.points}</p>
                            <Progress value={(user.points / maxPoints) * 100} className="w-20 h-2" />
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-500" />
                    Recent Activities
                  </CardTitle>
                  <CardDescription>Latest contributions from Culture Guides</CardDescription>
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
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                            {activity.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{activity.eventName}</p>
                            <p className="text-xs text-muted-foreground">
                              {activity.name} • {activity.points} points
                            </p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
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