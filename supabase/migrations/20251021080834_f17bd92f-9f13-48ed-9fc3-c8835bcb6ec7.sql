-- Create junction table for product classifications (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.product_classifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  classification_id uuid NOT NULL REFERENCES public.classifications(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(product_id, classification_id)
);

-- Enable RLS
ALTER TABLE public.product_classifications ENABLE ROW LEVEL SECURITY;

-- Create policies for product_classifications
CREATE POLICY "Public read access to product classifications"
  ON public.product_classifications
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage product classifications"
  ON public.product_classifications
  FOR ALL
  USING (auth.role() = 'authenticated'::text);

-- Migrate existing data from products.classification_id to junction table
INSERT INTO public.product_classifications (product_id, classification_id)
SELECT id, classification_id
FROM public.products
WHERE classification_id IS NOT NULL
ON CONFLICT (product_id, classification_id) DO NOTHING;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_product_classifications_product_id ON public.product_classifications(product_id);
CREATE INDEX IF NOT EXISTS idx_product_classifications_classification_id ON public.product_classifications(classification_id);