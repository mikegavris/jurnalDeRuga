import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-6">
      <div className="mx-auto max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground md:text-6xl">
            Jurnal de Rugăciune
          </h1>
          <p className="text-pretty text-xl text-muted-foreground md:text-2xl leading-relaxed">
            Înregistrează-ți experiențele cu Dumnezeu, adaugă cereri de rugăciune și primește versete biblice zilnice
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="text-lg">
            <Link href="/auth/sign-up">Creează cont</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg bg-transparent">
            <Link href="/auth/login">Autentificare</Link>
          </Button>
        </div>
<div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
  <div className="space-y-3 flex flex-col items-center">
    <div className="text-4xl">📖</div>
    <h3 className="font-semibold text-lg">Jurnal zilnic</h3>
    <p className="text-sm text-muted-foreground max-w-xs">
      Documentează experiențele tale spirituale zilnice cu text și fotografii
    </p>
  </div>

  <div className="space-y-3 flex flex-col items-center">
    <div className="text-4xl">🙏</div>
    <h3 className="font-semibold text-lg">Cereri de rugăciune</h3>
    <p className="text-sm text-muted-foreground max-w-xs">
      Ține evidența rugăciunilor tale și marchează-le ca răspunse
    </p>
  </div>

  <div className="space-y-3 flex flex-col items-center">
    <div className="text-4xl">⏰</div>
    <h3 className="font-semibold text-lg">Memento rugăciune</h3>
    <p className="text-sm text-muted-foreground max-w-xs">
      Primește amintiri pentru momentele tale de rugăciune
    </p>
  </div>
</div>
</div>
    </div>
  )
}
