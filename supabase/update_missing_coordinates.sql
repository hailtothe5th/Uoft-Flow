-- Update facilities with missing lat/lng coordinates
-- Fill in coordinates for all UofT campus buildings

UPDATE public.facilities
SET 
  lat = CASE id
    WHEN 'convocationhall-m' THEN 43.6625
    WHEN 'galbraith-fountain' THEN 43.6605
    WHEN 'galbraith-m' THEN 43.6605
    WHEN 'koffler-fountain' THEN 43.6565
    WHEN 'koffler-m' THEN 43.6565
    WHEN 'lash-miller-fountain' THEN 43.6640
    WHEN 'lash-miller-m' THEN 43.6640
    WHEN 'myhal-fountain' THEN 43.6595
    WHEN 'myhal-m' THEN 43.6595
    WHEN 'oise-fountain' THEN 43.6670
    WHEN 'oise-m' THEN 43.6670
    WHEN 'robartscafe-fountain' THEN 43.6655
    WHEN 'uc-fountain' THEN 43.6635
    WHEN 'unioncollegeuc-m' THEN 43.6635
  END,
  lng = CASE id
    WHEN 'convocationhall-m' THEN -79.3955
    WHEN 'galbraith-fountain' THEN -79.3940
    WHEN 'galbraith-m' THEN -79.3940
    WHEN 'koffler-fountain' THEN -79.3955
    WHEN 'koffler-m' THEN -79.3955
    WHEN 'lash-miller-fountain' THEN -79.3980
    WHEN 'lash-miller-m' THEN -79.3980
    WHEN 'myhal-fountain' THEN -79.3945
    WHEN 'myhal-m' THEN -79.3945
    WHEN 'oise-fountain' THEN -79.4000
    WHEN 'oise-m' THEN -79.4000
    WHEN 'robartscafe-fountain' THEN -79.3990
    WHEN 'uc-fountain' THEN -79.3920
    WHEN 'unioncollegeuc-m' THEN -79.3920
  END
WHERE lat IS NULL OR lng IS NULL;

-- Verify all facilities now have coordinates
SELECT id, name, building, lat, lng
FROM public.facilities
ORDER BY building, name;
