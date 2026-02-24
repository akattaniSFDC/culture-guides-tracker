import { type NextRequest, NextResponse } from "next/server"
import { localStorageService } from "@/lib/local-storage"
import { googleSheetsService } from "@/lib/google-sheets"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const type = searchParams.get('type')
    const limitParam = searchParams.get('limit') || '100'
    const quarter = searchParams.get('quarter') || undefined

    const limit = parseInt(limitParam)
    if (isNaN(limit) || limit < 1 || limit > 1000) {
      return NextResponse.json({ 
        error: "Invalid limit parameter",
        message: "Limit must be a number between 1 and 1000"
      }, { status: 400 })
    }

    let data
    let quarters: string[] = []

    try {
      if (googleSheetsService.isGoogleSheetsConfigured()) {
        if (type === 'leaderboard') {
          const activities = await googleSheetsService.getActivities(1000, quarter)
          data = generateLeaderboard(activities)
        } else {
          data = await googleSheetsService.getActivities(limit, quarter)
        }

        try {
          quarters = await googleSheetsService.listSheets()
        } catch {
          // Non-critical: quarter list is optional
        }

        console.log(`✅ Retrieved from Google Sheets (${quarter || 'current quarter'})`)
      } else {
        throw new Error('Google Sheets not configured, using local storage')
      }
    } catch (error) {
      console.log('⚠️  Google Sheets not available, using local storage:', error instanceof Error ? error.message : String(error))
      if (type === 'leaderboard') {
        data = await localStorageService.getLeaderboard()
      } else {
        data = await localStorageService.getActivities(limit)
      }
    }

    return NextResponse.json({
      success: true,
      data,
      quarters,
      source: googleSheetsService.isGoogleSheetsConfigured() ? 'google_sheets' : 'local_storage'
    })
  } catch (error) {
    console.error('Error fetching activities:', error)

    if (error instanceof Error) {
      if (error.message.includes('environment variable')) {
        return NextResponse.json({ 
          error: "Configuration error", 
          message: "Service not properly configured"
        }, { status: 503 })
      }
    }

    return NextResponse.json({ 
      error: "Internal server error",
      message: "Failed to fetch activities. Please try again later."
    }, { status: 500 })
  }
}

function generateLeaderboard(activities: any[]): any[] {
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

  return Object.values(leaderboard)
    .sort((a: any, b: any) => b.points - a.points)
    .slice(0, 10)
}
