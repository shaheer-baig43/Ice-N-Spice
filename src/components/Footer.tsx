import { Globe, Phone, Mail, Flame } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-card/30 backdrop-blur-md">
      <div className="container px-4 py-12 md:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Flame className="h-8 w-8 text-primary" />
              <span className="text-3xl font-black tracking-tighter text-primary italic uppercase">IceNSpice</span>
            </Link>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Karachi&apos;s favorite destination for spicy zingers, delicious Chinese, and more. Quality you can taste, spice you can feel.
            </p>
          </div>
          
          <div>
            <h3 className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-primary">Quick Links</h3>
            <ul className="flex flex-col gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              <li><Link href="/menu" className="hover:text-primary transition-colors">Full Menu</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-primary">Location</h3>
            <ul className="flex flex-col gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              <li className="leading-tight">Shop #2, North Plaza, SD-11, Block-A,<br />Opposite Jinnah University for Women,<br />North Nazimabad, Karachi</li>
              <li>+92 300 1234567</li>
              <li className="lowercase tracking-normal">info@icenspice.pk</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-primary">Follow Us</h3>
            <div className="flex gap-4">
              <Link href="#" className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all border border-white/5 shadow-xl">
                <Globe className="h-5 w-5" />
              </Link>
              <Link href="#" className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all border border-white/5 shadow-xl">
                <Phone className="h-5 w-5" />
              </Link>
              <Link href="#" className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all border border-white/5 shadow-xl">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-30">
            &copy; {new Date().getFullYear()} IceNSpice Karachi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
