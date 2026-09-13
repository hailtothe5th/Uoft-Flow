-- Add lat/lng columns to facilities table for distance calculation and map view

ALTER TABLE public.facilities
ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;

-- Update existing facilities with coordinates (UofT campus locations)
UPDATE public.facilities SET lat = 43.6651, lng = -79.3987 WHERE building = 'Robarts Library';
UPDATE public.facilities SET lat = 43.6612, lng = -79.3962 WHERE building = 'Sidney Smith Hall';
UPDATE public.facilities SET lat = 43.6597, lng = -79.3973 WHERE building = 'Bahen Centre';
UPDATE public.facilities SET lat = 43.6635, lng = -79.3942 WHERE building = 'Gerstein Science Information Centre';
UPDATE public.facilities SET lat = 43.6600, lng = -79.3935 WHERE building = 'Myhal Centre for Engineering Innovation';
UPDATE public.facilities SET lat = 43.6645, lng = -79.3915 WHERE building = 'Hart House';
UPDATE public.facilities SET lat = 43.6620, lng = -79.3930 WHERE building = 'Medical Sciences Building';
UPDATE public.facilities SET lat = 43.6565, lng = -79.3955 WHERE building = 'Koffler House';
