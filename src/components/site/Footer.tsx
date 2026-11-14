import Link from "next/link";
import { site } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-line-soft pb-28 pt-14 text-center md:pb-14">
      <div className="container-x">
        <p className="font-display text-3xl tracking-[0.14em]">
          Sans <span className="display-italic">Façon</span>
        </p>
        <p className="eyebrow mt-4">
          {site.baseline} · {site.contact.city}
        </p>
        <div className="ornament mt-8" aria-hidden>
          <span />
        </div>
        <nav aria-label="Pied de page" className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {[
            { href: "/#formules", label: "Formules" },
            { href: "/#reserver", label: "Réserver" },
            { href: "/#contact", label: "Contact" },
            { href: "/confidentialite", label: "Confidentialité" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.6875rem] uppercase tracking-[0.24em] text-stone transition-colors hover:text-gold-soft"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="mt-8 text-xs text-stone">© {site.name}. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
