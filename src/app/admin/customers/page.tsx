"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Profile } from "@/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Mail, Phone, Calendar, User, Search, RefreshCcw, Users } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false })
        
        if (error) throw error
        setCustomers(data || [])
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [])

  const handleRefresh = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (error) throw error
      setCustomers(data || [])
      toast.success("Customer list updated")
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(c => 
    c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Customer <span className="text-primary">Directory</span></h1>
          <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest opacity-50">Manage your Karachi fan base</p>
        </div>
        <Button variant="outline" className="rounded-2xl gap-2 border-primary/20 hover:bg-primary/5 px-6" onClick={handleRefresh} disabled={loading}>
          <RefreshCcw className={cn("h-4 w-4", loading && "animate-spin")} />
          Reload List
        </Button>
      </div>

      <div className="bg-card p-2 rounded-[1.5rem] border flex items-center gap-4 max-w-2xl">
        <div className="bg-white/5 p-3 rounded-2xl ml-1">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input 
          placeholder="Search by name, email or phone..." 
          className="border-none bg-transparent focus-visible:ring-0 text-lg placeholder:opacity-30"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-[2.5rem] border-none bg-card/40 backdrop-blur-md overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="font-black text-[10px] uppercase tracking-widest p-6">Identity</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Contact Intel</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Privileges</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest p-6">Member Since</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4} className="h-64 text-center">
                  <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary opacity-20" />
                </TableCell>
              </TableRow>
            ) : filteredCustomers.map((customer) => (
              <TableRow key={customer.id} className="group border-b border-white/5 hover:bg-white/5 transition-colors cursor-default">
                <TableCell className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl shadow-inner border border-primary/10">
                      {customer.full_name?.charAt(0) || <User className="h-6 w-6" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-sm uppercase tracking-tight">{customer.full_name || "Guest User"}</span>
                      <span className="font-mono text-[9px] text-muted-foreground opacity-50 uppercase">{customer.id}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                      <Mail className="h-3 w-3 text-primary" /> {customer.email}
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                        <Phone className="h-3 w-3 text-primary" /> {customer.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={customer.role === "admin" ? "default" : "secondary"} className={cn(
                    "capitalize font-black text-[10px] px-3 py-1 rounded-lg",
                    customer.role === "admin" ? "golden-gradient text-black" : ""
                  )}>
                    {customer.role}
                  </Badge>
                </TableCell>
                <TableCell className="p-6">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-muted-foreground tracking-tighter">
                    <Calendar className="h-3 w-3" />
                    {new Date(customer.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredCustomers.length === 0 && !loading && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4} className="h-64 text-center">
                   <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground opacity-20">
                    <Users className="h-16 w-16" />
                    <p className="font-black text-xl tracking-tighter uppercase">No customers found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
