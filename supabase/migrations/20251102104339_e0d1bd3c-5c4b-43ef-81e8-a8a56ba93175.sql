-- Create discount type enum
CREATE TYPE public.discount_type AS ENUM ('percentage', 'fixed');

-- Create coupons table
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type public.discount_type NOT NULL,
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  max_uses INTEGER CHECK (max_uses IS NULL OR max_uses > 0),
  current_uses INTEGER NOT NULL DEFAULT 0 CHECK (current_uses >= 0),
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  min_purchase_amount NUMERIC CHECK (min_purchase_amount IS NULL OR min_purchase_amount >= 0),
  max_discount_amount NUMERIC CHECK (max_discount_amount IS NULL OR max_discount_amount >= 0),
  applicable_to_products UUID[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create coupon_usage table to track who used which coupon
CREATE TABLE public.coupon_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  discount_amount NUMERIC NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(coupon_id, order_id)
);

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for coupons
CREATE POLICY "Public can read active coupons"
ON public.coupons
FOR SELECT
USING (is_active = true);

CREATE POLICY "Authenticated users can manage coupons"
ON public.coupons
FOR ALL
USING (auth.role() = 'authenticated');

-- RLS Policies for coupon_usage
CREATE POLICY "Users can view their own coupon usage"
ON public.coupon_usage
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert coupon usage"
ON public.coupon_usage
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Add trigger for updated_at
CREATE TRIGGER update_coupons_updated_at
BEFORE UPDATE ON public.coupons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add columns to orders table for coupon tracking
ALTER TABLE public.orders
ADD COLUMN coupon_id UUID REFERENCES public.coupons(id),
ADD COLUMN discount_amount NUMERIC DEFAULT 0;