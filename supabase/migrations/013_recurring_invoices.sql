CREATE TABLE public.recurring_invoice_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  items JSONB NOT NULL DEFAULT '[]',
  currency TEXT NOT NULL DEFAULT 'TRY',
  tax_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  discount_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  notes TEXT,
  payment_terms TEXT,
  interval TEXT NOT NULL DEFAULT 'monthly' CHECK (interval IN ('monthly', 'quarterly', 'yearly')),
  day_of_month INTEGER NOT NULL DEFAULT 1 CHECK (day_of_month BETWEEN 1 AND 28),
  due_days INTEGER NOT NULL DEFAULT 14,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_generated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.recurring_invoice_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users manage own recurring configs" ON public.recurring_invoice_configs
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_recurring_user ON public.recurring_invoice_configs(user_id);
CREATE INDEX idx_recurring_active ON public.recurring_invoice_configs(day_of_month) WHERE is_active = true;

CREATE TRIGGER update_recurring_invoice_configs_updated_at
  BEFORE UPDATE ON public.recurring_invoice_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
