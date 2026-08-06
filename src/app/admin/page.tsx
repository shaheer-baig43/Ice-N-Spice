"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShoppingCart, Utensils, Users, DollarSign, TrendingUp, Star, Loader2, Package } from "lucide-react"
import { startOfDay, startOfMonth, format } from "date-fns"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { DashboardStats, TopItem } from "@/types"
import Image from "next/image"

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    todaySales: 0,
    monthOrders: 0,
    totalCustomers: 0,
    activeItems: 0
  })
  const [topItems, setTopItems] = useState<TopItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const today = startOfDay(new Date()).toISOString()
      const firstOfMonth = startOfMonth(new Date()).toISOString()

      const { data: todayOrders } = await supabase
        .from("orders")
        .select("total_amount")
        .gte("created_at", today)
        .neq("status", "cancelled")
      
      const sales = todayOrders?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0

      const { count: monthCount } = await supabase
        .from("orders")
        .select("*", { count: 'exact', head: true })
        .gte("created_at", firstOfMonth)

      const { count: customerCount } = await supabase
        .from("profiles")
        .select("*", { count: 'exact', head: true })
        .eq("role", "customer")

      const { count: itemCount } = await supabase
        .from("menu_items")
        .select("*", { count: 'exact', head: true })
        .eq("is_available", true)

      const { data: orderItems } = await supabase
        .from("order_items")
        .select("quantity, menu_item:menu_items(name, image_url)")
        .limit(100)

      const itemAggregation: Record<string, TopItem> = {}
      orderItems?.forEach(item => {
        if (!item.menu_item) return
        const mi = item.menu_item as unknown as { name: string, image_url: string }
        const name = mi.name
        if (!itemAggregation[name]) {
          itemAggregation[name] = { name, count: 0, image: mi.image_url }
        }
        itemAggregation[name].count += item.quantity
      })

      const top5 = Object.values(itemAggregation)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      setStats({
        todaySales: sales,
        monthOrders: monthCount || 0,
        totalCustomers: customerCount || 0,
        activeItems: itemCount || 0
      })
      setTopItems(top5)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  )

  const statCards = [
    { name: "Today's Sales", value: `Rs. ${stats.todaySales}`, icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
    { name: "Monthly Orders", value: stats.monthOrders, icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Total Customers", value: stats.totalCustomers, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "Active Menu", value: stats.activeItems, icon: Utensils, color: "text-primary", bg: "bg-primary/10" },
  ]

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Control <span className="text-primary">Center</span></h1>
          <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px]">Real-time analytics for IceNSpice Karachi</p>
        </motion.div>
        <div className="text-right">
          <p className="text-xs font-bold text-muted-foreground uppercase">{format(new Date(), "EEEE, MMMM do")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none glass-card overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">{stat.name}</CardTitle>
                <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12", stat.bg, stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black tracking-tight">{stat.value}</div>
                <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-green-500 uppercase tracking-tighter">
                  <TrendingUp className="h-3 w-3" />
                  Live Data
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass-card border-none rounded-[2rem] overflow-hidden">
          <CardHeader className="p-8">
            <div className="flex items-center gap-3">
              <Star className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-2xl font-black uppercase tracking-tighter italic">Top Performers</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Most loved flavors this week</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="space-y-6">
              {topItems.length > 0 ? topItems.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black italic text-muted-foreground/20 w-8">0{i+1}</span>
                    <div className="h-14 w-14 rounded-2xl bg-muted overflow-hidden border border-white/5 relative">
                      <Image src={item.image} alt={item.name} fill className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                    </div>
                    <div>
                      <p className="font-black text-lg uppercase tracking-tight group-hover:text-primary transition-colors">{item.name}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">{item.count} Portions Sold</p>
                    </div>
                  </div>
                  <Badge className="rounded-xl h-8 px-4 font-black golden-gradient text-black border-none uppercase text-[10px] tracking-widest">
                    HOT
                  </Badge>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <Utensils className="h-12 w-12 opacity-10 mb-4" />
                  <p className="text-sm font-bold uppercase">No sales data yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center space-y-6 border-dashed border-2 border-white/5 opacity-50">
            <Package className="h-16 w-16 text-muted-foreground opacity-20" />
            <div className="space-y-2">
               <h3 className="font-black text-xl italic uppercase tracking-tighter">Order Velocity</h3>
               <p className="text-xs font-medium max-w-[200px]">Advanced charting and order velocity maps coming in the next update.</p>
            </div>
        </Card>
      </div>
    </div>
  )
}
