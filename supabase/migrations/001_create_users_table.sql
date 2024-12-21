-- Drop existing policies and triggers
drop policy if exists "Public profiles are viewable by everyone" on public.users;
drop policy if exists "Users can update own profile" on public.users;
drop policy if exists "Enable insert for authenticated users only" on public.users;
drop trigger if exists on_auth_user_created on auth.users;

create table if not exists public.users (
  id uuid references auth.users(id) primary key,
  email text unique not null,
  first_name text,
  last_name text,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on public.users for select
  using ( true );

create policy "Users can update own profile"
  on public.users for update
  using ( auth.uid() = id );

create policy "Enable insert for authenticated users only"
  on public.users for insert
  with check ( auth.role() = 'authenticated' );

-- Create function to handle user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, first_name, last_name, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    concat_ws(' ', 
      new.raw_user_meta_data->>'first_name',
      new.raw_user_meta_data->>'last_name'
    )
  );
  return new;
end;
$$;

-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
