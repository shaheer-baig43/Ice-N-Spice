"use client"

import { Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">
          Admin <span className="text-primary">Settings</span>
        </h1>
        <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest opacity-50">
          Configure your IceNSpice admin panel
        </p>
      </div>

      <Card className="glass-card border-none rounded-[2rem]">
        <CardHeader className="p-8">
          <CardTitle className="flex items-center gap-3 text-2xl font-black uppercase tracking-tighter italic">
            <Settings className="h-6 w-6 text-primary" />
            General Settings
          </CardTitle>
          <CardDescription className="font-bold text-[10px] uppercase tracking-widest opacity-50">
            Restaurant configuration and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground opacity-30 space-y-4">
            <Settings className="h-16 w-16" />
            <p className="font-black text-xl tracking-tighter uppercase italic">Coming Soon</p>
            <p className="text-xs font-bold uppercase tracking-widest">
              Settings panel is under construction
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
