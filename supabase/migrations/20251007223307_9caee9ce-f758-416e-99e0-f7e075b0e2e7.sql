-- Add missing columns to student_profile table
ALTER TABLE public.student_profile
ADD COLUMN IF NOT EXISTS origin_country text,
ADD COLUMN IF NOT EXISTS university_country text;

-- Drop and recreate the create_student_profile function with correct schema mapping
DROP FUNCTION IF EXISTS public.create_student_profile(uuid, text, text, text, text, text, text, text, text, bigint, bigint, bigint, text, text, text, text);

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
SET search_path = 'public'
AS $function$
BEGIN
  -- Ensure the user can only create profiles for themselves
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'You can only create profiles for yourself';
  END IF;

  -- Insert the student profile
  INSERT INTO public.student_profile (
    user_id,
    degree,
    field_of_study,
    area_of_study,
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
    desired_degree_type,
    created_at,
    updated_at
  ) VALUES (
    abs(hashtext(auth.uid()::text))::bigint,
    p_degree,
    p_field_of_study,
    p_area_of_study,
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
    p_desired_fields,
    now(),
    now()
  );
END;
$function$;