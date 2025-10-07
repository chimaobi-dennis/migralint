-- Enable public read access to programs table (dummy migration)
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view programs"
ON public.programs
FOR SELECT
USING (true);

-- Optional grants (Supabase usually manages these, keep if your setup needs them)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.programs TO anon, authenticated;
