# Google Sheets Integration Setup

## Overview
This guide will help you connect your Culture Guides Tracker to your Google Sheets for automatic data logging.

## Your Google Sheets
**Target Sheet**: https://docs.google.com/spreadsheets/d/1OxqzCbjHSAt9YCZ4KjPnSRq54RbtO5KfeGssgwJXvvc/edit?usp=sharing

## Setup Steps

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google Sheets API**

### 2. Create Service Account
1. Go to **IAM & Admin** > **Service Accounts**
2. Click **Create Service Account**
3. Name it: `culture-guides-tracker`
4. Click **Create and Continue**
5. Skip role assignment for now
6. Click **Done**

### 3. Generate Key
1. Click on your new service account
2. Go to **Keys** tab
3. Click **Add Key** > **Create New Key**
4. Choose **JSON** format
5. Download the file (keep it secure!)

### 4. Share Sheet with Service Account
1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1OxqzCbjHSAt9YCZ4KjPnSRq54RbtO5KfeGssgwJXvvc/edit
2. Click **Share** button
3. Add your service account email (from the JSON file: `client_email`)
4. Give **Editor** permissions
5. Uncheck "Notify people"
6. Click **Share**

### 5. Set Environment Variables
Create a `.env.local` file in your project root with:

```env
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----"
GOOGLE_SHEETS_SHEET_ID=1OxqzCbjHSAt9YCZ4KjPnSRq54RbtO5KfeGssgwJXvvc
```

**Important**: 
- Copy `client_email` and `private_key` from your JSON file
- Keep the quotes around the private key
- Replace `\n` in the private key with actual newlines or use `\\n`

### 6. Sheet Structure
Your sheet will automatically receive data in this format:

| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H |
|----------|----------|----------|----------|----------|----------|----------|----------|
| Timestamp | Name | Slack Handle | Role | Event Name | Event Date | Points | Notes |

### 7. Test the Integration
1. Start your application: `npm run dev`
2. Go to "Log Activity" page
3. Fill out the form and submit
4. Check your Google Sheet for new data!

## Troubleshooting

### Error: "Requested entity was not found"
- Make sure you shared the sheet with your service account email
- Verify the SHEET_ID in your .env file

### Error: "The caller does not have permission"
- Check that the service account has Editor access to the sheet
- Verify the Google Sheets API is enabled in your project

### Error: "Private key is invalid"
- Ensure the private key includes the full content with BEGIN/END lines
- Check for proper escaping of newlines

## Security Notes
- Never commit your `.env.local` file to version control
- Keep your service account JSON file secure
- Only give minimum required permissions