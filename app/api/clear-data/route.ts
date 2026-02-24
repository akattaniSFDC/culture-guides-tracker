import { type NextRequest, NextResponse } from "next/server"
import { localStorageService } from "@/lib/local-storage"
import { googleSheetsService } from "@/lib/google-sheets"

export async function DELETE(request: NextRequest) {
  try {
    const quarter = request.nextUrl.searchParams.get('quarter') || undefined

    if (googleSheetsService.isGoogleSheetsConfigured()) {
      await googleSheetsService.clearSheet(quarter)
      console.log(`✅ Cleared Google Sheets data for ${quarter || 'current quarter'}`)
    }

    await localStorageService.clearAllData()

    return NextResponse.json({
      success: true,
      message: `Activity data cleared successfully for ${quarter || 'current quarter'}!`
    })
  } catch (error) {
    console.error("Error clearing data:", error)
    return NextResponse.json(
      { error: "Failed to clear data" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    let quarter: string | undefined
    try {
      const body = await request.json()
      quarter = body.quarter
    } catch {
      // No body or invalid JSON is fine
    }

    if (googleSheetsService.isGoogleSheetsConfigured()) {
      await googleSheetsService.clearSheet(quarter)
    }

    await localStorageService.clearAllData()

    return NextResponse.json({
      success: true,
      message: `Activity data cleared successfully for ${quarter || 'current quarter'}!`
    })
  } catch (error) {
    console.error("Error clearing data:", error)
    return NextResponse.json(
      { error: "Failed to clear data" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const stats = await localStorageService.getStats()

    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error("Error getting stats:", error)
    return NextResponse.json(
      { error: "Failed to get stats" },
      { status: 500 }
    )
  }
}
