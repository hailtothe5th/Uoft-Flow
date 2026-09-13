-- Add menstrual products and baby change station columns to facilities table
ALTER TABLE public.facilities
ADD COLUMN IF NOT EXISTS has_free_menstrual_products BOOLEAN,
ADD COLUMN IF NOT EXISTS has_baby_change_station BOOLEAN;

-- Update existing facilities (set to false as we don't have data)
UPDATE public.facilities
SET 
  has_free_menstrual_products = false,
  has_baby_change_station = false
WHERE has_free_menstrual_products IS NULL OR has_baby_change_station IS NULL;

-- Verify the update
SELECT id, name, has_free_menstrual_products, has_baby_change_station
FROM public.facilities
ORDER BY building, name;
