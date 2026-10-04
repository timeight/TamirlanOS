-- TamirlanOS · VK 2012 — сообщества (шаг 1: только открытые группы).
-- Запускать ПОСЛЕ schema-social-06.sql. Повторный запуск безопасен.
--
-- Записи групп живут в той же таблице posts: отдельная таблица означала бы
-- вторые лайки, вторые комментарии и второй набор политик.

-- ─────────────────────────────────────────────────────────────
-- 1. ТАБЛИЦЫ
-- ─────────────────────────────────────────────────────────────

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  username text unique not null check (username ~ '^[a-z0-9_]{3,20}$'),
  name text not null check (char_length(name) between 2 and 80),
  description text check (char_length(description) <= 2000),
  avatar_url text,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists groups_name_idx on public.groups (lower(name));

create table if not exists public.group_members (
  group_id uuid not null references public.groups (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'member'
    check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create index if not exists group_members_user_idx
  on public.group_members (user_id);

-- Создатель сразу владелец: группа без владельца неуправляема.
create or replace function public.seed_group_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.group_members (group_id, user_id, role)
  values (new.id, new.owner_id, 'owner');
  return new;
end;
$$;

drop trigger if exists groups_seed_owner on public.groups;
create trigger groups_seed_owner
  after insert on public.groups
  for each row execute function public.seed_group_owner();

-- ─────────────────────────────────────────────────────────────
-- 2. ЗАПИСИ МОГУТ ПРИНАДЛЕЖАТЬ ГРУППЕ
-- ─────────────────────────────────────────────────────────────
-- wall_owner_id перестаёт быть обязательным: у записи ровно один хозяин —
-- либо человек, либо группа. Проверка не даёт появиться записи без хозяина
-- или с двумя сразу.

alter table public.posts
  alter column wall_owner_id drop not null,
  add column if not exists group_id uuid references public.groups (id) on delete cascade;

alter table public.posts drop constraint if exists posts_one_owner;
alter table public.posts add constraint posts_one_owner
  check ((wall_owner_id is null) <> (group_id is null));

create index if not exists posts_group_idx
  on public.posts (group_id, created_at desc);

-- ─────────────────────────────────────────────────────────────
-- 3. РОЛЬ УЧАСТНИКА
-- ─────────────────────────────────────────────────────────────
-- Через security definer, иначе политика group_members ссылалась бы сама
-- на себя и RLS ушла бы в рекурсию.

create or replace function public.group_role(group_key uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select m.role from public.group_members m
  where m.group_id = group_key and m.user_id = auth.uid();
$$;

create or replace function public.group_member_count(group_key uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::int from public.group_members m
  where m.group_id = group_key and auth.uid() is not null;
$$;

/** Группы с наибольшим числом участников — «популярные» без выдумок. */
create or replace function public.popular_groups(want integer default 10)
returns table (
  id uuid,
  username text,
  name text,
  description text,
  avatar_url text,
  owner_id uuid,
  created_at timestamptz,
  members integer
)
language sql
stable
security definer
set search_path = ''
as $$
  select g.id, g.username, g.name, g.description, g.avatar_url,
         g.owner_id, g.created_at,
         (select count(*)::int from public.group_members m
          where m.group_id = g.id)
  from public.groups g
  where auth.uid() is not null
  order by (select count(*) from public.group_members m
            where m.group_id = g.id) desc, g.created_at desc
  limit want;
$$;

-- ─────────────────────────────────────────────────────────────
-- 4. RLS
-- ─────────────────────────────────────────────────────────────

alter table public.groups enable row level security;
alter table public.group_members enable row level security;

-- На этом шаге все группы открытые: закрытые будут отдельной миграцией.
drop policy if exists groups_select on public.groups;
create policy groups_select on public.groups
  for select to authenticated using (true);

drop policy if exists groups_insert on public.groups;
create policy groups_insert on public.groups
  for insert to authenticated with check (owner_id = auth.uid());

drop policy if exists groups_update on public.groups;
create policy groups_update on public.groups
  for update to authenticated
  using (public.group_role(id) in ('owner', 'admin'))
  with check (public.group_role(id) in ('owner', 'admin'));

-- Удалить сообщество может только владелец, не администратор.
drop policy if exists groups_delete on public.groups;
create policy groups_delete on public.groups
  for delete to authenticated using (owner_id = auth.uid());

drop policy if exists members_group_select on public.group_members;
create policy members_group_select on public.group_members
  for select to authenticated using (true);

-- Вступают только за себя и только рядовым участником: роль owner или admin
-- через прямую вставку получить нельзя.
drop policy if exists members_group_insert on public.group_members;
create policy members_group_insert on public.group_members
  for insert to authenticated
  with check (user_id = auth.uid() and role = 'member');

-- Роли раздаёт владелец; себя он понизить не может.
drop policy if exists members_group_update on public.group_members;
create policy members_group_update on public.group_members
  for update to authenticated
  using (
    public.group_role(group_id) = 'owner'
    and user_id <> auth.uid()
  )
  with check (role in ('admin', 'member'));

-- Выйти может каждый сам; исключать — владелец и администратор,
-- но владельца исключить нельзя никому.
drop policy if exists members_group_delete on public.group_members;
create policy members_group_delete on public.group_members
  for delete to authenticated
  using (
    role <> 'owner'
    and (
      user_id = auth.uid()
      or public.group_role(group_id) in ('owner', 'admin')
    )
  );

-- ─────────────────────────────────────────────────────────────
-- 5. ПОЛИТИКИ ЗАПИСЕЙ УЧИТЫВАЮТ ГРУППЫ
-- ─────────────────────────────────────────────────────────────

drop policy if exists posts_select on public.posts;
create policy posts_select on public.posts
  for select to authenticated
  using (
    author_id = auth.uid()
    or group_id is not null
    or (wall_owner_id is not null and public.can_view(wall_owner_id, 'posts'))
  );

-- В группу пишут только её участники.
drop policy if exists posts_insert on public.posts;
create policy posts_insert on public.posts
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and (group_id is null or public.group_role(group_id) is not null)
  );

-- Модерация: автор, хозяин стены, владелец или администратор группы.
drop policy if exists posts_delete on public.posts;
create policy posts_delete on public.posts
  for delete to authenticated
  using (
    author_id = auth.uid()
    or wall_owner_id = auth.uid()
    or (group_id is not null
        and public.group_role(group_id) in ('owner', 'admin'))
  );
