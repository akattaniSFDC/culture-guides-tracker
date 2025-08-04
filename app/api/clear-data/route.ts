import { NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'activities.json')

export async function DELETE() {
  try {
    // Check if the file exists and delete it
    if (fs.existsSync(DATA_FILE)) {
      fs.unlinkSync(DATA_FILE)
      console.log('✅ Activities data cleared successfully')
    }

    return NextResponse.json({
      success: true,
      message: 'All activity data has been cleared successfully'
    })
  } catch (error) {
    console.error('❌ Error clearing data:', error)
    return NextResponse.json(
      { error: 'Failed to clear data' },
      { status: 500 }
    )
  }
}