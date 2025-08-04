import { type NextRequest, NextResponse } from "next/server"
import { localStorageService } from "@/lib/local-storage"
import { googleSheetsService } from "@/lib/google-sheets"

export async function GET(request: NextRequest) {
  try {
    // Use NextRequest.nextUrl instead of request.url for better compatibility
    const { searchParams } = request.nextUrl
    const type = searchParams.get('type') // 'activities' or 'leaderboard'
    const limitParam = searchParams.get('limit') || '100'
    
    const limit = parseInt(limitParam)
    if (isNaN(limit) || limit < 1 || limit > 1000) {
      return NextResponse.json({ 
        error: "Invalid limit parameter",
        message: "Limit must be a number between 1 and 1000"
      }, { status: 400 })
    }

    let data

    try {
      // Try Google Sheets first if it's configured
      if (googleSheetsService.isGoogleSheetsConfigured()) {
        if (type === 'leaderboard') {
          // For leaderboard, we need to process the data
          const activities = await googleSheetsService.getActivities(1000)
          data = generateLeaderboard(activities)
        } else {
          data = await googleSheetsService.getActivities(limit)
        }
        console.log('✅ Retrieved from Google Sheets')
      } else {
        throw new Error('Google Sheets not configured, using local storage')
      }
    } catch (error) {
      console.log('⚠️  Google Sheets not available, using local storage:', error instanceof Error ? error.message : String(error))
      // Fallback to local storage
      if (type === 'leaderboard') {
        data = await localStorageService.getLeaderboard()
      } else {
        data = await localStorageService.getActivities(limit)
      }
    }

    return NextResponse.json({
      success: true,
      data,
      source: googleSheetsService.isGoogleSheetsConfigured() ? 'google_sheets' : 'local_storage'
    })
  } catch (error) {
    console.error('Error fetching activities:', error)
    
    // Return different error messages based on error type
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
}