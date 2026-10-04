-- TamirlanOS · VK 2012 — приватность и настройки уведомлений.
-- Запускать ПОСЛЕ schema-social-05.sql. Повторный запуск безопасен.
--
-- Настройки применяются в RLS, а не в интерфейсе: переключатель, который
-- только красиво сохраняется, приватностью не является.

-- ─────────────────────────────────────────────────────────────
-- 1. ХРАНЕНИЕ НАСТРОЕК
-- ─────────────────────────────────────────────────────────────

alter table public.profiles
  add column if not exists privacy_requests text not null default 'all'
    check (privacy_requests in ('all', 'friends_of_friends', 'none')),
  add column if not exists privacy_messages text not null default 'all'
    check (privacy_messages in ('all', 'friends', 'none')),
  add column if not exists privacy_photos text not null default 'all'
    check (privacy_photos in ('all', 'friends', 'none')),
  add column if not exists privacy_posts text not null default 'all'
    check (privacy_posts in ('all', 'friends', 'none')),
  add column if not exists notify_friend_request boolean not null default true,
  add column if not exists notify_like boolean not null default true,
  add column if not exists notify_comment boolean not null default true,
  add column if not exists notify_message boolean not null default true;

-- ─────────────────────────────────────────────────────────────
-- 2. ПРОВЕРКИ ДОСТУПА
-- ─────────────────────────────────────────────────────────────

create or replace function public.are_friends(a uuid, b uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.friendships f
    where f.status = 'accepted'
      and ((f.requester_id = a and f.receiver_id = b)
        or (f.requester_id = b and f.receiver_id = a))
  );
$$;

/*
  scope: 'photos' или 'posts'. Владелец видит своё всегда, иначе решает
  настройка: all — всем вошедшим, friends — только друзьям, none — никому.
*/
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
    else 'none'
  end into rule
  from public.profiles p where p.id = target;

  if rule is null or rule = 'none' then return false; end if;
  if rule = 'all' then return true; end if;
  return public.are_friends(me, target);
end;
$$;

create or replace function public.can_message(target uuid)
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

  select p.privacy_messages into rule
  from public.profiles p where p.id = target;

  if rule is null or rule = 'none' then return false; end if;
  if rule = 'all' then return true; end if;
  return public.are_friends(me, target);
end;
$$;

create or replace function public.can_request(target uuid)
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
  if me is null or me = target then return false; end if;

  select p.privacy_requests into rule
  from public.profiles p where p.id = target;

  if rule is null or rule = 'none' then return false; end if;
  if rule = 'all' then return true; end if;

  -- friends_of_friends: есть хотя бы один общий друг.
  return exists (
    select 1
    from public.friend_ids(me) mine
    join public.friend_ids(target) theirs on theirs = mine
  );
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- 3. RLS: НАСТРОЙКИ НАЧИНАЮТ ДЕЙСТВОВАТЬ
-- ─────────────────────────────────────────────────────────────
-- Это ужесточение, а не ослабление: раньше select был открыт всем вошедшим.

drop policy if exists posts_select on public.posts;
create policy posts_select on public.posts
  for select to authenticated
  using (author_id = auth.uid() or public.can_view(wall_owner_id, 'posts'));

drop policy if exists photos_select on public.photos;
create policy photos_select on public.photos
  for select to authenticated
  using (public.can_view(owner_id, 'photos'));

drop policy if exists albums_select on public.albums;
create policy albums_select on public.albums
  for select to authenticated
  using (public.can_view(owner_id, 'photos'));

-- Заявку в друзья отправить можно только тому, кто это разрешил.
drop policy if exists friendships_insert on public.friendships;
create policy friendships_insert on public.friendships
  for insert to authenticated
  with check (requester_id = auth.uid() and public.can_request(receiver_id));

-- Переписку заводит только эта функция, здесь же проверяется разрешение.
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
  if not public.can_message(other) then
    raise exception 'messages_closed';
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

-- ─────────────────────────────────────────────────────────────
-- 4. УВЕДОМЛЕНИЯ УВАЖАЮТ НАСТРОЙКИ ПОЛУЧАТЕЛЯ
-- ─────────────────────────────────────────────────────────────

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
declare wanted boolean;
begin
  if recipient is null or actor is null or recipient = actor then
    return;
  end if;

  select case kind
    when 'friend_request' then p.notify_friend_request
    when 'friend_accepted' then p.notify_friend_request
    when 'post_like' then p.notify_like
    when 'post_comment' then p.notify_comment
    when 'message' then p.notify_message
    else true
  end into wanted
  from public.profiles p where p.id = recipient;

  if wanted is distinct from true then
    return;
  end if;

  insert into public.notifications (user_id, actor_id, kind, post_id, conversation_id)
  values (recipient, actor, kind, post, conversation);
end;
$$;

revoke execute on function public.notify(uuid, uuid, text, uuid, uuid) from public;
revoke execute on function public.notify(uuid, uuid, text, uuid, uuid) from authenticated;
revoke execute on function public.notify(uuid, uuid, text, uuid, uuid) from anon;

-- ─────────────────────────────────────────────────────────────
-- 5. УДАЛЕНИЕ ДАННЫХ АККАУНТА
-- ─────────────────────────────────────────────────────────────
-- Строку в auth.users отсюда удалить нельзя — для этого нужен service_role,
-- которому во фронтенде не место. Функция стирает всё, что принадлежит
-- человеку в приложении; каскады уносят записи, фото, переписки и заявки.

create or replace function public.purge_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare me uuid := auth.uid();
begin
  if me is null then
    raise exception 'bad_request';
  end if;
  delete from public.profiles where id = me;
end;
$$;
