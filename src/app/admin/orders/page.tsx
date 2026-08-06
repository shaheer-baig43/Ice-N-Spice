"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { Order, OrderStatus } from "@/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, RefreshCcw, Loader2, Clock, CheckCircle, ChefHat, Bike, Package, XCircle, Search, Filter, LucideIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const STATUS_CONFIG: Record<OrderStatus, { label: string, color: string, icon: LucideIcon }> = {
  pending: { label: "Pending", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20", icon: Clock },
  confirmed: { label: "Confirmed", color: "text-blue-500 bg-blue-500/10 border-blue-500/20", icon: CheckCircle },
  preparing: { label: "Preparing", color: "text-orange-500 bg-orange-500/10 border-orange-500/20", icon: ChefHat },
  out_for_delivery: { label: "Out for Delivery", color: "text-purple-500 bg-purple-500/10 border-purple-500/20", icon: Bike },
  delivered: { label: "Delivered", color: "text-green-500 bg-green-500/10 border-green-500/20", icon: Package },
  cancelled: { label: "Cancelled", color: "text-red-500 bg-red-500/10 border-red-500/20", icon: XCircle }
}

const STATUS_OPTIONS: OrderStatus[] = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter)
      }

      const { data, error } = await query
      
      if (error) throw error
      setOrders(data || [])
    } catch (error: unknown) {
      const err = error as { message?: string; details?: string; hint?: string; code?: string }
      console.error("Error fetching admin orders data:", {
        message: err.message,
        details: err.details,
        hint: err.hint,
        code: err.code
      })
      toast.error("Failed to load orders: " + (err.message || "Unknown error"))
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchOrders()
    
    const channel = supabase
      .channel("admin-orders-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchOrders])

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    // Optimistic Update: Update local state immediately
    const previousOrders = [...orders]
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))

    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId)

      if (error) throw error
      
      toast.success(`Order status updated to ${status}`)
    } catch (error: unknown) {
      // Rollback on error
      setOrders(previousOrders)
      const err = error as { message?: string }
      console.error("Error updating order status:", error)
      toast.error("Failed to update status: " + (err.message || "Unknown error"))
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.delivery_address.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.delivery_address.phone?.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Additional local filtering to handle optimistic updates before re-fetch
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Order <span className="text-primary">Dispatch</span></h1>
          <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest opacity-50">Manage Karachi&apos;s delivery queue</p>
        </div>
        <Button variant="outline" className="rounded-2xl gap-2 border-primary/20 hover:bg-primary/5 px-6" onClick={fetchOrders} disabled={loading}>
          <RefreshCcw className={cn("h-4 w-4", loading && "animate-spin")} />
          Sync Feed
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="bg-card p-2 rounded-[1.5rem] border flex items-center gap-4 flex-grow w-full">
          <div className="bg-white/5 p-3 rounded-2xl ml-1">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input 
            placeholder="Search by ID, Customer Name or Phone..." 
            className="border-none bg-transparent focus-visible:ring-0 text-lg placeholder:opacity-30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 bg-card p-2 rounded-[1.5rem] border shrink-0 w-full lg:w-auto">
           <div className="bg-white/5 p-3 rounded-2xl ml-1 shrink-0">
            <Filter className="h-5 w-5 text-muted-foreground" />
          </div>
          <ScrollArea className="w-full whitespace-nowrap px-2">
            <div className="flex gap-2">
               <Button 
                variant={statusFilter === "all" ? "default" : "ghost"} 
                size="sm" 
                className="rounded-xl text-[10px] font-black uppercase tracking-tighter h-10 px-4"
                onClick={() => setStatusFilter("all")}
               >
                 All Orders
               </Button>
               {STATUS_OPTIONS.map((opt) => (
                 <Button 
                  key={opt}
                  variant={statusFilter === opt ? "default" : "ghost"} 
                  size="sm" 
                  className={cn("rounded-xl text-[10px] font-black uppercase tracking-tighter h-10 px-4", statusFilter === opt && STATUS_CONFIG[opt].color)}
                  onClick={() => setStatusFilter(opt)}
                 >
                   {opt.replace(/_/g, " ")}
                 </Button>
               ))}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
        </div>
      </div>

      <div className="rounded-[2.5rem] border-none bg-card/40 backdrop-blur-md overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="font-black text-[10px] uppercase tracking-widest p-6">Order Info</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Customer</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Total</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Live Status</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest">Payment</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-right p-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="h-64 text-center">
                  <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary opacity-20" />
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredOrders.map((order) => {
                  const status = STATUS_CONFIG[order.status]
                  const StatusIcon = status.icon
                  return (
                    <motion.tr 
                      key={order.id} 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group border-b border-white/5 hover:bg-white/5 transition-colors cursor-default"
                    >
                      <TableCell className="p-6">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-black uppercase text-primary tracking-tighter">#{order.id.slice(0, 8)}</span>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold mt-1">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-black text-sm uppercase tracking-tight">{order.delivery_address.fullName || "Guest User"}</span>
                          <span className="text-[10px] text-muted-foreground font-bold tracking-tighter">{order.delivery_address.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-black text-lg italic text-primary">Rs. {order.total_amount}</span>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={order.status} 
                          onValueChange={(val) => updateOrderStatus(order.id, val as OrderStatus)}
                        >
                          <SelectTrigger className={cn("w-[170px] h-11 text-xs font-black rounded-xl uppercase tracking-tighter border-2 shadow-lg", status.color, "border-current/10")}>
                            <div className="flex items-center gap-2">
                              <StatusIcon className="h-4 w-4" />
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent className="glass-card border-white/10 rounded-2xl">
                            {STATUS_OPTIONS.map((opt) => (
                              <SelectItem key={opt} value={opt} className="capitalize text-[10px] font-black tracking-widest py-3">
                                {opt.replace(/_/g, " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "capitalize text-[10px] font-black px-4 py-1.5 rounded-full border-2",
                          order.payment_status === "paid" ? "text-green-500 border-green-500/10 bg-green-500/5" : "text-yellow-500 border-yellow-500/10 bg-yellow-500/5"
                        )}>
                          {order.payment_method.toUpperCase()} • {order.payment_status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right p-6">
                        <div className="flex justify-end gap-2">
                          <Link href={`/orders/${order.id}`}>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary hover:text-black transition-all" title="View order details">
                              <Eye className="h-5 w-5" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            )}
            {!loading && filteredOrders.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="h-96 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                    <div className="h-24 w-24 rounded-full bg-muted/20 flex items-center justify-center">
                      <Package className="h-10 w-10 opacity-10" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-black text-xl tracking-tighter uppercase italic">QUEUE EMPTY</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">No orders found matching this filter</p>
                    </div>
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
