"use client"

import { GenericError } from "@/components/ui/GenericError"

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return <GenericError error={error} reset={reset} />
}
