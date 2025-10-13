-- Ensure RLS is enabled (idempotent)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public (anon) read access to products
DROP POLICY IF EXISTS "Products are publicly readable" ON public.products;
CREATE POLICY "Products are publicly readable"
ON public.products
FOR SELECT
USING (true);
