-- Add new columns to testimonials table for public submissions
ALTER TABLE testimonials 
ADD COLUMN IF NOT EXISTS work_type TEXT,
ADD COLUMN IF NOT EXISTS work_image_url TEXT,
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing testimonials to be visible
UPDATE testimonials SET is_visible = true WHERE is_visible IS NULL;

-- Allow public inserts (anyone can submit a testimonial)
DROP POLICY IF EXISTS "Allow public read access" ON testimonials;
DROP POLICY IF EXISTS "Allow authenticated users to modify" ON testimonials;

-- Public can read only visible testimonials
CREATE POLICY "Allow public read visible testimonials" 
ON testimonials FOR SELECT 
USING (is_visible = true);

-- Public can insert new testimonials (pending approval)
CREATE POLICY "Allow public insert testimonials" 
ON testimonials FOR INSERT 
WITH CHECK (true);

-- Authenticated users can read all testimonials
CREATE POLICY "Allow authenticated read all testimonials" 
ON testimonials FOR SELECT 
TO authenticated
USING (true);

-- Authenticated users can update testimonials
CREATE POLICY "Allow authenticated update testimonials" 
ON testimonials FOR UPDATE 
TO authenticated
USING (true);

-- Authenticated users can delete testimonials
CREATE POLICY "Allow authenticated delete testimonials" 
ON testimonials FOR DELETE 
TO authenticated
USING (true);
