-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT NOT NULL,
  duration TEXT NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  ai_tag TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
DROP POLICY IF EXISTS "Public read access" ON services;
CREATE POLICY "Public read access"
  ON services FOR SELECT
  USING (true);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE services;

-- Insert sample data for Haircare services
INSERT INTO services (title, description, price, duration, image, category, ai_tag) VALUES
('Precision Haircut', 'Expert haircut tailored to your face shape, hair texture, and personal style.', '$75+', '45 min', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80', 'haircare', 'Recommended for fine hair'),
('Hair Styling & Blowout', 'Professional styling and blowout that gives your hair volume, shine and movement.', '$65+', '60 min', 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80', 'haircare', 'Perfect for special events'),
('Hair Color & Highlights', 'Premium hair coloring with dimensional highlights for a natural, radiant look.', '$120+', '120 min', 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80', 'haircare', 'Trending style this season');

-- Insert sample data for Skincare services
INSERT INTO services (title, description, price, duration, image, category, ai_tag) VALUES
('Hydrating Facial', 'Intensive moisture treatment for dry, dehydrated skin using hyaluronic acid and botanicals.', '$135+', '60 min', 'https://images.unsplash.com/photo-1596178060810-72660ee8a9d1?w=800&q=80', 'skincare', 'Perfect for dry skin'),
('Anti-Aging Facial', 'Targeted treatment to reduce signs of aging with peptides, antioxidants, and gentle exfoliation.', '$165+', '75 min', 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80', 'skincare', 'Recommended for 35+ skin'),
('Acne Treatment Facial', 'Deep cleansing treatment targeting acne-prone skin with antibacterial and anti-inflammatory ingredients.', '$145+', '60 min', 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&q=80', 'skincare', 'Solution for breakouts');

-- Insert sample data for Massage services
INSERT INTO services (title, description, price, duration, image, category, ai_tag) VALUES
('Swedish Relaxation Massage', 'Classic massage technique using long strokes and kneading to relieve tension and improve circulation.', '$130+', '60 min', 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80', 'massage', 'Stress reliever'),
('Deep Tissue Massage', 'Therapeutic massage targeting deeper muscle layers to release chronic tension and pain.', '$150+', '60 min', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80', 'massage', 'Pain relief specialist'),
('Hot Stone Therapy', 'Relaxing massage using smooth, heated stones to ease muscle tension and improve circulation.', '$165+', '75 min', 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80', 'massage', 'Heat therapy benefits');

-- Insert sample data for Wellness services
INSERT INTO services (title, description, price, duration, image, category, ai_tag) VALUES
('Full Body Detox Wrap', 'Purifying body wrap that eliminates toxins, reduces water retention, and leaves skin glowing.', '$145+', '90 min', 'https://images.unsplash.com/photo-1554344728-77cf90d9ed26?w=800&q=80', 'wellness', 'Total body refresh'),
('Yoga & Guided Breathing Sessions', 'One-on-one yoga instruction with focused breathing techniques tailored to your wellness goals.', '$110+', '60 min', 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&q=80', 'wellness', 'Mind-body balance'),
('Meditation + Aromatherapy Room', 'Guided meditation in a sensory room with carefully selected essential oils to enhance relaxation.', '$95+', '45 min', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80', 'wellness', 'Mental clarity booster');