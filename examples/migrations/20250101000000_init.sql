-- A small, deliberately imperfect schema used by `npm run lint:self` and the README.
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Lookup table that is meant to be world-readable (listed under publicTables in .migralint.yml).
CREATE TABLE public.categories (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles are readable" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "users edit own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "published posts are public" ON public.posts
  FOR SELECT USING (published = true);

CREATE POLICY "authors manage own posts" ON public.posts
  FOR ALL TO authenticated
  USING ((select auth.uid()) = author_id) WITH CHECK ((select auth.uid()) = author_id);

CREATE INDEX posts_author_id_idx ON public.posts (author_id);
