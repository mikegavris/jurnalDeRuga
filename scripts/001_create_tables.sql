-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create diary entries table
CREATE TABLE IF NOT EXISTS public.diary_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create prayer requests table
CREATE TABLE IF NOT EXISTS public.prayer_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'answered')),
  labels TEXT[] DEFAULT '{}',
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  answered_at TIMESTAMPTZ
);

-- Create prayer reminders table
CREATE TABLE IF NOT EXISTS public.prayer_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  time TIME NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_reminders ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can delete own profile" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Diary entries policies
CREATE POLICY "Users can view own diary entries" ON public.diary_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own diary entries" ON public.diary_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own diary entries" ON public.diary_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own diary entries" ON public.diary_entries FOR DELETE USING (auth.uid() = user_id);

-- Prayer requests policies
CREATE POLICY "Users can view own prayer requests" ON public.prayer_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view shared prayer requests" ON public.prayer_requests FOR SELECT USING (is_shared = true);
CREATE POLICY "Users can insert own prayer requests" ON public.prayer_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own prayer requests" ON public.prayer_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own prayer requests" ON public.prayer_requests FOR DELETE USING (auth.uid() = user_id);

-- Prayer reminders policies
CREATE POLICY "Users can view own prayer reminders" ON public.prayer_reminders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own prayer reminders" ON public.prayer_reminders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own prayer reminders" ON public.prayer_reminders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own prayer reminders" ON public.prayer_reminders FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
