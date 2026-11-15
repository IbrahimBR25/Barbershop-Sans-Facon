import Link from "next/link";
import { Suspense } from "react";
import { logout } from "@/app/actions/admin";
import { NavLinks, NavLinksView } from "@/components/admin/NavLinks";
import { isAdmin } from "@/lib/auth";
import { countPending } from "@/lib/bookings";

async function PendingBadge() {
  if (!(await isAdmin())) return null;
  const n = await countPending();
  if (n === 0) return null;
  return (
    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[0.6875rem] font-medium tracking-normal text-ink">
      {n}
    </span>
  );
}

export function AdminNav() {
  const badge = (
    <Suspense fallback={null}>
      <PendingBadge />
    </Suspense>
  );
  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-ink/95 backdrop-blur-md">
      <div className="container-x flex h-14 items-center justify-between gap-4">
        <Link href="/admin" className="font-display text-[1.4rem] leading-none">
          Sans Façon
          <span className="ml-3 hidden font-sans text-[0.625rem] uppercase tracking-[0.2em] text-stone sm:inline">
            Espace gérant
          </span>
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="text-[0.6875rem] uppercase tracking-[0.2em] text-stone transition-colors hover:text-gold-soft"
          >
            Déconnexion
          </button>
        </form>
      </div>
      <nav
        aria-label="Espace gérant"
        className="container-x -mb-px flex overflow-x-auto border-t border-line-soft [scrollbar-width:none]"
      >
        <Suspense fallback={<NavLinksView pathname={null} />}>
          <NavLinks badge={badge} />
        </Suspense>
      </nav>
    </header>
  );
}
