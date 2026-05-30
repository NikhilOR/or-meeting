create table if not exists public.or_meetings (
  id text primary key,
  title text not null,
  meeting_date date,
  attendees text default '',
  tags jsonb not null default '[]'::jsonb,
  body text default '',
  actions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.or_meetings enable row level security;

drop policy if exists "Allow anon read meetings" on public.or_meetings;
drop policy if exists "Allow anon insert meetings" on public.or_meetings;
drop policy if exists "Allow anon update meetings" on public.or_meetings;
drop policy if exists "Allow anon delete meetings" on public.or_meetings;

create policy "Allow anon read meetings"
on public.or_meetings
for select
to anon
using (true);

create policy "Allow anon insert meetings"
on public.or_meetings
for insert
to anon
with check (true);

create policy "Allow anon update meetings"
on public.or_meetings
for update
to anon
using (true)
with check (true);

create policy "Allow anon delete meetings"
on public.or_meetings
for delete
to anon
using (true);

create index if not exists or_meetings_meeting_date_idx on public.or_meetings (meeting_date desc);
create index if not exists or_meetings_tags_idx on public.or_meetings using gin (tags);
create index if not exists or_meetings_actions_idx on public.or_meetings using gin (actions);
