# Google Sheets Integration Setup

## Overview
This guide will help you connect your Culture Guides Tracker to Google Sheets for automatic activity logging.

**Target Sheet**: https://docs.google.com/spreadsheets/d/1OxqzCbjHSAt9YCZ4KjPnSRq54RbtO5KfeGssgwJXvvc/edit?usp=sharing

---

## Quick Setup (Easiest)

### 1. Create Service Account in Google Cloud
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project **culture-guides-tracker** (or create it)
3. Enable **Google Sheets API**: APIs & Services → Enable APIs → search "Google Sheets API"
4. Go to **IAM & Admin** → **Service Accounts**
5. Click **Create Service Account**
6. Name it: `culture-guides-sheets`
7. Click **Create and Continue** → **Done**

### 2. Download JSON Key
1. Click on your new service account
2. Go to **Keys** tab → **Add Key** → **Create New Key**
3. Choose **JSON** → Download
4. **Rename** the file to `google-service-account.json`
5. **Move** it to your project root: `culture-guides-tracker/google-service-account.json`

### 3. Share Your Google Sheet
1. Open: https://docs.google.com/spreadsheets/d/1OxqzCbjHSAt9YCZ4KjPnSRq54RbtO5KfeGssgwJXvvc/edit
2. Click **Share**
3. Add the **service account email** from the JSON (look for `client_email`, e.g. `culture-guides-sheets@culture-guides-tracker.iam.gserviceaccount.com`)
4. Give **Editor** permission
5. Uncheck "Notify people" → **Share**

### 4. Create .env.local
Create `.env.local` in your project root with:

```env
GOOGLE_SHEETS_SHEET_ID=1OxqzCbjHSAt9YCZ4KjPnSRq54RbtO5KfeGssgwJXvvc
```

That's it! The app will automatically load credentials from `google-service-account.json`.

### 5. Test
```bash
npm run dev
```
Go to **Log Activity** → fill form → submit → check your Google Sheet!

---

## Alternative: Environment Variables

For production (e.g. Vercel), use env vars instead of the JSON file:

```env
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Key_Here\n-----END PRIVATE KEY-----"
GOOGLE_SHEETS_SHEET_ID=1OxqzCbjHSAt9YCZ4KjPnSRq54RbtO5KfeGssgwJXvvc
```

Copy `client_email` and `private_key` from your service account JSON.

---

## Sheet Structure

Data is appended automatically:

| Timestamp | Name | Slack Handle | Role | Event Name | Event Date | Points | Notes |
|-----------|------|--------------|------|------------|------------|--------|-------|

---

## Troubleshooting

**"Requested entity was not found"**
- Share the sheet with your service account email
- Verify `GOOGLE_SHEETS_SHEET_ID` matches your sheet URL

**"The caller does not have permission"**
- Service account needs **Editor** access to the sheet
- Enable Google Sheets API in your project

**"Invalid service account JSON"**
- Ensure you downloaded a **Service Account** key, not OAuth client credentials
- OAuth files are named `client_secret_*.json` — wrong type!
- Service account JSON has `"type": "service_account"`, `client_email`, and `private_key`

---

## Security

- `google-service-account.json` is in `.gitignore` — never commit it
- For production, use environment variables in Vercel dashboard
