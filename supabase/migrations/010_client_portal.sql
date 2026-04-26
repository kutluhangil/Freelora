-- Client portal token for public invoice view
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS portal_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex');

-- Backfill existing clients
UPDATE public.clients SET portal_token = encode(gen_random_bytes(16), 'hex') WHERE portal_token IS NULL;
