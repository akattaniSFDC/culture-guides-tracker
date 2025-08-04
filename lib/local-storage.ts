interface ActivityData {
  name: string
  slackHandle: string
  role: string
  eventName: string
  eventDate: string
  points: number
  notes?: string
  timestamp?: string
  id?: string
}

// In-memory storage for Vercel serverless environment
// Note: Data will reset between function cold starts - perfect for MVP testing
let activitiesCache: ActivityData[] = []

export class LocalStorageService {
  constructor() {
    // Initialize with some demo data for MVP
    if (activitiesCache.length === 0) {
      activitiesCache = [
        {
          id: 'demo-1',
          name: 'Demo User',
          slackHandle: '@demo.user',
          role: 'project-manager',
          eventName: 'Culture Connect Demo Event',
          eventDate: new Date().toISOString().split('T')[0],
          points: 100,
          notes: 'Demo activity for testing',
          timestamp: new Date().toISOString()
        }
      ]
    }
  }

  async logActivity(data: ActivityData): Promise<void> {
    try {
      const activity = {
        ...data,
        id: generateId(),
        timestamp: new Date().toISOString(),
      }

      // Add new activity to beginning of array (latest first)
      activitiesCache.unshift(activity)
      
      // Keep only last 1000 activities to prevent memory issues
      if (activitiesCache.length > 1000) {
        activitiesCache = activitiesCache.slice(0, 1000)
      }
      
      console.log('✅ Activity logged to memory storage:', activity.eventName)
      console.log('📊 Total activities in cache:', activitiesCache.length)
    } catch (error) {
      console.error('❌ Error logging to memory storage:', error)
      throw new Error('Failed to log activity to memory storage')
    }
  }

  async getActivities(limit: number = 100): Promise<ActivityData[]> {
    try {
      return activitiesCache.slice(0, limit)
    } catch (error) {
      console.error('❌ Error reading from memory storage:', error)
      return []
    }
  }

  async getLeaderboard(): Promise<any[]> {
    try {
      const activities = activitiesCache // Use all activities for leaderboard
      
      // Group by name and calculate total points
      const leaderboard = activities.reduce((acc: any, activity) => {
        const name = activity.name
        if (!acc[name]) {
          acc[name] = {
            name,
            points: 0,
            activities: 0,
            lastActivity: activity.timestamp,
            slackHandle: activity.slackHandle
          }
        }
        acc[name].points += activity.points || 0
        acc[name].activities += 1
        
        return acc
      }, {})

      // Convert to array and sort by points
      return Object.values(leaderboard)
        .sort((a: any, b: any) => b.points - a.points)
        .slice(0, 10) // Top 10
    } catch (error) {
      console.error('❌ Error generating leaderboard:', error)
      return []
    }
  }

  async clearAllData(): Promise<void> {
    try {
      activitiesCache = []
      console.log('✅ All data cleared from memory storage')
    } catch (error) {
      console.error('❌ Error clearing data:', error)
      throw new Error('Failed to clear data')
    }
  }

  async getStats(): Promise<{ totalActivities: number, totalPoints: number, uniqueUsers: number }> {
    try {
      const totalActivities = activitiesCache.length
      const totalPoints = activitiesCache.reduce((sum, activity) => sum + (activity.points || 0), 0)
      const uniqueUsers = new Set(activitiesCache.map(activity => activity.name)).size
      
      return { totalActivities, totalPoints, uniqueUsers }
    } catch (error) {
      console.error('❌ Error getting stats:', error)
      return { totalActivities: 0, totalPoints: 0, uniqueUsers: 0 }
    }
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const localStorageService = new LocalStorageService()