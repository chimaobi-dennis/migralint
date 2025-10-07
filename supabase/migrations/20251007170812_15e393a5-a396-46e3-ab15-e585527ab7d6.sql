-- Fix the handle_new_user function with properly quoted column names
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert into public.user table with bigint id derived from auth uuid
  INSERT INTO public.user (
    id,
    name,
    lname,
    email,
    country,
    "countryCode",
    phone,
    created_at,
    updated_at,
    status
  ) VALUES (
    abs(hashtext(NEW.id::text))::bigint,
    COALESCE(NEW.raw_user_meta_data->>'firstName', ''),
    COALESCE(NEW.raw_user_meta_data->>'lastName', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'country', ''),
    COALESCE(NEW.raw_user_meta_data->>'countryCode', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NOW(),
    NOW(),
    1
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$function$;