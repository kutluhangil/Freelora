export type NotificationType = "invoice_paid" | "invoice_overdue" | "tax_reminder" | "invoice_generated" | "general";

export type PlanTier = "free" | "basic" | "pro";
export type PlanStatus = "active" | "canceled" | "past_due" | "paused";
export type TransactionType = "income" | "expense";
export type ProjectStatus = "active" | "completed" | "paused" | "canceled";
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "canceled";
export type RecurringInterval = "monthly" | "quarterly" | "yearly";
export type TaxType =
  | "kdv"
  | "muhtasar"
  | "gecici_vergi"
  | "gelir_vergisi"
  | "sgk"
  | "bagkur"
  | "us_quarterly"
  | "vat_eu"
  | "custom";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  tax_id: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string;
  preferred_currency: string;
  locale: string;
  avatar_url: string | null;
  plan: PlanTier;
  plan_status: PlanStatus;
  lemon_squeezy_customer_id: string | null;
  lemon_squeezy_subscription_id: string | null;
  onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  tax_id: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  currency: string;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  client_id: string | null;
  name: string;
  description: string | null;
  status: ProjectStatus;
  budget_amount: number | null;
  budget_currency: string;
  hourly_rate: number | null;
  estimated_hours: number | null;
  actual_hours: number;
  start_date: string | null;
  end_date: string | null;
  color: string;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  project_id: string | null;
  client_id: string | null;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  currency: string;
  amount_in_base: number | null;
  exchange_rate: number | null;
  date: string;
  is_recurring: boolean;
  recurring_interval: RecurringInterval | null;
  receipt_url: string | null;
  notes: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  client_id: string | null;
  project_id: string | null;
  invoice_number: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  currency: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_rate: number;
  discount_amount: number;
  total: number;
  notes: string | null;
  payment_terms: string | null;
  pdf_url: string | null;
  sent_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  sort_order: number;
  created_at: string;
}

export interface TaxReminder {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string;
  reminder_date: string;
  type: TaxType;
  country: string;
  is_recurring: boolean;
  recurring_interval: RecurringInterval | null;
  is_completed: boolean;
  notified: boolean;
  created_at: string;
}

export interface ExchangeRate {
  id: string;
  base_currency: string;
  target_currency: string;
  rate: number;
  fetched_at: string;
}

export type ProposalStatus = "draft" | "sent" | "accepted" | "rejected";

export interface ProposalItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface TimeEntry {
  id: string;
  user_id: string;
  project_id: string | null;
  client_id: string | null;
  description: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  hourly_rate: number | null;
  currency: string;
  is_billed: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: string;
  user_id: string;
  client_id: string | null;
  title: string;
  items: ProposalItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_rate: number;
  discount_amount: number;
  total: number;
  currency: string;
  status: ProposalStatus;
  valid_until: string | null;
  notes: string | null;
  public_token: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string | null;
  href: string | null;
  read: boolean;
  created_at: string;
}

export interface RecurringInvoiceConfig {
  id: string;
  user_id: string;
  client_id: string | null;
  title: string;
  items: ProposalItem[];
  currency: string;
  tax_rate: number;
  discount_rate: number;
  notes: string | null;
  payment_terms: string | null;
  interval: RecurringInterval;
  day_of_month: number;
  due_days: number;
  is_active: boolean;
  last_generated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionEvent {
  id: string;
  user_id: string;
  event_type: string;
  plan: string;
  lemon_squeezy_event_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

type TableDef<Row, Insert = Row, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: never[];
};

export interface Database {
  public: {
    Tables: {
      profiles: TableDef<Profile, Partial<Profile> & { id: string }>;
      clients: TableDef<Client, Omit<Client, "id" | "created_at" | "updated_at" | "is_active"> & { id?: string; is_active?: boolean }>;
      projects: TableDef<Project, Omit<Project, "id" | "created_at" | "updated_at" | "actual_hours"> & { id?: string; actual_hours?: number }>;
      transactions: TableDef<Transaction, Omit<Transaction, "id" | "created_at" | "updated_at"> & { id?: string }>;
      invoices: TableDef<Invoice, Omit<Invoice, "id" | "created_at" | "updated_at"> & { id?: string }>;
      invoice_items: TableDef<InvoiceItem, Omit<InvoiceItem, "id" | "created_at"> & { id?: string }>;
      tax_reminders: TableDef<TaxReminder, Omit<TaxReminder, "id" | "created_at" | "notified"> & { id?: string; notified?: boolean }>;
      exchange_rates: TableDef<ExchangeRate, Omit<ExchangeRate, "id"> & { id?: string }>;
      subscription_events: TableDef<SubscriptionEvent, Omit<SubscriptionEvent, "id" | "created_at"> & { id?: string }>;
      time_entries: TableDef<TimeEntry, Omit<TimeEntry, "id" | "created_at" | "updated_at"> & { id?: string }>;
      proposals: TableDef<Proposal, Omit<Proposal, "id" | "created_at" | "updated_at" | "public_token"> & { id?: string; public_token?: string }>;
      notifications: TableDef<Notification, Omit<Notification, "id" | "created_at" | "read"> & { id?: string; read?: boolean }>;
      recurring_invoice_configs: TableDef<RecurringInvoiceConfig, Omit<RecurringInvoiceConfig, "id" | "created_at" | "updated_at" | "last_generated_at"> & { id?: string; last_generated_at?: string | null }>;
    };
    Views: Record<string, never>;
    Functions: {
      calculate_project_profitability: {
        Args: { p_project_id: string };
        Returns: { total_income: number; total_expense: number; net_profit: number; profit_margin: number };
      };
      get_monthly_summary: {
        Args: { p_user_id: string; p_year: number; p_month: number };
        Returns: { total_income: number; total_expense: number; transaction_count: number };
      };
      next_invoice_number: {
        Args: { p_user_id: string };
        Returns: string;
      };
      get_revenue_trend: {
        Args: { p_user_id: string; p_months: number };
        Returns: { month: string; income: number; expense: number }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
