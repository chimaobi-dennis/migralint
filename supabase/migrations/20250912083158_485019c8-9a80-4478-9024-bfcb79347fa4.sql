-- Fix RLS policies to allow template creation without authentication for admin system
DROP POLICY "Authenticated users can create templates" ON public.templates;
DROP POLICY "Authenticated users can update templates" ON public.templates;
DROP POLICY "Authenticated users can delete templates" ON public.templates;

-- Create new policies that allow template management without authentication
-- (You can add admin role checks later)
CREATE POLICY "Allow template creation" 
ON public.templates 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow template updates" 
ON public.templates 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow template deletion" 
ON public.templates 
FOR DELETE 
USING (true);

-- Also update related table policies to be more permissive for admin operations
DROP POLICY "Authenticated users can create template versions" ON public.template_versions;
DROP POLICY "Authenticated users can manage all template tags" ON public.template_tags;

CREATE POLICY "Allow template version creation" 
ON public.template_versions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow template tag management" 
ON public.template_tags 
FOR ALL 
USING (true);