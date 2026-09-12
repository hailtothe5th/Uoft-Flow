-- Fix RLS policies for profiles table
-- This fixes the 401 Unauthorized error when creating profiles

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;

-- Create a more permissive policy that allows users to create their own profile
CREATE POLICY "Enable insert for authenticated users"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Also add a policy to allow users to update their own profile
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
CREATE POLICY "Enable update for users based on id"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Ensure users can read all profiles (for showing display names)
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
CREATE POLICY "Enable read access for all users"
ON public.profiles
FOR SELECT
TO authenticated, anon
USING (true);
