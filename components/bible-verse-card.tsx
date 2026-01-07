"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

const prayerVerses = [
  {
    text: "Rugați-vă neîncetat.",
    reference: "1 Tesaloniceni 5:17",
  },
  {
    text: "Nu vă îngrijorați de nimic, ci în orice împrejurare, prin rugăciune și cerere, cu mulțumire, să fie făcute cunoscute cererile voastre înaintea lui Dumnezeu.",
    reference: "Filipeni 4:6",
  },
  {
    text: "Căci oriunde sunt doi sau trei adunați în Numele Meu, sunt și Eu în mijlocul lor.",
    reference: "Matei 18:20",
  },
  {
    text: "Rugăciunea omului neprihănit lucrează cu putere.",
    reference: "Iacov 5:16",
  },
  {
    text: "Și orice veți cere în rugăciune, cu credință, veți primi.",
    reference: "Matei 21:22",
  },
  {
    text: "Domnul este aproape de toți cei ce Îl cheamă, de toți cei ce Îl cheamă cu adevărat.",
    reference: "Psalmul 145:18",
  },
  {
    text: "Aruncați asupra Lui toată îngrijorarea voastră, căci El Însuși îngrijește de voi.",
    reference: "1 Petru 5:7",
  },
  {
    text: "Cereți, și vi se va da; căutați, și veți afla; bateți, și vi se va deschide.",
    reference: "Matei 7:7",
  },
]

export function BibleVerseCard() {
  const [verse, setVerse] = useState(prayerVerses[0])

  useEffect(() => {
    const today = new Date().getDate()
    const verseIndex = today % prayerVerses.length
    setVerse(prayerVerses[verseIndex])
  }, [])

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
      <CardContent className="p-6">
        <div className="space-y-3">
          <p className="text-lg leading-relaxed text-balance italic">"{verse.text}"</p>
          <p className="text-sm text-muted-foreground font-medium">— {verse.reference}</p>
        </div>
      </CardContent>
    </Card>
  )
}
