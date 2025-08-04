import { type NextRequest, NextResponse } from "next/server"
import { WebClient } from "@slack/web-api"
import { googleSheetsService } from "@/lib/google-sheets"
import { localStorageService } from "@/lib/local-storage"

const slack = new WebClient(process.env.SLACK_BOT_TOKEN)

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 })
    }

    const { role, eventName, eventDate, name, slackHandle, notes, notifyManager } = body

    // Validate required fields
    if (!role || !eventName || !eventDate || !name || !slackHandle) {
      return NextResponse.json({ 
        error: "Missing required fields",
        required: ["role", "eventName", "eventDate", "name", "slackHandle"]
      }, { status: 400 })
    }

    // Validate role is a valid option
    const validRoles = ["project-manager", "committee-member", "on-site-help"]
    if (!validRoles.includes(role)) {
      return NextResponse.json({ 
        error: "Invalid role",
        validRoles
      }, { status: 400 })
    }

    // Get points for the role
    const pointsMap: Record<string, number> = {
      "project-manager": 100,
      "committee-member": 50,
      "on-site-help": 25,
    }
    const points = pointsMap[role] || 0

    // Log activity - try Google Sheets first, fallback to local storage
    const activityData = {
      name,
      slackHandle,
      role,
      eventName,
      eventDate,
      points,
      notes,
    }

    let loggedTo = 'local_storage' // Default for MVP
    
    try {
      // Try Google Sheets if it's configured
      if (googleSheetsService.isGoogleSheetsConfigured()) {
        await googleSheetsService.logActivity(activityData)
        console.log('✅ Logged to Google Sheets')
        loggedTo = 'google_sheets'
      } else {
        console.log('ℹ️  Google Sheets not configured, using memory storage for MVP')
        throw new Error('Google Sheets not configured, using memory storage')
      }
    } catch (error) {
      console.log('⚠️  Using memory storage:', error instanceof Error ? error.message : String(error))
      
      try {
        // Fallback to memory storage
        await localStorageService.logActivity(activityData)
        console.log('✅ Successfully logged to memory storage')
        loggedTo = 'memory_storage'
      } catch (storageError) {
        console.error('❌ Failed to log to memory storage:', storageError)
        throw storageError
      }
    }

    // Send Slack notification (optional)
    if (process.env.SLACK_BOT_TOKEN && process.env.SLACK_CHANNEL_ID) {
      try {
        const roleLabels: Record<string, string> = {
          "project-manager": "Project Manager",
          "committee-member": "Committee Member",
          "on-site-help": "On-site Help",
        }

        const slackMessage = {
          channel: process.env.SLACK_CHANNEL_ID,
          text: `🎉 New Culture Guides Activity Logged!`,
          blocks: [
            {
              type: "header",
              text: {
                type: "plain_text",
                text: "🎉 New Culture Guides Activity!",
              },
            },
            {
              type: "section",
              fields: [
                {
                  type: "mrkdwn",
                  text: `*Name:* ${name}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Slack:* ${slackHandle}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Role:* ${roleLabels[role]}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Points Earned:* ${points} 🌟`,
                },
                {
                  type: "mrkdwn",
                  text: `*Event:* ${eventName}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Date:* ${eventDate}`,
                },
              ],
            },
          ],
        }

        if (notes) {
          slackMessage.blocks.push({
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Notes:* ${notes}`,
            },
          })
        }

        await slack.chat.postMessage(slackMessage)
        console.log('✅ Slack notification sent')
      } catch (error) {
        console.log('⚠️  Slack notification failed:', error instanceof Error ? error.message : String(error))
        // Don't fail the request if Slack fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Activity logged successfully!",
      points,
      storage: loggedTo,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Error logging activity:", error)
    
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
      message: "Failed to log activity. Please try again later."
    }, { status: 500 })
  }
}
