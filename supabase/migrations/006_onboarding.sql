-- Add onboarded flag to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarded BOOLEAN DEFAULT false;

-- Mark existing users as already onboarded
UPDATE public.profiles SET onboarded = true WHERE created_at < NOW();
