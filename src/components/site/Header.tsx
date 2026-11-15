import Link from "next/link";
import { site } from "@/config/site";

const nav = [
  { href: "/#formules", label: "Formules" },
  { href: "/#cortege", label: site.cortege.title },
  { href: "/#carte", label: "La carte" },
  { href: "/#contact", label: "Contact" },
];

export function Header({ minimal = false }: { minimal?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-ink/80 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between gap-6 sm:h-[4.5rem]">
        <Link
          href="/"
          className="font-display text-[1.6rem] leading-none tracking-[-0.01em] text-ivory"
          aria-label={`${site.name} — accueil`}
        >
          Sans Façon
        </Link>

        <div className="flex items-center gap-10">
          {!minimal && (
            <nav aria-label="Navigation principale" className="hidden items-center gap-9 lg:flex">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[0.6875rem] uppercase tracking-[0.18em] text-sand transition-colors duration-300 hover:text-ivory"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
          <Link href="/#reserver" className="btn btn-ghost btn-sm">
            Réserver
          </Link>
        </div>
      </div>
    </header>
  );
}
