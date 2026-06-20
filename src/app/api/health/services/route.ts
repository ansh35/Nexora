import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const services = {
    resend: !!process.env.RESEND_API_KEY,
    pusher: !!(process.env.PUSHER_APP_ID && process.env.PUSHER_SECRET),
    groq: !!process.env.GROQ_API_KEY,
  };

  const allServicesConfigured = Object.values(services).every(Boolean);

  return NextResponse.json(
    { 
      status: allServicesConfigured ? "ok" : "degraded",
      services
    },
    { status: allServicesConfigured ? 200 : 207 }
  );
}
