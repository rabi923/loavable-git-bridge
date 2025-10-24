-- Allow users to view public profile information of other users
-- This is needed for chat participants and map markers to display giver/receiver info
CREATE POLICY "Anyone can view public profile info"
ON public.profiles
FOR SELECT
USING (true);

-- Drop the old restrictive policy that prevented viewing other profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;