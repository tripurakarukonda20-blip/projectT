-- Database Schema for RiskGuard AI
-- Does NOT delete any existing CareerPilot AI tables.

-- 1. CUSTOMERS TABLE
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  joined_at timestamptz default now(),
  total_spent numeric default 0,
  fraud_flags integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. DEVICES TABLE
create table if not exists public.devices (
  id text primary key, -- device fingerprint string
  risk_score integer default 0,
  created_at timestamptz default now()
);

-- 3. IP ADDRESSES TABLE
create table if not exists public.ip_addresses (
  id text primary key, -- ip address string
  country text,
  risk_score integer default 0,
  created_at timestamptz default now()
);

-- 4. TRANSACTIONS TABLE
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  amount numeric not null,
  currency text not null default 'INR',
  timestamp timestamptz default now(),
  merchant_id text,
  device_id text references public.devices(id) on delete set null,
  ip_address text references public.ip_addresses(id) on delete set null,
  location text,
  payment_method text,
  is_new_device boolean default false,
  previous_transactions integer default 0,
  chargeback_count integer default 0,
  refund_count integer default 0,
  velocity_24h integer default 0,
  ip_risk integer default 0,
  device_shared integer default 0,
  risk_score integer default 0,
  risk_level text, -- 'LOW', 'MEDIUM', 'HIGH'
  status text, -- 'COMPLETED', 'PENDING', 'DECLINED', 'HOLD', 'REFUNDED'
  risk_assessment jsonb, -- contains score, level, factors, explanation, recommendedAction
  created_at timestamptz default now()
);

-- 5. ALERTS TABLE
create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  severity text not null, -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  timestamp timestamptz default now(),
  description text not null,
  affected_entity_id text not null, -- string since it can be transaction ID, customer ID, etc.
  entity_type text not null, -- 'TRANSACTION', 'CUSTOMER', 'NETWORK'
  recommended_action text,
  status text not null default 'ACTIVE', -- 'ACTIVE', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add some basic indexes for performance
create index if not exists idx_transactions_customer on public.transactions(customer_id);
create index if not exists idx_transactions_risk_level on public.transactions(risk_level);
create index if not exists idx_alerts_status on public.alerts(status);
create index if not exists idx_alerts_severity on public.alerts(severity);

-- Enable RLS (Row Level Security) for new tables
alter table public.customers enable row level security;
alter table public.devices enable row level security;
alter table public.ip_addresses enable row level security;
alter table public.transactions enable row level security;
alter table public.alerts enable row level security;

-- Create default policies
create policy "Allow all operations for investigators on customers" on public.customers for all using (true) with check (true);
create policy "Allow all operations for investigators on devices" on public.devices for all using (true) with check (true);
create policy "Allow all operations for investigators on ip_addresses" on public.ip_addresses for all using (true) with check (true);
create policy "Allow all operations for investigators on transactions" on public.transactions for all using (true) with check (true);
create policy "Allow all operations for investigators on alerts" on public.alerts for all using (true) with check (true);

-- Realtime enabling for alerts and transactions
begin;
  alter publication supabase_realtime add table public.transactions;
  alter publication supabase_realtime add table public.alerts;
commit;
