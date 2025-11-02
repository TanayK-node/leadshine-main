-- Add video_url column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url text;

-- Create storage bucket for product videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-videos', 'product-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for product videos bucket
CREATE POLICY "Allow authenticated users to upload product videos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'product-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to product videos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-videos');

CREATE POLICY "Allow authenticated users to delete product videos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'product-videos' AND auth.role() = 'authenticated');