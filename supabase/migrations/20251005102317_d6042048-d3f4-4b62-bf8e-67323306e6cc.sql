-- Fix Templates RLS Policies
DROP POLICY IF EXISTS "Everyone can view all templates" ON templates;
DROP POLICY IF EXISTS "Allow template creation" ON templates;
DROP POLICY IF EXISTS "Allow template updates" ON templates;
DROP POLICY IF EXISTS "Allow template deletion" ON templates;

-- Create proper restrictive policies
CREATE POLICY "Users can view public or own templates"
ON templates FOR SELECT
TO authenticated
USING (is_public = true OR user_id = auth.uid());

CREATE POLICY "Users can create their own templates"
ON templates FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
ON templates FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates"
ON templates FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Remove insecure application credentials storage
ALTER TABLE applications 
DROP COLUMN IF EXISTS application_login,
DROP COLUMN IF EXISTS application_password;

-- Create proper role management system
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON user_roles FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;