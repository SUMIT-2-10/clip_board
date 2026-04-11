-- Convert Clip_Board.expire_at from timetz to timestamptz safely.
-- Direct cast (expire_at::timestamptz) is invalid in Postgres.

begin;

alter table public."Clip_Board"
	add column if not exists expire_at_new timestamptz;

-- timetz has no date component, so we anchor existing values to current_date.
update public."Clip_Board"
set expire_at_new = case
	when expire_at is null then null
	else (to_char(current_date, 'YYYY-MM-DD') || ' ' || expire_at::text)::timestamptz
end;

alter table public."Clip_Board"
	drop column if exists expire_at;

alter table public."Clip_Board"
	rename column expire_at_new to expire_at;

create index if not exists clip_board_expire_at_idx
	on public."Clip_Board" (expire_at);

commit;
