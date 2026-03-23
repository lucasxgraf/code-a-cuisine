-- 1. Cuisines Tabelle (Stammdaten)
create table public.cuisines (
  id uuid not null default extensions.uuid_generate_v4 (),
  name text not null,
  slug text not null,
  constraint cuisines_pkey primary key (id),
  constraint cuisines_slug_key unique (slug)
);

-- 2. Usage Quota Tabelle (Rate Limiting)
create table public.usage_quota (
  ip_address inet not null,
  request_count integer null default 0,
  last_request timestamp with time zone null default now(),
  constraint usage_quota_pkey primary key (ip_address)
);

-- 3. Recipes Tabelle (Hauptdaten mit Cache-Fingerabdruck)
create table public.recipes (
  id uuid not null default extensions.uuid_generate_v4 (),
  cuisine_id uuid null,
  title text not null,
  description text null,
  cooking_time integer not null,
  base_portions integer null default 2,
  base_chefs integer null default 1,
  likes integer null default 0,
  diet_type text null,
  kcal integer null,
  protein text null,
  fat text null,
  carbs text null,
  input_hash text null,
  created_at timestamp with time zone null default now(),
  constraint recipes_pkey primary key (id),
  constraint recipes_cuisine_id_fkey foreign KEY (cuisine_id) references cuisines (id)
);

-- Index für schnelles Caching erstellen
CREATE INDEX idx_recipes_input_hash ON public.recipes(input_hash);

-- 4. Recipe Steps Tabelle (Relationale Daten)
create table public.recipe_steps (
  id uuid not null default extensions.uuid_generate_v4 (),
  recipe_id uuid null,
  step_number integer not null,
  chef_id integer not null,
  title text null,
  description text not null,
  duration_min integer null default 0,
  is_parallel boolean null default false,
  constraint recipe_steps_pkey primary key (id),
  constraint recipe_steps_recipe_id_fkey foreign KEY (recipe_id) references recipes (id) on delete CASCADE
);

-- 5. Ingredients Tabelle (Relationale Daten)
create table public.ingredients (
  id uuid not null default extensions.uuid_generate_v4 (),
  recipe_id uuid null,
  name text not null,
  amount numeric not null,
  unit text null,
  is_extra boolean null default false,
  constraint ingredients_pkey primary key (id),
  constraint ingredients_recipe_id_fkey foreign KEY (recipe_id) references recipes (id) on delete CASCADE
);