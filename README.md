# Culture Guides Rockstar 🌟

A modern, gamified web application for Salesforce Culture Guides to log activities, earn points, and celebrate company culture.

## Features

- **🎯 Activity Logging**: Log cultural activities and earn points
- **📊 Dashboard**: View leaderboards and statistics
- **🎧 Podcast Integration**: Stream Culture Guides podcast from Google Drive
- **🤖 AI Assistant**: NotebookLM-powered chatbot for guidance
- **📱 Responsive Design**: Modern liquid glass UI optimized for all devices
- **🔗 Integrations**: Google Sheets for data storage, Slack for notifications

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Google Sheets API
- **Notifications**: Slack Web API
- **Media**: Google Drive API
- **AI**: NotebookLM Integration
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Cloud Project with enabled APIs
- Slack Bot Token

### Environment Variables

Create a `.env.local` file:

\`\`\`env
# Google Sheets Integration
GOOGLE_SHEETS_PRIVATE_KEY="your-private-key"
GOOGLE_SHEETS_CLIENT_EMAIL="your-client-email"
GOOGLE_SHEETS_SHEET_ID="your-sheet-id"

# Slack Integration
SLACK_BOT_TOKEN="xoxb-your-bot-token"
SLACK_CHANNEL_ID="C1234567890"

# Google Drive API
GOOGLE_DRIVE_API_KEY="your-api-key"

# NotebookLM (Optional)
NOTEBOOKLM_API_ENDPOINT="your-endpoint"
\`\`\`

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/your-org/culture-guides-rockstar.git
cd culture-guides-rockstar
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000)

### Deployment

Deploy to Vercel:

\`\`\`bash
npm run build
vercel --prod
\`\`\`

Or use the Vercel dashboard to connect your GitHub repository.

## API Endpoints

### POST /api/log-activity
Log a new culture activity.

**Request Body:**
\`\`\`json
{
  "role": "project-manager",
  "eventName": "Innovation Showcase",
  "eventDate": "2024-01-15",
  "name": "John Doe",
  "slackHandle": "@john.doe",
  "notes": "Led the planning committee",
  "notifyManager": true
}
\`\`\`

### GET /api/podcast
Get podcast metadata and streaming URL.

### POST /api/notebooklm
Send message to AI assistant.

**Request Body:**
\`\`\`json
{
  "message": "How can I plan a successful culture event?"
}
\`\`\`

## Google Sheets Setup

1. Create a Google Sheets document
2. Create a sheet named "Activities" with headers:
   - Timestamp
   - Name
   - Slack Handle
   - Role
   - Event Name
   - Event Date
   - Points
   - Notes

3. Set up Google Service Account:
   - Go to Google Cloud Console
   - Enable Google Sheets API
   - Create service account
   - Download credentials JSON
   - Share your sheet with the service account email

## Slack Integration Setup

1. Create a Slack App at api.slack.com
2. Add Bot Token Scopes:
   - `chat:write`
   - `channels:read`
3. Install app to workspace
4. Get Bot User OAuth Token
5. Add bot to #cultureguides-global channel

## File Structure

\`\`\`
culture-guides-rockstar/
├── app/
│   ├── api/
│   │   ├── log-activity/
│   │   ├── podcast/
│   │   └── notebooklm/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   │   └── Header.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── LogActivityPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── ResourcesPage.tsx
│   └── ui/
│       ├── BackgroundEffects.tsx
│       └── [shadcn components]
├── public/
│   └── hero-bg.jpg
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.mjs
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email cultureguides@salesforce.com or create an issue in this repository.
