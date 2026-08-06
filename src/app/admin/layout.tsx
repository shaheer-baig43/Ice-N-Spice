"use client"

import Link from "next/link"
import { LayoutDashboard, Utensils, ShoppingCart, Users, Settings, LogOut, ShieldAlert, Loader2 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Menu Items", href: "/admin/menu", icon: Utensils },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAdmin, loading, user } = useAuth()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success("Logged out from admin panel")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-background text-center px-4">
        <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-black">Restricted Access</h1>
        <p className="text-muted-foreground max-w-sm">
          This area is reserved for the IceNSpice administration team. 
          Please contact the system manager if you believe this is an error.
        </p>
        <Button onClick={() => router.push("/")} className="mt-2 rounded-full px-8">
          Back to Home
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tighter text-primary">IceNSpice</span>
            <Badge variant="outline" className="text-[10px]">ADMIN</Badge>
          </Link>
        </div>
        <nav className="flex-grow px-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 px-4",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.name}
                </Button>
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-auto p-8">
        {children}
      </main>
    </div>
  )
}
