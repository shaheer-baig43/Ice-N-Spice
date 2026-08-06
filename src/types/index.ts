export type Role = 'admin' | 'customer'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: Role
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image_url: string | null
  display_order: number
}

export interface MenuItem {
  id: string
  category_id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_popular: boolean
  is_available: boolean
  created_at?: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  customer_id: string
  status: OrderStatus
  total_amount: number
  payment_method: string
  payment_status: string
  delivery_address: {
    street: string
    area: string
    city: string
    landmark?: string
    fullName?: string
    phone?: string
  }
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  menu_item_id: string
  quantity: number
  unit_price: number
  menu_item?: MenuItem
}

export interface CartItem extends MenuItem {
  quantity: number
}

// Analytics Helpers
export interface DashboardStats {
  todaySales: number
  monthOrders: number
  totalCustomers: number
  activeItems: number
}

export interface TopItem {
  name: string
  count: number
  image: string
}
