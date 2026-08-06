"use client"

import { useState, useEffect, Suspense } from "react"
import { supabase } from "@/lib/supabase"
import { Category, MenuItem } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AddToCartButton from "@/components/AddToCartButton"
import { Search, Flame, FilterX, ChevronRight, Star, SlidersHorizontal } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { MenuSkeleton } from "@/components/MenuSkeleton"
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"
import Link from "next/link"
import { CATEGORIES as STATIC_CATEGORIES } from "@/constants"
import { useSearchParams } from "next/navigation"

// Inner component that uses useSearchParams — must be wrapped in Suspense
function MenuContent() {
  const [categories, setCategories] = useState<Category[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<number>(3000)
  const [showCategories, setShowCategories] = useState(true)

  const searchParams = useSearchParams()
  const { scrollY } = useScroll()

  // Apply category param from URL on initial load / when categories are resolved
  useEffect(() => {
    const categorySlug = searchParams.get("category")
    if (!categorySlug || categorySlug === "all") return

    const matched = categories.find(c => c.slug === categorySlug)
    if (matched) {
      setActiveCategory(matched.id)
    } else if (categories.length === 0) {
      // Categories not loaded yet — store slug as sentinel, resolved below
      setActiveCategory(categorySlug)
    }
  }, [searchParams, categories])

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    // If scrolling down, hide header. If at the very top, show header.
    if (latest > previous && latest > 0) {
      setShowCategories(false)
    } else if (latest <= 0) {
      setShowCategories(true)
    }
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: catData, error: catError } = await supabase
          .from("categories")
          .select("*")
          .order("display_order", { ascending: true })

        const { data: itemData, error: itemError } = await supabase
          .from("menu_items")
          .select("*")
          .eq("is_available", true)

        setCategories(catData || [])
        setMenuItems(itemData || [])
      } catch (error: unknown) {
        const err = error as { message?: string; code?: string; details?: string }
        console.error("Error fetching menu data:", err.message || err.code || error)
        if (err.details) console.error("Error details:", err.details)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredItems = menuItems.filter((item) => {
    // activeCategory can be "all", a UUID, or a slug (from URL before categories load)
    const activeCat = categories.find(c => c.id === activeCategory || c.slug === activeCategory)
    
    // Debugging logic
    const categoryIdFromSlug = activeCat?.id
    const matchesCategory = activeCategory === "all" || item.category_id === (categoryIdFromSlug ?? activeCategory)
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = item.price <= priceRange
    
    return matchesCategory && matchesSearch && matchesPrice
  })

  if (loading) return <MenuSkeleton />

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Premium Header */}
      <motion.div
        initial={false}
        animate={{ y: showCategories ? 0 : -100, opacity: showCategories ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="bg-card/80 border-b sticky top-16 z-30 backdrop-blur-xl"
      >
        <div className="container px-4 py-8 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-5xl font-black tracking-tighter uppercase italic">
                ICE N <span className="golden-text">SPICE</span>
              </h1>
              <p className="text-muted-foreground font-bold text-xs tracking-[0.3em] uppercase opacity-50">Karachi&apos;s Premium Fast Food</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search flavors..."
                  className="pl-12 h-14 bg-white/5 border-white/5 rounded-[1.25rem] focus:ring-primary/50 text-lg font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Price Filter */}
              <div className="flex items-center gap-4 bg-white/5 px-6 h-14 rounded-[1.25rem] border border-white/5 min-w-[240px]">
                <SlidersHorizontal className="h-5 w-5 text-primary shrink-0" />
                <div className="flex-grow space-y-1">
                  <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase">
                    <span>Price</span>
                    <span className="text-primary">Under {priceRange}</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="3000"
                    step="50"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-primary h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Icon-based Categories */}
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-4 pb-4">
              <Button
                variant={activeCategory === "all" ? "default" : "secondary"}
                onClick={() => setActiveCategory("all")}
                className="rounded-[1.25rem] px-8 h-16 flex flex-col items-center justify-center gap-1 font-black uppercase text-[10px] tracking-widest shadow-xl transition-all"
              >
                All
              </Button>
              {categories.map((category) => {
                const staticCat = STATIC_CATEGORIES.find(sc => sc.slug === category.slug)
                const Icon = staticCat?.icon || Flame
                return (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "secondary"}
                    onClick={() => setActiveCategory(category.id)}
                    className="rounded-[1.25rem] px-8 h-16 flex flex-col items-center justify-center gap-1 font-black uppercase text-[10px] tracking-widest shadow-xl transition-all"
                  >
                    <Icon className="h-5 w-5" />
                    {category.name.split(' ')[0]}
                  </Button>
                )
              })}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
        </div>
      </motion.div>

      <div className="container px-4 py-12">
        <AnimatePresence mode="popLayout">
          {filteredItems.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
            >
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="overflow-hidden group flex flex-col glass-card border-none hover:shadow-[0_20px_80px_rgba(212,175,55,0.15)] transition-all duration-700 rounded-[3rem] h-full">
                    <div className="relative aspect-[1/1] overflow-hidden">
                      <Image
                        src={item.image_url || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop"}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-125"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-700" />

                      <div className="absolute top-6 left-6">
                        <Badge className="bg-black/60 backdrop-blur-xl border-white/5 text-white font-black flex gap-1.5 items-center px-4 py-2 rounded-2xl">
                          <Star className="h-3.5 w-3.5 fill-primary text-primary" /> 4.9
                        </Badge>
                      </div>

                      {item.is_popular && (
                        <div className="absolute top-6 right-6 h-12 w-12 bg-primary rounded-2xl flex items-center justify-center shadow-2xl animate-float">
                          <Flame className="h-6 w-6 text-black fill-current" />
                        </div>
                      )}

                      <div className="absolute bottom-8 left-8 right-8">
                        <div className="flex flex-col">
                          <span className="text-primary font-black text-4xl italic tracking-tighter drop-shadow-2xl">Rs. {item.price}</span>
                          <span className="text-[10px] font-black uppercase text-white/50 tracking-[0.2em] mt-1">Authentic Karachi Style</span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-10 flex flex-col flex-grow space-y-6">
                      <div className="space-y-3">
                        <h3 className="font-black text-3xl group-hover:text-primary transition-colors leading-none uppercase tracking-tighter">{item.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium opacity-70">
                          {item.description || "Indulge in our signature blend of premium ingredients and spicy Karachi secrets."}
                        </p>
                      </div>

                      <div className="pt-4 mt-auto">
                        <AddToCartButton
                          item={item}
                          className="w-full h-16 rounded-[1.5rem] font-black text-xl shadow-2xl golden-gradient text-black hover:scale-[1.03] active:scale-95 transition-all"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-40 flex flex-col items-center justify-center text-center space-y-10"
            >
              <div className="relative">
                <div className="h-40 w-40 rounded-[3rem] bg-muted/20 flex items-center justify-center text-muted-foreground backdrop-blur-sm">
                  <FilterX className="h-20 w-20 opacity-10" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-4 border-2 border-dashed border-primary/20 rounded-[4rem]"
                />
              </div>
              <div className="space-y-3">
                <h3 className="text-5xl font-black tracking-tighter uppercase italic">NO FLAVORS FOUND</h3>
                <p className="text-muted-foreground max-w-sm mx-auto font-bold text-lg opacity-60 uppercase tracking-widest">Adjust your filters to discover more</p>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={() => { setActiveCategory("all"); setSearchQuery(""); setPriceRange(3000) }}
                className="rounded-3xl px-16 border-2 border-primary/50 font-black h-16 hover:bg-primary text-black transition-all hover:text-black"
              >
                RESET FILTERS
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating View Cart for Mobile */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-10 left-0 right-0 z-40 md:hidden px-8"
      >
        <Link href="/cart">
          <Button size="lg" className="w-full rounded-[2rem] shadow-[0_30px_60px_rgba(212,175,55,0.5)] h-20 font-black text-2xl gap-4 golden-gradient border-none text-black">
            VIEW CART <ChevronRight className="h-8 w-8" />
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}

// Outer page wraps MenuContent in Suspense — required by Next.js when using useSearchParams
export default function MenuPage() {
  return (
    <Suspense fallback={<MenuSkeleton />}>
      <MenuContent />
    </Suspense>
  )
}
