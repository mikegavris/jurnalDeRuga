"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import JournalSidebar from "@/components/journal/JournalSidebar"
import { Button } from "@/components/ui/button"

const supabase = createClient()

export default function JournalPage() {
  const [entries, setEntries] = useState<any[]>([])

  useEffect(() => {
    loadEntries()
  }, [])

  async function loadEntries() {
    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .order("created_at", { ascending: false })

    setEntries(data || [])
  }

  async function deleteEntry(id: string) {
    await supabase.from("journal_entries").delete().eq("id", id)
    loadEntries()
  }

  return (
    <>
      <JournalSidebar />

      <main className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Jurnalul meu spiritual</h1>
          <Button>Adaugă intrare</Button>
        </div>

        <div className="grid gap-4 max-w-2xl">
          {entries.map((e) => (
            <div
              key={e.id}
              className="border rounded-xl p-4 space-y-2"
            >
              <h3 className="font-semibold">{e.title}</h3>

              <p className="text-xs text-muted-foreground">
                {new Date(e.created_at).toLocaleDateString("ro-RO")}
              </p>

              <p className="text-sm opacity-80">{e.content}</p>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteEntry(e.id)}
              >
                Șterge
              </Button>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
