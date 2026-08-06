import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Clock } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="container px-4 py-16 max-w-4xl space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl uppercase tracking-tighter italic">Our <span className="text-primary">Story</span></h1>
        <p className="text-xl text-muted-foreground font-medium uppercase text-[10px] tracking-widest opacity-50">The most flavorful fast food in Karachi since 2010</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">Bringing the Heat to <span className="text-primary">Karachi</span></h2>
          <div className="space-y-4 text-muted-foreground font-medium leading-relaxed">
            <p>
              IceNSpice started with a simple mission: to serve the crispiest, juiciest Zinger burgers in Karachi. 
              Over the years, we&apos;ve expanded our menu to include gourmet beef burgers, authentic Chinese dishes, 
              and our signature Hot N Rolls.
            </p>
            <p>
              Every ingredient is handpicked, every spice blend is secret, and every meal is made to order. 
              We believe in quality without compromise.
            </p>
          </div>
        </div>
        <div className="relative h-80 md:h-[400px] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl bg-muted group">
          <Image 
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop" 
            alt="Pizza and Food" 
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        {[
          { icon: MapPin, title: "Location", desc: "Shop #2, North Plaza, North Nazimabad, Karachi" },
          { icon: Clock, title: "Timing", desc: "12:00 PM - 02:00 AM (Mon - Sun)" },
          { icon: Phone, title: "Contact", desc: "+92 300 1234567\ninfo@icenspice.pk" },
        ].map((item, i) => (
          <Card key={i} className="glass-card border-none rounded-[2rem] group hover:bg-primary/5 transition-all">
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <item.icon className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black uppercase tracking-widest text-xs">{item.title}</h3>
                <p className="text-xs text-muted-foreground font-bold leading-relaxed whitespace-pre-line">{item.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
