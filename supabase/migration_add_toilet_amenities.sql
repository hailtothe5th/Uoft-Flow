-- Migration: Add toilet amenity fields to reviews table
-- Run this in Supabase SQL Editor to add the new columns

-- Add new columns for toilet-specific amenities
ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS has_toilet_paper BOOLEAN,
ADD COLUMN IF NOT EXISTS has_soap BOOLEAN,
ADD COLUMN IF NOT EXISTS has_stall_lock BOOLEAN;

-- These columns are optional and only used for toilet reviews
-- Existing reviews will have NULL values for these fields
