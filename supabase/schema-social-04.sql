-- TamirlanOS · VK 2012 — доводка фотографий.
-- Запускать ПОСЛЕ schema-social-03.sql. Повторный запуск безопасен.

-- ─────────────────────────────────────────────────────────────
-- 1. УДАЛЕНИЕ ФОТОГРАФИИ НЕ ДОЛЖНО ЛОМАТЬ ЗАПИСИ И АВАТАР
-- ─────────────────────────────────────────────────────────────
-- posts.photo_id объявлен on delete set null, а posts_content_check
-- требует непустой текст ИЛИ фотографию. Поэтому удаление фотографии,
-- приложенной к записи без текста, падало на нарушении констрейнта:
-- каскад пытался обнулить photo_id и запись переставала быть валидной.
-- Такая запись без фотографии не имеет смысла и удаляется целиком.
--
-- Вторая половина — аватар: ссылка на удалённый файл оставалась
-- в profiles.avatar_url и профиль показывал битую картинку.

create or replace function public.detach_photo()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.posts
  where photo_id = old.id and char_length(content) = 0;

  update public.profiles
  set avatar_url = null
  where id = old.owner_id
    and avatar_url is not null
    and avatar_url like '%' || old.storage_path;

  return old;
end;
$$;

drop trigger if exists photos_detach on public.photos;
create trigger photos_detach
  before delete on public.photos
  for each row execute function public.detach_photo();

-- ─────────────────────────────────────────────────────────────
-- 2. ИНДЕКС ПОД ГАЛЕРЕЮ ПОЛЬЗОВАТЕЛЯ
-- ─────────────────────────────────────────────────────────────
-- photos_album_idx закрывал выборку по альбому, а галерея читает
-- все фотографии владельца.

create index if not exists photos_owner_idx
  on public.photos (owner_id, created_at desc);
