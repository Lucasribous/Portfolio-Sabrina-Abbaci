import React, { useEffect, useRef, useState } from "react";

/**
 * Carousel.jsx
 * Mobile-first swipe/scroll carousel (no autoplay)
 * - Adds pointer-based drag-to-scroll fallback so swipes always fonctionnent
 * - Props:
 *    images: [{ base, alt, href? }]
 *    dotSize, dotGap, widthPercent, maxWidth, heightPx
 */

const buildSrc = (base, size, ext) => `${base}-${size}.${ext}`;
const isExternal = (url) => /^https?:\/\//i.test(url);

export default function Carousel({
  images = [],
  dotSize = "0.9rem",
  dotGap = "0.9rem",
  widthPercent = "75%",
  maxWidth = "100%",
  heightPx = 480,
}) {
  const viewportRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const moved = useRef(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(null);

  const widthStyle =
    typeof widthPercent === "number" ? `${widthPercent}%` : widthPercent || "100%";

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

  // scroll index update
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
      vp.scrollTo({ left: currentIndex * vp.clientWidth });
    };
    window.addEventListener("resize", onResize);

    return () => {
      vp.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [currentIndex]);

  // Pointer drag handlers to guarantee swipe on all devices
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const onPointerDown = (e) => {
      // only primary button / touch
      if (e.pointerType === "mouse" && e.button !== 0) return;
      isDown.current = true;
      moved.current = false;
      startX.current = e.clientX;
      startScroll.current = vp.scrollLeft;
      vp.setPointerCapture?.(e.pointerId);
      vp.style.scrollBehavior = "auto"; // immediate during drag
      vp.classList.add("dragging"); // optional for cursor styling
    };

    const onPointerMove = (e) => {
      if (!isDown.current) return;
      const dx = startX.current - e.clientX;
      if (Math.abs(dx) > 3) moved.current = true;
      vp.scrollLeft = startScroll.current + dx;
    };

    const endDrag = (e) => {
      if (!isDown.current) return;
      isDown.current = false;
      try {
        vp.releasePointerCapture?.(e.pointerId);
      } catch (err) {}
      // restore smooth behavior and snap to nearest
      vp.style.scrollBehavior = "smooth";
      // snap to nearest slide
      const idx = Math.round(vp.scrollLeft / (vp.clientWidth || 1));
      vp.scrollTo({ left: idx * vp.clientWidth, behavior: "smooth" });
      vp.classList.remove("dragging");
    };

    vp.addEventListener("pointerdown", onPointerDown, { passive: true });
    vp.addEventListener("pointermove", onPointerMove, { passive: true });
    vp.addEventListener("pointerup", endDrag);
    vp.addEventListener("pointercancel", endDrag);
    vp.addEventListener("pointerleave", endDrag);

    return () => {
      vp.removeEventListener("pointerdown", onPointerDown);
      vp.removeEventListener("pointermove", onPointerMove);
      vp.removeEventListener("pointerup", endDrag);
      vp.removeEventListener("pointercancel", endDrag);
      vp.removeEventListener("pointerleave", endDrag);
    };
  }, []);

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
          cursor: undefined,
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
                style={{
                  maxWidth: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
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

      {/* Dots below viewport */}
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