-- Remove user_id requirement from templates table for admin-only template creation
ALTER TABLE public.templates ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.templates ALTER COLUMN user_id SET DEFAULT NULL;

-- Update RLS policies for admin-only template management
DROP POLICY "Users can view public templates and their own templates" ON public.templates;
DROP POLICY "Users can create their own templates" ON public.templates;
DROP POLICY "Users can update their own templates" ON public.templates;
DROP POLICY "Users can delete their own templates" ON public.templates;

-- Create new policies for admin-managed public templates
CREATE POLICY "Everyone can view all templates" 
ON public.templates 
FOR SELECT 
USING (true);

-- For now, allow authenticated users to manage templates (you can restrict to admin role later)
CREATE POLICY "Authenticated users can create templates" 
ON public.templates 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update templates" 
ON public.templates 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete templates" 
ON public.templates 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Update template versions policies
DROP POLICY "Users can create versions for their templates" ON public.template_versions;

CREATE POLICY "Authenticated users can create template versions" 
ON public.template_versions 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);

-- Update template tags policies
DROP POLICY "Users can manage tags for their templates" ON public.template_tags;

CREATE POLICY "Authenticated users can manage all template tags" 
ON public.template_tags 
FOR ALL 
USING (auth.uid() IS NOT NULL);