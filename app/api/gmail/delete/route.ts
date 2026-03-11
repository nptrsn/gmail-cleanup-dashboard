import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { sender, maxCount = 9999, dryRun = true } = await req.json();

  if (!sender || typeof sender !== "string") {
    return NextResponse.json({ error: "sender is required" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  const action = dryRun ? "dry_run" : "delete";
  const prompt = `Use gmail-cleanup:delete_emails with arguments: {"search_criteria":{"sender":"${sender}"},"dry_run":${dryRun},"max_count":${maxCount},"user_context":{"user_id":"default","session_id":"default"}}. Return ONLY raw JSON: {"count":N,"dry_run":${dryRun}}. No markdown.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        system: "You are a Gmail cleanup tool. Execute the MCP tool call exactly as instructed. Return ONLY raw JSON. No markdown, no explanation.",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    const text = data.content?.map((b: { type: string; text?: string }) => b.type === "text" ? b.text : "").join("") || "";
    const clean = text.replace(/```json|```/g, "").trim();

    try {
      const parsed = JSON.parse(clean);
      return NextResponse.json({ ...parsed, action, sender });
    } catch {
      return NextResponse.json({ error: "Failed to parse response", raw: text, sender }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json({ error: String(err), sender }, { status: 500 });
  }
}