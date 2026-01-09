"use client"

import { useState } from "react"
import {
  Plus,
  CalendarDays,
  Image as ImageIcon,
  Bold,
  Italic,
  List,
  Tag
} from "lucide-react"
import { Button } from "@/components/ui/button"

/* ======================
   Versete zilnice
====================== */
const verses = [
  "„Strigă către Mine și-ți voi răspunde.” – Ieremia 33:3",
  "„Domnul este aproape de toți cei ce-L cheamă.” – Psalmul 145:18",
  "„Rugați-vă neîncetat.” – 1 Tesaloniceni 5:17",
]

/* ======================
   Date mock
====================== */
const journalByMonth = {
  "Ianuarie 2026": [
    { id: 1, date: "09 Ian", title: "Mulțumire", mood: "🙂" },
    { id: 2, date: "07 Ian", title: "Luptă", mood: "😔" },
  ],
  "Februarie 2026": [
    { id: 3, date: "02 Feb", title: "Răspuns primit", mood: "🙏" },
  ],
}

const moods = ["😔", "🙂", "😊", "🙏", "😌"]

export default function JurnalPage() {
  const [selectedMood, setSelectedMood] = useState("🙂")
  const [labels, setLabels] = useState<string[]>(["mulțumire"])

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* HEADER */}
      <header className="border-b px-4 py-3 flex items-center justify-between">
        <div className="font-semibold text-lg">📖 Jurnalul meu</div>

        <Button size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Intrare nouă
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] min-h-[calc(100vh-56px)]">

        {/* ======================
            STÂNGA – LUNI + INTRĂRI
        ====================== */}
        <aside className="border-r p-4 space-y-6 overflow-y-auto">
          {Object.entries(journalByMonth).map(([month, entries]) => (
            <div key={month}>
              <div className="text-sm font-semibold opacity-70 mb-2">
                {month}
              </div>

              <div className="space-y-2">
                {entries.map(entry => (
                  <button
                    key={entry.id}
                    className="w-full flex items-center gap-3 rounded-lg p-2 text-left hover:bg-muted transition"
                  >
                    <span>{entry.mood}</span>
                    <div>
                      <div className="text-sm font-medium">
                        {entry.date}
                      </div>
                      <div className="text-xs opacity-70">
                        {entry.title}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* ======================
            DREAPTA – EDITOR
        ====================== */}
        <main className="p-6 flex flex-col gap-4">

          {/* Verset */}
          <div className="text-sm italic opacity-80 text-center">
            {verses[0]}
          </div>

          {/* Stare emoțională */}
          <div className="flex items-center gap-2 justify-center">
            {moods.map(mood => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={`text-2xl transition ${
                  mood === selectedMood ? "scale-125" : "opacity-50 hover:opacity-100"
                }`}
              >
                {mood}
              </button>
            ))}
          </div>

          {/* Titlu */}
          <input
            placeholder="Titlul intrării..."
            className="text-2xl font-semibold bg-transparent outline-none border-b pb-2"
          />

          {/* Toolbar */}
          <div className="flex items-center gap-2 border rounded-lg p-2">
            <Button size="icon" variant="ghost"><Bold className="w-4 h-4" /></Button>
            <Button size="icon" variant="ghost"><Italic className="w-4 h-4" /></Button>
            <Button size="icon" variant="ghost"><List className="w-4 h-4" /></Button>
            <Button size="icon" variant="ghost"><ImageIcon className="w-4 h-4" /></Button>
          </div>

          {/* Text */}
          <textarea
            placeholder="Scrie aici gândurile tale, rugăciunea, experiența..."
            className="flex-1 resize-none bg-transparent outline-none leading-relaxed"
          />

          {/* Labels */}
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 opacity-60" />
            {labels.map(label => (
              <span
                key={label}
                className="text-xs px-3 py-1 rounded-full bg-primary/10"
              >
                #{label}
              </span>
            ))}
            <button className="text-xs opacity-60 hover:opacity-100">
              + adaugă label
            </button>
          </div>

        </main>
      </div>
    </div>
  )
}
