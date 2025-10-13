import React, { useEffect, useRef, useState } from "react";

/**
 * Carousel.jsx
 * - Mobile-first swipe/scroll carousel (no autoplay)
 * - Props:
 *    images: [{ base, alt, href? }]  where `base` is path without size/extension, e.g. "/images/domestic-banana"
 *            expected assets: base-320.webp, base-640.webp, base-1024.webp, base-1600.webp and optional base.png
 *    dotSize: CSS size string for dot (ex "0.9rem")
 *    dotGap: gap between dots (ex "0.9rem")
 *    widthPercent: width of carousel relative to parent (string or number, ex "90%" or 90)
 *    maxWidth: CSS maxWidth to constrain carousel (ex "960px" or "100%")
 *    heightPx: optional explicit height in px (fallback if aspect-ratio not supported)
 *
 * Behaviour:
 * - horizontal scroll / swipe to change slides
 * - scroll-snap for smooth centering
 * - dots indicate active slide (active opacity=1, others 0.7)
 * - each image can include href to link (external opens _blank with rel)
 * - viewport height set via CSS aspect-ratio based on first image natural dimensions when available
 */

const buildSrc = (base, size, ext) => `${base}-${size}.${ext}`;
const isExternal = (url) => /^https?:\/\//i.test(url);

export default function Carousel({
  images = [],
  dotSize = "0.9rem",
  dotGap = "0.9rem",
  widthPercent = "75%", // can be "80%", 80, etc.
  maxWidth = "100%", // container max width
  heightPx = 480, // optional fallback explicit height in px
}) {
  const viewportRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(null); // "w / h" string for CSS aspect-ratio

  // Normalize widthPercent
  const widthStyle =
    typeof widthPercent === "number" ? `${widthPercent}%` : widthPercent || "100%";

  // Compute aspect ratio from first image to set viewport height (prevents CLS)
  useEffect(() => {
    if (!images || images.length === 0) return;

    const first = images[0];
    const base = first.base;
    if (!base) return;

    const trySources = [
      buildSrc(base, "1024", "webp"),
      buildSrc(base, "640", "webp"),
      `${base}.png`,
      buildSrc(base, "320", "webp"),
      buildSrc(base, "320", "png"),
    ];

    let canceled = false;
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (canceled) return;
      if (img.naturalWidth && img.naturalHeight) {
        setAspectRatio(`${img.naturalWidth} / ${img.naturalHeight}`);
      }
    };
    img.onerror = () => {
      const next = trySources.shift();
      if (next) img.src = next;
    };

    img.src = trySources.shift();

    return () => {
      canceled = true;
    };
  }, [images]);

  // Update currentIndex on scroll
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    let raf = null;

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const scrollLeft = vp.scrollLeft;
        const clientW = vp.clientWidth || 1;
        const idx = Math.round(scrollLeft / clientW);
        setCurrentIndex((prev) => (prev !== idx ? idx : prev));
      });
    };

    vp.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      // re-snap to current index to keep alignment
      vp.scrollTo({ left: currentIndex * vp.clientWidth });
    };
    window.addEventListener("resize", onResize);

    return () => {
      vp.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [currentIndex]);

  const scrollToIndex = (idx) => {
    const vp = viewportRef.current;
    if (!vp) return;
    const left = idx * vp.clientWidth;
    vp.scrollTo({ left, behavior: "smooth" });
    setCurrentIndex(idx);
  };

  if (!images || images.length === 0) return null;

  return (
    <div
      className="carousel-wrapper"
      style={{
        width: widthStyle,
        maxWidth,
        margin: "0 auto",
      }}
      aria-roledescription="carousel"
    >
      <div
        ref={viewportRef}
        className="carousel-viewport"
        role="list"
        style={{
          aspectRatio: aspectRatio || undefined,
          height: !aspectRatio ? `${heightPx}px` : undefined,
          touchAction: "pan-x",
          overscrollBehaviorX: "contain",
        }}
      >
        {images.map((img, idx) => {
          const base = img.base;
          const alt = img.alt || "";
          const href = img.href;

          const webpSet = [
            `${buildSrc(base, "320", "webp")} 320w`,
            `${buildSrc(base, "640", "webp")} 640w`,
            `${buildSrc(base, "1024", "webp")} 1024w`,
            `${buildSrc(base, "1600", "webp")} 1600w`,
          ].join(", ");

          const pngSet = [
            `${buildSrc(base, "320", "png")} 320w`,
            `${buildSrc(base, "640", "png")} 640w`,
            `${buildSrc(base, "1024", "png")} 1024w`,
            `${buildSrc(base, "1600", "png")} 1600w`,
          ].join(", ");

          const picture = (
            <picture>
              <source type="image/webp" srcSet={webpSet} sizes="100vw" />
              <source type="image/png" srcSet={pngSet} sizes="100vw" />
              <img
                src={`${base}.png`}
                alt={alt}
                loading="lazy"
                decoding="async"
                className="select-none"
                style={{ maxWidth: "100%", height: "100%", objectFit: "contain", display: "block" }}
                draggable={false}
              />
            </picture>
          );

          return (
            <div
              key={idx}
              className="carousel-slide"
              role="listitem"
              aria-roledescription="slide"
              aria-label={alt || `Slide ${idx + 1}`}
            >
              {href ? (
                <a
                  href={href}
                  target={isExternal(href) ? "_blank" : undefined}
                  rel={isExternal(href) ? "noopener noreferrer" : undefined}
                  aria-label={alt || `Slide ${idx + 1}`}
                  style={{ width: "100%", display: "block", height: "100%" }}
                >
                  {picture}
                </a>
              ) : (
                <div style={{ width: "100%", height: "100%" }}>{picture}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div
        className="carousel-dots"
        style={{
          gap: dotGap,
        }}
        aria-hidden={images.length <= 1}
      >
        {images.map((_, i) => {
          const active = currentIndex === i;
          return (
            <button
              key={i}
              className="carousel-dot"
              style={{
                width: dotSize,
                height: dotSize,
                opacity: active ? 1 : 0.7,
                background: "#f19fd3",
              }}
              aria-label={`Aller à l'image ${i + 1}`}
              aria-current={active ? "true" : "false"}
              onClick={() => scrollToIndex(i)}
            />
          );
        })}
      </div>
    </div>
  );
}