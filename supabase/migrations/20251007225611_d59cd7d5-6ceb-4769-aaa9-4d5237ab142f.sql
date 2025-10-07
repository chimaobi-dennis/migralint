-- Remove university_country column from student_profile
ALTER TABLE public.student_profile 
DROP COLUMN IF EXISTS university_country;

-- Ensure university column exists (it should already exist)
-- This is just for safety in case it doesn't
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'student_profile' 
    AND column_name = 'university'
  ) THEN
    ALTER TABLE public.student_profile ADD COLUMN university text;
  END IF;
END $$;