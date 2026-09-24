-- Rendez-vous proposés aux clients à partir d'une demande de devis.
-- appointment_token : jeton aléatoire envoyé par email, qui permet au client de confirmer ou de demander une autre date sans compte.
alter table public.quote_requests
  add column if not exists lang text not null default 'fr' check (lang in ('fr','en','es','de')),
  add column if not exists category_label text,
  add column if not exists appointment_at timestamptz,
  add column if not exists appointment_duration integer check (appointment_duration between 15 and 600),
  add column if not exists appointment_location text,
  add column if not exists appointment_note text,
  add column if not exists appointment_status text check (appointment_status in ('proposee','confirmee','a_replanifier')),
  add column if not exists appointment_token uuid unique,
  add column if not exists appointment_responded_at timestamptz,
  add column if not exists client_response text,
  add column if not exists reminder_sent_at timestamptz;

create index if not exists quote_requests_appointment_at_idx on public.quote_requests (appointment_at) where appointment_status = 'confirmee';
