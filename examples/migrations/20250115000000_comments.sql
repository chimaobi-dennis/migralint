-- This migration contains the kinds of mistakes migralint exists to catch.
CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts (id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.profiles (id),
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
-- Forgot: ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;  (S001)
-- Forgot: an index on post_id and author_id                       (P001)

-- A write policy that trusts everyone. (S003)
CREATE POLICY "anyone can comment" ON public.comments
  FOR INSERT WITH CHECK (true);

-- A policy that trusts user-editable metadata. (S005)
CREATE POLICY "admins delete comments" ON public.comments
  FOR DELETE USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- SECURITY DEFINER without a pinned search_path. (S006)
CREATE OR REPLACE FUNCTION public.comment_count(p uuid)
RETURNS bigint LANGUAGE sql SECURITY DEFINER AS $$
  SELECT count(*) FROM public.comments WHERE post_id = p;
$$;

-- Destructive changes slipped into a feature migration. (D002, D008)
ALTER TABLE public.posts DROP COLUMN body;
ALTER TABLE public.posts RENAME COLUMN title TO headline;
