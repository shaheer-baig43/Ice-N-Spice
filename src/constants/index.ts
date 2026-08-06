import { 
  UtensilsCrossed, 
  Flame, 
  ChefHat, 
  Box,
  LayoutGrid,
  Zap,
  Ham,
  Drumstick
} from "lucide-react"

export const CATEGORIES = [
  { id: '1', name: 'Zinger & Gourmet', slug: 'zinger-gourmet', icon: Zap },
  { id: '2', name: 'Burgers & Broast', slug: 'burgers-broast', icon: Drumstick },
  { id: '3', name: 'Sandwiches', slug: 'sandwiches', icon: Ham },
  { id: '4', name: 'Hot N Roll', slug: 'hot-n-roll', icon: Flame },
  { id: '5', name: 'Chinese', slug: 'chinese', icon: UtensilsCrossed },
  { id: '6', name: 'Starters', slug: 'starters', icon: ChefHat },
  { id: '7', name: 'Sidelines', slug: 'sidelines', icon: LayoutGrid },
  { id: '8', name: 'Combos', slug: 'combos', icon: Box },
]

export const PLACEHOLDER_ITEMS = [
  {
    id: 'p1',
    category_id: '1',
    name: 'Zinger Max',
    description: 'Double patty zinger burger with cheese and special sauce.',
    price: 470,
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
    is_popular: true,
    is_available: true,
  },
  {
    id: 'p2',
    category_id: '1',
    name: 'Zinger Fiery',
    description: 'Spicy zinger burger for the brave hearts.',
    price: 470,
    image_url: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1000&auto=format&fit=crop',
    is_popular: true,
    is_available: true,
  },
  {
    id: 'p3',
    category_id: '8',
    name: 'Economy Combo',
    description: '1 Zinger + 1 Regular Fries + 1 Drink.',
    price: 1030,
    image_url: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1000&auto=format&fit=crop',
    is_popular: true,
    is_available: true,
  },
]
