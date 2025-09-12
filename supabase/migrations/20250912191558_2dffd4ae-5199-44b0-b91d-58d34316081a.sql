-- PHASE 1: EMERGENCY DATA PROTECTION - RLS Policies for Critical Tables

-- 1. Enable RLS on all critical tables
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_destinations ENABLE ROW LEVEL SECURITY;

-- 2. USER TABLE POLICIES - Users can only access their own data
CREATE POLICY "Users can view their own profile" 
ON public.user 
FOR SELECT 
TO authenticated
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" 
ON public.user 
FOR UPDATE 
TO authenticated
USING (auth.uid()::text = id::text)
WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can insert their own profile" 
ON public.user 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid()::text = id::text);

-- 3. APPLICATIONS TABLE POLICIES - Users can only access their own applications
CREATE POLICY "Users can view their own applications" 
ON public.applications 
FOR SELECT 
TO authenticated
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own applications" 
ON public.applications 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own applications" 
ON public.applications 
FOR UPDATE 
TO authenticated
USING (auth.uid()::text = user_id::text)
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own applications" 
ON public.applications 
FOR DELETE 
TO authenticated
USING (auth.uid()::text = user_id::text);

-- 4. STUDENT_PROFILE TABLE POLICIES - Users can only access their own profile
CREATE POLICY "Users can view their own student profile" 
ON public.student_profile 
FOR SELECT 
TO authenticated
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own student profile" 
ON public.student_profile 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own student profile" 
ON public.student_profile 
FOR UPDATE 
TO authenticated
USING (auth.uid()::text = user_id::text)
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own student profile" 
ON public.student_profile 
FOR DELETE 
TO authenticated
USING (auth.uid()::text = user_id::text);

-- 5. REFERENCE TABLES POLICIES - Public read access for authenticated users
-- Countries table - read-only access for all authenticated users
CREATE POLICY "Authenticated users can view countries" 
ON public.countries 
FOR SELECT 
TO authenticated
USING (true);

-- Programs table - read-only access for all authenticated users
CREATE POLICY "Authenticated users can view programs" 
ON public.programs 
FOR SELECT 
TO authenticated
USING (true);

-- Study destinations table - read-only access for all authenticated users
CREATE POLICY "Authenticated users can view study destinations" 
ON public.study_destinations 
FOR SELECT 
TO authenticated
USING (true);

-- 6. Update the create_student_profile function to be more secure
CREATE OR REPLACE FUNCTION public.create_student_profile(
  p_user_id uuid,
  p_degree text,
  p_field_of_study text,
  p_area_of_study text,
  p_desired_fields text,
  p_origin_country text,
  p_university_country text,
  p_language text,
  p_language_test_type text,
  p_language_test_score bigint,
  p_language_test_year bigint,
  p_has_language_test bigint,
  p_study_envs text,
  p_interest_keywords text,
  p_work_experience text,
  p_fee_preference text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Ensure the user can only create profiles for themselves
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'You can only create profiles for yourself';
  END IF;

  -- Insert the student profile with proper user mapping
  INSERT INTO public.student_profile (
    user_id,
    degree,
    field_of_study,
    area_of_study,
    desired_fields,
    origin_country,
    university_country,
    language,
    language_test_type,
    language_test_score,
    language_test_year,
    has_language_test,
    study_envs,
    interest_keywords,
    work_experience,
    fee_preference,
    created_at,
    updated_at
  ) VALUES (
    -- Use the authenticated user's UUID converted to bigint
    abs(hashtext(auth.uid()::text))::bigint,
    p_degree,
    p_field_of_study,
    p_area_of_study,
    p_desired_fields::jsonb,
    p_origin_country,
    p_university_country,
    p_language,
    p_language_test_type,
    p_language_test_score,
    p_language_test_year,
    p_has_language_test,
    p_study_envs::jsonb,
    p_interest_keywords::jsonb,
    p_work_experience,
    p_fee_preference,
    now(),
    now()
  );
END;
$function$;