-- Sans Façon — Le Cortège (réservation de groupe)
-- Liste des personnes d'une demande de groupe : [{ "role": "marie", "packId": "marie" }, …]
-- NULL pour une réservation individuelle.

alter table public.bookings
  add column if not exists party jsonb;

alter table public.bookings
  drop constraint if exists party_shape;

alter table public.bookings
  add constraint party_shape check (
    party is null
    or (jsonb_typeof(party) = 'array' and jsonb_array_length(party) between 2 and 10)
  );
