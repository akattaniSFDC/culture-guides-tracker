import { google } from 'googleapis'

interface ActivityData {
  name: string
  slackHandle: string
  role: string
  eventName: string
  eventDate: string
  points: number
  notes?: string
}

export class GoogleSheetsService {
  private sheets: any
  private isConfigured: boolean = false

  constructor() {
    // Check if Google Sheets is configured
    this.isConfigured = !!(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL && 
      process.env.GOOGLE_SHEETS_PRIVATE_KEY && 
      process.env.GOOGLE_SHEETS_SHEET_ID
    )
  }

  isGoogleSheetsConfigured(): boolean {
    return this.isConfigured
  }

  private initializeSheets() {
    if (!this.isConfigured) {
      throw new Error('Google Sheets is not configured. Using local storage fallback.')
    }

    if (!this.sheets) {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      })

      this.sheets = google.sheets({ version: 'v4', auth })
    }
    return this.sheets
  }

  async logActivity(data: ActivityData): Promise<void> {
    if (!this.isConfigured) {
      throw new Error('Google Sheets not configured')
    }

    const timestamp = new Date().toISOString()
    const spreadsheetId = process.env.GOOGLE_SHEETS_SHEET_ID!
    const sheets = this.initializeSheets()

    try {
      // First, ensure we have headers
      await this.ensureHeaders(spreadsheetId)

      // Then append the data
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1!A:H',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            timestamp,
            data.name,
            data.slackHandle,
            data.role,
            data.eventName,
            data.eventDate,
            data.points,
            data.notes || ''
          ]],
        },
      })
    } catch (error) {
      console.error('Error logging to Google Sheets:', error)
      throw new Error('Failed to log activity to Google Sheets')
    }
  }

  private async ensureHeaders(spreadsheetId: string): Promise<void> {
    const sheets = this.initializeSheets()
    try {
      // Check if headers exist
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A1:H1',
      })

      // If no data or headers don't match, add them
      if (!response.data.values || response.data.values.length === 0) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: 'Sheet1!A1:H1',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[
              'Timestamp',
              'Name',
              'Slack Handle',
              'Role',
              'Event Name',
              'Event Date',
              'Points',
              'Notes'
            ]],
          },
        })
      }
    } catch (error) {
      console.error('Error ensuring headers:', error)
      // Continue even if header setup fails
    }
  }

  async getActivities(limit: number = 100): Promise<any[]> {
    if (!this.isConfigured) {
      throw new Error('Google Sheets not configured')
    }

    const spreadsheetId = process.env.GOOGLE_SHEETS_SHEET_ID!
    const sheets = this.initializeSheets()

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `Sheet1!A2:H${limit + 1}`, // Skip header row
      })

      if (!response.data.values) {
        return []
      }

      return response.data.values.map((row: any[]) => ({
        timestamp: row[0],
        name: row[1],
        slackHandle: row[2],
        role: row[3],
        eventName: row[4],
        eventDate: row[5],
        points: parseInt(row[6]) || 0,
        notes: row[7] || '',
      }))
    } catch (error) {
      console.error('Error fetching activities from Google Sheets:', error)
      throw new Error('Failed to fetch activities from Google Sheets')
    }
  }
}

export const googleSheetsService = new GoogleSheetsService()