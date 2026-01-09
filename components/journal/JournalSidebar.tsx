"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"

const MONTHS = [
  "Ianuarie", "Februarie", "Martie", "Aprilie",
  "Mai", "Iunie", "Iulie", "August",
  "Septembrie", "Octombrie", "Noiembrie", "Decembrie",
]

export default function JournalSidebar() {
  const [search, setSearch] = useState("")

  return (
    <aside className="w-64 border-r bg-muted/30 p-4 space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-2">Caută</h3>
        <Input
          placeholder="Caută în jurnal..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Luni</h3>
        <ul className="space-y-1 text-sm">
          {MONTHS.map((m) => (
            <li
              key={m}
              className="cursor-pointer rounded px-2 py-1 hover:bg-accent"
            >
              {m}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Etichete</h3>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs px-2 py-1 rounded bg-accent">
            Credință
          </span>
          <span className="text-xs px-2 py-1 rounded bg-accent">
            Mulțumire
          </span>
          <span className="text-xs px-2 py-1 rounded bg-accent">
            Luptă
          </span>
        </div>
      </div>
    </aside>
  )
}
