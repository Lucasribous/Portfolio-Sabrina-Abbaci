import React from "react";

/**
 * MarqueeText.jsx
 * - Props :
 *    text: chaîne affichée (sera répétée pour effet continu)
 *    fontSizeClass: classes Tailwind pour la taille (ex: "text-xl md:text-3xl")
 *    fontWeight: number|string pour fontWeight CSS (ex: 700) ou classe via fontWeightClass
 *    fontWeightClass: optionnel, classe tailwind (ex: "font-bold")
 *    speedSeconds: durée de la boucle en secondes (défaut 30)
 *    repeat: nombre d'occurrences dans un bloc (défaut 4)
 *
 * Usage mobile-first. Le masque (mask-image) crée un dégradé latéral vers la transparence.
 */

export default function MarqueeText({
  text = "SABRINA ABBACI — ",
  fontSizeClass = "text-xl md:text-3xl",
  fontWeight = "700",
  fontWeightClass = "font-bold",
  speedSeconds = 30,
  repeat = 5,
}) {
  // build an array of spans to repeat inside each block
  const block = Array.from({ length: Math.max(2, repeat) }).map((_, i) => (
    <span
      key={i}
      className={`${fontSizeClass} ${fontWeightClass} tracking-wide inline-block mx-8`}
      style={{ fontFamily: "inherit" }}
    >
      {text}
    </span>
  ));

  // combine two identical blocks to create a continuous loop (translateX(-50%))
  const movingStyle = {
    display: "inline-block",
    whiteSpace: "nowrap",
    animation: `marquee ${speedSeconds}s linear infinite`,
    willChange: "transform",
  };

  // mask gradients on left/right for fade effect (webkit + standard)
  const containerStyle = {
    maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
    WebkitMaskImage:
      "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
    overflow: "hidden",
  };

  // allow explicit numeric fontWeight if provided (overrides class)
  const textStyle = fontWeight ? { fontWeight } : undefined;

  return (
    <div
      className="w-full block"
      style={containerStyle}
      aria-label="Bandeau défilant"
    >
      <div
        className="inline-block"
        style={{
          ...movingStyle,
          // apply fontWeight to the whole moving block if provided
          ...(textStyle || {}),
        }}
        aria-hidden="false"
      >
        <div className="inline-block">{block}</div>
        <div className="inline-block">{block}</div>
      </div>
    </div>
  );
}