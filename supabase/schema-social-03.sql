-- TamirlanOS · VK 2012 — доводка системы друзей.
-- Запускать ПОСЛЕ schema-social-02.sql. Повторный запуск безопасен.

-- ─────────────────────────────────────────────────────────────
-- 1. ОТМЕТКА ВРЕМЕНИ ИЗМЕНЕНИЯ
-- ─────────────────────────────────────────────────────────────
-- created_at говорит, когда заявку отправили; принятие и отклонение
-- меняют строку, и без updated_at эти события в базе не видны.

alter table public.friendships
  add column if not exists updated_at timestamptz not null default now();

create or replace function public.touch_friendship()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists friendships_touch on public.friendships;
create trigger friendships_touch
  before update on public.friendships
  for each row execute function public.touch_friendship();

-- ─────────────────────────────────────────────────────────────
-- 2. ИМЕНА СОСТОЯНИЙ
-- ─────────────────────────────────────────────────────────────
-- Состояние по-прежнему считает база, меняются только названия:
-- pending_outgoing / pending_incoming вместо прежнего порядка слов.

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
        when f.status = 'pending' and f.requester_id = auth.uid() then 'pending_outgoing'
        when f.status = 'pending' then 'pending_incoming'
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

-- ─────────────────────────────────────────────────────────────
-- 3. ИНДЕКС ПОД СПИСОК ИСХОДЯЩИХ
-- ─────────────────────────────────────────────────────────────
-- friendships_receiver_idx закрывал только входящие; выборка исходящих
-- заявок шла последовательным чтением.

create index if not exists friendships_requester_idx
  on public.friendships (requester_id, status);
