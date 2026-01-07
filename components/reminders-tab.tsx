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
import { Plus, Trash2, Bell } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"

type Reminder = {
  id: string
  time: string
  enabled: boolean
  created_at: string
}

export function RemindersTab() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [time, setTime] = useState("09:00")
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    loadReminders()
  }, [])

  const loadReminders = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from("prayer_reminders")
      .select("*")
      .eq("user_id", user.id)
      .order("time", { ascending: true })

    if (error) {
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca mementourile",
        variant: "destructive",
      })
      return
    }

    setReminders(data || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from("prayer_reminders").insert({
      user_id: user.id,
      time,
      enabled: true,
    })

    if (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut adăuga mementoul",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Succes",
        description: "Mementoul a fost adăugat",
      })
      setTime("09:00")
      setIsOpen(false)
      loadReminders()
    }

    setIsLoading(false)
  }

  const toggleEnabled = async (id: string, currentEnabled: boolean) => {
    const { error } = await supabase.from("prayer_reminders").update({ enabled: !currentEnabled }).eq("id", id)

    if (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza mementoul",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Succes",
        description: !currentEnabled ? "Memento activat" : "Memento dezactivat",
      })
      loadReminders()
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("prayer_reminders").delete().eq("id", id)

    if (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge mementoul",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Succes",
        description: "Mementoul a fost șters",
      })
      loadReminders()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Mementouri pentru rugăciune</h2>
          <p className="text-muted-foreground">Setează notificări pentru momentele de rugăciune</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adaugă memento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Memento nou</DialogTitle>
              <DialogDescription>Alege ora la care vrei să primești amintirea de a te ruga</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="time">Ora</Label>
                <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Se adaugă..." : "Adaugă memento"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reminders.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Nu ai mementouri setate. Adaugă primul tău memento pentru rugăciune!
              </p>
            </CardContent>
          </Card>
        ) : (
          reminders.map((reminder) => (
            <Card key={reminder.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-2xl">{reminder.time.substring(0, 5)}</CardTitle>
                      <CardDescription>{reminder.enabled ? "Activat" : "Dezactivat"}</CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={reminder.enabled}
                    onCheckedChange={() => toggleEnabled(reminder.id, reminder.enabled)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(reminder.id)} className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Șterge
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
