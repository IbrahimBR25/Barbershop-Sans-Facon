import Link from "next/link";
import { site } from "@/config/site";
import { contactLink } from "@/lib/whatsapp";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";

/** Barre d'action fixe en bas de l'écran, sur téléphone uniquement. */
export function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-ink/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <a
        href={`tel:${site.contact.phoneE164}`}
        aria-label="Appeler le salon"
        className="flex h-14 w-14 shrink-0 items-center justify-center border-r border-line text-gold-soft"
      >
        <PhoneIcon />
      </a>
      <a
        href={contactLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Écrire sur WhatsApp"
        className="flex h-14 w-14 shrink-0 items-center justify-center border-r border-line text-gold-soft"
      >
        <WhatsAppIcon />
      </a>
      <Link
        href="/#reserver"
        className="flex h-14 flex-1 items-center justify-center bg-gold text-xs font-medium uppercase tracking-[0.24em] text-ink"
      >
        Réserver un créneau
      </Link>
    </div>
  );
}
