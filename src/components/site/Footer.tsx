import Link from "next/link";
import { site } from "@/config/site";

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-line-soft pb-28 pt-16 md:pb-12">
      <div className="container-x">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <nav aria-label="Pied de page" className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              { href: "/#formules", label: "Formules" },
              { href: "/#cortege", label: site.cortege.title },
              { href: "/#reserver", label: "Réserver" },
              { href: "/confidentialite", label: "Confidentialité" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[0.6875rem] uppercase tracking-[0.18em] text-sand transition-colors hover:text-ivory"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs text-stone">
            © {site.name} — {site.baseline}, {site.contact.city}
          </p>
        </div>
        <p
          aria-hidden
          className="mt-14 select-none whitespace-nowrap font-display text-[22vw] leading-[0.8] tracking-[-0.03em] text-ivory/[0.06] md:text-[17vw]"
        >
          Sans Façon
        </p>
      </div>
    </footer>
  );
}
