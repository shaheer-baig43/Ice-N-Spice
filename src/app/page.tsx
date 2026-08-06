"use client"

import { Button } from "@/components/ui/button"
import { PLACEHOLDER_ITEMS, CATEGORIES } from "@/constants"
import { ChevronRight, Flame, Clock, Truck, ShieldCheck, Star, ArrowDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AddToCartButton from "@/components/AddToCartButton"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

// Correct framer-motion motion props (spread directly onto motion components, not used as variants)
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" as const }
}

// Variant version of fadeInUp for use as children of staggerContainer
const fadeInUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
}

// staggerContainer uses proper variant keys: hidden/visible — NOT whileInView inside variant values
const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function Home() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div className="flex flex-col gap-24 pb-24 overflow-hidden" ref={containerRef}>
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2000&auto=format&fit=crop"
            alt="Hero Background"
            fill
            className="object-cover brightness-[0.3]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
        </motion.div>
        
        <div className="container relative z-10 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <Badge className="bg-primary/20 text-primary border-primary/20 px-6 py-2 rounded-full text-sm font-bold tracking-widest backdrop-blur-md">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              AUTHENTIC KARACHI TASTE
            </Badge>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9]">
              SIZZLING <br />
              <span className="golden-text glow-primary">FLAVORS</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
              Experience the legendary Zinger Max and Gourmet series. 
              Karachi&apos;s favorite spices, delivered to your doorstep.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
              <Link href="/menu">
                <Button size="lg" className="h-16 px-10 text-xl font-black rounded-full shadow-2xl hover:scale-105 transition-transform bg-primary text-primary-foreground">
                  Order Now
                </Button>
              </Link>
              <Link href="/menu">
                <Button size="lg" variant="outline" className="h-16 px-10 text-xl font-bold rounded-full border-2 border-primary/50 hover:bg-primary/10 transition-all backdrop-blur-sm">
                  View Menu
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div 
          style={{ opacity }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Scroll to explore</span>
          <ArrowDown className="h-4 w-4 text-primary" />
        </motion.div>
      </section>

      {/* Stats/Features Section */}
      <section className="container px-4">
        <motion.div 
          {...fadeInUp}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {[
            { icon: Clock, title: "45 Min Delivery", desc: "Always fresh, always hot", color: "text-blue-500" },
            { icon: Truck, title: "Free Shipping", desc: "On orders above Rs. 2000", color: "text-primary" },
            { icon: ShieldCheck, title: "Hygiene Guaranteed", desc: "Safe handling & packaging", color: "text-green-500" },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="flex items-start gap-6 p-8 rounded-3xl glass-card border border-white/5"
            >
              <div className={`h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center ${feature.color} shrink-0 shadow-inner`}>
                <feature.icon className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Categories Grid */}
      <section className="container px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <motion.div {...fadeInUp} className="space-y-2 text-left">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">EXPLORE <span className="text-primary">MENU</span></h2>
            <p className="text-muted-foreground font-medium">Select a category to see our specialties</p>
          </motion.div>
          <motion.div {...fadeInUp}>
            <Link href="/menu">
              <Button variant="link" className="text-primary font-black text-lg gap-2 group p-0">
                View Everything <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {CATEGORIES.map((category) => (
            <motion.div
              key={category.id}
              variants={fadeInUpVariant}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={`/menu?category=${category.slug}`}>
                <Card className="glass-card hover:border-primary/50 transition-all cursor-pointer group h-full">
                  <CardContent className="p-8 flex flex-col items-center justify-center text-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-xl">
                      <Flame className="h-8 w-8" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest leading-none">{category.name}</span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Bestsellers Section */}
      <section className="container px-4 relative">
        <div className="absolute -top-24 left-0 w-full h-[500px] bg-primary/5 blur-[120px] -z-10 rounded-full" />
        
        <div className="text-center mb-16 space-y-4">
          <motion.h2 {...fadeInUp} className="text-5xl md:text-7xl font-black tracking-tighter uppercase">
            Customer <span className="golden-text">Favorites</span>
          </motion.h2>
          <motion.p {...fadeInUp} className="text-muted-foreground text-lg font-medium">
            Hand-picked delicacies that Karachi loves the most.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PLACEHOLDER_ITEMS.filter(item => item.is_popular).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden group glass-card border-none hover:shadow-2xl transition-all duration-500 rounded-[2rem]">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-black/50 backdrop-blur-md border-white/10 text-white font-bold flex gap-1 items-center px-3">
                      <Star className="h-3 w-3 fill-primary text-primary" /> 4.9
                    </Badge>
                  </div>
                  {item.is_popular && (
                    <div className="absolute top-4 right-4 h-10 w-10 bg-primary rounded-full flex items-center justify-center animate-bounce shadow-lg">
                      <Flame className="h-5 w-5 text-black" />
                    </div>
                  )}
                </div>
                <CardContent className="p-8 space-y-6 relative">
                  <div className="space-y-2">
                    <h3 className="font-black text-2xl group-hover:text-primary transition-colors">{item.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Starting from</span>
                      <span className="text-2xl font-black text-primary">Rs. {item.price}</span>
                    </div>
                    <AddToCartButton 
                      item={item} 
                      className="rounded-2xl h-12 w-12 p-0 shadow-lg hover:rotate-12 transition-transform" 
                      size="icon" 
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA / Newsletter */}
      <section className="container px-4">
        <motion.div 
          {...fadeInUp}
          className="relative overflow-hidden rounded-[3rem] bg-card p-12 md:p-24 text-center border border-white/5"
        >
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-primary/20 blur-[100px] rounded-full" />
          
          <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
              JOIN THE <span className="golden-text">SPICE CLUB</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground font-medium">
              Get exclusive deals, new item alerts, and priority delivery in Karachi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow h-14 rounded-2xl px-6 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
              />
              <Button className="h-14 px-8 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">
                Subscribe
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
