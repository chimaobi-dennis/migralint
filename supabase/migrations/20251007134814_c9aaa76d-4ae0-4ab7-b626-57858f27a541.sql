-- Add public read access policy for business_details table
CREATE POLICY "Allow public read access to business details"
ON public.business_details
FOR SELECT
USING (true);