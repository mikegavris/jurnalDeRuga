"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import JournalSidebar from "@/components/journal/JournalSidebar"
import RichTextEditor from "@/components/RichTextEditorClient"
import { Button } from "@/components/ui/button"

type Entry = {
  id: string
  title: string
  content: string
  experience_date: string | null
  tags: string[] | null
  images: string[] | null
}

const supabase = createClient()

export default function JournalPage() {
  /* =========================
     STATE
  ========================= */
  const [entries, setEntries] = useState<Entry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>([])

  const [userId, setUserId] = useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [experienceDate, setExperienceDate] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const [sidebarOpen, setSidebarOpen] = useState(false)

  /* =========================
     LOAD
  ========================= */
  async function loadEntries() {
    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .order("experience_date", { ascending: false })

    setEntries(data || [])
  }

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    init()
    loadEntries()
    setExperienceDate(new Date().toISOString().split("T")[0])
  }, [])

  /* =========================
     FILTER
  ========================= */
  useEffect(() => {
    let result = [...entries]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        e =>
          e.title.toLowerCase().includes(q) ||
          e.content.toLowerCase().includes(q)
      )
    }

    if (selectedMonth !== null) {
      result = result.filter(e =>
        e.experience_date
          ? new Date(e.experience_date).getMonth() === selectedMonth
          : false
      )
    }

    if (activeTag) {
      result = result.filter(e => e.tags?.includes(activeTag))
    }

    setFilteredEntries(result)
  }, [entries, searchQuery, selectedMonth, activeTag])

  /* =========================
     TAGS
  ========================= */
  function addNewTag() {
    const tag = newTag.trim().toLowerCase()
    if (!tag || selectedTags.includes(tag)) return
    setSelectedTags(prev => [...prev, tag])
    setNewTag("")
  }

  /* =========================
     SAVE
  ========================= */
  async function saveEntry() {
    if (!title.trim()) return alert("Titlu obligatoriu")
    if (!userId) return alert("Trebuie să fii autentificat!")

    const payload = {
      title,
      content,
      experience_date: experienceDate || null,
      tags: selectedTags,
      images: [],
      user_id: userId
    }

    let result
    if (editingId) {
      result = await supabase.from("journal_entries").update(payload).eq("id", editingId)
    } else {
      result = await supabase.from("journal_entries").insert(payload)
    }

    console.log("RESULT:", result)

    if (result.error) {
      alert("Eroare: " + result.error.message)
      return
    }

    resetForm()
    loadEntries()
  }

  function resetForm() {
    setTitle("")
    setContent("")
    setExperienceDate(new Date().toISOString().split("T")[0])
    setSelectedTags([])
    setEditingId(null)
  }

  function startEdit(e: Entry) {
    setEditingId(e.id)
    setTitle(e.title)
    setContent(e.content)
    setExperienceDate(e.experience_date || "")
    setSelectedTags(e.tags || [])
  }

  /* =========================
     CLOUDINARY UPLOAD
  ========================= */
  function openCloudinaryUpload(callback: (url: string) => void) {
    // @ts-ignore
    window.cloudinary.openUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        multiple: false,
      },
      (err: any, result: any) => {
        if (!err && result.event === "success") {
          callback(result.info.secure_url)
        }
      }
    )
  }

  const allTags = useMemo(
    () => [...new Set(entries.flatMap(e => e.tags || []))],
    [entries]
  )

  return (
    <div className="flex min-h-screen relative">

      {/* MOBILE TOP BAR */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center gap-3 p-3 bg-background/80 backdrop-blur-sm border-b md:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-blue-500 text-white p-2 rounded-lg shadow-lg"
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>
        <a href="/">
          <img src="/logo.png" alt="Voia Ta" className="w-9 h-9 rounded-full" />
        </a>
        <span className="font-semibold text-sm">Jurnalul meu spiritual</span>
      </div>

      {/* OVERLAY for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed top-0 left-0 h-full z-40 transform transition-transform duration-300
          md:relative md:translate-x-0 md:block
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <JournalSidebar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedMonth={selectedMonth}
          onMonthSelect={setSelectedMonth}
          activeTag={activeTag}
          onTagSelect={(tag) => {
            setActiveTag(tag)
            setSidebarOpen(false)
          }}
          allTags={allTags}
          onResetFilters={() => {
            setSearchQuery("")
            setSelectedMonth(null)
            setActiveTag(null)
          }}
        />
      </div>

      <main className="flex-1 p-4 sm:p-6 space-y-6 w-full pt-20 md:pt-6">
        <h1 className="text-xl sm:text-2xl font-bold hidden md:block">Jurnalul meu spiritual</h1>

        {/* FORM */}
        <div className="border rounded-xl p-3 sm:p-4 space-y-3 w-full max-w-full lg:max-w-xl">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Titlu"
            className="w-full border p-2 rounded text-sm sm:text-base"
          />

          <RichTextEditor
            content={content}
            onChange={setContent}
            onImageUpload={openCloudinaryUpload}
          />

          <input
            type="date"
            value={experienceDate}
            onChange={e => setExperienceDate(e.target.value)}
            className="w-full border p-2 rounded text-sm sm:text-base"
          />

          {/* TAGS */}
          <div className="flex gap-2 flex-wrap">
            {selectedTags.map(tag => (
              <span
                key={tag}
                className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded-full cursor-pointer text-xs sm:text-sm"
                onClick={() =>
                  setSelectedTags(prev => prev.filter(t => t !== tag))
                }
              >
                {tag} ✕
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              placeholder="Etichetă nouă"
              className="flex-1 border p-2 rounded text-sm sm:text-base"
              onKeyDown={e => e.key === "Enter" && addNewTag()}
            />
            <button
              onClick={addNewTag}
              className="px-3 py-2 bg-blue-500 text-white rounded text-sm sm:text-base"
            >
              +
            </button>
          </div>

          <Button onClick={saveEntry} className="w-full sm:w-auto">
            {editingId ? "Salvează" : "Adaugă în jurnal"}
          </Button>
        </div>

        {/* ENTRIES */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEntries.map(e => (
            <div key={e.id} className="border p-3 sm:p-4 rounded space-y-2">
              <h3 className="font-semibold text-sm sm:text-base">{e.title}</h3>
              <p className="text-xs text-gray-500">
                {e.experience_date &&
                  new Date(e.experience_date).toLocaleDateString("ro-RO")}
              </p>
              <div
                className="prose prose-sm max-w-none [&_img]:max-w-full [&_img]:h-auto"
                dangerouslySetInnerHTML={{ __html: e.content }}
              />
              <Button size="sm" onClick={() => startEdit(e)}>
                Editează
              </Button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}