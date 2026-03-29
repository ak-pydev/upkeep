create extension if not exists pgcrypto;
create extension if not exists vector;

create table if not exists machines (
  id text primary key,
  shop_id text not null,
  manufacturer text not null,
  model text not null,
  nickname text,
  serial_number text,
  status text not null default 'active',
  tags text[] not null default '{}',
  notes text,
  manual_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists manuals (
  id text primary key,
  machine_id text not null references machines(id) on delete cascade,
  title text not null,
  filename text not null,
  source_url text,
  pages integer,
  status text not null default 'pending',
  chunk_count integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  indexed_at timestamptz
);

create table if not exists manual_chunks (
  id text primary key,
  manual_id text not null references manuals(id) on delete cascade,
  chunk_index integer not null,
  page_number integer,
  content text not null,
  part_numbers text[] not null default '{}',
  embedding vector(1536),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists manual_chunks_manual_id_idx on manual_chunks (manual_id);
create index if not exists manual_chunks_page_number_idx on manual_chunks (page_number);

create table if not exists maintenance_logs (
  id text primary key,
  machine_id text not null references machines(id) on delete cascade,
  issue text not null,
  resolution text not null,
  part_numbers text[] not null default '{}',
  source_manual_ids text[] not null default '{}',
  created_by text,
  created_at timestamptz not null default now()
);

create index if not exists maintenance_logs_machine_id_idx on maintenance_logs (machine_id);
create index if not exists maintenance_logs_created_at_idx on maintenance_logs (created_at desc);

