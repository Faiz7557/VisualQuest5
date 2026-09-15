import { NextRequest } from "next/server";
import { evaluateMessage } from "@/lib/triage-engine";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Pesan tidak valid" }), { status: 400 });
    }

    const { evaluation, responseText } = evaluateMessage(message);

    // Return JSON containing evaluation metadata and response text
    return new Response(
      JSON.stringify({
        evaluation,
        responseText,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), { status: 500 });
  }
}
