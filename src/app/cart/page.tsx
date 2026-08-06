"use client"

import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import QuantitySelector from "@/components/QuantitySelector"
import { Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart()

  if (cart.length === 0) {
    return (
      <div className="container px-4 py-32 flex flex-col items-center justify-center text-center space-y-8">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="h-32 w-32 rounded-full bg-muted flex items-center justify-center text-muted-foreground shadow-inner"
        >
          <ShoppingBag className="h-16 w-16 opacity-20" />
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight uppercase tracking-tighter italic">Your Cart Is Empty</h1>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest opacity-50 max-w-xs mx-auto">Looks like you haven&apos;t discovered Karachi&apos;s best spices yet.</p>
        </div>
        <Link href="/menu">
          <Button size="lg" className="rounded-[1.5rem] px-12 font-black h-16 shadow-2xl golden-gradient text-black hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">
            Browse Our Menu
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 max-w-6xl">
      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-5xl font-black mb-12 tracking-tighter uppercase italic"
      >
        Shopping <span className="text-primary tracking-normal">Cart</span>
      </motion.h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <Card className="overflow-hidden glass-card border-none rounded-[2rem] hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex gap-6 sm:gap-10">
                      <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-3xl border border-white/5 shadow-2xl bg-muted">
                        <Image
                          src={item.image_url || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex flex-grow flex-col justify-between py-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-black text-xl sm:text-2xl group-hover:text-primary transition-colors uppercase tracking-tight">{item.name}</h3>
                            <p className="text-xs text-muted-foreground font-black uppercase tracking-widest opacity-50 italic mt-1">Karachi Special Recipe</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive/50 hover:text-destructive hover:bg-destructive/10 rounded-full h-10 w-10 transition-colors"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center mt-6">
                          <QuantitySelector 
                            quantity={item.quantity}
                            onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
                            onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
                            className="bg-muted/50 border-none rounded-xl h-11"
                          />
                          <div className="text-right">
                            <span className="font-black text-2xl text-primary italic">Rs. {item.price * item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1"
        >
          <Card className="sticky top-24 glass-card border-none rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="bg-primary/10 p-8 border-b border-primary/10">
              <h2 className="text-2xl font-black uppercase tracking-tighter italic tracking-widest">Total Summary</h2>
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                <span>Items ({totalItems})</span>
                <span className="text-foreground">Rs. {totalPrice}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  <span>Delivery</span>
                </div>
                <span className="text-green-500">Free Over 2000</span>
              </div>
              
              <div className="pt-6 border-t border-white/5">
                <div className="flex justify-between items-end">
                  <span className="font-black text-lg uppercase italic tracking-tighter opacity-50">Subtotal</span>
                  <span className="text-4xl font-black text-primary leading-none italic tracking-tighter">Rs. {totalPrice}</span>
                </div>
                <p className="text-[10px] font-bold text-muted-foreground mt-4 uppercase tracking-widest opacity-30 text-center">Excluding taxes and zone fees</p>
              </div>
            </CardContent>
            <CardFooter className="p-8 pt-0">
              <Link href="/checkout" className="w-full">
                <Button className="w-full h-16 text-xl font-black rounded-2xl gap-3 shadow-xl shadow-primary/20 golden-gradient text-black hover:scale-[1.03] active:scale-95 transition-all uppercase tracking-widest">
                  Checkout Now
                  <ArrowRight className="h-6 w-6" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <div className="mt-8 p-6 rounded-[2rem] bg-white/5 border border-white/5 flex items-center gap-4 shadow-inner group">
             <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
               <Truck className="h-5 w-5" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest leading-tight opacity-70">
               Free delivery on orders above Rs. 2000 in Karachi!
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
