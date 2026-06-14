import { NextResponse } from "next/server"
import { auth } from "@/../auth"
import { pusherServer } from "@/lib/pusher"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const data = await req.text()
    const params = new URLSearchParams(data)
    
    const socketId = params.get("socket_id")
    const channelName = params.get("channel_name")

    if (!socketId || !channelName) {
      return new NextResponse("Missing parameters", { status: 400 })
    }

    // Security Check: Enforce Organization Scope
    // e.g., channelName: private-org-abc123xyz
    // or presence-org-abc123xyz
    // or private-user-abc123xyz

    if (channelName.startsWith("private-org-") || channelName.startsWith("presence-org-")) {
      const orgId = channelName.split("-")[2]
      if (orgId !== session.user.organizationId) {
        return new NextResponse("Forbidden: Cross-organization subscription attempt blocked.", { status: 403 })
      }
    } else if (channelName.startsWith("private-user-")) {
      const userId = channelName.split("-")[2]
      if (userId !== session.user.id) {
        return new NextResponse("Forbidden: Cannot subscribe to another user's channel.", { status: 403 })
      }
    }

    // Presence Channel requires additional user info
    if (channelName.startsWith("presence-")) {
      const presenceData = {
        user_id: session.user.id,
        user_info: {
          name: session.user.name,
          email: session.user.email,
        }
      }
      const authResponse = pusherServer.authorizeChannel(socketId, channelName, presenceData)
      return NextResponse.json(authResponse)
    }

    // Private Channels
    const authResponse = pusherServer.authorizeChannel(socketId, channelName)
    return NextResponse.json(authResponse)
    
  } catch (error) {
    console.error("Pusher Auth Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
