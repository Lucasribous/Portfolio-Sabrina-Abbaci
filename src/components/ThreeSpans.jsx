// ...existing code...
import React from "react";

/**
 * ThreeSpans.jsx
 * - Props :
 *    texts: array de chaînes (obligatoire)
 *    gap: espace entre les paragraphes (ex: "1.5rem" ou "24px")
 *    paddingTop / paddingBottom: paddings du container (ex: "2rem")
 *    maxWidth: largeur max des paragraphes (ex: "90%" ou "720px")
 *    fontSizeClass: classes Tailwind pour la taille (ex: "text-lg md:text-2xl")
 *    fontSize: valeur numérique en px (ex: 18) -> priorité sur fontSizeClass si fourni
 *    fontWeightClass: classe tailwind pour la graisse (ex: "font-medium", "font-bold")
 *
 * Usage mobile-first. Texte centré et couleur rose via la variable --rose.
 */

export default function ThreeSpans({
  texts = [],
  gap = "1.5rem",
  paddingTop = "2rem",
  paddingBottom = "3rem",
  maxWidth = "90%",
  fontSizeClass = "text-lg md:text-2xl",
  fontSize, // number in px, optional (overrides fontSizeClass)
  fontWeightClass = "font-medium",
}) {
  if (!Array.isArray(texts) || texts.length === 0) return null;

  const containerStyle = {
    gap,
    paddingTop,
    paddingBottom,
    color: "var(--rose)",
  };

  const paragraphStyle = {
    maxWidth,
    margin: "0 auto",
    textAlign: "center",
    ...(typeof fontSize === "number" ? { fontSize: `${fontSize}px` } : {}),
  };

  return (
    <section
      className="w-full flex flex-col items-center justify-center text-center"
      style={containerStyle}
      aria-label="Présentation"
      role="region"
    >
      {texts.map((t, i) => (
        <p
          key={i}
          className={`${fontSizeClass} ${fontWeightClass} leading-relaxed`}
          style={paragraphStyle}
        >
          {t}
        </p>
      ))}
    </section>
  );
}
// ...existing code...