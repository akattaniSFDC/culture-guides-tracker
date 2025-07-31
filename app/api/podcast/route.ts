import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Google Drive file ID from the URL
    const fileId = "1-Eog4zwEEl6oXPJ8Btuo_mg3JvK6z6L7"

    // Convert to direct download URL
    const audioUrl = `https://drive.google.com/uc?export=download&id=${fileId}`

    // Get file metadata
    const metadataUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?key=${process.env.GOOGLE_DRIVE_API_KEY}&fields=name,size,mimeType,createdTime`

    const metadataResponse = await fetch(metadataUrl)
    const metadata = await metadataResponse.json()

    return NextResponse.json({
      success: true,
      data: {
        title: "Ohana Connect - The Culture Guides",
        description:
          "An inspiring conversation on how we shape the future of work at Salesforce through our Ohana culture.",
        audioUrl,
        metadata: {
          name: metadata.name || "Ohana Connect Episode",
          size: metadata.size,
          mimeType: metadata.mimeType,
          createdTime: metadata.createdTime,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching podcast data:", error)
    return NextResponse.json({ error: "Failed to fetch podcast data" }, { status: 500 })
  }
}
