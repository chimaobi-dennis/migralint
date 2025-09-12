-- Create templates table for template builder
CREATE TABLE public.templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'resume',
  is_premium BOOLEAN NOT NULL DEFAULT false,
  is_public BOOLEAN NOT NULL DEFAULT false,
  structure JSONB NOT NULL DEFAULT '{}',
  styling JSONB NOT NULL DEFAULT '{}',
  content JSONB NOT NULL DEFAULT '{}',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create template versions table for version control
CREATE TABLE public.template_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  structure JSONB NOT NULL DEFAULT '{}',
  styling JSONB NOT NULL DEFAULT '{}',
  content JSONB NOT NULL DEFAULT '{}',
  changes_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL
);

-- Create template categories table
CREATE TABLE public.template_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create template tags table for better organization
CREATE TABLE public.template_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(template_id, tag)
);

-- Create template usage analytics
CREATE TABLE public.template_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'view', 'use', 'download', 'favorite'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for templates
CREATE POLICY "Users can view public templates and their own templates" 
ON public.templates 
FOR SELECT 
USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own templates" 
ON public.templates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates" 
ON public.templates 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates" 
ON public.templates 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for template versions
CREATE POLICY "Users can view versions of accessible templates" 
ON public.template_versions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.templates t 
    WHERE t.id = template_versions.template_id 
    AND (t.is_public = true OR t.user_id = auth.uid())
  )
);

CREATE POLICY "Users can create versions for their templates" 
ON public.template_versions 
FOR INSERT 
WITH CHECK (
  auth.uid() = created_by AND
  EXISTS (
    SELECT 1 FROM public.templates t 
    WHERE t.id = template_versions.template_id 
    AND t.user_id = auth.uid()
  )
);

-- RLS Policies for template categories (public read, admin write)
CREATE POLICY "Everyone can view template categories" 
ON public.template_categories 
FOR SELECT 
USING (true);

-- RLS Policies for template tags
CREATE POLICY "Users can view tags for accessible templates" 
ON public.template_tags 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.templates t 
    WHERE t.id = template_tags.template_id 
    AND (t.is_public = true OR t.user_id = auth.uid())
  )
);

CREATE POLICY "Users can manage tags for their templates" 
ON public.template_tags 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.templates t 
    WHERE t.id = template_tags.template_id 
    AND t.user_id = auth.uid()
  )
);

-- RLS Policies for template usage
CREATE POLICY "Users can view their own usage analytics" 
ON public.template_usage 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create usage records" 
ON public.template_usage 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_templates_user_id ON public.templates(user_id);
CREATE INDEX idx_templates_type ON public.templates(type);
CREATE INDEX idx_templates_public ON public.templates(is_public) WHERE is_public = true;
CREATE INDEX idx_template_versions_template_id ON public.template_versions(template_id);
CREATE INDEX idx_template_tags_template_id ON public.template_tags(template_id);
CREATE INDEX idx_template_tags_tag ON public.template_tags(tag);
CREATE INDEX idx_template_usage_template_id ON public.template_usage(template_id);
CREATE INDEX idx_template_usage_user_id ON public.template_usage(user_id);
CREATE INDEX idx_template_usage_action ON public.template_usage(action);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_templates_updated_at
    BEFORE UPDATE ON public.templates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default template categories
INSERT INTO public.template_categories (name, description, icon, color) VALUES
('Resume', 'Professional resume templates', 'FileText', 'blue'),
('Cover Letter', 'Cover letter templates', 'Mail', 'green'),
('Portfolio', 'Portfolio and showcase templates', 'Briefcase', 'purple'),
('Academic', 'Academic and research templates', 'GraduationCap', 'orange');

-- Enable real-time for all template tables
ALTER TABLE public.templates REPLICA IDENTITY FULL;
ALTER TABLE public.template_versions REPLICA IDENTITY FULL;
ALTER TABLE public.template_categories REPLICA IDENTITY FULL;
ALTER TABLE public.template_tags REPLICA IDENTITY FULL;
ALTER TABLE public.template_usage REPLICA IDENTITY FULL;

-- Add tables to supabase_realtime publication for real-time updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.templates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.template_versions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.template_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.template_tags;
ALTER PUBLICATION supabase_realtime ADD TABLE public.template_usage;