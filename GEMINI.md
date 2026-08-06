# IceNSpice Restaurant Website

## Project Overview
A modern, full-stack restaurant website built with Next.js 15, Tailwind CSS, and Supabase.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Icons:** Lucide React
- **Backend:** Supabase (Auth, Database, Real-time)
- **State Management:** React Context API (Cart)

## Features
- **Homepage:** Hero section, category browsing, popular items.
- **Menu:** Full menu with category filtering and search.
- **Cart:** Persistent cart with quantity controls.
- **Auth:** Email/Password authentication via Supabase.
- **Checkout:** Karachi-focused delivery address form and COD payment.
- **Order Tracking:** Real-time order status updates.
- **Admin Dashboard:** Stats, Menu CRUD, and Order status management.

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anonymous Key.

## Project Structure
- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components.
- `src/context`: React Context providers (Cart).
- `src/lib`: Utility functions and clients (Supabase).
- `src/types`: TypeScript interfaces.
- `src/constants`: Static data like categories and placeholder items.
