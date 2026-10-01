-- TamirlanOS · VK 2012 — схема базы.
-- Запускать целиком в Supabase → SQL Editor. Повторный запуск безопасен.

-- ─────────────────────────────────────────────────────────────
-- 1. ПРОФИЛИ
-- ─────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null check (username ~ '^[a-z0-9_]{3,20}$'),
  first_name text not null check (char_length(first_name) between 1 and 40),
  last_name text not null check (char_length(last_name) between 1 and 40),
  avatar_url text,
  birthday date,
  city text,
  website text,
  activity text,
  relationship_status text check (
    relationship_status in (
      'not_specified', 'single', 'dating', 'engaged',
      'married', 'complicated', 'in_love'
    )
  ),
  relationship_partner_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists profiles_name_idx
  on public.profiles (lower(first_name), lower(last_name));

-- Профиль заводится автоматически вместе с аккаунтом: без него
-- пользователь существовал бы в auth, но был бы невидим в приложении.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username, first_name, last_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'username', ''),
      'id' || replace(substr(new.id::text, 1, 8), '-', '')
    ),
    coalesce(nullif(new.raw_user_meta_data ->> 'first_name', ''), 'Пользователь'),
    coalesce(nullif(new.raw_user_meta_data ->> 'last_name', ''), 'ВКонтакте')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- 2. СТЕНА
-- ─────────────────────────────────────────────────────────────

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  -- Владелец стены: своя запись или запись на чужой стене.
  wall_owner_id uuid not null references public.profiles (id) on delete cascade,
  content text not null check (char_length(content) between 1 and 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_wall_idx
  on public.posts (wall_owner_id, created_at desc);

create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  content text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists comments_post_idx
  on public.comments (post_id, created_at);

-- ─────────────────────────────────────────────────────────────
-- 3. ДРУЗЬЯ
-- ─────────────────────────────────────────────────────────────

create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles (id) on delete cascade,
  receiver_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  check (requester_id <> receiver_id),
  unique (requester_id, receiver_id)
);

create index if not exists friendships_receiver_idx
  on public.friendships (receiver_id, status);

-- ─────────────────────────────────────────────────────────────
-- 4. СООБЩЕНИЯ
-- ─────────────────────────────────────────────────────────────

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table if not exists public.conversation_members (
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  last_read_at timestamptz not null default 'epoch',
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  content text not null check (char_length(content) between 1 and 4000),
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_idx
  on public.messages (conversation_id, created_at);

-- Без этой функции политики messages и conversation_members ссылались бы
-- друг на друга и RLS уходила бы в бесконечную рекурсию.
create or replace function public.is_conversation_member(conv uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.conversation_members m
    where m.conversation_id = conv
      and m.user_id = auth.uid()
  );
$$;

-- ─────────────────────────────────────────────────────────────
-- 5. ФОТОГРАФИИ
-- ─────────────────────────────────────────────────────────────

create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 80),
  created_at timestamptz not null default now()
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.albums (id) on delete cascade,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  storage_path text not null,
  caption text check (char_length(caption) <= 500),
  created_at timestamptz not null default now()
);

create index if not exists photos_album_idx
  on public.photos (album_id, created_at desc);

-- ─────────────────────────────────────────────────────────────
-- 6. RLS
-- ─────────────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;
alter table public.friendships enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.albums enable row level security;
alter table public.photos enable row level security;

-- Профили: видны всем вошедшим, правит только владелец.
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated using (true);

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Стена: читают все, пишет автор от своего имени, правит и удаляет
-- автор записи либо владелец стены.
drop policy if exists posts_select on public.posts;
create policy posts_select on public.posts
  for select to authenticated using (true);

drop policy if exists posts_insert on public.posts;
create policy posts_insert on public.posts
  for insert to authenticated with check (author_id = auth.uid());

drop policy if exists posts_update on public.posts;
create policy posts_update on public.posts
  for update to authenticated
  using (author_id = auth.uid()) with check (author_id = auth.uid());

drop policy if exists posts_delete on public.posts;
create policy posts_delete on public.posts
  for delete to authenticated
  using (author_id = auth.uid() or wall_owner_id = auth.uid());

drop policy if exists likes_select on public.likes;
create policy likes_select on public.likes
  for select to authenticated using (true);

drop policy if exists likes_insert on public.likes;
create policy likes_insert on public.likes
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists likes_delete on public.likes;
create policy likes_delete on public.likes
  for delete to authenticated using (user_id = auth.uid());

drop policy if exists comments_select on public.comments;
create policy comments_select on public.comments
  for select to authenticated using (true);

drop policy if exists comments_insert on public.comments;
create policy comments_insert on public.comments
  for insert to authenticated with check (author_id = auth.uid());

drop policy if exists comments_delete on public.comments;
create policy comments_delete on public.comments
  for delete to authenticated using (author_id = auth.uid());

-- Дружба: обе стороны видят запись, отправляет только инициатор,
-- отвечает только получатель, разорвать может любой.
drop policy if exists friendships_select on public.friendships;
create policy friendships_select on public.friendships
  for select to authenticated
  using (requester_id = auth.uid() or receiver_id = auth.uid());

drop policy if exists friendships_insert on public.friendships;
create policy friendships_insert on public.friendships
  for insert to authenticated with check (requester_id = auth.uid());

drop policy if exists friendships_update on public.friendships;
create policy friendships_update on public.friendships
  for update to authenticated
  using (receiver_id = auth.uid()) with check (receiver_id = auth.uid());

drop policy if exists friendships_delete on public.friendships;
create policy friendships_delete on public.friendships
  for delete to authenticated
  using (requester_id = auth.uid() or receiver_id = auth.uid());

-- Переписка: только участники.
drop policy if exists conversations_select on public.conversations;
create policy conversations_select on public.conversations
  for select to authenticated using (public.is_conversation_member(id));

drop policy if exists conversations_insert on public.conversations;
create policy conversations_insert on public.conversations
  for insert to authenticated with check (true);

drop policy if exists members_select on public.conversation_members;
create policy members_select on public.conversation_members
  for select to authenticated
  using (user_id = auth.uid() or public.is_conversation_member(conversation_id));

drop policy if exists members_insert on public.conversation_members;
create policy members_insert on public.conversation_members
  for insert to authenticated with check (true);

drop policy if exists members_update on public.conversation_members;
create policy members_update on public.conversation_members
  for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists messages_select on public.messages;
create policy messages_select on public.messages
  for select to authenticated
  using (public.is_conversation_member(conversation_id));

drop policy if exists messages_insert on public.messages;
create policy messages_insert on public.messages
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and public.is_conversation_member(conversation_id)
  );

drop policy if exists messages_delete on public.messages;
create policy messages_delete on public.messages
  for delete to authenticated using (author_id = auth.uid());

-- Альбомы и фотографии: видны всем вошедшим, меняет владелец.
drop policy if exists albums_select on public.albums;
create policy albums_select on public.albums
  for select to authenticated using (true);

drop policy if exists albums_write on public.albums;
create policy albums_write on public.albums
  for all to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists photos_select on public.photos;
create policy photos_select on public.photos
  for select to authenticated using (true);

drop policy if exists photos_write on public.photos;
create policy photos_write on public.photos
  for all to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- ─────────────────────────────────────────────────────────────
-- 7. REALTIME
-- ─────────────────────────────────────────────────────────────

alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.friendships;

-- ─────────────────────────────────────────────────────────────
-- 8. STORAGE
-- ─────────────────────────────────────────────────────────────
-- Бакеты создаются один раз; первый сегмент пути — id владельца,
-- поэтому записывать в чужую папку невозможно.

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true), ('photos', 'photos', true)
on conflict (id) do nothing;

drop policy if exists storage_read on storage.objects;
create policy storage_read on storage.objects
  for select to public using (bucket_id in ('avatars', 'photos'));

drop policy if exists storage_write on storage.objects;
create policy storage_write on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('avatars', 'photos')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists storage_delete on storage.objects;
create policy storage_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id in ('avatars', 'photos')
    and (storage.foldername(name))[1] = auth.uid()::text
  );
