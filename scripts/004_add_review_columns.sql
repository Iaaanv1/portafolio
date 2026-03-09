-- Add missing columns to testimonials table
ALTER TABLE testimonials 
ADD COLUMN IF NOT EXISTS rating INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS work_type TEXT,
ADD COLUMN IF NOT EXISTS work_image_url TEXT,
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT NOW();

-- Update existing testimonials to be visible
UPDATE testimonials SET is_visible = true WHERE is_visible IS NULL;
UPDATE testimonials SET rating = 5 WHERE rating IS NULL;
