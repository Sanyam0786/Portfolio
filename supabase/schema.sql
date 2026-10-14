-- ==========================================================
-- SUPABASE SCHEMA FOR SANYAM MUJAVADIA PORTFOLIO
-- Paste this entire script into your Supabase Dashboard:
-- SQL Editor -> New Query -> Run
-- ==========================================================

-- 1. Create Profile Table
CREATE TABLE IF NOT EXISTS public.profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Sanyam Mujavadia',
  role TEXT NOT NULL DEFAULT 'React & React Native Developer',
  email TEXT NOT NULL DEFAULT 'sanyammj786@gmail.com',
  linkedin TEXT DEFAULT 'https://www.linkedin.com/in/sanyam-mujavadia-88819328a/',
  whatsapp TEXT DEFAULT 'https://wa.me/917861961399',
  github TEXT DEFAULT 'https://github.com/Sanyam0786',
  formspree TEXT DEFAULT 'https://formspree.io/f/mrbkozgw',
  hero_sentences JSONB DEFAULT '["I build delightful mobile experiences.", "React Native & performance obsessed.", "Crafting polished interactions that users love.", "Available for selective remote freelance work."]'::jsonb,
  resume_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  level TEXT DEFAULT 'Expert',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  cover_image TEXT,
  screenshots TEXT[] DEFAULT '{}',
  demo JSONB DEFAULT '{}'::jsonb,
  highlights TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  challenges JSONB DEFAULT '[]'::jsonb,
  impact JSONB DEFAULT '[]'::jsonb,
  github TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Experience Table
CREATE TABLE IF NOT EXISTS public.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  period TEXT NOT NULL,
  impact TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Education Table
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school TEXT NOT NULL,
  degree TEXT NOT NULL,
  period TEXT NOT NULL,
  notes TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

-- Grant table and sequence permissions to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;

-- Public Read Policies (Anyone can view your portfolio)
CREATE POLICY "Allow public read on profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Allow public read on skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Allow public read on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read on experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Allow public read on education" ON public.education FOR SELECT USING (true);

-- Authenticated Admin Policies (Only you, logged in, can create/edit/delete)
CREATE POLICY "Allow admin write on profile" ON public.profile FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin write on skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin write on projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin write on experience" ON public.experience FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin write on education" ON public.education FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Storage bucket for project images, skill icons, and resume
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public can view images, authenticated admin can upload/delete
CREATE POLICY "Allow public view storage" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-media');
CREATE POLICY "Allow admin upload storage" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-media');
CREATE POLICY "Allow admin update storage" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-media');
CREATE POLICY "Allow admin delete storage" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio-media');
