-- Create announcement_banner table
CREATE TABLE public.announcement_banner (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  button_text TEXT,
  button_link TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  bg_color TEXT DEFAULT 'bg-primary',
  text_color TEXT DEFAULT 'text-primary-foreground',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.announcement_banner ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can read active banners
CREATE POLICY "Anyone can read active banners"
ON public.announcement_banner
FOR SELECT
USING (is_active = true);

-- RLS Policy: Only admins can manage banners
CREATE POLICY "Admins can manage banners"
ON public.announcement_banner
FOR ALL
USING (public.is_admin());

-- Add trigger for updated_at
CREATE TRIGGER update_announcement_banner_updated_at
BEFORE UPDATE ON public.announcement_banner
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default banner
INSERT INTO public.announcement_banner (text, button_text, button_link, is_active)
VALUES (
  '🎉 BIGGEST Wholesale Sale - Up to 50% Off + Free Shipping on Orders $500+',
  'Shop Now',
  '/shop-all',
  true
);

COMMENT ON TABLE public.announcement_banner IS 'Stores announcement banner settings that appear at the top of the site';