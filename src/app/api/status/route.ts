import { NextResponse } from "next/server";
import { hasApiKey } from "@/lib/gemini";

export async function GET() {
  return NextResponse.json({
    geminiConfigured: hasApiKey(),
  });
}
