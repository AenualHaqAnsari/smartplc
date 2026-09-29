import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function hashIP(ip: string) {
  return crypto
    .createHash("sha256")
    .update(ip)
    .digest("hex");
}

function detectDevice(userAgent: string) {
  const ua = userAgent.toLowerCase();

  if (/ipad|tablet|playbook|silk/.test(ua)) {
    return "Tablet";
  }

  if (
    /mobile|android|iphone|ipod|blackberry|windows phone/.test(
      ua
    )
  ) {
    return "Mobile";
  }

  return "Desktop";
}

function detectBrowser(userAgent: string) {
  const ua = userAgent.toLowerCase();

  if (ua.includes("edg/")) {
    return "Edge";
  }

  if (ua.includes("opr/") || ua.includes("opera")) {
    return "Opera";
  }

  if (ua.includes("chrome/") && !ua.includes("edg/")) {
    return "Chrome";
  }

  if (ua.includes("firefox/")) {
    return "Firefox";
  }

  if (
    ua.includes("safari/") &&
    !ua.includes("chrome/")
  ) {
    return "Safari";
  }

  if (ua.includes("msie") || ua.includes("trident/")) {
    return "Internet Explorer";
  }

  return "Other";
}

function detectCountry(request: NextRequest) {
  return (
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-country") ||
    null
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const path = String(
      body.path || "/"
    ).trim();
const productId =
  body.productId
    ? String(body.productId)
    : null;
if (
  path === "/admin" ||
  path.startsWith("/admin/")
) {
  return NextResponse.json({
    success: true,
    ignored: true,
  });
}

    let visitorId =
      request.cookies.get("visitor_id")?.value;

    if (!visitorId) {
      visitorId = crypto.randomUUID();
    }

    const forwarded =
      request.headers.get("x-forwarded-for");

    const ip =
      forwarded?.split(",")[0]?.trim() ||
      "unknown";

    const userAgent =
      request.headers.get("user-agent") ||
      "";

    const device =
      detectDevice(userAgent);

    const browser =
      detectBrowser(userAgent);

    const country =
      detectCountry(request);

    const visitor =
      await prisma.visitor.upsert({
        where: {
          visitorId,
        },

        update: {
          lastSeen: new Date(),
          device,
          browser,

          ...(country
            ? { country }
            : {}),
        },

        create: {
          visitorId,

          ipHash:
            ip !== "unknown"
              ? hashIP(ip)
              : null,

          device,
          browser,

          country,
        },
      });

    await prisma.pageView.create({
  data: {
    visitorId: visitor.id,
    path,
    productId,
  },
});

    const response =
      NextResponse.json({
        success: true,
      });

    response.cookies.set(
      "visitor_id",
      visitorId,
      {
        httpOnly: true,
        maxAge:
          60 * 60 * 24 * 365,
        sameSite: "lax",
        path: "/",
      }
    );

    return response;
  } catch (error) {
    console.error(
      "ANALYTICS TRACK ERROR",
      error
    );

    return NextResponse.json(
      {
        error: "Tracking failed",
      },
      {
        status: 500,
      }
    );
  }
}