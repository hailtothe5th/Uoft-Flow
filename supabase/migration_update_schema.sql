-- Migration: Update facilities table to use address instead of lat/lng
-- Run this in Supabase SQL Editor

-- Add address column if it doesn't exist
ALTER TABLE public.facilities
ADD COLUMN IF NOT EXISTS address TEXT;

-- Remove lat/lng columns if they exist
ALTER TABLE public.facilities
DROP COLUMN IF EXISTS lat,
DROP COLUMN IF EXISTS lng;

-- Update existing facilities with placeholder addresses (you'll need to update these manually)
-- This is just to prevent NULL constraint violations
UPDATE public.facilities
SET address = 'Address not available'
WHERE address IS NULL;

-- Make address NOT NULL after updating existing rows
ALTER TABLE public.facilities
ALTER COLUMN address SET NOT NULL;

-- Add toilet amenity columns to reviews table
ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS has_toilet_paper BOOLEAN,
ADD COLUMN IF NOT EXISTS has_soap BOOLEAN,
ADD COLUMN IF NOT EXISTS has_stall_lock BOOLEAN;
