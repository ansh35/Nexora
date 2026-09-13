import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// In-memory sliding-window rate limiter (1 request per 10 seconds per IP)
const ipRateMap = new Map<string, number>();

export async function GET(req: NextRequest) {
  const secretKey = req.headers.get("x-keepalive-key");
  const expectedSecret = process.env.KEEPALIVE_SECRET;

  if (!expectedSecret || secretKey !== expectedSecret) {
    return NextResponse.json(
      { status: "error", message: "Unauthorized" },
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
      { status: "error", message: "Rate limit exceeded (1 request per 10 seconds allowed)." },
      { status: 429 }
    );
  }
  ipRateMap.set(ip, now);

  try {
    // Use $runCommandRaw or a lightweight ping instead of exposing counts
    await prisma.$runCommandRaw({ ping: 1 });
    
    return NextResponse.json(
      { 
        status: "success", 
        message: "Connected to MongoDB successfully"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: "Failed to connect to the database"
      },
      { status: 500 }
    );
  }
}
