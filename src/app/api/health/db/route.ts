import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const secretKey = req.headers.get("x-keepalive-key");
  const expectedSecret = process.env.KEEPALIVE_SECRET;

  if (!expectedSecret || secretKey !== expectedSecret) {
    return NextResponse.json(
      { status: "error", message: "Unauthorized" },
      { status: 401 }
    );
  }

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
