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
import { Badge } from "@/components/ui/badge"
import { Plus, Check, Share2, Trash2, Tag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"

type PrayerRequest = {
  id: string
  title: string
  description: string | null
  status: "in_progress" | "answered"
  labels: string[]
  is_shared: boolean
  created_at: string
  answered_at: string | null
}

export function PrayersTab() {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([])
  const [sharedPrayers, setSharedPrayers] = useState<PrayerRequest[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [labels, setLabels] = useState("")
  const [isShared, setIsShared] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<"all" | "in_progress" | "answered">("all")
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    loadPrayers()
    loadSharedPrayers()
  }, [])

  const loadPrayers = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from("prayer_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca rugăciunile",
        variant: "destructive",
      })
      return
    }

    setPrayers(data || [])
  }

  const loadSharedPrayers = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from("prayer_requests")
      .select("*")
      .eq("is_shared", true)
      .neq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (!error) {
      setSharedPrayers(data || [])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const labelsArray = labels
      .split(",")
      .map((l) => l.trim())
      .filter((l) => l.length > 0)

    const { error } = await supabase.from("prayer_requests").insert({
      user_id: user.id,
      title,
      description: description || null,
      labels: labelsArray,
      is_shared: isShared,
    })

    if (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut adăuga cererea de rugăciune",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Succes",
        description: "Cererea de rugăciune a fost adăugată",
      })
      setTitle("")
      setDescription("")
      setLabels("")
      setIsShared(false)
      setIsOpen(false)
      loadPrayers()
      if (isShared) loadSharedPrayers()
    }

    setIsLoading(false)
  }

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "in_progress" ? "answered" : "in_progress"
    const { error } = await supabase
      .from("prayer_requests")
      .update({
        status: newStatus,
        answered_at: newStatus === "answered" ? new Date().toISOString() : null,
      })
      .eq("id", id)

    if (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza statusul",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Succes",
        description: newStatus === "answered" ? "Rugăciune marcată ca răspunsă!" : "Rugăciune în lucru",
      })
      loadPrayers()
    }
  }

  const toggleShare = async (id: string, currentShared: boolean) => {
    const { error } = await supabase.from("prayer_requests").update({ is_shared: !currentShared }).eq("id", id)

    if (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza partajarea",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Succes",
        description: !currentShared ? "Rugăciune partajată!" : "Rugăciune privată",
      })
      loadPrayers()
      loadSharedPrayers()
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("prayer_requests").delete().eq("id", id)

    if (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge cererea",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Succes",
        description: "Cererea a fost ștearsă",
      })
      loadPrayers()
    }
  }

  const filteredPrayers = prayers.filter((prayer) => {
    if (filter === "all") return true
    return prayer.status === filter
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Rugăciunile mele</h2>
          <p className="text-muted-foreground">Ține evidența cererilor tale de rugăciune</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adaugă rugăciune
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Cerere nouă de rugăciune</DialogTitle>
              <DialogDescription>Adaugă o nouă cerere în lista ta de rugăciuni</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prayer-title">Titlu</Label>
                <Input
                  id="prayer-title"
                  placeholder="Ex: Vindecare pentru mama"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prayer-description">Descriere (opțional)</Label>
                <Textarea
                  id="prayer-description"
                  placeholder="Detalii despre cererea de rugăciune..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prayer-labels">
                  <Tag className="h-4 w-4 inline mr-2" />
                  Etichete (separate prin virgulă)
                </Label>
                <Input
                  id="prayer-labels"
                  placeholder="Ex: sănătate, familie, serviciu"
                  value={labels}
                  onChange={(e) => setLabels(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="prayer-shared" checked={isShared} onCheckedChange={setIsShared} />
                <Label htmlFor="prayer-shared" className="cursor-pointer">
                  Partajează această rugăciune cu alții
                </Label>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Se adaugă..." : "Adaugă rugăciune"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
          Toate
        </Button>
        <Button
          variant={filter === "in_progress" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("in_progress")}
        >
          În lucru
        </Button>
        <Button variant={filter === "answered" ? "default" : "outline"} size="sm" onClick={() => setFilter("answered")}>
          Răspunse
        </Button>
      </div>

      {/* My Prayers */}
      <div className="space-y-4">
        {filteredPrayers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                {filter === "all"
                  ? "Nu ai încă cereri de rugăciune. Adaugă prima ta cerere!"
                  : `Nu ai cereri ${filter === "answered" ? "răspunse" : "în lucru"}.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPrayers.map((prayer) => (
            <Card key={prayer.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <CardTitle className="text-lg">{prayer.title}</CardTitle>
                    <CardDescription>
                      {new Date(prayer.created_at).toLocaleDateString("ro-RO", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      {prayer.answered_at && (
                        <span className="ml-2">
                          • Răspunsă la{" "}
                          {new Date(prayer.answered_at).toLocaleDateString("ro-RO", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant={prayer.status === "answered" ? "default" : "secondary"}>
                    {prayer.status === "answered" ? "Răspunsă" : "În lucru"}
                  </Badge>
                </div>
              </CardHeader>
              {(prayer.description || prayer.labels.length > 0) && (
                <CardContent className="space-y-3">
                  {prayer.description && <p className="text-sm text-muted-foreground">{prayer.description}</p>}
                  {prayer.labels.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {prayer.labels.map((label, idx) => (
                        <Badge key={idx} variant="outline">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      size="sm"
                      variant={prayer.status === "answered" ? "outline" : "default"}
                      onClick={() => toggleStatus(prayer.id, prayer.status)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      {prayer.status === "answered" ? "Marchează în lucru" : "Marchează ca răspunsă"}
                    </Button>
                    <Button
                      size="sm"
                      variant={prayer.is_shared ? "default" : "outline"}
                      onClick={() => toggleShare(prayer.id, prayer.is_shared)}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      {prayer.is_shared ? "Privată" : "Partajează"}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(prayer.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Șterge
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Shared Prayers Section */}
      {sharedPrayers.length > 0 && (
        <div className="space-y-4 pt-8 border-t">
          <div>
            <h3 className="text-xl font-semibold">Rugăciuni partajate</h3>
            <p className="text-muted-foreground text-sm">Rugați-vă pentru cererile altora</p>
          </div>
          <div className="space-y-4">
            {sharedPrayers.map((prayer) => (
              <Card key={prayer.id} className="bg-accent/5">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <CardTitle className="text-lg">{prayer.title}</CardTitle>
                      <CardDescription>
                        {new Date(prayer.created_at).toLocaleDateString("ro-RO", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardDescription>
                    </div>
                    <Badge variant={prayer.status === "answered" ? "default" : "secondary"}>
                      {prayer.status === "answered" ? "Răspunsă" : "În lucru"}
                    </Badge>
                  </div>
                </CardHeader>
                {(prayer.description || prayer.labels.length > 0) && (
                  <CardContent className="space-y-3">
                    {prayer.description && <p className="text-sm text-muted-foreground">{prayer.description}</p>}
                    {prayer.labels.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {prayer.labels.map((label, idx) => (
                          <Badge key={idx} variant="outline">
                            {label}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
