import { OpenAIStream } from '@/utils/chat'

export const config = {
  runtime: 'edge',
}

const handler = async (req: Request): Promise<Response> => {
  try {
    const { prompt } = (await req.json()) as {
      prompt: string
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return new Response('OpenAI API key not configured', { status: 500 })
    }

    const stream = await OpenAIStream(prompt, apiKey)

    return new Response(stream)
  } catch (error) {
    console.error(error)
    return new Response('Error', { status: 500 })
  }
}

export default handler
