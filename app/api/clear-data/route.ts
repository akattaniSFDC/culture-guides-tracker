import { NextResponse } from "next/server"
import { localStorageService } from "@/lib/local-storage"

// Support both DELETE and POST methods for clear data
export async function DELETE() {
  try {
    await localStorageService.clearAllData()
    
    return NextResponse.json({
      success: true,
      message: "All activity data cleared successfully!"
    })
  } catch (error) {
    console.error("Error clearing data:", error)
    return NextResponse.json(
      { error: "Failed to clear data" },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    await localStorageService.clearAllData()
    
    return NextResponse.json({
      success: true,
      message: "All activity data cleared successfully!"
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