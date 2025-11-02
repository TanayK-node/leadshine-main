-- Add discount_price column to products table
ALTER TABLE public.products
ADD COLUMN discount_price NUMERIC CHECK (discount_price IS NULL OR discount_price >= 0);

-- Add shipping_amount to orders table
ALTER TABLE public.orders
ADD COLUMN shipping_amount NUMERIC DEFAULT 0;

COMMENT ON COLUMN public.products.discount_price IS 'Discounted price for the product. If set, this price will be used instead of MRP (INR)';
COMMENT ON COLUMN public.orders.shipping_amount IS 'Shipping charges for the order';