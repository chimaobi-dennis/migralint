-- Create a sequence for student_profile id
CREATE SEQUENCE IF NOT EXISTS public.student_profile_id_seq;

-- Set the id column to use the sequence as default
ALTER TABLE public.student_profile 
ALTER COLUMN id SET DEFAULT nextval('public.student_profile_id_seq');

-- Set the sequence ownership to the id column
ALTER SEQUENCE public.student_profile_id_seq OWNED BY public.student_profile.id;