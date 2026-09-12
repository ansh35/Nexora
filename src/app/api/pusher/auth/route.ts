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

    // Strict regex validation for permitted channel patterns:
    // 1. (private|presence)-org-<24-hex-orgId>
    // 2. private-user-<24-hex-userId>
    const orgChannelRegex = /^(private|presence)-org-([a-fA-F0-9]{24})$/
    const userChannelRegex = /^private-user-([a-fA-F0-9]{24})$/

    const orgMatch = channelName.match(orgChannelRegex)
    const userMatch = channelName.match(userChannelRegex)

    if (orgMatch) {
      const [, type, targetOrgId] = orgMatch

      if (targetOrgId !== session.user.organizationId) {
        return new NextResponse("Forbidden: Cross-organization subscription attempt blocked.", { status: 403 })
      }

      if (type === "presence") {
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

      const authResponse = pusherServer.authorizeChannel(socketId, channelName)
      return NextResponse.json(authResponse)
    }

    if (userMatch) {
      const [, targetUserId] = userMatch

      if (targetUserId !== session.user.id) {
        return new NextResponse("Forbidden: Cannot subscribe to another user's channel.", { status: 403 })
      }

      const authResponse = pusherServer.authorizeChannel(socketId, channelName)
      return NextResponse.json(authResponse)
    }

    // Reject any channel that does not strictly match the whitelist
    return new NextResponse("Forbidden: Unrecognized or unauthorized channel scope.", { status: 403 })
    
  } catch (error) {
    console.error("Pusher Auth Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
