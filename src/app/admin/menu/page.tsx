"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { MenuItem, Category } from "@/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, Flame, Loader2, Save, Upload, X } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category_id: "",
    image_url: "",
    is_popular: false,
    is_available: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: catData, error: catError } = await supabase.from("categories").select("*").order("display_order")
      const { data: itemData, error: itemError } = await supabase.from("menu_items").select("*").order("created_at", { ascending: false })
      
      if (catError) throw catError
      if (itemError) throw itemError

      setCategories(catData || [])
      setItems(itemData || [])
    } catch (error: unknown) {
      const err = error as { message?: string; details?: string; hint?: string; code?: string }
      console.error("Error fetching admin menu data:", {
        message: err.message,
        details: err.details,
        hint: err.hint,
        code: err.code
      })
      toast.error("Failed to load menu data: " + (err.message || "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `menu-items/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      setFormData({ ...formData, image_url: publicUrl })
      toast.success("Image uploaded successfully")
    } catch (error: unknown) {
      toast.error("Error uploading image: " + (error instanceof Error ? error.message : "Unknown error"))
    } finally {
      setIsUploading(false)
    }
  }

  const handleOpenDialog = (item: MenuItem | null = null) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        name: item.name,
        description: item.description || "",
        price: item.price,
        category_id: item.category_id,
        image_url: item.image_url || "",
        is_popular: item.is_popular,
        is_available: item.is_available
      })
    } else {
      setEditingItem(null)
      setFormData({
        name: "",
        description: "",
        price: 0,
        category_id: categories[0]?.id || "",
        image_url: "",
        is_popular: false,
        is_available: true
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.category_id) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSaving(true)
    try {
      if (editingItem) {
        const { error } = await supabase
          .from("menu_items")
          .update(formData)
          .eq("id", editingItem.id)
        
        if (error) throw error
        toast.success("Item updated successfully")
      } else {
        const { error } = await supabase
          .from("menu_items")
          .insert([formData])
        
        if (error) throw error
        toast.success("Item created successfully")
      }
      setIsDialogOpen(false)
      fetchData()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    try {
      const { error } = await supabase.from("menu_items").delete().eq("id", id)
      if (error) throw error
      toast.success("Item deleted")
      fetchData()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An unknown error occurred")
    }
  }

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getCategoryName = (id: string) => {
    return categories.find(c => c.id === id)?.name || "Uncategorized"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground">Add, edit, or remove items from your restaurant menu.</p>
        </div>
        <Button className="gap-2 rounded-full px-6 shadow-lg shadow-primary/20" onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4" /> Add New Item
        </Button>
      </div>

      <div className="bg-card p-4 rounded-xl border flex items-center gap-4">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search items by name..." 
          className="border-none bg-transparent focus-visible:ring-0 text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Item Details</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : filteredItems.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/20 transition-colors">
                <TableCell>
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg border bg-muted">
                    <Image
                      src={item.image_url || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="max-w-[250px]">
                  <div className="flex flex-col">
                    <span className="font-bold text-base">{item.name}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">{item.description}</span>
                    {item.is_popular && (
                      <div className="flex items-center text-[10px] text-primary font-black mt-1">
                        <Flame className="h-3 w-3 mr-1 fill-current" /> POPULAR
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-medium">{getCategoryName(item.category_id)}</Badge>
                </TableCell>
                <TableCell className="font-black text-primary">Rs. {item.price}</TableCell>
                <TableCell>
                  <Badge variant={item.is_available ? "default" : "outline"} className={item.is_available ? "bg-green-500/10 text-green-500 border-green-500/20" : "opacity-50"}>
                    {item.is_available ? "Active" : "Sold Out"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10" onClick={() => handleOpenDialog(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* CRUD Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl overflow-auto max-h-[90vh] glass-card border-white/10 rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase">{editingItem ? "Edit Menu Item" : "Add New Item"}</DialogTitle>
            <DialogDescription className="font-bold text-[10px] uppercase tracking-widest opacity-50">Manage your Karachi flavors</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest opacity-70">Item Name *</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Zinger Max" className="h-12 bg-background/50 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="text-xs font-black uppercase tracking-widest opacity-70">Price (PKR) *</Label>
                <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} placeholder="650" className="h-12 bg-background/50 rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-xs font-black uppercase tracking-widest opacity-70">Category *</Label>
              <Select value={formData.category_id} onValueChange={(val) => setFormData({...formData, category_id: val})}>
                <SelectTrigger className="h-12 bg-background/50 rounded-xl">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest opacity-70">Description</Label>
              <Input id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Short description of the item..." className="h-12 bg-background/50 rounded-xl" />
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest opacity-70">Item Visual</Label>
              <div className="flex flex-col gap-4">
                {formData.image_url ? (
                   <div className="relative group rounded-[1.5rem] overflow-hidden border border-white/5 shadow-2xl h-48 w-full bg-muted">
                     <Image src={formData.image_url} alt="Preview" fill className="object-cover" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <Button variant="destructive" size="sm" className="rounded-full gap-2" onClick={() => setFormData({...formData, image_url: ""})}>
                          <X className="h-4 w-4" /> Remove Image
                        </Button>
                     </div>
                   </div>
                ) : (
                  <div className="flex items-center justify-center h-48 rounded-[1.5rem] border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                      disabled={isUploading}
                    />
                    <div className="flex flex-col items-center gap-2">
                      {isUploading ? (
                        <>
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <span className="text-xs font-black uppercase tracking-widest">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground opacity-20" />
                          <span className="text-xs font-black uppercase tracking-widest opacity-40">Upload Food Shot</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
                <Input id="image_url" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} placeholder="Or paste image URL directly..." className="h-10 bg-background/30 rounded-lg text-[10px]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between border border-white/5 p-4 rounded-2xl bg-white/5">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-black uppercase tracking-tighter">Popular</Label>
                    <p className="text-[10px] text-muted-foreground font-bold">Show Badge</p>
                  </div>
                  <Switch checked={formData.is_popular} onCheckedChange={(val) => setFormData({...formData, is_popular: val})} />
                </div>

                <div className="flex items-center justify-between border border-white/5 p-4 rounded-2xl bg-white/5">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-black uppercase tracking-tighter">Live</Label>
                    <p className="text-[10px] text-muted-foreground font-bold">Public Menu</p>
                  </div>
                  <Switch checked={formData.is_available} onCheckedChange={(val) => setFormData({...formData, is_available: val})} />
                </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSaving} className="rounded-xl font-bold uppercase tracking-widest text-[10px]">Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving || isUploading} className="gap-2 rounded-xl h-12 px-8 font-black uppercase tracking-widest shadow-xl shadow-primary/20">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingItem ? "Update Item" : "Create Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
