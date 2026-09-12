import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextRequest, NextResponse } from "next/server"

const authHandler = NextAuth(authConfig).auth

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Explicitly ignore /api/keepalive so unauthenticated requests are never redirected to /login
  if (pathname.startsWith("/api/keepalive")) {
    return NextResponse.next()
  }

  return (authHandler as unknown as (req: NextRequest) => Promise<NextResponse | Response | undefined>)(req)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp)$).*)'],
}

