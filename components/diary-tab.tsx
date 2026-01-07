"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, ImageIcon, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type DiaryEntry = {
  id: string
  title: string
  content: string
  photo_url: string | null
  created_at: string
}

export function DiaryTab() {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from("diary_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca intrările din jurnal",
        variant: "destructive",
      })
      return
    }

    setEntries(data || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from("diary_entries").insert({
      user_id: user.id,
      title,
      content,
      photo_url: photoUrl || null,
    })

    if (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut adăuga intrarea în jurnal",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Succes",
        description: "Intrarea a fost adăugată în jurnal",
      })
      setTitle("")
      setContent("")
      setPhotoUrl("")
      setIsOpen(false)
      loadEntries()
    }

    setIsLoading(false)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("diary_entries").delete().eq("id", id)

    if (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge intrarea",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Succes",
        description: "Intrarea a fost ștearsă",
      })
      loadEntries()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Jurnalul meu spiritual</h2>
          <p className="text-muted-foreground">Documentează experiențele tale cu Dumnezeu</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adaugă intrare
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Intrare nouă în jurnal</DialogTitle>
              <DialogDescription>Adaugă o nouă experiență spirituală în jurnalul tău</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titlu</Label>
                <Input
                  id="title"
                  placeholder="Ex: Răspuns la rugăciune"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Conținut</Label>
                <Textarea
                  id="content"
                  placeholder="Descrie experiența ta..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo">
                  <ImageIcon className="h-4 w-4 inline mr-2" />
                  URL fotografie (opțional)
                </Label>
                <Input
                  id="photo"
                  type="url"
                  placeholder="https://exemplu.ro/imagine.jpg"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Se adaugă..." : "Adaugă în jurnal"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {entries.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                Nu ai încă intrări în jurnal. Adaugă prima ta experiență spirituală!
              </p>
            </CardContent>
          </Card>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id} className="flex flex-col">
              {entry.photo_url && (
                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                  <img
                    src={entry.photo_url || "/placeholder.svg"}
                    alt={entry.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{entry.title}</CardTitle>
                <CardDescription>
                  {new Date(entry.created_at).toLocaleDateString("ro-RO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-4">{entry.content}</p>
              </CardContent>
              <div className="p-4 pt-0">
                <Button variant="destructive" size="sm" onClick={() => handleDelete(entry.id)} className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Șterge
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
