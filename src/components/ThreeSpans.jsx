import React from "react";

/**
 * ThreeSpans.jsx
 * - Receives a `texts` array (3+ items supported)
 * - fontSizeClass for external sizing control
 * - Produces centered, pink spans with balanced spacing
 */

const ThreeSpans = ({ texts = [], fontSizeClass = "text-lg md:text-2xl" }) => {
  if (!Array.isArray(texts) || texts.length === 0) {
    return null;
  }

  return (
    <section
      className="w-full flex flex-col items-center justify-center text-center gap-6 py-8"
      style={{
        color: "var(--rose)",
      }}
    >
      {texts.map((t, i) => (
        <span
          key={i}
          className={`block ${fontSizeClass} font-medium max-w-[90%] md:max-w-[70%] leading-relaxed`}
        >
          {t}
        </span>
      ))}
    </section>
  );
};

export default ThreeSpans;