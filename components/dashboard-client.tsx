"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Moon, Sun, LogOut, Plus, BookOpen, Church } from "lucide-react"
import { DiaryTab } from "@/components/diary-tab"
import { PrayersTab } from "@/components/prayers-tab"
import { RemindersTab } from "@/components/reminders-tab"
import { BibleVerseCard } from "@/components/bible-verse-card"

type Tab = "diary" | "prayers" | "reminders"

export function DashboardClient() {
  const [activeTab, setActiveTab] = useState<Tab>("diary")
  const [isDark, setIsDark] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true"
    setIsDark(darkMode)
    if (darkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDark
    setIsDark(newDarkMode)
    localStorage.setItem("darkMode", newDarkMode.toString())
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Church className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Jurnal de Rugăciune</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Bible Verse Card */}
        <BibleVerseCard />

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-border">
          <Button
            variant={activeTab === "diary" ? "default" : "ghost"}
            className="rounded-b-none"
            onClick={() => setActiveTab("diary")}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Jurnal
          </Button>
          
        </div>

        {/* Tab Content */}
        {activeTab === "diary" && <DiaryTab />}
        {activeTab === "prayers" && <PrayersTab />}
        {activeTab === "reminders" && <RemindersTab />}
      </div>
    </div>
  )
}
