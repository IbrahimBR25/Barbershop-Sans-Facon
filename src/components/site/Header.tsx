import Link from "next/link";
import { site } from "@/config/site";

const nav = [
  { href: "/#formules", label: "Formules" },
  { href: "/#carte", label: "La carte" },
  { href: "/#comment", label: "Comment réserver" },
  { href: "/#contact", label: "Contact" },
];

export function Header({ minimal = false }: { minimal?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-ink/85 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between gap-6 sm:h-20">
        <Link
          href="/"
          className="font-display text-[1.45rem] tracking-[0.14em] text-ivory sm:text-[1.65rem]"
          aria-label={`${site.name} — accueil`}
        >
          Sans <span className="display-italic">Façon</span>
        </Link>

        {!minimal && (
          <nav aria-label="Navigation principale" className="hidden items-center gap-9 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[0.6875rem] uppercase tracking-[0.26em] text-sand transition-colors duration-300 hover:text-gold-soft"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        <Link href="/#reserver" className="btn btn-gold btn-sm">
          Réserver
        </Link>
      </div>
    </header>
  );
}
