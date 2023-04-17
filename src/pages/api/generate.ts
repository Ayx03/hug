import type { NextRequest } from "next/server";
import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

export const config = {
  runtime: "edge",
};

const handler = async (req: NextRequest): Promise<Response> => {
  const { prompt, openaiApiKey } = (await req.json()) as {
    prompt?: string;
    openaiApiKey?: string;
  };

  const apiKey = openaiApiKey ?? process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return new Response("Missing OpenAI API key", { status: 400 });
  }

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    // model:"text-chat-davinci-002-20230126",
    // model:"text-chat-davinci-003",
    
    model: "text-davinci-003",
    // model:"text-curie-001",
    prompt,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 500,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload, apiKey);
  return new Response(stream);
};

export default handler;
