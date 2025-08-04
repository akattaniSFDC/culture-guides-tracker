/**
 * Environment variable validation utility
 * This ensures required environment variables are present at runtime
 */

interface EnvConfig {
  // Google Sheets Integration
  GOOGLE_SHEETS_CLIENT_EMAIL?: string
  GOOGLE_SHEETS_PRIVATE_KEY?: string
  GOOGLE_SHEETS_SHEET_ID?: string
  
  // Slack Integration
  SLACK_BOT_TOKEN?: string
  SLACK_CHANNEL_ID?: string
  
  // Google Drive API
  GOOGLE_DRIVE_API_KEY?: string
  
  // NotebookLM API (Optional)
  NOTEBOOKLM_API_ENDPOINT?: string
}

export function validateEnvironmentVariables(): EnvConfig {
  // All variables are now optional for MVP deployment
  const optionalVars = [
    'GOOGLE_SHEETS_CLIENT_EMAIL',
    'GOOGLE_SHEETS_PRIVATE_KEY', 
    'GOOGLE_SHEETS_SHEET_ID',
    'SLACK_BOT_TOKEN',
    'SLACK_CHANNEL_ID',
    'GOOGLE_DRIVE_API_KEY',
    'NOTEBOOKLM_API_ENDPOINT'
  ] as const

  const warnings: string[] = []

  // Check optional variables and warn if missing
  for (const varName of optionalVars) {
    if (!process.env[varName]) {
      warnings.push(varName)
    }
  }

  if (warnings.length > 0 && process.env.NODE_ENV !== 'production') {
    console.warn(
      `⚠️  Optional environment variables not set: ${warnings.join(', ')}\n` +
      'App will work with reduced functionality. Google Sheets and Slack features will be disabled.'
    )
  }

  // Check if Google Sheets is partially configured (warn about incomplete setup)
  const googleSheetsVars = ['GOOGLE_SHEETS_CLIENT_EMAIL', 'GOOGLE_SHEETS_PRIVATE_KEY', 'GOOGLE_SHEETS_SHEET_ID']
  const configuredGoogleSheets = googleSheetsVars.filter(varName => process.env[varName])
  
  if (configuredGoogleSheets.length > 0 && configuredGoogleSheets.length < googleSheetsVars.length) {
    console.warn(
      `⚠️  Google Sheets partially configured. Missing: ${googleSheetsVars.filter(v => !process.env[v]).join(', ')}\n` +
      'Google Sheets integration will be disabled. Configure all three variables to enable it.'
    )
  }

  return {
    GOOGLE_SHEETS_CLIENT_EMAIL: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    GOOGLE_SHEETS_PRIVATE_KEY: process.env.GOOGLE_SHEETS_PRIVATE_KEY,
    GOOGLE_SHEETS_SHEET_ID: process.env.GOOGLE_SHEETS_SHEET_ID,
    SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
    SLACK_CHANNEL_ID: process.env.SLACK_CHANNEL_ID,
    GOOGLE_DRIVE_API_KEY: process.env.GOOGLE_DRIVE_API_KEY,
    NOTEBOOKLM_API_ENDPOINT: process.env.NOTEBOOKLM_API_ENDPOINT,
  }
}

export function getEnvironmentInfo() {
  const env = process.env.NODE_ENV || 'development'
  const isProduction = env === 'production'
  const isDevelopment = env === 'development'
  
  return {
    env,
    isProduction,
    isDevelopment,
    hasGoogleSheets: !!(process.env.GOOGLE_SHEETS_CLIENT_EMAIL && process.env.GOOGLE_SHEETS_PRIVATE_KEY),
    hasSlack: !!(process.env.SLACK_BOT_TOKEN && process.env.SLACK_CHANNEL_ID),
    hasGoogleDrive: !!process.env.GOOGLE_DRIVE_API_KEY,
    hasNotebookLM: !!process.env.NOTEBOOKLM_API_ENDPOINT,
  }
}