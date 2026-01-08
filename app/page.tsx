"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

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
    const showDuration = 30000 // 30 sec
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
        <div className="w-full flex justify-center sm:justify-end mb-6 sm:mb-0 sm:absolute sm:top-6 sm:right-6">
  <button
    onClick={() => setDark(!dark)}
    className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm
      hover:bg-muted transition"
  >
    {dark ? "🌙 Dark" : "☀️ Light"}
  </button>
</div>


        <div className="mx-auto max-w-2xl text-center space-y-8">
          {/* Verset */}
          <FloatingVerse />

          {/* Titlu */}
          <div className="space-y-4">
            <h1 className="text-balance text-5xl font-bold tracking-tight md:text-6xl">
              Jurnal de Rugăciune
            </h1>

            <p className="text-pretty text-xl md:text-2xl leading-relaxed opacity-80">
              Înregistrează-ți experiențele cu Dumnezeu, adaugă cereri de rugăciune și primește versete biblice zilnice
            </p>
          </div>

          {/* Butoane */}
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

          {/* Features */}
          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-4xl">📖</div>
              <h3 className="font-semibold text-lg">Jurnal zilnic</h3>
              <p className="text-sm opacity-80">
                Documentează experiențele tale spirituale zilnice cu text și fotografii
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-4xl">🙏</div>
              <h3 className="font-semibold text-lg">Cereri de rugăciune</h3>
              <p className="text-sm opacity-80">
                Ține evidența rugăciunilor tale și marchează-le ca răspunse
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-4xl">⏰</div>
              <h3 className="font-semibold text-lg">Memento rugăciune</h3>
              <p className="text-sm opacity-80">
                Primește amintiri pentru momentele tale de rugăciune
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
