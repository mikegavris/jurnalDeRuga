"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { BookOpen, HandHeart, AlarmClock, Sun, Moon } from "lucide-react"

/* ======================
   Versete biblice
====================== */
const verses = [
  "„Rugați-vă neîncetat.” – 1 Tesaloniceni 5:17",
  "„Strigă către Mine și-ți voi răspunde.” – Ieremia 33:3",
  "„Domnul este aproape de toți cei ce-L cheamă.” – Psalmul 145:18",
  "„Apropiați-vă de Dumnezeu și El Se va apropia de voi.” – Iacov 4:8",
  "„Orice veți cere în rugăciune, cu credință, veți primi.” – Matei 21:22",
]

/* ======================
   Verset animat
====================== */
function FloatingVerse() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % verses.length)
        setVisible(true)
      }, 800)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-10 flex items-center justify-center">
      <p
        className={`text-sm md:text-base italic transition-all duration-700 text-center
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`}
      >
        {verses[index]}
      </p>
    </div>
  )
}

/* ======================
   Pagina principală
====================== */
export default function Page() {
  const [dark, setDark] = useState(false)

  return (
    <div className={dark ? "dark" : ""}>
      <div
        className={`min-h-screen transition-colors duration-500
        ${dark
          ? "bg-gradient-to-b from-neutral-950 to-neutral-900 text-neutral-100"
          : "bg-gradient-to-b from-background to-secondary/20 text-foreground"}
        flex flex-col`}
      >
        {/* HEADER – switch (SAFE pe mobile) */}
        <header className="w-full flex justify-center sm:justify-end p-4 sm:p-6">
          <button
            onClick={() => setDark(!dark)}
            className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm
              hover:bg-muted transition"
          >
            {dark ? <Moon size={16} /> : <Sun size={16} />}
            {dark ? "Dark" : "Light"}
          </button>
        </header>

        {/* CONTINUT */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="mx-auto max-w-2xl text-center space-y-8">
            <FloatingVerse />

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                Jurnal de Rugăciune
              </h1>

              <p className="text-xl md:text-2xl leading-relaxed opacity-80">
                Înregistrează-ți experiențele cu Dumnezeu, adaugă cereri de
                rugăciune și primește versete biblice zilnice
              </p>
            </div>

            {/* BUTOANE */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-lg">
                <Link href="/auth/sign-up">Creează cont</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg bg-transparent"
              >
                <Link href="/auth/login">Autentificare</Link>
              </Button>
            </div>

            {/* FEATURES */}
            <div className="pt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card */}
              <Feature
                icon={BookOpen}
                color="text-blue-500"
                title="Jurnal zilnic"
                text="Notează-ți gândurile, trăirile și întâlnirile tale zilnice cu Dumnezeu."
              />

              <Feature
                icon={HandHeart}
                color="text-emerald-500"
                title="Cereri de rugăciune"
                text="Păstrează o evidență a rugăciunilor tale și urmărește răspunsurile primite."
              />

              <Feature
                icon={AlarmClock}
                color="text-amber-500"
                title="Memento rugăciune"
                text="Primește amintiri blânde care te ajută să-ți faci timp zilnic pentru rugăciune."
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

/* ======================
   Componentă Feature
====================== */
function Feature({
  icon: Icon,
  title,
  text,
  color,
}: {
  icon: any
  title: string
  text: string
  color: string
}) {
  return (
    <div className="group text-center space-y-3 transition-transform duration-300 hover:-translate-y-1">
      <div
        className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center
        bg-muted ${color} group-hover:scale-110 transition`}
      >
        <Icon size={28} />
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm opacity-80">{text}</p>
    </div>
  )
}
