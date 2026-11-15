import { site } from "@/config/site";

export function Gallery() {
  const { items, showPlaceholders } = site.gallery;
  if (items.length === 0 && !showPlaceholders) return null;
  const frames = items.length > 0 ? items.slice(0, 3) : Array.from({ length: 3 }, () => null);

  return (
    <section id="salon" aria-label="Le salon" className="border-t border-line-soft py-6">
      <div className={`grid gap-px bg-line-soft ${items.length > 0 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-3"}`}>
        {frames.map((item, i) => (
          <div
            key={item?.src ?? i}
            className={`relative overflow-hidden bg-panel ${item ? "aspect-[4/5]" : "aspect-[3/4] sm:aspect-[4/3]"}`}
          >
            {item ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="h-full w-full object-cover grayscale-[20%] transition-transform duration-[1.4s] ease-[var(--ease-soft)] hover:scale-[1.03]"
              />
            ) : (
              <div aria-hidden className="flex h-full w-full items-end justify-between p-3 sm:p-5">
                <span className="index text-stone">{String(i + 1).padStart(2, "0")}</span>
                <span className="eyebrow hidden text-stone sm:inline">Image à venir</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
