create table amazon_affiliate_links (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    short_link text not null,
    original_url text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    last_clicked_at timestamp with time zone,
    clicks_count integer default 0,
    is_active boolean default true
);
