"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Order, OrderStatus, OrderItem } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package, ChefHat, Bike, CheckCircle, Clock, MapPin, Hash, ReceiptText, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const STATUS_CONFIG: Record<OrderStatus, { label: string, icon: LucideIcon, color: string, glow: string, step: number }> = {
  pending: { label: "Pending", icon: Clock, color: "text-yellow-500", glow: "shadow-[0_0_20px_rgba(234,179,8,0.2)]", step: 0 },
  confirmed: { label: "Confirmed", icon: CheckCircle, color: "text-blue-500", glow: "shadow-[0_0_20px_rgba(59,130,246,0.2)]", step: 1 },
  preparing: { label: "Preparing", icon: ChefHat, color: "text-orange-500", glow: "shadow-[0_0_20px_rgba(249,115,22,0.2)]", step: 2 },
  out_for_delivery: { label: "Out for Delivery", icon: Bike, color: "text-purple-500", glow: "shadow-[0_0_20px_rgba(168,85,247,0.2)]", step: 3 },
  delivered: { label: "Delivered", icon: Package, color: "text-green-500", glow: "shadow-[0_0_20px_rgba(34,197,94,0.2)]", step: 4 },
  cancelled: { label: "Cancelled", icon: Hash, color: "text-red-500", glow: "shadow-[0_0_20px_rgba(239,68,68,0.2)]", step: -1 }
}

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params)
  const id = unwrappedParams.id
  
  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single()
      
      const { data: itemsData } = await supabase
        .from("order_items")
        .select("*, menu_item:menu_items(*)")
        .eq("order_id", id)

      setOrder(orderData)
      setItems(itemsData || [])
      setLoading(false)
    }

    fetchOrder()

    const channel = supabase
      .channel(`order-${id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${id}` }, (payload) => {
        setOrder(payload.new as Order)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  )

  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter italic">Order Not Found</h1>
      <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest opacity-50">We couldn&apos;t locate this order in our records.</p>
    </div>
  )

  const currentStatus = STATUS_CONFIG[order.status]
  const steps = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"]

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container px-4 py-12 max-w-5xl space-y-12">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
        >
          <div className="space-y-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 font-black px-4 py-1 rounded-full uppercase tracking-tighter">
              Real-time Status
            </Badge>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic">Order <span className="text-primary tracking-normal">Tracking</span></h1>
            <p className="font-mono text-muted-foreground opacity-60 text-xs">REF: {order.id.toUpperCase()}</p>
          </div>
          <div className={cn("px-8 py-4 rounded-3xl glass-card flex items-center gap-4 border-2 transition-all duration-500", currentStatus.color, "border-current/20", currentStatus.glow)}>
            <currentStatus.icon className="h-8 w-8 animate-pulse" />
            <span className="text-3xl font-black uppercase italic tracking-tighter">{currentStatus.label}</span>
          </div>
        </motion.div>

        {order.status !== "cancelled" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-[3rem] p-12 relative overflow-hidden"
          >
            <div className="relative flex justify-between z-10">
              <div className="absolute top-1/2 left-0 w-full h-1.5 -translate-y-1/2 bg-white/5 -z-10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStatus.step / 4) * 100}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full golden-gradient shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                />
              </div>

              {steps.map((step, index) => {
                const config = STATUS_CONFIG[step as keyof typeof STATUS_CONFIG]
                const Icon = config.icon
                const isActive = index <= currentStatus.step
                const isCurrent = index === currentStatus.step

                return (
                  <div key={step} className="flex flex-col items-center gap-4">
                    <motion.div 
                      initial={false}
                      animate={{ 
                        scale: isCurrent ? 1.25 : isActive ? 1 : 0.9,
                        backgroundColor: isActive ? "#D4AF37" : "transparent"
                      }}
                      className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500",
                        isActive ? "border-primary text-black shadow-xl" : "border-white/10 text-muted-foreground backdrop-blur-sm bg-white/5",
                        isCurrent && "ring-8 ring-primary/20 animate-pulse"
                      )}
                    >
                      <Icon className={cn("h-7 w-7", isCurrent && "animate-bounce")} />
                    </motion.div>
                    <span className={cn(
                      "hidden md:block text-[10px] font-black uppercase tracking-widest",
                      isActive ? "text-primary" : "text-muted-foreground opacity-30"
                    )}>
                      {config.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            <Card className="glass-card border-none rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="flex items-center gap-3 text-2xl font-black uppercase tracking-tighter italic">
                  <ReceiptText className="h-6 w-6 text-primary" /> Item Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 overflow-hidden relative">
                           <Image 
                            src={item.menu_item?.image_url || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop"} 
                            alt={item.menu_item?.name || "Food"} 
                            fill
                            className="object-cover" 
                           />
                        </div>
                        <div>
                          <p className="font-black text-lg group-hover:text-primary transition-colors uppercase tracking-tight">{item.menu_item?.name}</p>
                          <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter opacity-50">Qty: {item.quantity} &times; Rs. {item.unit_price}</p>
                        </div>
                      </div>
                      <span className="font-black text-xl italic">Rs. {item.unit_price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-white/5 space-y-2">
                  <div className="flex justify-between text-muted-foreground font-bold uppercase text-xs tracking-widest opacity-50">
                    <span>Subtotal</span>
                    <span>Rs. {order.total_amount}</span>
                  </div>
                  <div className="flex justify-between text-primary font-black text-4xl pt-2 italic tracking-tighter">
                    <span>Total</span>
                    <span>Rs. {order.total_amount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <Card className="glass-card border-none rounded-[2.5rem]">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="flex items-center gap-3 text-2xl font-black uppercase tracking-tighter italic">
                  <MapPin className="h-6 w-6 text-primary" /> Delivery Intel
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] opacity-50">Customer</h4>
                  <p className="text-xl font-black uppercase tracking-tight">{order.delivery_address.fullName || "Guest User"}</p>
                  <p className="text-sm text-primary font-bold">{order.delivery_address.phone}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] opacity-50">Destination</h4>
                  <p className="text-xl font-black uppercase tracking-tight leading-tight">{order.delivery_address.street}</p>
                  <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">{order.delivery_address.area}, Karachi</p>
                </div>
                {order.delivery_address.landmark && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 italic text-xs font-medium opacity-60">
                    &quot;{order.delivery_address.landmark}&quot;
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="p-8 rounded-[2.5rem] bg-primary/10 border border-primary/20 text-center space-y-4 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 transition-opacity" />
              <div className="space-y-1">
                <h3 className="font-black text-xl italic uppercase tracking-tighter">Support Line</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Call our Karachi HQ for instant help</p>
              </div>
              <Button className="w-full rounded-2xl font-black h-14 bg-primary text-black hover:scale-105 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest">
                +92 300 1234567
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
