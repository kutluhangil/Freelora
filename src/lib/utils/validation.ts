import { z } from "zod";

export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(8, "min8");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: z.string().min(2),
});

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  category: z.string().min(1),
  description: z.string().min(1),
  amount: z.coerce.number().positive(),
  currency: z.string().length(3),
  date: z.string(),
  project_id: z.string().uuid().nullable().optional(),
  client_id: z.string().uuid().nullable().optional(),
  is_recurring: z.boolean().default(false),
  recurring_interval: z.enum(["monthly", "quarterly", "yearly"]).nullable().optional(),
  notes: z.string().optional(),
});

export const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["active", "completed", "paused", "canceled"]).default("active"),
  budget_amount: z.coerce.number().nonnegative().nullable().optional(),
  budget_currency: z.string().length(3).default("TRY"),
  hourly_rate: z.coerce.number().nonnegative().nullable().optional(),
  estimated_hours: z.coerce.number().nonnegative().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  client_id: z.string().uuid().nullable().optional(),
  color: z.string().default("#6B7280"),
});

export const clientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  tax_id: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().default("TR"),
  currency: z.string().default("TRY"),
  notes: z.string().optional(),
});

export const invoiceItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.coerce.number().positive(),
  unit_price: z.coerce.number().nonnegative(),
});

export const invoiceSchema = z.object({
  client_id: z.string().uuid(),
  project_id: z.string().uuid().nullable().optional(),
  issue_date: z.string(),
  due_date: z.string(),
  currency: z.string().length(3).default("TRY"),
  tax_rate: z.coerce.number().min(0).max(100).default(20),
  discount_rate: z.coerce.number().min(0).max(100).default(0),
  notes: z.string().optional(),
  payment_terms: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1),
});
