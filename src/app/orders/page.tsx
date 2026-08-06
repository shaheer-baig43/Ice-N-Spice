"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Order, OrderStatus } from "@/types"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Package, ChevronRight, Clock, CheckCircle, ChefHat, Bike, XCircle, LucideIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const STATUS_CONFIG: Record<OrderStatus, { label: string, color: string, icon: LucideIcon }> = {
  pending: { label: "Pending", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20", icon: Clock },
  confirmed: { label: "Confirmed", color: "text-blue-500 bg-blue-500/10 border-blue-500/20", icon: CheckCircle },
  preparing: { label: "Preparing", color: "text-orange-500 bg-orange-500/10 border-orange-500/20", icon: ChefHat },
  out_for_delivery: { label: "Out for Delivery", color: "text-purple-500 bg-purple-500/10 border-purple-500/20", icon: Bike },
  delivered: { label: "Delivered", color: "text-green-500 bg-green-500/10 border-green-500/20", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "text-red-500 bg-red-500/10 border-red-500/20", icon: XCircle }
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchOrders = async (userId: string) => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_id", userId)
      .order("created_at", { ascending: false })
    
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth?redirect=/orders")
        return
      }
      fetchOrders(user.id)

      channel = supabase
        .channel(`my-orders-${user.id}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "orders", filter: `customer_id=eq.${user.id}` },
          () => {
            if (user) fetchOrders(user.id)
          }
        )
        .subscribe()
    })

    // Cleanup runs correctly — channel reference captured in outer scope
    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [router])

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 max-w-4xl">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase tracking-tighter">My <span className="text-primary">Orders</span></h1>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest opacity-50">Keep track of your current and past treats</p>
        </div>

        {orders.length > 0 ? (
          <div className="grid gap-6">
            {orders.map((order) => {
              const status = STATUS_CONFIG[order.status]
              const StatusIcon = status.icon
              
              return (
                <Card key={order.id} className="overflow-hidden hover:border-primary/50 transition-colors border-none glass-card rounded-[2rem]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 sm:p-8">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest opacity-50">Reference</span>
                      <span className="font-mono text-xs font-black uppercase text-primary tracking-tighter">#{order.id.slice(0, 8)}</span>
                    </div>
                    <Badge className={cn("rounded-full px-4 py-1.5 font-black border-none text-[10px] uppercase tracking-widest shadow-lg", status.color)}>
                      <StatusIcon className="h-3 w-3 mr-2" />
                      {status.label}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-6 sm:p-8 pt-0">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-50">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                        <p className="font-black text-3xl italic">Rs. {order.total_amount}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-50 mb-1">Method</p>
                        <Badge variant="outline" className="rounded-lg font-black uppercase text-[9px] tracking-tighter px-3 py-1 border-white/10 bg-white/5">
                          {order.payment_method}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-white/5 p-6 sm:p-8 flex justify-end">
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="ghost" className="rounded-xl font-black uppercase tracking-widest text-[10px] group h-12 px-6 hover:bg-primary hover:text-black transition-all">
                        Live Tracking <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-8 glass-card rounded-[3rem]">
            <div className="h-32 w-32 rounded-full bg-muted/20 flex items-center justify-center text-muted-foreground">
              <Package className="h-12 w-12 opacity-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-black tracking-tighter uppercase italic">NO ORDERS YET</h3>
              <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest opacity-50">Your delicious journey starts here!</p>
            </div>
            <Link href="/menu">
              <Button size="lg" className="rounded-[1.5rem] px-12 font-black h-16 shadow-2xl golden-gradient text-black hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">
                Start Ordering
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
