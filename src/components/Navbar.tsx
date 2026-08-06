"use client"

import Link from "next/link"
import { ShoppingCart, User, Menu, X, Flame, Trash2, ArrowRight } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"
import { useCart } from "@/context/CartContext"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter 
} from "./ui/sheet"
import Image from "next/image"
import QuantitySelector from "./QuantitySelector"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { totalItems, cart, updateQuantity, removeFromCart, totalPrice } = useCart()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tighter text-primary">IceNSpice</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/menu" className="text-sm font-medium hover:text-primary transition-colors">Menu</Link>
          <Link href="/orders" className="text-sm font-medium hover:text-primary transition-colors">Orders</Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {totalItems}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Your Cart ({totalItems})
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex-grow overflow-auto py-6">
                {cart.length > 0 ? (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 border-b pb-4">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                          <Image
                            src={item.image_url || "/placeholder.png"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-grow flex-col justify-between">
                          <div className="flex justify-between">
                            <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-destructive"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <QuantitySelector 
                              quantity={item.quantity}
                              onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
                              onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
                            />
                            <span className="text-sm font-bold text-primary">Rs. {item.price * item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground opacity-20" />
                    <p className="text-muted-foreground">Your cart is empty.</p>
                    <Link href="/menu">
                      <Button variant="outline" size="sm">Browse Menu</Button>
                    </Link>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <SheetFooter className="border-t pt-6 flex flex-col gap-4">
                  <div className="flex justify-between items-center w-full">
                    <span className="font-medium">Total</span>
                    <span className="text-xl font-bold text-primary">Rs. {totalPrice}</span>
                  </div>
                  <Link href="/cart" className="w-full">
                    <Button className="w-full h-12 text-lg font-bold gap-2">
                      Check Out
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </SheetFooter>
              )}
            </SheetContent>
          </Sheet>
          <Link href="/auth">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          <Link href="/menu" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Menu</Link>
          <Link href="/orders" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Orders</Link>
          <Link href="/about" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>About</Link>
          <hr className="border-border" />
          <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
            <Button className="w-full justify-start gap-2" variant="ghost">
              <User className="h-5 w-5" />
              Account
            </Button>
          </Link>
        </div>
      )}
    </nav>
  )
}
