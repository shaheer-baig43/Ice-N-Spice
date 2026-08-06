-- ICE N SPICE - COMPLETE MENU SEED SCRIPT
-- This script populates categories and menu items.

-- 1. CLEANUP (Optional: Only if you want to reset data)
TRUNCATE menu_items, categories CASCADE;

-- 2. INSERT CATEGORIES
INSERT INTO categories (name, slug, display_order) VALUES
('Zinger & Gourmet Series', 'zinger-gourmet', 1),
('Burgers & Broast', 'burgers-broast', 2),
('Sandwiches', 'sandwiches', 3),
('Hot N Roll', 'hot-n-roll', 4),
('Chinese', 'chinese', 5),
('Starters', 'starters', 6),
('Sidelines', 'sidelines', 7),
('Combos', 'combos', 8);

-- 3. INSERT MENU ITEMS
WITH cat AS (SELECT id, slug FROM categories)
INSERT INTO menu_items (category_id, name, description, price, is_popular, is_available, image_url) VALUES
-- Zinger & Gourmet Series
((SELECT id FROM cat WHERE slug = 'zinger-gourmet'), 'Zinger Max', 'Double crispy patty with secret sauce and cheese.', 470, true, true, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop'),
((SELECT id FROM cat WHERE slug = 'zinger-gourmet'), 'Zinger Fiery', 'Extra spicy zinger patty with jalapenos and fiery mayo.', 470, true, true, 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1000&auto=format&fit=crop'),
((SELECT id FROM cat WHERE slug = 'zinger-gourmet'), 'Zinger Burger', 'The classic Karachi zinger, crispy and juicy.', 480, false, true, 'https://images.unsplash.com/photo-1513185158878-8d8c196b7f81?q=80&w=1000&auto=format&fit=crop'),
((SELECT id FROM cat WHERE slug = 'zinger-gourmet'), 'Gourmet Beef', 'Premium beef patty with caramelised onions and swiss cheese.', 750, true, true, 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop'),

-- Sandwiches
((SELECT id FROM cat WHERE slug = 'sandwiches'), 'BBQ Sandwich', 'Smoky BBQ chicken shreds with lettuce and tomatoes.', 650, true, true, 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=1000&auto=format&fit=crop'),
((SELECT id FROM cat WHERE slug = 'sandwiches'), 'Club Sandwich', 'Traditional 3-layer sandwich with chicken, egg, and cheese.', 550, false, true, 'https://images.unsplash.com/photo-1550507992-eb63dedc1e50?q=80&w=1000&auto=format&fit=crop'),

-- Chinese
((SELECT id FROM cat WHERE slug = 'chinese'), 'Chicken Manchurian', 'Classic sweet and sour manchurian served with egg fried rice.', 700, true, true, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1000&auto=format&fit=crop'),
((SELECT id FROM cat WHERE slug = 'chinese'), 'Chicken Chowmein', 'Stir-fried noodles with veggies and juicy chicken chunks.', 680, true, true, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1000&auto=format&fit=crop'),

-- Burgers & Broast
((SELECT id FROM cat WHERE slug = 'burgers-broast'), 'Quarter Broast', 'Crispy fried chicken (chest/leg) with fries and bun.', 450, true, true, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000&auto=format&fit=crop'),
((SELECT id FROM cat WHERE slug = 'burgers-broast'), 'Beef Burger', 'Classic juicy beef patty with mayo and lettuce.', 550, false, true, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop'),

-- Hot N Roll
((SELECT id FROM cat WHERE slug = 'hot-n-roll'), 'Zinger Roll', 'Crispy zinger chunks wrapped in a fresh paratha.', 350, true, true, 'https://images.unsplash.com/photo-1662116765994-4e32086370ba?q=80&w=1000&auto=format&fit=crop'),

-- Starters
((SELECT id FROM cat WHERE slug = 'starters'), 'Finger Fish', 'Crispy fried fish fillets with tartar sauce.', 550, true, true, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1000&auto=format&fit=crop'),

-- Sidelines
((SELECT id FROM cat WHERE slug = 'sidelines'), 'Masala Fries', 'Large portion of fries with spicy Karachi masala.', 280, true, true, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1000&auto=format&fit=crop'),

-- Combos
((SELECT id FROM cat WHERE slug = 'combos'), 'Economy Combo', '1 Zinger + 1 Regular Fries + 1 Drink.', 1030, true, true, 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1000&auto=format&fit=crop'),
((SELECT id FROM cat WHERE slug = 'combos'), 'Family Feast', '4 Zingers + 1 Family Fries + 1.5L Drink.', 1550, true, true, 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1000&auto=format&fit=crop');
