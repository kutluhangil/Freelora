-- ==========================================
-- 002_RLS_POLICIES — Row-Level Security
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;

-- PROFILES
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Macro: per-user CRUD policies
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['clients','projects','transactions','invoices','tax_reminders'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "%I_select_own" ON public.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY "%I_select_own" ON public.%I FOR SELECT USING (auth.uid() = user_id)', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "%I_insert_own" ON public.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY "%I_insert_own" ON public.%I FOR INSERT WITH CHECK (auth.uid() = user_id)', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "%I_update_own" ON public.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY "%I_update_own" ON public.%I FOR UPDATE USING (auth.uid() = user_id)', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "%I_delete_own" ON public.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY "%I_delete_own" ON public.%I FOR DELETE USING (auth.uid() = user_id)', tbl, tbl);
  END LOOP;
END $$;

-- INVOICE_ITEMS — via invoice ownership
DROP POLICY IF EXISTS "invoice_items_select_own" ON public.invoice_items;
CREATE POLICY "invoice_items_select_own" ON public.invoice_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.invoices i WHERE i.id = invoice_items.invoice_id AND i.user_id = auth.uid()));
DROP POLICY IF EXISTS "invoice_items_insert_own" ON public.invoice_items;
CREATE POLICY "invoice_items_insert_own" ON public.invoice_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.invoices i WHERE i.id = invoice_items.invoice_id AND i.user_id = auth.uid()));
DROP POLICY IF EXISTS "invoice_items_update_own" ON public.invoice_items;
CREATE POLICY "invoice_items_update_own" ON public.invoice_items FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.invoices i WHERE i.id = invoice_items.invoice_id AND i.user_id = auth.uid()));
DROP POLICY IF EXISTS "invoice_items_delete_own" ON public.invoice_items;
CREATE POLICY "invoice_items_delete_own" ON public.invoice_items FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.invoices i WHERE i.id = invoice_items.invoice_id AND i.user_id = auth.uid()));

-- SUBSCRIPTION_EVENTS — read own; writes via service-role only
DROP POLICY IF EXISTS "subscription_events_select_own" ON public.subscription_events;
CREATE POLICY "subscription_events_select_own" ON public.subscription_events FOR SELECT
  USING (auth.uid() = user_id);

-- EXCHANGE_RATES — public read
DROP POLICY IF EXISTS "exchange_rates_select_all" ON public.exchange_rates;
CREATE POLICY "exchange_rates_select_all" ON public.exchange_rates FOR SELECT USING (true);
