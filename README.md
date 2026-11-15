# Sans Façon — website, booking requests and owner agenda

Website for the Sans Façon barbershop: a luxury one-page site, a short booking request
form that hands off to WhatsApp, a tracking page for the customer, and a private area
where the owner confirms appointments and sees his week.

Built with Next.js 16 (App Router), Tailwind CSS 4 and Postgres (Supabase).

## How booking works

1. The customer fills a short form: name, phone, package, preferred day and time.
2. The request is saved, then the customer lands on a tracking page that says clearly
   **"not confirmed yet"**. One button opens WhatsApp with the message already written,
   addressed to the salon's number.
3. The owner calls the customer back, agrees on a time, and confirms it in `/admin`.
4. The customer's tracking page switches to **"confirmed"** with the date, time, address
   and an "add to my calendar" button. The owner can also send a ready-made WhatsApp
   confirmation.

**Le Cortège (group booking):** in the form, "Le Cortège" switches to group mode. The client
adds each person (groom, best man, brother…) with their own package, up to 10 people, and
sends one request. The WhatsApp message, the tracking page and the owner area all show the
full group. The group offer text is set in `cortege` in the content file.

Because the request is saved before WhatsApp opens, nothing is lost if the customer
never taps "send": it still shows up in the owner's admin area.

## Where to change content

Everything that will change lives in **one file**: [`src/config/site.ts`](src/config/site.ts).

| What | Field |
| --- | --- |
| Phone and WhatsApp number, address, Maps link | `contact` |
| Opening hours shown on the site | `hours` |
| Bookable time slots, closed days | `booking` |
| Instagram, Facebook, TikTok links (empty string hides one) | `socials` |
| Packages, their contents, duration and price | `packs` |
| Le Cortège texts, group offer, max group size | `cortege` |
| À la carte services and prices | `services` |
| Photos of the salon | `gallery` |
| Hero background photo or video | `hero` |
| Frequently asked questions | `faq` |

Values marked `À COMPLÉTER` are placeholders. A price left at `null` shows
"Tarif sur demande".

**Photos and videos:** drop files in `public/photos/` (or `public/videos/`), then list
them in `gallery.items` or `hero`. Until then the gallery shows decorative frames; set
`gallery.showPlaceholders` to `false` to hide the section instead.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then fill it in, see below
npm run hash-password        # prints ADMIN_PASSWORD_HASH, AUTH_SECRET, CALENDAR_FEED_KEY
npm run db:migrate           # creates the tables
npm run dev
```

The site is at http://localhost:3000 and the owner area at http://localhost:3000/admin.

## Deploy (Supabase + Vercel)

1. **Supabase**: create a project (region Paris, `eu-west-3`, is the closest to Tunisia).
   Open the SQL Editor, paste the content of each file in
   [`supabase/migrations/`](supabase/migrations/) in order (`0001`, then `0002`) and run it.
   Then open **Connect** and copy the **Transaction pooler** connection string (port 6543).
2. **Secrets**: run `npm run hash-password` on your machine and choose the owner's
   password (12 characters minimum). Keep the three printed lines.
3. **Vercel**: import the Git repository and add these environment variables:

   | Variable | Value |
   | --- | --- |
   | `DATABASE_URL` | Supabase transaction pooler string |
   | `AUTH_SECRET` | from `hash-password` |
   | `ADMIN_PASSWORD_HASH` | from `hash-password` |
   | `CALENDAR_FEED_KEY` | from `hash-password` |
   | `NEXT_PUBLIC_SITE_URL` | the public address, e.g. `https://www.sansfacon.tn` |

4. Deploy, then attach the domain in Vercel.

## The owner area (`/admin`)

- **Demandes**: new requests, with a call button. Open one to confirm it after the call.
- **Agenda**: the week, with confirmed appointments and pending requests (dashed).
- **Nouveau**: add an appointment taken by phone or in the shop.
- **Historique**: search by name, phone or reference.
- **Réglages**: a private calendar address to subscribe from Google Calendar or iPhone,
  so confirmed appointments appear in the owner's personal calendar.

A warning appears when a time overlaps another confirmed appointment.

## Security

- The database is never reachable from the browser. Row Level Security is enabled with
  no policy, so Supabase's public API keys can read and write nothing. Only the server
  talks to Postgres, through `DATABASE_URL`.
- All input is validated on the server (zod) and written with parameterised queries.
- Public form: honeypot field, limits per phone number, per IP and globally, duplicate
  detection, 64 kB body limit.
- Owner login: scrypt password hash, signed `httpOnly` session cookie scoped to `/admin`,
  8 attempts per 15 minutes. Every admin page and every admin action re-checks the session.
- Customer tracking links use a 192-bit random token and show only the first name,
  the slot and a masked phone number.
- Strict security headers: Content-Security-Policy (no third-party scripts, fonts are
  self-hosted), HSTS, no framing, no referrer on private pages, `noindex` on `/admin`,
  `/reservation` and `/api`.
- No analytics, no tracking cookies. IP addresses are stored only as a keyed hash.

To log everyone out, change `AUTH_SECRET`. To change the password, generate a new
`ADMIN_PASSWORD_HASH`. To revoke the calendar address, change `CALENDAR_FEED_KEY`.

## Useful commands

```bash
npm run dev            # development server
npm run build          # production build
npm run lint           # ESLint
npm run typecheck      # TypeScript
npm run hash-password  # generate the password hash and secrets
npm run db:migrate     # apply SQL migrations to DATABASE_URL (.env.local)
```
