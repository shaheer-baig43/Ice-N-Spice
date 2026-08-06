"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { useCart } from "@/context/CartContext"
import { MenuItem } from "@/types"
import { ShoppingCart, Plus } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

interface AddToCartButtonProps {
  item: MenuItem
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showText?: boolean
}

export default function AddToCartButton({ item, size = "default", className, showText = true }: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleAdd = () => {
    addToCart(item)
    setIsAnimating(true)
    
    toast.success(`${item.name} added to cart!`, {
      description: "Ready for checkout when you are.",
      action: {
        label: "View Cart",
        onClick: () => window.location.href = "/cart"
      }
    })

    setTimeout(() => setIsAnimating(false), 1000)
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ opacity: 1, scale: 1, y: 0 }}
            animate={{ opacity: 0, scale: 0.5, y: -100, x: 200 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center"
          >
            <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center shadow-2xl">
              <Plus className="text-black h-6 w-6" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button 
        className={className} 
        size={size}
        onClick={handleAdd}
      >
        <ShoppingCart className={showText ? "mr-2 h-4 w-4" : "h-5 w-5"} />
        {showText && "Add to Cart"}
      </Button>
    </div>
  )
}
