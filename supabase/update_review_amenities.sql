-- Update existing reviews to have default amenity values
-- This will set all NULL values to true (amenities available)

UPDATE public.reviews
SET 
  has_toilet_paper = COALESCE(has_toilet_paper, true),
  has_soap = COALESCE(has_soap, true),
  has_stall_lock = COALESCE(has_stall_lock, true)
WHERE has_toilet_paper IS NULL 
   OR has_soap IS NULL 
   OR has_stall_lock IS NULL;

-- Verify the update
SELECT 
  id,
  facility_id,
  has_toilet_paper,
  has_soap,
  has_stall_lock
FROM public.reviews
LIMIT 10;
