-- Create a function to sync auth.users with public.user table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into public.user table with bigint id derived from auth uuid
  INSERT INTO public.user (
    id,
    name,
    lname,
    email,
    created_at,
    updated_at,
    status
  ) VALUES (
    -- Convert UUID to bigint using consistent hashing
    abs(hashtext(NEW.id::text))::bigint,
    COALESCE(NEW.raw_user_meta_data->>'firstName', ''),
    COALESCE(NEW.raw_user_meta_data->>'lastName', ''),
    NEW.email,
    NOW(),
    NOW(),
    1  -- Active status
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create a helper function to get user's bigint id from their auth uuid
CREATE OR REPLACE FUNCTION public.get_user_bigint_id(auth_uuid uuid)
RETURNS bigint
LANGUAGE sql
STABLE
AS $$
  SELECT abs(hashtext(auth_uuid::text))::bigint;
$$;

-- Update RLS policies to use the helper function for proper type handling
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user;
CREATE POLICY "Users can view their own profile"
ON public.user
FOR SELECT
USING (id = public.get_user_bigint_id(auth.uid()));

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user;
CREATE POLICY "Users can update their own profile"
ON public.user
FOR UPDATE
USING (id = public.get_user_bigint_id(auth.uid()))
WITH CHECK (id = public.get_user_bigint_id(auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user;
CREATE POLICY "Users can insert their own profile"
ON public.user
FOR INSERT
WITH CHECK (id = public.get_user_bigint_id(auth.uid()));