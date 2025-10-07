-- Fix Function Search Path Security Issue
-- Set explicit search_path for all functions to prevent security vulnerabilities

-- Update the update_updated_at_column function to have secure search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

-- Update the create_student_profile function to have secure search_path  
CREATE OR REPLACE FUNCTION public.create_student_profile(
  p_user_id uuid,
  p_degree text,
  p_field_of_study text,
  p_area_of_study text,
  p_country text,
  p_university text,
  p_language text,
  p_language_test_type text,
  p_language_test_score bigint,
  p_language_test_year bigint,
  p_has_language_test bigint,
  p_study_envs text,
  p_interest_keywords text,
  p_work_experience text,
  p_fee_preference text,
  p_desired_degree_type text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
    country,
    university,
    language,
    language_test_type,
    language_test_score,
    language_test_year,
    has_language_test,
    study_envs,
    interest_keywords,
    work_experience,
    fee_preference,
    desired_degree_type,
    created_at,
    updated_at
  ) VALUES (
    -- Use the authenticated user's UUID converted to bigint
    abs(hashtext(auth.uid()::text))::bigint,
    p_degree,
    p_field_of_study,
    p_area_of_study,
    p_country,
    p_university,
    p_language,
    p_language_test_type,
    p_language_test_score,
    p_language_test_year,
    p_has_language_test,
    p_study_envs::jsonb,
    p_interest_keywords::jsonb,
    p_work_experience,
    p_fee_preference,
    p_desired_degree_type,
    now(),
    now()
  );
END;
$function$;