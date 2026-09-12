import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// In-memory sliding-window rate limiter (1 request per 10 seconds per IP)
const ipRateMap = new Map<string, number>();

export async function GET(req: NextRequest) {
  const secretKey = req.headers.get("x-keepalive-key");
  const expectedSecret = process.env.KEEPALIVE_SECRET;

  // Enforce shared secret authentication
  if (!expectedSecret || secretKey !== expectedSecret) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Rate limiting check: 1 request per 10 seconds per IP
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
  const now = Date.now();
  const lastAccess = ipRateMap.get(ip) || 0;

  if (now - lastAccess < 10000) {
    return NextResponse.json(
      { ok: false, error: "Rate limit exceeded (1 request per 10 seconds allowed)." },
      { status: 429 }
    );
  }
  ipRateMap.set(ip, now);

  try {
    await prisma.$runCommandRaw({ ping: 1 });
    return NextResponse.json(
      { ok: true, message: "Ping successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Keepalive ping failed:", error);
    return NextResponse.json(
      { ok: false, error: "Database unreachable" },
      { status: 500 }
    );
  }
}
