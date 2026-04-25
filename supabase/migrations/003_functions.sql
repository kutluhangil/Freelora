-- ==========================================
-- 003_FUNCTIONS — Profitability, monthly summary, invoice numbering
-- ==========================================

-- Project profitability
CREATE OR REPLACE FUNCTION calculate_project_profitability(p_project_id UUID)
RETURNS TABLE (
  total_income DECIMAL,
  total_expense DECIMAL,
  net_profit DECIMAL,
  profit_margin DECIMAL,
  hours_logged DECIMAL,
  effective_hourly_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN COALESCE(t.amount_in_base, t.amount) ELSE 0 END), 0)::DECIMAL,
    COALESCE(SUM(CASE WHEN t.type = 'expense' THEN COALESCE(t.amount_in_base, t.amount) ELSE 0 END), 0)::DECIMAL,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN COALESCE(t.amount_in_base, t.amount) ELSE -COALESCE(t.amount_in_base, t.amount) END), 0)::DECIMAL,
    CASE
      WHEN SUM(CASE WHEN t.type = 'income' THEN COALESCE(t.amount_in_base, t.amount) ELSE 0 END) > 0
      THEN ((SUM(CASE WHEN t.type = 'income' THEN COALESCE(t.amount_in_base, t.amount) ELSE -COALESCE(t.amount_in_base, t.amount) END) /
            SUM(CASE WHEN t.type = 'income' THEN COALESCE(t.amount_in_base, t.amount) ELSE 0 END)) * 100)::DECIMAL
      ELSE 0::DECIMAL
    END,
    p.actual_hours::DECIMAL,
    CASE
      WHEN p.actual_hours > 0
      THEN (SUM(CASE WHEN t.type = 'income' THEN COALESCE(t.amount_in_base, t.amount) ELSE -COALESCE(t.amount_in_base, t.amount) END) / p.actual_hours)::DECIMAL
      ELSE 0::DECIMAL
    END
  FROM public.projects p
  LEFT JOIN public.transactions t ON t.project_id = p.id
  WHERE p.id = p_project_id
  GROUP BY p.actual_hours;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Monthly summary
CREATE OR REPLACE FUNCTION get_monthly_summary(
  p_user_id UUID,
  p_year INT,
  p_month INT
)
RETURNS TABLE (
  total_income DECIMAL,
  total_expense DECIMAL,
  net_income DECIMAL,
  transaction_count INT,
  top_category TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE WHEN type = 'income' THEN COALESCE(amount_in_base, amount) ELSE 0 END), 0)::DECIMAL,
    COALESCE(SUM(CASE WHEN type = 'expense' THEN COALESCE(amount_in_base, amount) ELSE 0 END), 0)::DECIMAL,
    COALESCE(SUM(CASE WHEN type = 'income' THEN COALESCE(amount_in_base, amount) ELSE -COALESCE(amount_in_base, amount) END), 0)::DECIMAL,
    COUNT(*)::INT,
    (SELECT category FROM public.transactions
     WHERE user_id = p_user_id AND EXTRACT(YEAR FROM date) = p_year AND EXTRACT(MONTH FROM date) = p_month
     GROUP BY category ORDER BY SUM(COALESCE(amount_in_base, amount)) DESC LIMIT 1)
  FROM public.transactions
  WHERE user_id = p_user_id
    AND EXTRACT(YEAR FROM date) = p_year
    AND EXTRACT(MONTH FROM date) = p_month;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-generate invoice numbers per user: FK-YYYY-NNNN
CREATE OR REPLACE FUNCTION next_invoice_number(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  yr TEXT := to_char(NOW(), 'YYYY');
  cnt INT;
BEGIN
  SELECT COUNT(*) + 1 INTO cnt
  FROM public.invoices
  WHERE user_id = p_user_id
    AND invoice_number LIKE 'FK-' || yr || '-%';
  RETURN 'FK-' || yr || '-' || lpad(cnt::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get last 6 months trend (income/expense by month)
CREATE OR REPLACE FUNCTION get_revenue_trend(p_user_id UUID, p_months INT DEFAULT 6)
RETURNS TABLE (
  month_label TEXT,
  income DECIMAL,
  expense DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH series AS (
    SELECT generate_series(
      date_trunc('month', NOW()) - ((p_months - 1) || ' months')::INTERVAL,
      date_trunc('month', NOW()),
      '1 month'::INTERVAL
    ) AS m
  )
  SELECT
    to_char(s.m, 'YYYY-MM')::TEXT,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN COALESCE(t.amount_in_base, t.amount) END), 0)::DECIMAL,
    COALESCE(SUM(CASE WHEN t.type = 'expense' THEN COALESCE(t.amount_in_base, t.amount) END), 0)::DECIMAL
  FROM series s
  LEFT JOIN public.transactions t ON t.user_id = p_user_id
    AND date_trunc('month', t.date) = s.m
  GROUP BY s.m
  ORDER BY s.m;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
