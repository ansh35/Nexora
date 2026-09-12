import type { NextAuthConfig } from "next-auth";
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/api/auth",
  "/api/keepalive",
  "/api/health",
  "/invite",
];

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const { pathname } = nextUrl;
      const isLoggedIn = !!auth?.user;

      const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

      if (isPublicRoute) {
        // Redirect authenticated users trying to access auth pages back to dashboard
        if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      // Allow authenticated users to access protected routes
      if (isLoggedIn) {
        return true;
      }

      // Strict Default-Deny:
      // For unauthenticated API calls, reject with 401 Unauthorized
      if (pathname.startsWith("/api/")) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      // For unauthenticated page visits, return false (NextAuth will redirect to signIn page)
      return false;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.organizationId = user.organizationId;
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.organizationId = token.organizationId as string | null | undefined;
      }
      return session;
    },
  },
  providers: [], // Providers configured in auth.ts due to Node dependencies
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
