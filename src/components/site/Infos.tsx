import { site } from "@/config/site";
import { contactLink } from "@/lib/whatsapp";

const socials = [
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "tiktok", label: "TikTok" },
] as const;

export function Infos() {
  const { contact } = site;
  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="container-x">
        <div className="flex items-baseline gap-5 border-t border-line pt-5">
          <span className="index">05</span>
          <span className="eyebrow">Le salon</span>
        </div>

        <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-10 lg:mt-16">
          <div>
            <p className="eyebrow">Adresse</p>
            <address className="mt-4 font-display text-[1.9rem] not-italic leading-tight">
              {contact.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            {contact.mapsUrl && (
              <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-line mt-6">
                Itinéraire
              </a>
            )}
          </div>

          <div>
            <p className="eyebrow">Horaires</p>
            <dl className="mt-4 border-t border-line-soft">
              {site.hours.map((row) => (
                <div key={row.days} className="flex items-baseline justify-between gap-4 border-b border-line-soft py-3">
                  <dt className="text-sand">{row.days}</dt>
                  <dd className="tabular-nums">{row.hours}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-stone">Sur rendez-vous de préférence.</p>
          </div>

          <div>
            <p className="eyebrow">Contact</p>
            <a
              href={`tel:${contact.phoneE164}`}
              className="mt-4 block font-display text-[1.9rem] leading-tight transition-colors hover:text-gold-soft"
            >
              {contact.phoneDisplay}
            </a>
            <div className="mt-6 flex flex-col items-start gap-4">
              <a href={contactLink()} target="_blank" rel="noopener noreferrer" className="link-line">
                WhatsApp
              </a>
              {socials.map(({ key, label }) => {
                const href = site.socials[key];
                if (!href) return null;
                return (
                  <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="link-line">
                    {label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
