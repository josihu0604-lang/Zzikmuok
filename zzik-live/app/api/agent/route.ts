/**
 * ZZIK Claude Agent API Route
 * 
 * POST /api/agent
 * - Handles conversation with Claude using Anthropic SDK
 * - Implements tool use loop for search_places and save_bookmark
 * - Returns final assistant response
 */

import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/agent/prompt";
import { toolSchemas, runTool, type ToolUseBlock } from "@/lib/agent/tools";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

type UIMessage = {
  role: "user" | "assistant";
  content: string;
};

type RequestBody = {
  messages: UIMessage[];
  coords?: {
    lat: number;
    lng: number;
  };
  userId?: string;
};

/**
 * Convert UI messages to Anthropic API format
 */
function toAnthropicHistory(msgs: UIMessage[]) {
  return msgs.map((m) => ({
    role: m.role,
    content: m.content,
  }));
}

/**
 * POST handler - Process agent conversation
 */
export async function POST(req: Request) {
  try {
    // Validate API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not configured");
      return NextResponse.json(
        { error: "서버 설정 오류: API 키가 없습니다." },
        { status: 500 }
      );
    }

    // Parse request body
    const body: RequestBody = await req.json();
    const { messages, coords, userId = "demo-user" } = body;

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "메시지가 필요합니다." },
        { status: 400 }
      );
    }

    // Convert to Anthropic format
    const history = toAnthropicHistory(messages);

    // Add coordinates context if provided
    let systemPrompt = SYSTEM_PROMPT;
    if (coords) {
      systemPrompt += `\n\n현재 사용자 위치: 위도 ${coords.lat.toFixed(4)}, 경도 ${coords.lng.toFixed(4)}
이 위치를 기준으로 장소를 검색할 때 search_places 도구를 사용하세요.`;
    }

    // Initial API call
    console.log(`[Agent] Starting conversation with ${messages.length} messages`);
    let resp = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022", // Latest Sonnet model
      max_tokens: 2048,
      system: systemPrompt,
      tools: toolSchemas as any,
      messages: history as any,
    });

    // Tool use loop
    // - Execute tool_use blocks
    // - Return tool_result and get next response
    // - Repeat until no more tool_use blocks
    let safetyGuard = 0;
    const MAX_TOOL_ROUNDS = 5;

    while (safetyGuard++ < MAX_TOOL_ROUNDS) {
      // Find tool_use blocks in response
      const toolUses = (resp.content ?? []).filter(
        (c: any): c is ToolUseBlock => c.type === "tool_use"
      );

      if (toolUses.length === 0) {
        console.log(`[Agent] No more tools to execute. Finished in ${safetyGuard} rounds.`);
        break;
      }

      console.log(`[Agent] Round ${safetyGuard}: Executing ${toolUses.length} tool(s)`);

      // Execute all tools in parallel
      const toolResults = await Promise.all(
        toolUses.map(async (tu) => {
          console.log(`[Agent] Executing tool: ${tu.name}`);
          const result = await runTool(tu, userId);
          console.log(`[Agent] Tool result:`, JSON.stringify(result).slice(0, 200));
          
          return {
            role: "user" as const,
            content: [
              {
                type: "tool_result" as const,
                tool_use_id: tu.id,
                content: JSON.stringify(result, null, 2),
              },
            ],
          };
        })
      );

      // Next round: Add assistant response + tool results to history
      resp = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2048,
        system: systemPrompt,
        tools: toolSchemas as any,
        messages: [
          ...history,
          { role: "assistant", content: resp.content as any },
          ...toolResults,
        ] as any,
      });
    }

    if (safetyGuard >= MAX_TOOL_ROUNDS) {
      console.warn(`[Agent] Hit max tool rounds limit (${MAX_TOOL_ROUNDS})`);
    }

    // Extract final text response
    const textBlocks = (resp.content ?? []).filter((b: any) => b.type === "text");
    const text = textBlocks.map((b: any) => b.text).join("\n\n");

    if (!text) {
      console.error("[Agent] No text response from Claude");
      return NextResponse.json(
        {
          error: "응답을 생성할 수 없습니다.",
          text: "죄송합니다. 응답을 처리하는 중 문제가 발생했습니다. 다시 시도해주세요."
        },
        { status: 500 }
      );
    }

    console.log(`[Agent] Conversation completed. Response length: ${text.length}`);

    return NextResponse.json(
      {
        text,
        usage: {
          input_tokens: resp.usage?.input_tokens ?? 0,
          output_tokens: resp.usage?.output_tokens ?? 0,
        },
        model: resp.model,
        stop_reason: resp.stop_reason,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("[Agent] Error:", error);

    // Handle specific error types
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        {
          error: "AI 서비스 오류가 발생했습니다.",
          details: error.message,
        },
        { status: error.status ?? 500 }
      );
    }

    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler - CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
