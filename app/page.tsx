"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { BookOpen, HandHeart, AlarmClock } from "lucide-react"

/* ======================
   Versete biblice
====================== */
const verses = [
  "„Rugați-vă neîncetat.” – 1 Tesaloniceni 5:17",
  "„Apropiați-vă de Dumnezeu și El Se va apropia de voi.” – Iacov 4:8",
  "„Orice veți cere în rugăciune, cu credință, veți primi.” – Matei 21:22",
  "„Domnul este aproape de toți cei ce-L cheamă.” – Psalmul 145:18",
  "„Strigă către Mine și-ți voi răspunde.” – Ieremia 33:3",
]

/* ======================
   Componenta verset animat
====================== */
function FloatingVerse() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const showDuration = 15000
    const fadeDuration = 1000

    const interval = setInterval(() => {
      setVisible(false)

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % verses.length)
        setVisible(true)
      }, fadeDuration)
    }, showDuration)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-10 flex items-center justify-center">
      <p
        className={`text-sm md:text-base italic transition-all duration-1000
        ${visible ? "opacity-100 blur-0 translate-y-0" : "opacity-0 blur-sm -translate-y-1"}`}
      >
        {verses[index]}
      </p>
    </div>
  )
}

/* ======================
   Card Feature
====================== */
function FeatureCard({
  icon,
  title,
  text,
  color,
}: {
  icon: React.ReactNode
  title: string
  text: string
  color: "blue" | "amber" | "rose"
}) {
  const colors = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  }

  return (
    <div
      className="
        group rounded-2xl border border-border/60 bg-background/60 backdrop-blur
        p-6 text-center transition-all duration-300
        hover:-translate-y-2 hover:shadow-xl
      "
    >
      <div
        className={`
          mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl
          transition-all duration-300
          ${colors[color]}
          group-hover:scale-110 group-hover:shadow-md
        `}
      >
        {icon}
      </div>

      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm opacity-80">{text}</p>
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
        className={`relative min-h-screen transition-colors duration-500
        ${dark
          ? "bg-gradient-to-b from-neutral-950 to-neutral-900 text-neutral-100"
          : "bg-gradient-to-b from-background to-secondary/20 text-foreground"}
        flex flex-col items-center justify-center px-6 py-10`}
      >
        {/* Switch Dark / Light – FIXAT SUS */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setDark(!dark)}
            className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm
              bg-background/80 backdrop-blur hover:bg-muted transition"
          >
            {dark ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>

        <div className="mx-auto max-w-3xl text-center space-y-8">
          {/* Verset */}
          <FloatingVerse />

          {/* Titlu */}
          <div className="space-y-4">
            <h1 className="text-balance text-5xl font-bold tracking-tight md:text-6xl">
              Jurnal de Rugăciune
            </h1>

            <p className="text-pretty text-xl md:text-2xl leading-relaxed opacity-80">
              Înregistrează-ți experiențele cu Dumnezeu, adaugă cereri de rugăciune
              și primește versete biblice zilnice
            </p>
          </div>

          {/* Butoane */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/auth/sign-up">Creează cont</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              <Link href="/auth/login">Autentificare</Link>
            </Button>
          </div>

          {/* Features */}
          <div className="pt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              color="blue"
              icon={<BookOpen className="h-7 w-7" />}
              title="Jurnal zilnic"
              text="Notează-ți gândurile, trăirile și întâlnirile tale zilnice cu Dumnezeu, însoțite de text și imagini."
            />

            <FeatureCard
              color="amber"
              icon={<HandHeart className="h-7 w-7" />}
              title="Cereri de rugăciune"
              text="Păstrează o evidență a rugăciunilor tale și urmărește modul în care Dumnezeu răspunde."
            />

            <FeatureCard
              color="rose"
              icon={<AlarmClock className="h-7 w-7" />}
              title="Memento rugăciune"
              text="Primește notificări blânde care te ajută să-ți faci timp zilnic pentru rugăciune."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
