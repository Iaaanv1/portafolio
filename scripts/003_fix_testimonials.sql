-- Fix existing testimonials to be visible
UPDATE testimonials SET is_visible = true WHERE is_visible IS NULL OR is_visible = false;
