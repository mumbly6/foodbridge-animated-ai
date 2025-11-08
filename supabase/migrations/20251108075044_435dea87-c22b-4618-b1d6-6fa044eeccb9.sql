-- Create notifications table for in-app notifications (idempotent table create)
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  type text not null check (type in ('donation_created','request_created')),
  title text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.notifications enable row level security;

-- Create RLS policies (table is new, so names won't exist yet)
create policy "Users can view their own notifications"
  on public.notifications
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own notifications"
  on public.notifications
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on public.notifications
  for update
  using (auth.uid() = user_id);

-- Helpful index
create index if not exists idx_notifications_user_created on public.notifications(user_id, created_at desc);
