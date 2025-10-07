-- Add public read access policy for programs table
CREATE POLICY "Allow public read access to programs" ON public.programs
FOR SELECT USING (true);