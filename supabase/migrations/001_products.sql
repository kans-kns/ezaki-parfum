create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  slug text not null unique,
  source_id text,
  source_url text,
  name text not null,
  arabic text not null default '',
  tagline text not null default '',
  short_description text not null default '',
  description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  old_price numeric(10, 2),
  category text not null default 'Non classe',
  family text not null default 'Non renseignee',
  concentration text not null default 'Non renseignee',
  size text not null default 'Non renseignee',
  notes_top text[] not null default '{}',
  notes_heart text[] not null default '{}',
  notes_base text[] not null default '{}',
  image_path text,
  badge text,
  rating numeric(3, 2) not null default 0,
  reviews_count integer not null default 0,
  longevity text not null default 'Non renseignee',
  intensity text not null default 'Non renseignee',
  in_stock boolean not null default true,
  featured boolean not null default false,
  accent text not null default '#C9A227',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

create table if not exists public.product_audit_log (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

revoke all on public.admin_users from anon, authenticated;
revoke all on public.product_audit_log from anon, authenticated;
grant select on public.admin_users to authenticated;
grant select on public.product_audit_log to authenticated;

alter table public.products enable row level security;
alter table public.admin_users enable row level security;
alter table public.product_audit_log enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "public can read published products" on public.products;
drop policy if exists "admins can read all products" on public.products;
drop policy if exists "admins can insert products" on public.products;
drop policy if exists "admins can update products" on public.products;
drop policy if exists "admins can delete products" on public.products;
drop policy if exists "admins can read their admin record" on public.admin_users;
drop policy if exists "admins can read audit log" on public.product_audit_log;
drop policy if exists "admins can write audit log" on public.product_audit_log;

create policy "public can read published products"
  on public.products for select
  to anon, authenticated
  using (published = true);

create policy "admins can read all products"
  on public.products for select
  to authenticated
  using (public.is_admin());

create policy "admins can insert products"
  on public.products for insert
  to authenticated
  with check (public.is_admin());

create policy "admins can update products"
  on public.products for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins can delete products"
  on public.products for delete
  to authenticated
  using (public.is_admin());

create policy "admins can read their admin record"
  on public.admin_users for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "admins can read audit log"
  on public.product_audit_log for select
  to authenticated
  using (public.is_admin());

create or replace function public.set_products_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
before update on public.products
for each row execute function public.set_products_updated_at();

create or replace function public.write_product_audit_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.product_audit_log (product_id, user_id, action, after_data)
    values (new.id, (select auth.uid()), 'insert', to_jsonb(new));
    return new;
  elsif tg_op = 'UPDATE' then
    insert into public.product_audit_log (product_id, user_id, action, before_data, after_data)
    values (new.id, (select auth.uid()), 'update', to_jsonb(old), to_jsonb(new));
    return new;
  else
    insert into public.product_audit_log (product_id, user_id, action, before_data)
    values (old.id, (select auth.uid()), 'delete', to_jsonb(old));
    return old;
  end if;
end;
$$;

revoke execute on function public.write_product_audit_log() from public, anon, authenticated;

drop trigger if exists products_audit_log on public.products;
create trigger products_audit_log
after insert or update or delete on public.products
for each row execute function public.write_product_audit_log();
