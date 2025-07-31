import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"
import { WebClient } from "@slack/web-api"

const slack = new WebClient(process.env.SLACK_BOT_TOKEN)

async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  return google.sheets({ version: "v4", auth })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { role, eventName, eventDate, name, slackHandle, notes, notifyManager } = body

    // Validate required fields
    if (!role || !eventName || !eventDate || !name || !slackHandle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get points for the role
    const pointsMap: Record<string, number> = {
      "project-manager": 100,
      "committee-member": 50,
      "on-site-help": 25,
    }
    const points = pointsMap[role] || 0

    // Log to Google Sheets
    const sheets = await getGoogleSheetsClient()
    const timestamp = new Date().toISOString()

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_SHEET_ID,
      range: "Activities!A:H",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[timestamp, name, slackHandle, role, eventName, eventDate, points, notes || ""]],
      },
    })

    // Send Slack notification
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

    return NextResponse.json({
      success: true,
      message: "Activity logged successfully!",
      points,
    })
  } catch (error) {
    console.error("Error logging activity:", error)
    return NextResponse.json({ error: "Failed to log activity" }, { status: 500 })
  }
}
