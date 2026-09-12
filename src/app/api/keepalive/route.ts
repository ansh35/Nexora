import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
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
