"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { BookOpen, HandHeart, AlarmClock } from "lucide-react"

/* ======================
   Versete biblice
====================== */
type Verse = {
  text: string
  ref: string
}

const verses: Verse[] = [
  {
    text: "Rugați-vă neîncetat.",
    ref: "1 Tesaloniceni 5:17",
  },
  {
    text: "Apropiați-vă de Dumnezeu și El Se va apropia de voi.",
    ref: "Iacov 4:8",
  },
  {
    text: "Orice veți cere în rugăciune, cu credință, veți primi.",
    ref: "Matei 21:22",
  },
  {
    text: "Domnul este aproape de toți cei ce-L cheamă.",
    ref: "Psalmul 145:18",
  },
]


/* ======================
   Verset animat
====================== */
function FloatingVerse() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const showDuration = 10000 // 30 sec
    const fadeDuration = 1000

    const interval = setInterval(() => {
      setVisible(false)

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % verses.length)
        setVisible(true)
      }, fadeDuration)
    }, showDuration)
const verse = verses[index]

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex justify-center px-4">
      <div
        className={`max-w-xs sm:max-w-none text-center transition-all duration-1000
        ${visible ? "opacity-100 blur-0 translate-y-0" : "opacity-0 blur-sm -translate-y-1"}`}
      >
        {/* Text verset */}
        <p className="italic text-base leading-relaxed sm:text-lg md:text-xl">
  „{verses[index].text}”
</p>




        {/* Referință – mereu pe rând separat, BOLD */}
        <p className="mt-1 text-sm italic font-semibold opacity-90">
          – {verses[index].ref}
        </p>
      </div>
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
        flex flex-col items-center justify-center p-6`}
      >
        {/* Switch Dark / Light */}
        <div className="w-full flex justify-center sm:justify-end mb-6 sm:absolute sm:top-6 sm:right-6">
          <button
            onClick={() => setDark(!dark)}
            className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm
            backdrop-blur hover:bg-muted transition"
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
              și primește zilnic versete biblice pentru a-ți întări credința.
            </p>
          </div>

          {/* Butoane */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="text-lg">
              <Link href="/auth/sign-up">Creează cont</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg bg-transparent">
              <Link href="/auth/login">Autentificare</Link>
            </Button>
          </div>

          {/* FEATURES CLICKABILE */}
          <div className="pt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Jurnal */}
            <Link
              href="/jurnal"
              className="group rounded-2xl border p-6 transition
              hover:-translate-y-1 hover:shadow-xl
              hover:bg-secondary/20 dark:hover:bg-white/5"
            >
              <div className="mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center
              bg-blue-500/10 text-blue-600 dark:text-blue-400
              group-hover:scale-110 transition">
                <BookOpen size={28} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Jurnal zilnic</h3>
              <p className="text-sm opacity-80">
                Notează-ți gândurile, trăirile și întâlnirile tale zilnice cu Dumnezeu, însoțite de texte și imagini.
              </p>
            </Link>

            {/* Cereri */}
            <Link
              href="/rugaciuni"
              className="group rounded-2xl border p-6 transition
              hover:-translate-y-1 hover:shadow-xl
              hover:bg-secondary/20 dark:hover:bg-white/5"
            >
              <div className="mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center
              bg-emerald-500/10 text-emerald-600 dark:text-emerald-400
              group-hover:scale-110 transition">
                <HandHeart size={28} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Cereri de rugăciune</h3>
              <p className="text-sm opacity-80">
                Păstrează o evidență a rugăciunilor tale și urmărește modul în care Dumnezeu răspunde.
              </p>
            </Link>

            {/* Memento */}
            <Link
              href="/remindere"
              className="group rounded-2xl border p-6 transition
              hover:-translate-y-1 hover:shadow-xl
              hover:bg-secondary/20 dark:hover:bg-white/5"
            >
              <div className="mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center
              bg-amber-500/10 text-amber-600 dark:text-amber-400
              group-hover:scale-110 transition">
                <AlarmClock size={28} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Memento rugăciune</h3>
              <p className="text-sm opacity-80">
                Primește notificări blânde care te ajută să-ți faci timp zilnic pentru rugăciune.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
