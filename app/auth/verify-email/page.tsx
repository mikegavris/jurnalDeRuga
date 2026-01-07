import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Verifică email-ul</CardTitle>
            <CardDescription>
              Am trimis un link de verificare la adresa ta de email. Te rugăm să verifici inbox-ul și să apeși pe link
              pentru a-ți activa contul.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Dacă nu găsești email-ul, verifică și folderul de spam.</p>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/auth/login">Înapoi la autentificare</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
