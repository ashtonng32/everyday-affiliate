create table if not exists public.affiliate_clicks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  retailer_id uuid references public.retailers(id) not null,
  clicked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  converted_at timestamp with time zone,
  purchase_amount decimal(10,2),
  commission_earned decimal(10,2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add indexes for better query performance
create index if not exists affiliate_clicks_user_id_idx on public.affiliate_clicks(user_id);
create index if not exists affiliate_clicks_retailer_id_idx on public.affiliate_clicks(retailer_id);
create index if not exists affiliate_clicks_clicked_at_idx on public.affiliate_clicks(clicked_at);

-- Add RLS policies
alter table public.affiliate_clicks enable row level security;

create policy "Users can view their own clicks"
  on public.affiliate_clicks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own clicks"
  on public.affiliate_clicks for insert
  with check (auth.uid() = user_id);

-- Function to update conversion status
create or replace function public.update_affiliate_conversion(
  p_click_id uuid,
  p_purchase_amount decimal,
  p_retailer_id uuid
)
returns void
language plpgsql
security definer
as $$
declare
  v_commission_rate decimal;
begin
  -- Get the commission rate for the retailer
  select commission_rate into v_commission_rate
  from public.retailers
  where id = p_retailer_id;

  -- Update the click record with conversion details
  update public.affiliate_clicks
  set
    converted_at = now(),
    purchase_amount = p_purchase_amount,
    commission_earned = p_purchase_amount * (v_commission_rate / 100)
  where id = p_click_id;
end;
$$;
