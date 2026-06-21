import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
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
