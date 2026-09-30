import { NextRequest, NextResponse } from "next/server";
import { hasApiKey, mockChatReply, runChat } from "@/lib/gemini";
import type { ChatRequestBody, ChatResponseBody } from "@/lib/types";
import { getModel } from "@/lib/models";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const { messages, modelId, imageBase64, imageMimeType, videoNote, rewriteForModel } =
      body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages required", message: "" } satisfies ChatResponseBody,
        { status: 400 }
      );
    }
    if (!modelId || !getModel(modelId)) {
      return NextResponse.json(
        { error: "Invalid modelId", message: "" } satisfies ChatResponseBody,
        { status: 400 }
      );
    }

    if (!hasApiKey()) {
      const mock = mockChatReply({ messages, modelId, rewriteForModel });
      const res: ChatResponseBody = {
        message: mock.text,
        prompt: mock.prompt,
        mock: true,
      };
      return NextResponse.json(res);
    }

    const result = await runChat({
      messages,
      modelId,
      imageBase64,
      imageMimeType,
      videoNote,
      rewriteForModel,
    });

    const res: ChatResponseBody = {
      message: result.text,
      prompt: result.prompt,
      mock: false,
    };
    return NextResponse.json(res);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[api/chat]", msg);
    return NextResponse.json(
      {
        error: msg,
        message: `Something went wrong talking to Gemini: ${msg}`,
      } satisfies ChatResponseBody,
      { status: 500 }
    );
  }
}
