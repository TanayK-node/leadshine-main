-- Create classifications table for product categories
CREATE TABLE IF NOT EXISTS public.classifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add age_range and classification_id to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS age_range text,
ADD COLUMN IF NOT EXISTS classification_id uuid REFERENCES public.classifications(id);

-- Enable RLS on classifications table
ALTER TABLE public.classifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for classifications (public read access)
CREATE POLICY "Allow public read access to classifications"
ON public.classifications
FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated users to manage classifications"
ON public.classifications
FOR ALL
TO authenticated
USING (auth.role() = 'authenticated'::text);

-- Insert default classifications
INSERT INTO public.classifications (name, description) VALUES
  ('Toys & Games', 'Fun and educational toys for children'),
  ('Art & Crafts', 'Creative materials and craft supplies'),
  ('School Essentials', 'Educational supplies and stationery'),
  ('Kids Accessories', 'Clothing accessories and personal items'),
  ('New Arrivals', 'Recently added products')
ON CONFLICT (name) DO NOTHING;

-- Add trigger for updated_at on classifications
CREATE TRIGGER update_classifications_updated_at
BEFORE UPDATE ON public.classifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();