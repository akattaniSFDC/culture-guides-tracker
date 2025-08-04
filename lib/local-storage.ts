import fs from 'fs'
import path from 'path'

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

const DATA_FILE = path.join(process.cwd(), 'data', 'activities.json')

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

export class LocalStorageService {
  async logActivity(data: ActivityData): Promise<void> {
    try {
      ensureDataDirectory()
      
      const activity = {
        ...data,
        id: generateId(),
        timestamp: new Date().toISOString(),
      }

      // Read existing data
      let activities: ActivityData[] = []
      if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8')
        activities = JSON.parse(fileContent)
      }

      // Add new activity
      activities.unshift(activity) // Add to beginning for latest first

      // Write back to file
      fs.writeFileSync(DATA_FILE, JSON.stringify(activities, null, 2))
      
      console.log('✅ Activity logged to local storage:', activity.eventName)
    } catch (error) {
      console.error('❌ Error logging to local storage:', error)
      throw new Error('Failed to log activity to local storage')
    }
  }

  async getActivities(limit: number = 100): Promise<ActivityData[]> {
    try {
      ensureDataDirectory()
      
      if (!fs.existsSync(DATA_FILE)) {
        return []
      }

      const fileContent = fs.readFileSync(DATA_FILE, 'utf-8')
      const activities = JSON.parse(fileContent)
      
      return activities.slice(0, limit)
    } catch (error) {
      console.error('❌ Error reading from local storage:', error)
      return []
    }
  }

  async getLeaderboard(): Promise<any[]> {
    try {
      const activities = await this.getActivities(1000) // Get more for accurate leaderboard
      
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
        acc[name].points += activity.points
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

  async exportToCSV(): Promise<string> {
    try {
      const activities = await this.getActivities(1000)
      
      const headers = ['Timestamp', 'Name', 'Slack Handle', 'Role', 'Event Name', 'Event Date', 'Points', 'Notes']
      const rows = activities.map(activity => [
        activity.timestamp || '',
        activity.name,
        activity.slackHandle,
        activity.role,
        activity.eventName,
        activity.eventDate,
        activity.points.toString(),
        activity.notes || ''
      ])

      const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n')

      const csvFile = path.join(process.cwd(), 'data', 'activities_export.csv')
      fs.writeFileSync(csvFile, csvContent)
      
      return csvFile
    } catch (error) {
      console.error('❌ Error exporting to CSV:', error)
      throw new Error('Failed to export activities to CSV')
    }
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const localStorageService = new LocalStorageService()