// ...existing code...
import React from "react";

/**
 * Header.jsx
 * - Mobile-first, optimisé :
 *   - <source type="image/webp" srcSet="..."> pour WebP (320 / 640 / 1024 / 1600)
 *   - <img src="/images/header.png"> comme fallback PNG (header.png présent dans /public/images)
 * - Props :
 *   - image : string (chemin) ou { base, alt } où `base` sans extension ex: "/images/header"
 * - Utilise loading/eager & fetchpriority pour header visible au dessus de la ligne de flottaison
 */

const buildSrc = (base, size, ext) => `${base}-${size}.${ext}`;

export default function Header({ image = { base: "/images/header", alt: "Sabrina Abbaci" } }) {
  // Accept string or object for backwards compatibility
  const isString = typeof image === "string";
  const baseRaw = isString ? image : image.base || "/images/header";
  const alt = isString ? "Sabrina Abbaci" : image.alt || "Sabrina Abbaci";

  // If base contains an extension, use it directly (simple case)
  const hasExt = /\.\w{2,4}$/.test(baseRaw);

  if (hasExt) {
    return (
      <header
        className="w-full flex justify-center items-center select-none"
        style={{
          paddingTop: "var(--gap-header-top, 2rem)",
          paddingBottom: "var(--gap-header-bottom, 2rem)",
        }}
      >
        <img
          src={baseRaw}
          alt={alt}
          className="w-auto h-10 sm:h-14 md:h-20 object-contain"
          loading="eager"
          decoding="async"
          fetchpriority="high"
          draggable="false"
        />
      </header>
    );
  }

  // mobile-first sizes: small screens -> use small image
  const webpSrcSet = [
    `${buildSrc(baseRaw, "320", "webp")} 320w`,
    `${buildSrc(baseRaw, "640", "webp")} 640w`,
    `${buildSrc(baseRaw, "1024", "webp")} 1024w`,
    `${buildSrc(baseRaw, "1600", "webp")} 1600w`,
  ].join(", ");

  const pngFallback = `${baseRaw}.png`; // header.png présent dans /public/images

  return (
    <header
      className="w-full flex justify-center items-center select-none"
      style={{
        paddingTop: "var(--gap-header-top, 2rem)",
        paddingBottom: "var(--gap-header-bottom, 2rem)",
      }}
      aria-label="En-tête"
    >
      <picture>
        {/* WebP responsive source (mobile-first) */}
        <source
          type="image/webp"
          srcSet={webpSrcSet}
          sizes="(max-width: 640px) 320px, (max-width: 1024px) 640px, 1600px"
        />

        {/* Fallback image: PNG (also used by browsers that don't support WebP) */}
        <img
          src={pngFallback}
          alt={alt}
          className="w-auto h-10 sm:h-14 md:h-20 object-contain"
          loading="eager"
          decoding="async"
          fetchpriority="high"
          draggable="false"
          onError={(e) => {
            // si PNG manquant, tenter webp 320 (évite boucle infinie grâce au dataset)
            const el = e.currentTarget;
            const tried = el.dataset.tried || "0";
            if (tried === "0") {
              el.dataset.tried = "1";
              el.src = buildSrc(baseRaw, "320", "webp");
            } else {
              // dernier recours : tiny transparent pixel
              el.dataset.tried = "2";
              el.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            }
          }}
        />
      </picture>
    </header>
  );
}
// ...existing code...