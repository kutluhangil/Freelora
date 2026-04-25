-- ==========================================
-- 005_SEED — Optional seed data (run manually)
-- ==========================================

-- Seed exchange rates (example, will be overwritten by cron)
INSERT INTO public.exchange_rates (base_currency, target_currency, rate)
VALUES
  ('USD','TRY', 38.50),
  ('USD','EUR', 0.92),
  ('USD','GBP', 0.79),
  ('USD','USD', 1.00)
ON CONFLICT (base_currency, target_currency) DO NOTHING;
