-- Add toilet amenity columns to reviews table
ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS has_toilet_paper BOOLEAN,
ADD COLUMN IF NOT EXISTS has_soap BOOLEAN,
ADD COLUMN IF NOT EXISTS has_stall_lock BOOLEAN;
