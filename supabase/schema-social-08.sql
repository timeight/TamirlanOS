-- TamirlanOS · VK 2012 — аудиозаписи.
-- Запускать ПОСЛЕ schema-social-07.sql. Повторный запуск безопасен.

-- ─────────────────────────────────────────────────────────────
-- 1. ТАБЛИЦА
-- ─────────────────────────────────────────────────────────────
-- Одна таблица на всё: трек принадлежит либо человеку, либо сообществу.
-- Отдельные my_audio и group_audio означали бы два набора политик.

create table if not exists public.audio_tracks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  group_id uuid references public.groups (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  artist text not null check (char_length(artist) between 1 and 120),
  storage_path text not null unique,
  duration integer not null default 0 check (duration >= 0),
  created_at timestamptz not null default now()
);

create index if not exists audio_owner_idx
  on public.audio_tracks (owner_id, created_at desc);

create index if not exists audio_group_idx
  on public.audio_tracks (group_id, created_at desc);

create index if not exists audio_search_idx
  on public.audio_tracks (lower(title), lower(artist));

-- ─────────────────────────────────────────────────────────────
-- 2. ПРИВАТНОСТЬ АУДИО
-- ─────────────────────────────────────────────────────────────

alter table public.profiles
  add column if not exists privacy_audio text not null default 'all'
    check (privacy_audio in ('all', 'friends', 'none'));

-- can_view учится третьей области; поведение для photos и posts прежнее.
create or replace function public.can_view(target uuid, scope text)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  me uuid := auth.uid();
  rule text;
begin
  if me is null then return false; end if;
  if me = target then return true; end if;

  select case scope
    when 'photos' then p.privacy_photos
    when 'posts' then p.privacy_posts
    when 'audio' then p.privacy_audio
    else 'none'
  end into rule
  from public.profiles p where p.id = target;

  if rule is null or rule = 'none' then return false; end if;
  if rule = 'all' then return true; end if;
  return public.are_friends(me, target);
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- 3. RLS
-- ─────────────────────────────────────────────────────────────

alter table public.audio_tracks enable row level security;

drop policy if exists audio_select on public.audio_tracks;
create policy audio_select on public.audio_tracks
  for select to authenticated
  using (
    owner_id = auth.uid()
    or group_id is not null
    or public.can_view(owner_id, 'audio')
  );

-- Загрузить можно только от своего имени; в сообщество — управляющим.
drop policy if exists audio_insert on public.audio_tracks;
create policy audio_insert on public.audio_tracks
  for insert to authenticated
  with check (
    owner_id = auth.uid()
    and (
      group_id is null
      or public.group_role(group_id) in ('owner', 'admin')
    )
  );

-- Название и исполнителя правит только тот, кто загрузил.
drop policy if exists audio_update on public.audio_tracks;
create policy audio_update on public.audio_tracks
  for update to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists audio_delete on public.audio_tracks;
create policy audio_delete on public.audio_tracks
  for delete to authenticated
  using (
    owner_id = auth.uid()
    or (group_id is not null
        and public.group_role(group_id) in ('owner', 'admin'))
  );

-- ─────────────────────────────────────────────────────────────
-- 4. ХРАНИЛИЩЕ
-- ─────────────────────────────────────────────────────────────
-- Бакет закрытый, в отличие от аватаров и фотографий: иначе настройка
-- «кто слышит мои записи» обходилась бы прямой ссылкой на файл.
-- Воспроизведение идёт по временной подписанной ссылке.

insert into storage.buckets (id, name, public)
values ('audio', 'audio', false)
on conflict (id) do nothing;

/** Владелец файла — первый сегмент пути, как в остальных бакетах. */
create or replace function public.audio_path_owner(object_name text)
returns uuid
language sql
immutable
set search_path = ''
as $$
  select nullif((storage.foldername(object_name))[1], '')::uuid;
$$;

drop policy if exists storage_audio_read on storage.objects;
create policy storage_audio_read on storage.objects
  for select to authenticated
  using (
    bucket_id = 'audio'
    and (
      public.audio_path_owner(name) = auth.uid()
      or public.can_view(public.audio_path_owner(name), 'audio')
      or exists (
        select 1 from public.audio_tracks t
        where t.storage_path = name and t.group_id is not null
      )
    )
  );

drop policy if exists storage_audio_write on storage.objects;
create policy storage_audio_write on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'audio'
    and public.audio_path_owner(name) = auth.uid()
  );

drop policy if exists storage_audio_delete on storage.objects;
create policy storage_audio_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'audio'
    and public.audio_path_owner(name) = auth.uid()
  );
