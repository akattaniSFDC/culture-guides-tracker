import { createHuggingFace } from '@ai-sdk/huggingface'
import { streamText, convertToModelMessages, type UIMessage } from 'ai'
import { getCultureGuidesSystemPrompt } from '@/lib/culture-guides-knowledge'

const huggingface = createHuggingFace({
  apiKey: process.env.HUGGINGFACE_API_KEY,
})

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  if (!process.env.HUGGINGFACE_API_KEY) {
    return new Response(
      JSON.stringify({
        error: 'HUGGINGFACE_API_KEY is not configured. Add it to your environment variables.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const result = streamText({
    model: huggingface('Qwen/Qwen2.5-7B-Instruct'),
    system: getCultureGuidesSystemPrompt(today),
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
