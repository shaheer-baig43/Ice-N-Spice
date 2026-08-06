"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/context/CartContext"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import { ShoppingBag, Loader2, CreditCard, Banknote, MapPin, Truck } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@supabase/supabase-js"

const KARACHI_ZONES = [
  { name: "North Nazimabad", fee: 80 },
  { name: "FB Area / Nazimabad", fee: 100 },
  { name: "Buffer Zone", fee: 100 },
  { name: "Gulshan-e-Iqbal", fee: 150 },
  { name: "Gulistan-e-Johar", fee: 180 },
  { name: "Saddar / Garden", fee: 200 },
  { name: "DHA / Clifton", fee: 250 },
  { name: "Malir / Korangi", fee: 300 },
  { name: "Bahria Town", fee: 500 },
  { name: "Other Karachi Areas", fee: 250 }
]

const checkoutSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  phone: z.string().min(10, "Valid phone number is required"),
  area: z.string().min(1, "Please select your area"),
  street: z.string().min(5, "Street address is too short"),
  landmark: z.string().optional(),
  paymentMethod: z.enum(["cod", "online"]),
})

type CheckoutValues = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart, totalItems } = useCart()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const [deliveryFee, setDeliveryFee] = useState(0)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "cod",
      area: ""
    }
  })

  const selectedArea = watch("area")
  const paymentMethod = watch("paymentMethod")

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        setValue("fullName", user.user_metadata?.full_name || "")
      }
    })
  }, [setValue])

  useEffect(() => {
    const zone = KARACHI_ZONES.find(z => z.name === selectedArea)
    setDeliveryFee(zone ? zone.fee : 0)
  }, [selectedArea])

  const onPlaceOrder = async (values: CheckoutValues) => {
    if (!user) {
      toast.error("Please login to place an order")
      router.push("/auth?redirect=/checkout")
      return
    }

    setLoading(true)
    try {
      const effectiveDelivery = totalPrice > 2000 ? 0 : deliveryFee
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_id: user.id,
          total_amount: totalPrice + effectiveDelivery,
          status: "pending",
          payment_method: values.paymentMethod,
          payment_status: "pending",
          delivery_address: {
            street: values.street,
            area: values.area,
            landmark: values.landmark,
            city: "Karachi",
            fullName: values.fullName,
            phone: values.phone
          }
        })
        .select()
        .single()

      if (orderError) throw orderError

      const orderItems = cart.map((item) => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price
      }))

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems)

      if (itemsError) throw itemsError

      toast.success("Order placed successfully!", {
        description: `Order ID: #${order.id.slice(0, 8)}`
      })
      clearCart()
      router.push(`/orders/${order.id}`)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unknown error occurred"
      console.error("Order error:", message)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (totalItems === 0) {
    return (
      <div className="container px-4 py-32 flex flex-col items-center justify-center text-center space-y-6">
        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground text-lg">Add some zing to your day before checking out!</p>
        </div>
        <Button size="lg" onClick={() => router.push("/menu")} className="rounded-full px-8 font-bold">
          Explore Menu
        </Button>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 max-w-6xl">
      <h1 className="text-4xl font-black mb-8 tracking-tight">Checkout</h1>

      <form onSubmit={handleSubmit(onPlaceOrder)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Info */}
          <Card className="border-none bg-card/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Delivery Details
              </CardTitle>
              <CardDescription>We&apos;ll deliver your hot meal to this address in Karachi.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" {...register("fullName")} placeholder="Your Name" className="bg-background" />
                  {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" {...register("phone")} placeholder="03xx xxxxxxx" className="bg-background" />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Delivery Area</Label>
                  <Select onValueChange={(val) => setValue("area", val)} defaultValue={selectedArea}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select Area" />
                    </SelectTrigger>
                    <SelectContent>
                      {KARACHI_ZONES.map((zone) => (
                        <SelectItem key={zone.name} value={zone.name}>
                          {zone.name} (Rs. {zone.fee})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.area && <p className="text-xs text-destructive">{errors.area.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address / House #</Label>
                  <Input id="street" {...register("street")} placeholder="A-123, Street 4" className="bg-background" />
                  {errors.street && <p className="text-xs text-destructive">{errors.street.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="landmark">Landmark (Optional)</Label>
                <Input id="landmark" {...register("landmark")} placeholder="Near famous park, shop, etc." className="bg-background" />
              </div>
            </CardContent>
          </Card>

          {/* Payment Options */}
          <Card className="border-none bg-card/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Payment Method
              </CardTitle>
              <CardDescription>Choose how you&apos;d like to pay for your order.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                defaultValue="cod" 
                className="grid gap-4 md:grid-cols-2"
                onValueChange={(val) => setValue("paymentMethod", val as "cod" | "online")}
              >
                <div>
                  <RadioGroupItem value="cod" id="cod" className="peer sr-only" />
                  <Label
                    htmlFor="cod"
                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-background p-4 hover:bg-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all cursor-pointer"
                  >
                    <Banknote className="mb-3 h-6 w-6 text-muted-foreground peer-data-[state=checked]:text-primary" />
                    <span className="font-bold">Cash on Delivery</span>
                    <span className="text-[10px] text-muted-foreground mt-1">Pay when you receive</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="online" id="online" className="peer sr-only" />
                  <Label
                    htmlFor="online"
                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-background p-4 hover:bg-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all cursor-pointer"
                  >
                    <CreditCard className="mb-3 h-6 w-6 text-muted-foreground peer-data-[state=checked]:text-primary" />
                    <span className="font-bold">Online Payment</span>
                    <span className="text-[10px] text-muted-foreground mt-1">Stripe / Card (Coming Soon)</span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-none shadow-xl bg-card">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-[30vh] overflow-auto space-y-3 pr-2 scrollbar-hide">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex flex-col">
                      <span className="font-bold">{item.name}</span>
                      <span className="text-[10px] text-muted-foreground">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-medium text-muted-foreground">Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 pt-4 border-t border-white/5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">Rs. {totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Truck className="h-3 w-3" />
                    <span>Delivery Fee</span>
                  </div>
                  <span className="font-medium">Rs. {deliveryFee}</span>
                </div>
                {totalPrice > 2000 && deliveryFee > 0 && (
                  <div className="flex justify-between text-sm text-green-500 font-bold">
                    <span>Free Delivery (Over Rs. 2000)</span>
                    <span>- Rs. {deliveryFee}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-black pt-2 text-primary border-t border-primary/20">
                  <span>Grand Total</span>
                  <span>Rs. {totalPrice > 2000 ? totalPrice : totalPrice + deliveryFee}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full h-14 text-lg font-black rounded-xl shadow-lg hover:scale-[1.02] transition-transform" 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Preparing...</>
                ) : (
                  paymentMethod === "cod" ? "Place Order (COD)" : "Pay & Place Order"
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <p className="text-[10px] text-center text-muted-foreground mt-4 px-4">
            By placing this order, you agree to our Terms of Service and Privacy Policy. 
            Delivery times are estimated between 30-50 minutes.
          </p>
        </div>
      </form>
    </div>
  )
}
