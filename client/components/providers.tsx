"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import { type ReactNode, useState } from "react"
import { trpc } from "@/lib/trpc"

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    if (process.env.NODE_ENV === "production" && !apiUrl) {
      console.error("[v0] NEXT_PUBLIC_API_URL is not set in production")
    }

    const trpcUrl = process.env.NODE_ENV === "production" && apiUrl ? `${apiUrl}/api/trpc` : "/api/trpc"

    return trpc.createClient({
      links: [
        httpBatchLink({
          url: trpcUrl,
        }),
      ],
    })
  })

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
