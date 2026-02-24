import { google } from 'googleapis'
import * as fs from 'fs'
import * as path from 'path'

interface ActivityData {
  name: string
  slackHandle: string
  role: string
  eventName: string
  eventDate: string
  points: number
  notes?: string
}

interface ServiceAccountCredentials {
  client_email: string
  private_key: string
}

function loadCredentials(): { credentials: ServiceAccountCredentials; spreadsheetId: string } | null {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SHEET_ID
  if (!spreadsheetId) return null

  if (process.env.GOOGLE_SHEETS_CLIENT_EMAIL && process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
    return {
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      spreadsheetId,
    }
  }

  const credentialsPath =
    process.env.GOOGLE_SHEETS_CREDENTIALS_PATH ||
    path.join(process.cwd(), 'google-service-account.json')

  try {
    if (fs.existsSync(credentialsPath)) {
      const json = fs.readFileSync(credentialsPath, 'utf-8')
      const parsed = JSON.parse(json)

      if (parsed.type !== 'service_account' || !parsed.client_email || !parsed.private_key) {
        console.error('Invalid service account JSON: must have type, client_email, and private_key')
        return null
      }

      return {
        credentials: {
          client_email: parsed.client_email,
          private_key: parsed.private_key.replace(/\\n/g, '\n'),
        },
        spreadsheetId,
      }
    }
  } catch (e) {
    console.error('Failed to load Google credentials from file:', e)
  }

  return null
}

export function getQuarterSheetName(eventDate: string): string {
  const date = new Date(eventDate)
  if (isNaN(date.getTime())) {
    const now = new Date()
    return `Q${Math.ceil((now.getMonth() + 1) / 3)}-${now.getFullYear()}`
  }
  const quarter = Math.ceil((date.getMonth() + 1) / 3)
  return `Q${quarter}-${date.getFullYear()}`
}

export function getCurrentQuarter(): string {
  const now = new Date()
  const quarter = Math.ceil((now.getMonth() + 1) / 3)
  return `Q${quarter}-${now.getFullYear()}`
}

const HEADERS = ['Timestamp', 'Name', 'Slack Handle', 'Role', 'Event Name', 'Event Date', 'Points', 'Notes']

export class GoogleSheetsService {
  private sheets: any
  private isConfigured: boolean = false
  private config: { credentials: ServiceAccountCredentials; spreadsheetId: string } | null = null

  constructor() {
    this.config = loadCredentials()
    this.isConfigured = !!this.config
  }

  isGoogleSheetsConfigured(): boolean {
    return this.isConfigured
  }

  private initializeSheets() {
    if (!this.isConfigured || !this.config) {
      throw new Error('Google Sheets is not configured. Using local storage fallback.')
    }

    if (!this.sheets) {
      const auth = new google.auth.GoogleAuth({
        credentials: this.config.credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      })

      this.sheets = google.sheets({ version: 'v4', auth })
    }
    return this.sheets
  }

  private getSpreadsheetId(): string {
    if (!this.config) throw new Error('Google Sheets not configured')
    return this.config.spreadsheetId
  }

  async ensureSheet(sheetName: string): Promise<void> {
    const spreadsheetId = this.getSpreadsheetId()
    const sheets = this.initializeSheets()

    try {
      const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId })
      const existing = spreadsheet.data.sheets?.find(
        (s: any) => s.properties?.title === sheetName
      )

      if (!existing) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [{ addSheet: { properties: { title: sheetName } } }],
          },
        })
      }

      // Ensure headers on this tab
      const headerResp = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `'${sheetName}'!A1:H1`,
      })

      if (!headerResp.data.values || headerResp.data.values.length === 0) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `'${sheetName}'!A1:H1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [HEADERS] },
        })
      }
    } catch (error) {
      console.error(`Error ensuring sheet "${sheetName}":`, error)
      throw error
    }
  }

  async logActivity(data: ActivityData): Promise<void> {
    if (!this.isConfigured) {
      throw new Error('Google Sheets not configured')
    }

    const sheetName = getQuarterSheetName(data.eventDate)
    const timestamp = new Date().toISOString()
    const spreadsheetId = this.getSpreadsheetId()
    const sheets = this.initializeSheets()

    try {
      await this.ensureSheet(sheetName)

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `'${sheetName}'!A:H`,
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

  async getActivities(limit: number = 100, quarter?: string): Promise<any[]> {
    if (!this.isConfigured) {
      throw new Error('Google Sheets not configured')
    }

    const sheetName = quarter || getCurrentQuarter()
    const spreadsheetId = this.getSpreadsheetId()
    const sheets = this.initializeSheets()

    try {
      await this.ensureSheet(sheetName)

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `'${sheetName}'!A2:H${limit + 1}`,
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

  async clearSheet(quarter?: string): Promise<void> {
    if (!this.isConfigured) {
      throw new Error('Google Sheets not configured')
    }

    const sheetName = quarter || getCurrentQuarter()
    const spreadsheetId = this.getSpreadsheetId()
    const sheets = this.initializeSheets()

    try {
      await this.ensureSheet(sheetName)

      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: `'${sheetName}'!A2:H`,
      })

      console.log(`✅ Cleared data from sheet "${sheetName}"`)
    } catch (error) {
      console.error(`Error clearing sheet "${sheetName}":`, error)
      throw new Error('Failed to clear Google Sheets data')
    }
  }

  async listSheets(): Promise<string[]> {
    if (!this.isConfigured) {
      throw new Error('Google Sheets not configured')
    }

    const spreadsheetId = this.getSpreadsheetId()
    const sheets = this.initializeSheets()

    try {
      const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId })
      const allTabs: string[] = (spreadsheet.data.sheets || [])
        .map((s: any) => s.properties?.title)
        .filter(Boolean)

      // Return only quarter-formatted tabs (Q1-2026, Q2-2026, etc.)
      return allTabs
        .filter((name: string) => /^Q[1-4]-\d{4}$/.test(name))
        .sort((a: string, b: string) => {
          const [qa, ya] = a.replace('Q', '').split('-').map(Number)
          const [qb, yb] = b.replace('Q', '').split('-').map(Number)
          return ya !== yb ? yb - ya : qb - qa
        })
    } catch (error) {
      console.error('Error listing sheets:', error)
      throw new Error('Failed to list sheets')
    }
  }
}

export const googleSheetsService = new GoogleSheetsService()
