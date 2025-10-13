import React, { useEffect, useRef, useState } from "react";

/**
 * Carousel.jsx
 * - Mobile-first swipe/scroll carousel (no autoplay)
 * - Pointer-based drag fallback for reliable swipe on mobile
 * - Debug overlay shown when URL has ?debug=1 or localStorage.carouselDebug === "1"
 *
 * Props:
 *  - images: [{ base, alt, href? }]
 *  - dotSize, dotGap, widthPercent, maxWidth, heightPx
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [showDebug, setShowDebug] = useState(() => {
    try {
      const url = typeof window !== "undefined" ? new URL(window.location.href) : null;
      return (url && url.searchParams.get("debug") === "1") || localStorage.getItem("carouselDebug") === "1";
    } catch {
      return false;
    }
  });

  const widthStyle = typeof widthPercent === "number" ? `${widthPercent}%` : widthPercent || "100%";

  // compute aspect ratio from first image
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

  // helpers
  const getSlideWidth = () => {
    const vp = viewportRef.current;
    if (!vp) return 1;
    const slide = vp.querySelector(".carousel-slide");
    return slide ? slide.getBoundingClientRect().width : vp.clientWidth || 1;
  };

  // update currentIndex on scroll
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    let raf = null;

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const slideW = getSlideWidth();
        const idx = Math.round(vp.scrollLeft / slideW);
        setCurrentIndex((prev) => (prev !== idx ? idx : prev));
      });
    };

    vp.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      vp.scrollTo({ left: currentIndex * getSlideWidth() });
    };
    window.addEventListener("resize", onResize);

    const t = setTimeout(() => {
      // initial snap after layout settle
      vp.scrollTo({ left: currentIndex * getSlideWidth() });
    }, 60);

    return () => {
      clearTimeout(t);
      vp.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [currentIndex]);

  // pointer drag handlers (guarantee swipe on mobile)
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    const onPointerDown = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      isDown.current = true;
      startX.current = e.clientX;
      startScroll.current = vp.scrollLeft;
      try { vp.setPointerCapture?.(e.pointerId); } catch {}
      vp.style.scrollBehavior = "auto";
    };

    const onPointerMove = (e) => {
      if (!isDown.current) return;
      const dx = startX.current - e.clientX;
      vp.scrollLeft = startScroll.current + dx;
    };

    const endDrag = (e) => {
      if (!isDown.current) return;
      isDown.current = false;
      try { vp.releasePointerCapture?.(e.pointerId); } catch {}
      vp.style.scrollBehavior = "smooth";
      const idx = Math.round(vp.scrollLeft / getSlideWidth());
      vp.scrollTo({ left: idx * getSlideWidth(), behavior: "smooth" });
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
  }, [images]);

  // scroll to index using real slide width
  const scrollToIndex = (idx) => {
    const vp = viewportRef.current;
    if (!vp) return;
    const slideW = getSlideWidth();
    let left = idx * slideW;
    const maxLeft = Math.max(0, vp.scrollWidth - vp.clientWidth);
    if (left > maxLeft) left = maxLeft;
    if (left < 0) left = 0;
    vp.scrollTo({ left, behavior: "smooth" });
    setCurrentIndex(idx);
  };

  // debug overlay info
  useEffect(() => {
    if (!showDebug) return;
    const vp = viewportRef.current;
    if (!vp) {
      setDebugInfo({ error: "no viewport element" });
      return;
    }
    const getInfo = () => {
      const slideEls = Array.from(vp.querySelectorAll(".carousel-slide"));
      const slideWidths = slideEls.map((s) => Math.round(s.getBoundingClientRect().width * 10) / 10);
      const rect = vp.getBoundingClientRect();
      const centerEl = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      const cs = getComputedStyle(vp);
      return {
        clientWidth: vp.clientWidth,
        clientHeight: vp.clientHeight,
        scrollWidth: vp.scrollWidth,
        scrollLeft: vp.scrollLeft,
        slideWidths,
        centerTag: centerEl ? `${centerEl.tagName}.${(centerEl.className || "").toString().split(" ").join(".")}` : null,
        overflowX: cs.overflowX,
        touchAction: cs.touchAction,
        pointerEvents: cs.pointerEvents,
      };
    };

    setDebugInfo(getInfo());
    const t1 = setTimeout(() => setDebugInfo(getInfo()), 120);
    const t2 = setTimeout(() => setDebugInfo(getInfo()), 600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [showDebug, currentIndex, images]);

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
                loading={idx === 0 ? "eager" : "lazy"}
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

      {/* dots below viewport */}
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

      {/* Debug overlay */}
      {showDebug && debugInfo && (
        <div
          style={{
            position: "fixed",
            left: 8,
            right: 8,
            bottom: 12,
            background: "rgba(0,0,0,0.78)",
            color: "#fff",
            padding: 10,
            borderRadius: 8,
            fontSize: 12,
            zIndex: 9999,
            maxHeight: "50vh",
            overflow: "auto",
            lineHeight: "1.2",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <strong>DEBUG carousel</strong>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => {
                  setShowDebug(false);
                  try { localStorage.setItem("carouselDebug", "0"); } catch {}
                }}
                style={{ background: "#f19fd3", border: "none", padding: "2px 6px", borderRadius: 6 }}
              >
                Hide
              </button>
              <button
                onClick={() => {
                  try { navigator.clipboard?.writeText(JSON.stringify(debugInfo, null, 2)); } catch {}
                }}
                style={{ background: "#fff", border: "none", padding: "2px 6px", borderRadius: 6 }}
              >
                Copy
              </button>
            </div>
          </div>
          <pre style={{ whiteSpace: "pre-wrap", marginTop: 8, color: "#fff" }}>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}