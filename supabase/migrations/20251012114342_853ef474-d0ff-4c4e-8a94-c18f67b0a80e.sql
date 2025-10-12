-- Drop existing RLS policies for student_profile
DROP POLICY IF EXISTS "Users can view their own student profile" ON public.student_profile;
DROP POLICY IF EXISTS "Users can create their own student profile" ON public.student_profile;
DROP POLICY IF EXISTS "Users can update their own student profile" ON public.student_profile;
DROP POLICY IF EXISTS "Users can delete their own student profile" ON public.student_profile;

-- Create new RLS policies using get_user_bigint_id function for proper UUID to bigint conversion
CREATE POLICY "Users can view their own student profile"
ON public.student_profile
FOR SELECT
USING (user_id = get_user_bigint_id(auth.uid()));

CREATE POLICY "Users can create their own student profile"
ON public.student_profile
FOR INSERT
WITH CHECK (user_id = get_user_bigint_id(auth.uid()));

CREATE POLICY "Users can update their own student profile"
ON public.student_profile
FOR UPDATE
USING (user_id = get_user_bigint_id(auth.uid()))
WITH CHECK (user_id = get_user_bigint_id(auth.uid()));

CREATE POLICY "Users can delete their own student profile"
ON public.student_profile
FOR DELETE
USING (user_id = get_user_bigint_id(auth.uid()));