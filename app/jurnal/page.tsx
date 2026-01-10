"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import JournalSidebar from "@/components/journal/JournalSidebar"

type Entry = {
  id: string
  title: string
  content: string
  created_at: string
}

const supabase = createClient()

export default function JournalPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)

  /* =========================
     LOAD ENTRIES
  ========================= */
  async function loadEntries() {
    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .order("created_at", { ascending: false })

    setEntries(data || [])
  }

  useEffect(() => {
    loadEntries()
  }, [])

  /* =========================
     SAVE (ADD / UPDATE)
  ========================= */
  async function saveEntry() {
    if (!title.trim()) return

    if (editingId) {
      await supabase
        .from("journal_entries")
        .update({ title, content })
        .eq("id", editingId)
    } else {
      await supabase.from("journal_entries").insert({
        title,
        content,
      })
    }

    setTitle("")
    setContent("")
    setEditingId(null)
    loadEntries()
  }

  /* =========================
     DELETE
  ========================= */
  async function deleteEntry(id: string) {
    await supabase.from("journal_entries").delete().eq("id", id)
    loadEntries()
  }

  /* =========================
     START EDIT
  ========================= */
  function startEdit(entry: Entry) {
    setTitle(entry.title)
    setContent(entry.content)
    setEditingId(entry.id)
  }

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <JournalSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Jurnalul meu spiritual</h1>
          <p className="text-muted-foreground">
            Documentează experiențele tale cu Dumnezeu
          </p>
        </header>

        {/* FORM */}
        <div className="border rounded-xl p-4 space-y-3 max-w-xl">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titlu"
            className="w-full border p-2 rounded"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Scrie aici..."
            className="w-full border p-2 rounded min-h-[120px]"
          />

          <Button onClick={saveEntry}>
            {editingId ? "Salvează modificările" : "Adaugă în jurnal"}
          </Button>

          {editingId && (
            <Button
              variant="secondary"
              onClick={() => {
                setEditingId(null)
                setTitle("")
                setContent("")
              }}
            >
              Anulează editarea
            </Button>
          )}
        </div>

        {/* ENTRIES */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((e) => (
            <div
              key={e.id}
              className="border rounded-xl p-4 space-y-2 bg-background"
            >
              <h3 className="font-semibold">{e.title}</h3>

              <p className="text-xs text-muted-foreground">
                {new Date(e.created_at).toLocaleDateString("ro-RO")}
              </p>

              <p className="text-sm opacity-80 whitespace-pre-wrap">
                {e.content}
              </p>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => startEdit(e)}
                >
                  Editează
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteEntry(e.id)}
                >
                  Șterge
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
