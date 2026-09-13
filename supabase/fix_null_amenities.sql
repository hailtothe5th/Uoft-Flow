-- Fix NULL amenity values in existing reviews
-- This will set NULL values to true (amenities available by default)

UPDATE public.reviews
SET 
  has_toilet_paper = COALESCE(has_toilet_paper, true),
  has_soap = COALESCE(has_soap, true),
  has_stall_lock = COALESCE(has_stall_lock, true)
WHERE has_toilet_paper IS NULL 
   OR has_soap IS NULL 
   OR has_stall_lock IS NULL;

-- Verify the update worked
SELECT 
  id,
  facility_id,
  has_toilet_paper,
  has_soap,
  has_stall_lock
FROM public.reviews
ORDER BY created_at DESC
LIMIT 10;
