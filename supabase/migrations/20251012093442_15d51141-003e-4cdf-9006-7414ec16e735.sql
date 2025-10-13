-- Update RLS policies for brands table to allow public read access
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON brands;

-- Allow public read access
CREATE POLICY "Allow public read access to brands"
ON brands FOR SELECT
USING (true);

-- Allow authenticated users to manage brands
CREATE POLICY "Allow authenticated users to manage brands"
ON brands FOR ALL
USING (auth.role() = 'authenticated');

-- Update RLS policies for subbrands table to allow public read access
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON subbrands;

-- Allow public read access
CREATE POLICY "Allow public read access to subbrands"
ON subbrands FOR SELECT
USING (true);

-- Allow authenticated users to manage subbrands
CREATE POLICY "Allow authenticated users to manage subbrands"
ON subbrands FOR ALL
USING (auth.role() = 'authenticated');