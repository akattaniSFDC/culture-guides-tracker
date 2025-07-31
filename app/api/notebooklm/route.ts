import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // This is a mock implementation since NotebookLM doesn't have a public API
    // In a real implementation, you would integrate with the actual NotebookLM service

    // Simulate AI response based on Culture Guides context
    const responses = [
      "That's a great question! Based on our Culture Guides knowledge base, I'd recommend focusing on inclusive activities that align with Salesforce's core values of Trust, Customer Success, Innovation, and Equality.",
      "I can help you plan that event! Consider incorporating elements of innovation, equality, and community impact to maximize engagement and points. Would you like me to suggest some specific activities?",
      "From our program data, events with interactive workshops and collaborative activities tend to have the highest participation rates. I can provide you with templates and best practices.",
      "That's an excellent initiative! Culture Guides events work best when they create meaningful connections between team members while advancing our cultural values. Let me share some successful examples.",
      "Based on the Culture Guides playbook, I recommend starting with a clear objective, engaging multiple stakeholders, and ensuring accessibility for all participants. What type of event are you planning?",
    ]

    // Simple keyword-based response selection
    let response = responses[Math.floor(Math.random() * responses.length)]

    if (message.toLowerCase().includes("event") || message.toLowerCase().includes("plan")) {
      response =
        "I can help you plan that event! Consider incorporating elements of innovation, equality, and community impact to maximize engagement and points. Would you like me to suggest some specific activities?"
    } else if (message.toLowerCase().includes("points") || message.toLowerCase().includes("earn")) {
      response =
        "Great question about points! Project Managers earn 100 points, Committee Members earn 50 points, and On-site Help earns 25 points. The key is consistent participation and meaningful contributions to our culture initiatives."
    } else if (message.toLowerCase().includes("best practices") || message.toLowerCase().includes("tips")) {
      response =
        "Here are some Culture Guides best practices: 1) Focus on inclusive activities, 2) Align with Salesforce values, 3) Encourage cross-team collaboration, 4) Document and share learnings, 5) Celebrate successes with the community!"
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    return NextResponse.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error processing NotebookLM request:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
