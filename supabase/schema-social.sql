-- TamirlanOS · VK 2012 — друзья, сообщения, фотографии, уведомления.
-- Запускать ПОСЛЕ schema.sql, в Supabase → SQL Editor. Повторный запуск безопасен.

-- ─────────────────────────────────────────────────────────────
-- 1. СОСТОЯНИЕ ДРУЖБЫ СЧИТАЕТ БАЗА
-- ─────────────────────────────────────────────────────────────
-- Клиент видит только свои строки friendships, поэтому "сколько у него
-- друзей" и "кто у нас общий" он посчитать не может. Эти функции —
-- security definer, но каждая проверяет auth.uid(): анонимным нет ответа.

create or replace function public.friend_ids(owner uuid)
returns setof uuid
language sql
stable
security definer
set search_path = ''
as $$
  select case when f.requester_id = owner then f.receiver_id else f.requester_id end
  from public.friendships f
  where f.status = 'accepted'
    and (f.requester_id = owner or f.receiver_id = owner)
    and auth.uid() is not null;
$$;

create or replace function public.friend_state(target uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (
      select case
        when f.status = 'accepted' then 'friends'
        when f.status = 'pending' and f.requester_id = auth.uid() then 'outgoing_pending'
        when f.status = 'pending' then 'incoming_pending'
        else 'none'
      end
      from public.friendships f
      where auth.uid() is not null
        and (
          (f.requester_id = auth.uid() and f.receiver_id = target)
          or (f.requester_id = target and f.receiver_id = auth.uid())
        )
      limit 1
    ),
    'none'
  );
$$;

-- Список результатов поиска требует состояния для каждой строки; по одному
-- запросу на человека — это тридцать круговых обращений вместо одного.
create or replace function public.friend_states(targets uuid[])
returns table (target uuid, state text)
language sql
stable
security definer
set search_path = ''
as $$
  select t.id, public.friend_state(t.id)
  from unnest(targets) as t(id)
  where auth.uid() is not null;
$$;

create or replace function public.friends_of(owner uuid)
returns setof public.profiles
language sql
stable
security definer
set search_path = ''
as $$
  select p.*
  from public.profiles p
  where p.id in (select * from public.friend_ids(owner))
  order by lower(p.first_name), lower(p.last_name);
$$;

create or replace function public.friend_count(owner uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::int from public.friend_ids(owner);
$$;

create or replace function public.mutual_friends(target uuid)
returns setof public.profiles
language sql
stable
security definer
set search_path = ''
as $$
  select p.*
  from public.profiles p
  where p.id in (
    select * from public.friend_ids(auth.uid())
    intersect
    select * from public.friend_ids(target)
  )
  order by lower(p.first_name);
$$;

create or replace function public.incoming_requests()
returns setof public.profiles
language sql
stable
security definer
set search_path = ''
as $$
  select p.*
  from public.friendships f
  join public.profiles p on p.id = f.requester_id
  where f.receiver_id = auth.uid() and f.status = 'pending'
  order by f.created_at desc;
$$;

create or replace function public.outgoing_requests()
returns setof public.profiles
language sql
stable
security definer
set search_path = ''
as $$
  select p.*
  from public.friendships f
  join public.profiles p on p.id = f.receiver_id
  where f.requester_id = auth.uid() and f.status = 'pending'
  order by f.created_at desc;
$$;

-- unique (requester_id, receiver_id) не мешает встречной заявке: без этой
-- проверки A→B и B→A существовали бы одновременно и состояние стало бы
-- неопределённым.
create or replace function public.guard_friendship()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if exists (
    select 1 from public.friendships f
    where f.requester_id = new.receiver_id and f.receiver_id = new.requester_id
  ) then
    raise exception 'friendship_exists';
  end if;
  return new;
end;
$$;

drop trigger if exists friendships_guard on public.friendships;
create trigger friendships_guard
  before insert on public.friendships
  for each row execute function public.guard_friendship();

-- ─────────────────────────────────────────────────────────────
-- 2. ПЕРЕПИСКА: ОДИН ДИАЛОГ НА ПАРУ
-- ─────────────────────────────────────────────────────────────
-- В schema.sql политики conversations_insert и members_insert стояли на
-- with check (true) — любой мог добавить кого угодно в любую переписку.
-- Теперь прямая вставка запрещена, а диалог создаёт только эта функция.

create or replace function public.direct_conversation(other uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := auth.uid();
  conv uuid;
begin
  if me is null or other is null or me = other then
    raise exception 'bad_request';
  end if;
  if not exists (select 1 from public.profiles p where p.id = other) then
    raise exception 'no_such_user';
  end if;

  select mine.conversation_id into conv
  from public.conversation_members mine
  join public.conversation_members theirs
    on theirs.conversation_id = mine.conversation_id
  where mine.user_id = me
    and theirs.user_id = other
    and (
      select count(*) from public.conversation_members x
      where x.conversation_id = mine.conversation_id
    ) = 2
  limit 1;

  if conv is not null then
    return conv;
  end if;

  insert into public.conversations default values returning id into conv;
  insert into public.conversation_members (conversation_id, user_id)
  values (conv, me), (conv, other);
  return conv;
end;
$$;

create or replace function public.my_conversations()
returns table (
  conversation_id uuid,
  other_id uuid,
  other_username text,
  other_first_name text,
  other_last_name text,
  other_avatar_url text,
  last_content text,
  last_created_at timestamptz,
  last_author_id uuid,
  unread integer
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    c.id,
    p.id,
    p.username,
    p.first_name,
    p.last_name,
    p.avatar_url,
    last.content,
    last.created_at,
    last.author_id,
    (
      select count(*) from public.messages x
      where x.conversation_id = c.id
        and x.author_id <> auth.uid()
        and x.created_at > mine.last_read_at
    )::int
  from public.conversations c
  join public.conversation_members mine
    on mine.conversation_id = c.id and mine.user_id = auth.uid()
  join public.conversation_members theirs
    on theirs.conversation_id = c.id and theirs.user_id <> auth.uid()
  join public.profiles p on p.id = theirs.user_id
  left join lateral (
    select m.content, m.created_at, m.author_id
    from public.messages m
    where m.conversation_id = c.id
    order by m.created_at desc
    limit 1
  ) last on true
  where auth.uid() is not null
  order by coalesce(last.created_at, c.created_at) desc;
$$;

-- ─────────────────────────────────────────────────────────────
-- 3. УВЕДОМЛЕНИЯ
-- ─────────────────────────────────────────────────────────────
-- У таблицы нет insert-политики: писать в неё может только триггер
-- (security definer). Поэтому подделать уведомление от чужого имени
-- технически невозможно, а не "не предусмотрено интерфейсом".

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  actor_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (
    kind in (
      'friend_request', 'friend_accepted',
      'post_like', 'post_comment', 'message'
    )
  ),
  post_id uuid references public.posts (id) on delete cascade,
  conversation_id uuid references public.conversations (id) on delete cascade,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  check (user_id <> actor_id)
);

create index if not exists notifications_user_idx
  on public.notifications (user_id, is_read, created_at desc);

alter table public.notifications enable row level security;

drop policy if exists notifications_select on public.notifications;
create policy notifications_select on public.notifications
  for select to authenticated using (user_id = auth.uid());

drop policy if exists notifications_update on public.notifications;
create policy notifications_update on public.notifications
  for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists notifications_delete on public.notifications;
create policy notifications_delete on public.notifications
  for delete to authenticated using (user_id = auth.uid());

create or replace function public.notify(
  recipient uuid,
  actor uuid,
  kind text,
  post uuid default null,
  conversation uuid default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if recipient is null or actor is null or recipient = actor then
    return;
  end if;
  insert into public.notifications (user_id, actor_id, kind, post_id, conversation_id)
  values (recipient, actor, kind, post, conversation);
end;
$$;

revoke execute on function public.notify(uuid, uuid, text, uuid, uuid) from public;
revoke execute on function public.notify(uuid, uuid, text, uuid, uuid) from authenticated;
revoke execute on function public.notify(uuid, uuid, text, uuid, uuid) from anon;

create or replace function public.on_friendship_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    perform public.notify(new.receiver_id, new.requester_id, 'friend_request');
  elsif new.status = 'accepted' and old.status <> 'accepted' then
    perform public.notify(new.requester_id, new.receiver_id, 'friend_accepted');
  end if;
  return new;
end;
$$;

drop trigger if exists friendships_notify on public.friendships;
create trigger friendships_notify
  after insert or update on public.friendships
  for each row execute function public.on_friendship_change();

create or replace function public.on_like_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare author uuid;
begin
  select p.author_id into author from public.posts p where p.id = new.post_id;
  perform public.notify(author, new.user_id, 'post_like', new.post_id);
  return new;
end;
$$;

drop trigger if exists likes_notify on public.likes;
create trigger likes_notify
  after insert on public.likes
  for each row execute function public.on_like_insert();

create or replace function public.on_comment_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare author uuid;
begin
  select p.author_id into author from public.posts p where p.id = new.post_id;
  perform public.notify(author, new.author_id, 'post_comment', new.post_id);
  return new;
end;
$$;

drop trigger if exists comments_notify on public.comments;
create trigger comments_notify
  after insert on public.comments
  for each row execute function public.on_comment_insert();

create or replace function public.on_message_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.notify(m.user_id, new.author_id, 'message', null, new.conversation_id)
  from public.conversation_members m
  where m.conversation_id = new.conversation_id
    and m.user_id <> new.author_id;
  return new;
end;
$$;

drop trigger if exists messages_notify on public.messages;
create trigger messages_notify
  after insert on public.messages
  for each row execute function public.on_message_insert();

-- ─────────────────────────────────────────────────────────────
-- 4. СЧЁТЧИКИ
-- ─────────────────────────────────────────────────────────────

create or replace function public.my_counters()
returns table (
  friend_requests integer,
  unread_messages integer,
  unread_notifications integer
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    (
      select count(*)::int from public.friendships f
      where f.receiver_id = auth.uid() and f.status = 'pending'
    ),
    (
      select count(*)::int
      from public.conversation_members mine
      join public.messages m on m.conversation_id = mine.conversation_id
      where mine.user_id = auth.uid()
        and m.author_id <> auth.uid()
        and m.created_at > mine.last_read_at
    ),
    (
      select count(*)::int from public.notifications n
      where n.user_id = auth.uid() and not n.is_read
    )
  where auth.uid() is not null;
$$;

-- ─────────────────────────────────────────────────────────────
-- 5. ФОТОГРАФИИ В ЗАПИСЯХ
-- ─────────────────────────────────────────────────────────────

alter table public.posts
  add column if not exists photo_id uuid references public.photos (id) on delete set null;

-- Запись без текста допустима, если к ней приложена фотография —
-- ВКонтакте 2012 это позволял.
alter table public.posts drop constraint if exists posts_content_check;
alter table public.posts add constraint posts_content_check check (
  char_length(content) <= 4000
  and (char_length(content) > 0 or photo_id is not null)
);

-- Один альбом на название у владельца, иначе "Фотографии на стене"
-- плодились бы при каждой загрузке.
create unique index if not exists albums_owner_title_idx
  on public.albums (owner_id, lower(title));

create or replace function public.ensure_album(title text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := auth.uid();
  found uuid;
begin
  if me is null then
    raise exception 'bad_request';
  end if;
  select a.id into found
  from public.albums a
  where a.owner_id = me and lower(a.title) = lower(title);
  if found is not null then
    return found;
  end if;
  insert into public.albums (owner_id, title) values (me, title) returning id into found;
  return found;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- 6. ЗАКРЫТИЕ ДЫРЫ В RLS ПЕРЕПИСКИ
-- ─────────────────────────────────────────────────────────────

drop policy if exists conversations_insert on public.conversations;
drop policy if exists members_insert on public.conversation_members;

-- ─────────────────────────────────────────────────────────────
-- 7. REALTIME
-- ─────────────────────────────────────────────────────────────

do $$
begin
  alter publication supabase_realtime add table public.notifications;
exception
  when duplicate_object then null;
end;
$$;
