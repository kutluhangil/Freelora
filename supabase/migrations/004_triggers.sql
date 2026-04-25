-- ==========================================
-- 004_TRIGGERS — Auto-create profile, updated_at
-- ==========================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, locale)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'locale', 'tr')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at touchers
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['profiles','clients','projects','transactions','invoices'] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS touch_%I_updated_at ON public.%I', tbl, tbl);
    EXECUTE format('CREATE TRIGGER touch_%I_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at()', tbl, tbl);
  END LOOP;
END $$;

-- Auto-fill amount_in_base if exchange_rate set
CREATE OR REPLACE FUNCTION public.transactions_compute_base()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.amount_in_base IS NULL AND NEW.exchange_rate IS NOT NULL THEN
    NEW.amount_in_base := NEW.amount * NEW.exchange_rate;
  ELSIF NEW.amount_in_base IS NULL THEN
    NEW.amount_in_base := NEW.amount;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_transactions_compute_base ON public.transactions;
CREATE TRIGGER trg_transactions_compute_base
  BEFORE INSERT OR UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.transactions_compute_base();
