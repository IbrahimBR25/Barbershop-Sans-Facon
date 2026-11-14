import "server-only";
import { randomBytes, randomInt } from "node:crypto";
import { db } from "@/lib/db";
import { addMinutes, timeToMinutes } from "@/lib/dates";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Booking = {
  id: string;
  ref: string;
  token: string;
  name: string;
  phone: string;
  packId: string | null;
  requestedDate: string;
  requestedTime: string | null;
  message: string | null;
  status: BookingStatus;
  confirmedDate: string | null;
  confirmedTime: string | null;
  durationMin: number;
  adminNote: string | null;
  source: "web" | "admin";
  createdAt: string;
  updatedAt: string;
};

type Row = {
  id: string;
  ref: string;
  token: string;
  name: string;
  phone: string;
  pack_id: string | null;
  requested_date: string;
  requested_time: string | null;
  message: string | null;
  status: BookingStatus;
  confirmed_date: string | null;
  confirmed_time: string | null;
  duration_min: number;
  admin_note: string | null;
  source: "web" | "admin";
  created_at: Date;
  updated_at: Date;
};

function toBooking(r: Row): Booking {
  return {
    id: r.id,
    ref: r.ref,
    token: r.token,
    name: r.name,
    phone: r.phone,
    packId: r.pack_id,
    requestedDate: r.requested_date,
    requestedTime: r.requested_time,
    message: r.message,
    status: r.status,
    confirmedDate: r.confirmed_date,
    confirmedTime: r.confirmed_time,
    durationMin: r.duration_min,
    adminNote: r.admin_note,
    source: r.source,
    createdAt: r.created_at.toISOString(),
    updatedAt: r.updated_at.toISOString(),
  };
}

/** Colonnes lues, avec dates et heures converties en texte. */
function cols() {
  return db()`
    id, ref, token, name, phone, pack_id,
    requested_date::text as requested_date,
    to_char(requested_time, 'HH24:MI') as requested_time,
    message, status,
    confirmed_date::text as confirmed_date,
    to_char(confirmed_time, 'HH24:MI') as confirmed_time,
    duration_min, admin_note, source, created_at, updated_at
  `;
}

const REF_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // sans 0/O/1/I

function newRef(): string {
  let out = "";
  for (let i = 0; i < 6; i++) out += REF_ALPHABET[randomInt(REF_ALPHABET.length)];
  return `SF-${out}`;
}

function newToken(): string {
  return randomBytes(24).toString("base64url");
}

export const TOKEN_RE = /^[A-Za-z0-9_-]{32}$/;
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type NewBooking = {
  name: string;
  phone: string;
  packId: string | null;
  requestedDate: string;
  requestedTime: string | null;
  message: string | null;
  durationMin: number;
  ipHash: string | null;
};

/** Demande envoyée depuis le site : toujours « en attente ». */
export async function createRequest(input: NewBooking): Promise<Booking> {
  const sql = db();
  const rows = await sql<Row[]>`
    insert into bookings
      (ref, token, name, phone, pack_id, requested_date, requested_time, message, duration_min, ip_hash, source)
    values
      (${newRef()}, ${newToken()}, ${input.name}, ${input.phone}, ${input.packId},
       ${input.requestedDate}, ${input.requestedTime}, ${input.message}, ${input.durationMin},
       ${input.ipHash}, 'web')
    returning ${cols()}
  `;
  return toBooking(rows[0]);
}

/** Rendez-vous saisi par le gérant (appel, passage au salon) : confirmé d'emblée. */
export async function createConfirmed(input: {
  name: string;
  phone: string;
  packId: string | null;
  date: string;
  time: string;
  durationMin: number;
  adminNote: string | null;
}): Promise<Booking> {
  const sql = db();
  const rows = await sql<Row[]>`
    insert into bookings
      (ref, token, name, phone, pack_id, requested_date, requested_time,
       status, confirmed_date, confirmed_time, duration_min, admin_note, source)
    values
      (${newRef()}, ${newToken()}, ${input.name}, ${input.phone}, ${input.packId},
       ${input.date}, ${input.time}, 'confirmed', ${input.date}, ${input.time},
       ${input.durationMin}, ${input.adminNote}, 'admin')
    returning ${cols()}
  `;
  return toBooking(rows[0]);
}

/** Évite les doublons quand un client envoie deux fois le même formulaire. */
export async function findRecentDuplicate(phone: string, date: string): Promise<Booking | null> {
  const sql = db();
  const rows = await sql<Row[]>`
    select ${cols()} from bookings
    where phone = ${phone} and requested_date = ${date} and status = 'pending'
      and created_at > now() - interval '15 minutes'
    order by created_at desc limit 1
  `;
  return rows[0] ? toBooking(rows[0]) : null;
}

export async function getByToken(token: string): Promise<Booking | null> {
  if (!TOKEN_RE.test(token)) return null;
  const sql = db();
  const rows = await sql<Row[]>`select ${cols()} from bookings where token = ${token} limit 1`;
  return rows[0] ? toBooking(rows[0]) : null;
}

export async function getById(id: string): Promise<Booking | null> {
  if (!UUID_RE.test(id)) return null;
  const sql = db();
  const rows = await sql<Row[]>`select ${cols()} from bookings where id = ${id} limit 1`;
  return rows[0] ? toBooking(rows[0]) : null;
}

export async function listPending(): Promise<Booking[]> {
  const sql = db();
  const rows = await sql<Row[]>`
    select ${cols()} from bookings where status = 'pending'
    order by created_at desc limit 200
  `;
  return rows.map(toBooking);
}

/** Rendez-vous confirmés entre deux dates incluses. */
export async function listConfirmedBetween(from: string, to: string): Promise<Booking[]> {
  const sql = db();
  const rows = await sql<Row[]>`
    select ${cols()} from bookings
    where status = 'confirmed' and confirmed_date between ${from} and ${to}
    order by confirmed_date, confirmed_time
    limit 1000
  `;
  return rows.map(toBooking);
}

/** Demandes en attente dont le souhait tombe entre deux dates incluses. */
export async function listPendingBetween(from: string, to: string): Promise<Booking[]> {
  const sql = db();
  const rows = await sql<Row[]>`
    select ${cols()} from bookings
    where status = 'pending' and requested_date between ${from} and ${to}
    order by requested_date, requested_time nulls last
    limit 500
  `;
  return rows.map(toBooking);
}

export async function listRecent(
  status: BookingStatus | "all",
  search: string | null,
  limit = 100,
): Promise<Booking[]> {
  const sql = db();
  const like = search ? `%${search.replace(/[\\%_]/g, "\\$&")}%` : null;
  const rows = await sql<Row[]>`
    select ${cols()} from bookings
    where true
      ${status === "all" ? sql`` : sql`and status = ${status}`}
      ${like ? sql`and (name ilike ${like} or phone ilike ${like} or ref ilike ${like})` : sql``}
    order by created_at desc
    limit ${limit}
  `;
  return rows.map(toBooking);
}

export async function countPending(): Promise<number> {
  const sql = db();
  const rows = await sql<{ n: number }[]>`
    select count(*)::int as n from bookings where status = 'pending'
  `;
  return rows[0].n;
}

/** Rendez-vous confirmés qui chevauchent le créneau donné. */
export async function findConflicts(
  date: string,
  time: string,
  durationMin: number,
  excludeId: string | null,
): Promise<Booking[]> {
  const sameDay = await listConfirmedBetween(date, date);
  const start = timeToMinutes(time);
  const end = start + durationMin;
  return sameDay.filter((b) => {
    if (b.id === excludeId || !b.confirmedTime) return false;
    const s = timeToMinutes(b.confirmedTime);
    return s < end && start < s + b.durationMin;
  });
}

export async function confirmBooking(
  id: string,
  input: { date: string; time: string; durationMin: number; packId: string | null; adminNote: string | null },
): Promise<Booking | null> {
  if (!UUID_RE.test(id)) return null;
  const sql = db();
  const rows = await sql<Row[]>`
    update bookings set
      status = 'confirmed',
      confirmed_date = ${input.date},
      confirmed_time = ${input.time},
      duration_min = ${input.durationMin},
      pack_id = ${input.packId},
      admin_note = ${input.adminNote},
      updated_at = now()
    where id = ${id}
    returning ${cols()}
  `;
  return rows[0] ? toBooking(rows[0]) : null;
}

export async function setStatus(
  id: string,
  status: "pending" | "cancelled",
): Promise<Booking | null> {
  if (!UUID_RE.test(id)) return null;
  const sql = db();
  const rows = await sql<Row[]>`
    update bookings set
      status = ${status},
      confirmed_date = null,
      confirmed_time = null,
      updated_at = now()
    where id = ${id}
    returning ${cols()}
  `;
  return rows[0] ? toBooking(rows[0]) : null;
}

/** Suppression définitive. Uniquement pour une demande déjà annulée. */
export async function deleteCancelled(id: string): Promise<boolean> {
  if (!UUID_RE.test(id)) return false;
  const sql = db();
  const rows = await sql`delete from bookings where id = ${id} and status = 'cancelled' returning id`;
  return rows.length > 0;
}

/** Heure de fin d'un rendez-vous confirmé. */
export function endTime(b: Pick<Booking, "confirmedTime" | "durationMin">): string | null {
  return b.confirmedTime ? addMinutes(b.confirmedTime, b.durationMin) : null;
}
