import React, { useEffect, useRef, useState } from "react";

const buildSrc = (base, size, ext) => `${base}-${size}.${ext}`;
const isExternal = (url) => /^https?:\/\//i.test(url);

export default function Carousel({
  images = [], // [{ base: "/images/name", alt, href? }]
  widthPercent = "75%", // can be "90%" or number 90
  maxWidth = "1100px",
  dotSize = "0.9rem",
  dotGap = "0.9rem",
  heightPx = 420, // fallback if aspect-ratio not available
  showDecor = true, // render left.png / right.png decorations from public/images
}) {
  const vpRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(null);

  const widthStyle = typeof widthPercent === "number" ? `${widthPercent}%` : widthPercent;

  // determine aspect ratio from first image
  useEffect(() => {
    if (!images || images.length === 0) return;
    const base = images[0].base;
    if (!base) return;
    const tries = [
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
      if (img.naturalWidth && img.naturalHeight) setAspectRatio(`${img.naturalWidth} / ${img.naturalHeight}`);
    };
    img.onerror = () => {
      const next = tries.shift();
      if (next) img.src = next;
    };
    img.src = tries.shift();
    return () => { canceled = true; };
  }, [images]);

  const getSlideWidth = () => {
    const vp = vpRef.current;
    if (!vp) return 1;
    const slide = vp.querySelector(".carousel-slide");
    return slide ? slide.getBoundingClientRect().width : vp.clientWidth || 1;
  };

  // sync index on scroll
  useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    let raf = null;
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const idx = Math.round(vp.scrollLeft / getSlideWidth());
        setCurrentIndex((prev) => (prev !== idx ? idx : prev));
      });
    };
    vp.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => vp.scrollTo({ left: currentIndex * getSlideWidth() });
    window.addEventListener("resize", onResize);

    // initial snap after layout settle
    const t = setTimeout(() => vp.scrollTo({ left: currentIndex * getSlideWidth() }), 60);

    return () => {
      clearTimeout(t);
      vp.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [currentIndex]);

  // pointer drag fallback for reliable swipe on mobile
  useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const onDown = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      isDown.current = true;
      startX.current = e.clientX;
      startScroll.current = vp.scrollLeft;
      try { vp.setPointerCapture?.(e.pointerId); } catch {}
      vp.style.scrollBehavior = "auto";
    };
    const onMove = (e) => {
      if (!isDown.current) return;
      const dx = startX.current - e.clientX;
      vp.scrollLeft = startScroll.current + dx;
    };
    const onUp = (e) => {
      if (!isDown.current) return;
      isDown.current = false;
      try { vp.releasePointerCapture?.(e.pointerId); } catch {}
      vp.style.scrollBehavior = "smooth";
      const idx = Math.round(vp.scrollLeft / getSlideWidth());
      vp.scrollTo({ left: idx * getSlideWidth(), behavior: "smooth" });
    };

    vp.addEventListener("pointerdown", onDown, { passive: true });
    vp.addEventListener("pointermove", onMove, { passive: true });
    vp.addEventListener("pointerup", onUp);
    vp.addEventListener("pointercancel", onUp);
    vp.addEventListener("pointerleave", onUp);

    return () => {
      vp.removeEventListener("pointerdown", onDown);
      vp.removeEventListener("pointermove", onMove);
      vp.removeEventListener("pointerup", onUp);
      vp.removeEventListener("pointercancel", onUp);
      vp.removeEventListener("pointerleave", onUp);
    };
  }, [images]);

  const scrollToIndex = (idx) => {
    const vp = vpRef.current;
    if (!vp) return;
    const left = Math.min(Math.max(0, idx * getSlideWidth()), vp.scrollWidth - vp.clientWidth);
    vp.scrollTo({ left, behavior: "smooth" });
    setCurrentIndex(idx);
  };

  if (!images || images.length === 0) return null;

  return (
    <div
      className="carousel-wrapper"
      style={{ width: widthStyle, maxWidth, margin: "0 auto", position: "relative" }}
      aria-roledescription="carousel"
    >
      {showDecor && (
        <>
          <img src="/images/left.png" alt="Décor gauche" className="carousel-decor carousel-decor--left" />
          <img src="/images/right.png" alt="Décor droite" className="carousel-decor carousel-decor--right" />
        </>
      )}

      <div
        ref={vpRef}
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

          const imgEl = (
            <picture>
              <source type="image/webp" srcSet={webpSet} sizes="100vw" />
              <source type="image/png" srcSet={pngSet} sizes="100vw" />
              <img
                src={`${base}.png`}
                alt={alt}
                loading={idx === 0 ? "eager" : "lazy"}
                decoding="async"
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", pointerEvents: "none" }}
                draggable={false}
              />
            </picture>
          );

          return (
            <div key={idx} className="carousel-slide" role="listitem" aria-roledescription="slide" aria-label={alt || `Slide ${idx + 1}`}>
              {href ? (
                <a href={href} target={isExternal(href) ? "_blank" : undefined} rel={isExternal(href) ? "noopener noreferrer" : undefined} style={{ display: "block", width: "100%", height: "100%" }}>
                  {imgEl}
                </a>
              ) : (
                <div style={{ width: "100%", height: "100%" }}>{imgEl}</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="carousel-dots" style={{ display: "flex", gap: dotGap, justifyContent: "center", marginTop: "0.75rem" }} aria-hidden={images.length <= 1}>
        {images.map((_, i) => {
          const active = currentIndex === i;
          return (
            <button
              key={i}
              className="carousel-dot"
              aria-current={active ? "true" : "false"}
              aria-label={`Aller à l'image ${i + 1}`}
              onClick={() => scrollToIndex(i)}
              style={{
                width: dotSize,
                height: dotSize,
                borderRadius: "9999px",
                background: "#f19fd3",
                opacity: active ? 1 : 0.7,
                border: "none",
                padding: 0,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}