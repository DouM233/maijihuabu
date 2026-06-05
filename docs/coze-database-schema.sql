-- Coze / Postgres first deployment schema.
-- Run this in the Coze database SQL console before testing canvas history or asset uploads.

create table if not exists public.canvases (
  id text primary key,
  owner_id text,
  name text not null default 'Untitled canvas',
  nodes_json jsonb not null default '[]'::jsonb,
  edges_json jsonb not null default '[]'::jsonb,
  viewport_json jsonb not null default '{"x":0,"y":0,"zoom":1}'::jsonb,
  node_count integer not null default 0,
  created_at bigint not null default ((extract(epoch from now()) * 1000)::bigint),
  updated_at bigint not null default ((extract(epoch from now()) * 1000)::bigint),
  deleted_at bigint
);

create index if not exists canvases_updated_at_idx
  on public.canvases (updated_at desc);

create index if not exists canvases_owner_updated_at_idx
  on public.canvases (owner_id, updated_at desc);

create table if not exists public.assets (
  id text primary key,
  owner_id text,
  canvas_id text,
  source_node_id text,
  kind text not null,
  storage_key text not null,
  url text not null,
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,
  prompt text,
  metadata_json jsonb,
  created_at bigint default ((extract(epoch from now()) * 1000)::bigint)
);

alter table if exists public.assets
  alter column created_at drop not null,
  alter column created_at set default ((extract(epoch from now()) * 1000)::bigint);

alter table if exists public.canvases
  alter column created_at set default ((extract(epoch from now()) * 1000)::bigint),
  alter column updated_at set default ((extract(epoch from now()) * 1000)::bigint);

create index if not exists assets_canvas_id_idx
  on public.assets (canvas_id);

create index if not exists assets_created_at_idx
  on public.assets (created_at desc);

create table if not exists public.skill_packages (
  id text primary key,
  name text not null,
  version text,
  category text,
  storage_prefix text,
  manifest_json jsonb,
  enabled boolean not null default true,
  created_at bigint not null default ((extract(epoch from now()) * 1000)::bigint),
  updated_at bigint not null default ((extract(epoch from now()) * 1000)::bigint)
);

create table if not exists public.skill_templates (
  id text primary key,
  package_id text references public.skill_packages(id) on delete cascade,
  style_name text not null,
  category text not null,
  sub_category text not null,
  visual_style text,
  prompt text not null,
  negative_prompt text,
  tags jsonb not null default '[]'::jsonb,
  preview_asset_ids jsonb not null default '[]'::jsonb,
  enabled boolean not null default true,
  created_at bigint not null default ((extract(epoch from now()) * 1000)::bigint),
  updated_at bigint not null default ((extract(epoch from now()) * 1000)::bigint)
);

create index if not exists skill_templates_package_id_idx
  on public.skill_templates (package_id);

create index if not exists skill_templates_category_idx
  on public.skill_templates (category, sub_category);

-- If Coze exposes Supabase/PostgREST schema cache controls, refresh schema cache after running this file.
-- If Row Level Security is enabled by default, add the proper Coze auth policies before public traffic.
