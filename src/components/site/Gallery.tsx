import { site } from "@/config/site";
import { SectionHeading } from "@/components/site/SectionHeading";

const layout = [
  "col-span-2 row-span-2 aspect-square sm:aspect-auto",
  "aspect-[4/5]",
  "aspect-[4/5]",
  "aspect-[4/5]",
  "aspect-[4/5]",
];

export function Gallery() {
  const { items, showPlaceholders } = site.gallery;
  if (items.length === 0 && !showPlaceholders) return null;

  const frames = items.length > 0 ? items.slice(0, 5) : Array.from({ length: 5 }, () => null);

  return (
    <section id="salon" className="border-t border-line-soft bg-coal py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Le salon"
          title={
            <>
              Un lieu pensé <span className="display-italic">pour prendre son temps</span>
            </>
          }
        />
        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {frames.map((item, i) => (
            <div
              key={item?.src ?? i}
              className={`relative overflow-hidden border border-line-soft bg-panel ${layout[i] ?? "aspect-[4/5]"}`}
            >
              {item ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-soft)] hover:scale-[1.04]"
                />
              ) : (
                <div
                  aria-hidden
                  className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#c9a96a1f,transparent_60%)]"
                >
                  <span className="font-display text-3xl italic text-gold/35 sm:text-4xl">SF</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
