import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const organizationCount = await prisma.organization.count();
    
    return NextResponse.json(
      { 
        status: "success", 
        message: "Connected to MongoDB successfully", 
        organizationCount 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: "Failed to connect to the database",
        error: error instanceof Error ? (error instanceof Error ? error.message : String(error)) : "Unknown error"
      },
      { status: 500 }
    );
  }
}
