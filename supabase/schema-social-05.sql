-- TamirlanOS · VK 2012 — лента новостей.
-- Запускать ПОСЛЕ schema-social-04.sql. Повторный запуск безопасен.

-- ─────────────────────────────────────────────────────────────
-- АВТОРЫ ЛЕНТЫ
-- ─────────────────────────────────────────────────────────────
-- Клиент не может сам составить этот список: RLS показывает ему только
-- свои строки friendships, поэтому «кто мои друзья» считает база.
-- Сами записи читаются обычным select — posts_select открыт всем вошедшим,
-- и переписывать выборку записей отдельной функцией незачем.

create or replace function public.feed_authors()
returns setof uuid
language sql
stable
security definer
set search_path = ''
as $$
  select auth.uid()
  where auth.uid() is not null
  union
  select * from public.friend_ids(auth.uid());
$$;

-- Лента читает записи по автору и времени; существующий posts_wall_idx
-- построен по владельцу стены и для неё не годится.
create index if not exists posts_author_idx
  on public.posts (author_id, created_at desc);
