-- TrustMarket Supabase schema
create extension if not exists "uuid-ossp";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  username text unique,
  role text not null default 'buyer' check (role in ('buyer', 'seller', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  price numeric(10,2) not null check (price >= 0),
  category text not null,
  file_url text not null,
  cover_image text,
  seller_id uuid not null references public.users(id) on delete cascade,
  sales_count int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  buyer_id uuid not null references public.users(id) on delete cascade,
  seller_id uuid references public.users(id) on delete set null,
  payment_status text not null,
  payment_method text not null,
  paypal_order_id text,
  created_at timestamptz not null default now(),
  unique (product_id, buyer_id)
);

create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.reviews enable row level security;

create policy "Public products visible" on public.products for select using (true);
create policy "Seller manages own products" on public.products for all using (auth.uid() = seller_id) with check (auth.uid() = seller_id);

create policy "Buyer can read own orders" on public.orders for select using (auth.uid() = buyer_id or auth.uid() = seller_id);
create policy "Buyer can insert order" on public.orders for insert with check (auth.uid() = buyer_id);

create policy "Public reviews visible" on public.reviews for select using (true);
create policy "Buyer can write review" on public.reviews for insert with check (auth.uid() = user_id);

create policy "User can read own profile" on public.users for select using (auth.uid() = id);
create policy "User can insert own profile" on public.users for insert with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, username, role)
  values (new.id, new.email, split_part(new.email, '@', 1), 'buyer')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
