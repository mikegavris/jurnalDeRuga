"use client"




"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const finishAuth = async () => {
      await supabase.auth.getSession()
      router.replace("/jurnal")
    }

    finishAuth()
  }, [router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Se finalizează autentificarea…</p>
    </div>
  )
}

