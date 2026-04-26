-- Track when overdue reminder was sent for each invoice
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS overdue_reminder_sent_at TIMESTAMPTZ;
