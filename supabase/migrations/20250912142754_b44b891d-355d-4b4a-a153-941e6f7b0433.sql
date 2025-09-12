-- Ensure student_profile table has proper RLS policies
ALTER TABLE public.student_profile ENABLE ROW LEVEL SECURITY;

-- Create policies for student profile access
CREATE POLICY "Users can view their own profile" 
ON public.student_profile 
FOR SELECT 
USING (auth.uid()::bigint = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.student_profile 
FOR INSERT 
WITH CHECK (auth.uid()::bigint = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.student_profile 
FOR UPDATE 
USING (auth.uid()::bigint = user_id);

CREATE POLICY "Users can delete their own profile" 
ON public.student_profile 
FOR DELETE 
USING (auth.uid()::bigint = user_id);