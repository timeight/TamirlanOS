-- TamirlanOS · VK 2012 — прочитанность счётчиков.
-- Запускать ПОСЛЕ schema-social.sql. Повторный запуск безопасен.

-- ─────────────────────────────────────────────────────────────
-- 1. «ЗАЯВКУ ВИДЕЛИ» — СВОЙСТВО ЗАЯВКИ, А НЕ УВЕДОМЛЕНИЯ
-- ─────────────────────────────────────────────────────────────
-- Счётчик друзей считал все pending-заявки, поэтому погасить его можно
-- было только приняв или отклонив заявку. Отметка просмотра живёт здесь:
-- политика friendships_update уже разрешает получателю менять свою строку,
-- поэтому отдельной функции не нужно.

alter table public.friendships
  add column if not exists seen_at timestamptz;

create index if not exists friendships_unseen_idx
  on public.friendships (receiver_id, status)
  where seen_at is null;

-- ─────────────────────────────────────────────────────────────
-- 2. СЧЁТЧИКИ УЧИТЫВАЮТ ПРОСМОТР
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
      where f.receiver_id = auth.uid()
        and f.status = 'pending'
        and f.seen_at is null
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
