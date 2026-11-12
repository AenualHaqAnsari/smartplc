import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/it-services/ai-agent-development") {
    return NextResponse.redirect(
      new URL("/custom-business-ai-agents", request.url),
      301,
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/it-services/ai-agent-development"],
};
