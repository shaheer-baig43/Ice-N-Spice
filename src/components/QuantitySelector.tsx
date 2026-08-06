"use client"

import { Button } from "./ui/button"
import { Minus, Plus } from "lucide-react"

interface QuantitySelectorProps {
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
  className?: string
}

export default function QuantitySelector({ 
  quantity, 
  onIncrement, 
  onDecrement,
  className 
}: QuantitySelectorProps) {
  return (
    <div className={`flex items-center border rounded-md ${className}`}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-none border-r"
        onClick={onDecrement}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="w-10 text-center text-sm font-medium">{quantity}</span>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-none border-l"
        onClick={onIncrement}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  )
}
