-- Add description column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS description text;