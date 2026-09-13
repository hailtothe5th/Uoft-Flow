-- Add campus column to facilities table
ALTER TABLE public.facilities
ADD COLUMN IF NOT EXISTS campus TEXT;

-- Update all existing facilities with campus information
-- Based on addresses, all current facilities are on St. George campus
UPDATE public.facilities
SET campus = 'St. George'
WHERE campus IS NULL;

-- Verify the update
SELECT id, name, building, campus
FROM public.facilities
ORDER BY campus, building, name;
