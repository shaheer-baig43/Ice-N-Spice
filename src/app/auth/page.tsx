"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Welcome back to IceNSpice!")
      router.push("/")
    }
    setLoading(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Success! Please check your email for verification.")
    }
    setLoading(false)
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="w-full max-w-md glass-card border-none rounded-[2rem] shadow-2xl overflow-hidden">
        <CardHeader className="text-center p-8 bg-primary/10 border-b border-primary/10">
          <CardTitle className="text-4xl font-black italic tracking-tighter uppercase">Ice N Spice</CardTitle>
          <CardDescription className="font-bold text-[10px] uppercase tracking-widest opacity-50 mt-2">Join Karachi&apos;s Spicy Elite</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-14 bg-muted/30 rounded-xl p-1 mb-8">
              <TabsTrigger value="login" className="rounded-lg font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-black transition-all">Login</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-lg font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-black transition-all">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest opacity-50">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="example@gmail.com" 
                    className="h-14 bg-background/50 rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password"  className="text-[10px] font-black uppercase tracking-widest opacity-50">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    className="h-14 bg-background/50 rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
                <Button className="w-full h-14 rounded-xl font-black uppercase tracking-widest text-lg shadow-xl shadow-primary/20" type="submit" disabled={loading}>
                  {loading ? "Authenticating..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-[10px] font-black uppercase tracking-widest opacity-50">Full Name</Label>
                  <Input 
                    id="signup-name" 
                    placeholder="John Doe" 
                    className="h-14 bg-background/50 rounded-xl"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-[10px] font-black uppercase tracking-widest opacity-50">Email Address</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="example@gmail.com" 
                    className="h-14 bg-background/50 rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password"  className="text-[10px] font-black uppercase tracking-widest opacity-50">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    placeholder="••••••••"
                    className="h-14 bg-background/50 rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
                <Button className="w-full h-14 rounded-xl font-black uppercase tracking-widest text-lg shadow-xl shadow-primary/20" type="submit" disabled={loading}>
                  {loading ? "Creating Account..." : "Join the Club"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
