import { site } from "@/config/site";
import { contactLink } from "@/lib/whatsapp";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "@/components/ui/icons";

const socials = [
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
  { key: "tiktok", label: "TikTok", Icon: TikTokIcon },
] as const;

export function Infos() {
  const { contact } = site;
  return (
    <section id="contact" className="border-t border-line-soft py-24 sm:py-32">
      <div className="container-x">
        <div className="grid gap-px bg-line-soft md:grid-cols-3">
          <div className="bg-ink p-8 sm:p-10">
            <p className="eyebrow">Adresse</p>
            <address className="mt-5 font-display text-[1.7rem] not-italic leading-snug">
              {contact.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            {contact.mapsUrl && (
              <a
                href={contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-gold mt-6 inline-block text-sm"
              >
                Voir l&apos;itinéraire
              </a>
            )}
          </div>

          <div className="bg-ink p-8 sm:p-10">
            <p className="eyebrow">Horaires</p>
            <dl className="mt-5 space-y-3">
              {site.hours.map((row) => (
                <div key={row.days} className="flex items-baseline justify-between gap-4">
                  <dt className="text-sand">{row.days}</dt>
                  <dd className="font-display text-[1.45rem] tabular-nums">{row.hours}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm text-stone">Sur rendez-vous de préférence.</p>
          </div>

          <div className="bg-ink p-8 sm:p-10">
            <p className="eyebrow">Contact</p>
            <a
              href={`tel:${contact.phoneE164}`}
              className="mt-5 block font-display text-[1.7rem] leading-snug transition-colors hover:text-gold-soft"
            >
              {contact.phoneDisplay}
            </a>
            <a
              href={contactLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="link-gold mt-3 inline-flex items-center gap-2 text-sm"
            >
              <WhatsAppIcon width={16} height={16} />
              Écrire sur WhatsApp
            </a>
            <ul className="mt-7 flex gap-3">
              {socials.map(({ key, label, Icon }) => {
                const href = site.socials[key];
                if (!href) return null;
                return (
                  <li key={key}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-11 w-11 items-center justify-center border border-line text-sand transition-colors duration-300 hover:border-gold hover:text-gold-soft"
                    >
                      <Icon />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
