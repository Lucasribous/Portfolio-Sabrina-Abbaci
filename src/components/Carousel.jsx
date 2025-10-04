import { useEffect, useRef, useState } from "react";

export default function Carousel({
  images = [],
  dotSize = "0.75rem",
  dotGap = "0.75rem",
}) {
  const [active, setActive] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.offsetWidth);
      setActive(idx);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  if (!images.length) return null;

  return (
    <div className="relative w-full mt-6">
      <div className="flex flex-col items-center relative">
        <div className="relative w-full max-w-[75vw] mx-auto isolate">
          {/* décor : centre au coin haut-gauche (sous le carrousel) */}
          <img
            src="/images/optimized/left-320.webp"
            alt=""
            className="absolute left-0 top-0 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none max-w-[15vw] z-[-1]"
            loading="lazy"
            decoding="async"
          />

          {/* décor : centre au coin bas-droit (au-dessus du carrousel) */}
          <img
            src="/images/optimized/right-320.webp"
            alt=""
            className="absolute left-full top-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none max-w-[15vw] z-[30]"
            loading="lazy"
            decoding="async"
          />

          {/* carrousel */}
          <div
            ref={ref}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full rounded-xl no-scrollbar z-[10]"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {images.map((img, i) => (
              <div key={i} className="flex-shrink-0 w-full snap-center px-2">
                <a href={img.link || "#"} className="block w-full">
                  <picture>
                    <source
                      srcSet={`${img.base}-320.webp 320w, ${img.base}-640.webp 640w, ${img.base}-1024.webp 1024w, ${img.base}-1600.webp 1600w`}
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 80vw, 60vw"
                      type="image/webp"
                    />
                    <img
                      src={`${img.base}-640.webp`}
                      alt={img.alt || ""}
                      className="w-full object-cover rounded-xl shadow-md"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* dots : utilise la classe CSS .carousel-dots / .carousel-dot (voir index.css) */}
        <div
          className="carousel-dots flex items-center mt-4 z-[10]"
          style={{ columnGap: dotGap }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const el = ref.current;
                if (!el) return;
                el.scrollTo({ left: i * el.offsetWidth, behavior: "smooth" });
              }}
              aria-label={`Aller à la diapo ${i + 1}`}
              type="button"
              className={`carousel-dot rounded-full inline-flex items-center justify-center p-0 min-w-0 border-0 outline-none appearance-none ${
                i === active ? "active" : ""
              }`}
              style={{
                width: dotSize,
                height: dotSize,
                // fallback visuel si le CSS ne gère pas l'état actif
                opacity: i === active ? 1 : 0.5,
                transform: i === active ? "scale(1.15)" : "none",
                background: "var(--accent)", // force la couleur via la variable CSS
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}