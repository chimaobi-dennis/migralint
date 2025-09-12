-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.student_profile;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.student_profile;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.student_profile;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.student_profile;

-- Create RLS policies with proper data type handling
CREATE POLICY "Users can view their own profile" 
ON public.student_profile 
FOR SELECT 
USING (user_id = (SELECT id FROM auth.users WHERE auth.uid() = id LIMIT 1)::bigint);

CREATE POLICY "Users can create their own profile" 
ON public.student_profile 
FOR INSERT 
WITH CHECK (user_id = (SELECT id FROM auth.users WHERE auth.uid() = id LIMIT 1)::bigint);

CREATE POLICY "Users can update their own profile" 
ON public.student_profile 
FOR UPDATE 
USING (user_id = (SELECT id FROM auth.users WHERE auth.uid() = id LIMIT 1)::bigint);

CREATE POLICY "Users can delete their own profile" 
ON public.student_profile 
FOR DELETE 
USING (user_id = (SELECT id FROM auth.users WHERE auth.uid() = id LIMIT 1)::bigint);