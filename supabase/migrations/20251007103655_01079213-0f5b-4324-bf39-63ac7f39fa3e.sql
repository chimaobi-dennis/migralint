-- Enable public read access to universities table
CREATE POLICY "Anyone can view universities"
ON public.universities
FOR SELECT
USING (true);