"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export const adminLinks = [
  { href: "/admin", label: "Demandes" },
  { href: "/admin/agenda", label: "Agenda" },
  { href: "/admin/nouveau", label: "Nouveau" },
  { href: "/admin/historique", label: "Historique" },
  { href: "/admin/reglages", label: "Réglages" },
];

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/admin") return pathname === "/admin" || pathname.startsWith("/admin/rdv");
  return pathname.startsWith(href);
}

export function NavLinksView({
  pathname,
  badge,
}: {
  pathname: string | null;
  badge?: ReactNode;
}) {
  return (
    <>
      {adminLinks.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`relative flex h-12 shrink-0 items-center gap-2 px-3.5 text-[0.6875rem] uppercase tracking-[0.2em] transition-colors sm:px-4 ${
              active
                ? "text-gold-soft after:absolute after:inset-x-3 after:bottom-0 after:h-px after:bg-gold"
                : "text-sand hover:text-ivory"
            }`}
          >
            {link.label}
            {link.href === "/admin" && badge}
          </Link>
        );
      })}
    </>
  );
}

export function NavLinks({ badge }: { badge?: ReactNode }) {
  return <NavLinksView pathname={usePathname()} badge={badge} />;
}
