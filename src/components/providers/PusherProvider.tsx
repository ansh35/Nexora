"use client"

import { createContext, useContext, useEffect, useState } from "react"
import Pusher from "pusher-js"

type PusherContextType = {
  pusherClient: Pusher | null
}

const PusherContext = createContext<PusherContextType>({ pusherClient: null })

export function PusherProvider({ children }: { children: React.ReactNode }) {
  const [pusherClient, setPusherClient] = useState<Pusher | null>(null)

  useEffect(() => {
    // We only initialize pusher if the required keys are present
    if (!process.env.NEXT_PUBLIC_PUSHER_APP_KEY || process.env.NEXT_PUBLIC_PUSHER_APP_KEY === "placeholder") {
      console.warn("Pusher credentials missing. Real-time features will be disabled.")
      return
    }

    const client = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "placeholder",
      authEndpoint: "/api/pusher/auth",
      authTransport: "ajax",
      auth: {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    })

    setPusherClient(client)

    return () => {
      client.disconnect()
    }
  }, [])

  return (
    <PusherContext.Provider value={{ pusherClient }}>
      {children}
    </PusherContext.Provider>
  )
}

export function usePusher() {
  return useContext(PusherContext)
}
