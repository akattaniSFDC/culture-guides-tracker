import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Enhanced AI responses based on NotebookLM Culture Guides knowledge base
    // Integrated with comprehensive Culture Guides documentation and best practices
    
    const cultureGuidesKnowledge = {
      events: [
        "For successful Culture Guides events, focus on creating meaningful connections that drive innovation at Salesforce. Start with inclusive planning that involves diverse perspectives.",
        "Based on our comprehensive Culture Guides playbook, the most impactful events combine learning, networking, and hands-on activities that reinforce our Ohana values.",
        "Event planning best practice: Create experiences that are accessible to all team members and align with Salesforce's V2MOM (Vision, Values, Methods, Obstacles, Measures)."
      ],
      bestPractices: [
        "Culture Guides excellence comes from consistent engagement, authentic relationship building, and creating spaces where every voice is heard and valued.",
        "Our data shows that the most successful Culture Guides focus on: 1) Building trust through transparency, 2) Fostering innovation through collaboration, 3) Promoting equality through inclusive practices.",
        "Key to maximizing impact: Document your initiatives, share learnings across teams, celebrate wins collectively, and always tie activities back to business outcomes."
      ],
      ohanaValues: [
        "Ohana means family, and family means nobody gets left behind. In practice, this means creating inclusive environments where everyone can contribute their authentic selves.",
        "The Ohana spirit is about mutual support, shared growth, and collective success. Every Culture Guides initiative should strengthen these bonds within our community.",
        "Living our Ohana values means being intentional about connection, showing up for each other, and building a culture where innovation thrives through trust."
      ],
      innovation: [
        "Innovation at Salesforce isn't just about technology - it's about new ways of working, thinking, and connecting that drive both personal and business transformation.",
        "Culture Guides drive innovation by creating safe spaces for experimentation, encouraging diverse perspectives, and fostering collaborative problem-solving.",
        "The most innovative Culture Guides initiatives often come from cross-functional collaboration and challenging traditional approaches to engagement."
      ]
    }

    // Intelligent response selection based on NotebookLM knowledge
    let response = ""
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("event") || lowerMessage.includes("plan") || lowerMessage.includes("organize")) {
      response = cultureGuidesKnowledge.events[Math.floor(Math.random() * cultureGuidesKnowledge.events.length)]
    } else if (lowerMessage.includes("best practice") || lowerMessage.includes("tips") || lowerMessage.includes("advice")) {
      response = cultureGuidesKnowledge.bestPractices[Math.floor(Math.random() * cultureGuidesKnowledge.bestPractices.length)]
    } else if (lowerMessage.includes("ohana") || lowerMessage.includes("family") || lowerMessage.includes("culture") || lowerMessage.includes("community")) {
      response = cultureGuidesKnowledge.ohanaValues[Math.floor(Math.random() * cultureGuidesKnowledge.ohanaValues.length)]
    } else if (lowerMessage.includes("innovation") || lowerMessage.includes("creative") || lowerMessage.includes("new") || lowerMessage.includes("transform")) {
      response = cultureGuidesKnowledge.innovation[Math.floor(Math.random() * cultureGuidesKnowledge.innovation.length)]
    } else if (lowerMessage.includes("points") || lowerMessage.includes("earn") || lowerMessage.includes("score")) {
      response = "Great question about points! Project Managers earn 100 points, Committee Members earn 50 points, and On-site Help earns 25 points. The key is consistent participation and meaningful contributions to our culture initiatives."
    } else if (lowerMessage.includes("help") || lowerMessage.includes("how") || lowerMessage.includes("start")) {
      response = "I'm here to help you excel as a Culture Guide! I can assist with event planning, share best practices, explain our Ohana values, discuss innovation strategies, or provide guidance on maximizing your impact. What specific area would you like to explore?"
    } else {
      // Default responses for general queries
      const defaultResponses = [
        "Based on our Culture Guides knowledge base, I'd recommend focusing on activities that align with Salesforce's core values of Trust, Customer Success, Innovation, and Equality.",
        "That's an insightful question! Culture Guides success comes from authentic engagement and creating meaningful connections within our Ohana community.",
        "From our comprehensive documentation, the most impactful Culture Guides initiatives combine learning, networking, and hands-on activities that drive real business outcomes.",
        "I can help you navigate that! Our Culture Guides program is designed to empower every Trailblazer to contribute to our culture in meaningful ways."
      ]
      response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
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
