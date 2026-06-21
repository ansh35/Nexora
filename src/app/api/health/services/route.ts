import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const allServicesConfigured = !!(
    process.env.RESEND_API_KEY &&
    process.env.PUSHER_APP_ID &&
    process.env.PUSHER_SECRET &&
    process.env.GROQ_API_KEY
  );

  return NextResponse.json(
    { 
      status: allServicesConfigured ? "ok" : "degraded"
    },
    { status: allServicesConfigured ? 200 : 207 }
  );
}
