import React, { useEffect, useRef, useState } from "react";
// correction : CSS centralisé sous src/styles/components
import "./Carousel.css";

export default function Carousel({
  items = [], // expect: [{ title, image }] where image is a public path (e.g. "/assets/slide1.png")
  baseWidth = 400,
  autoplay = false, // kept but default false
  autoplayDelay = 3000,
  pauseOnHover = true,
  loop = false,
}) {
  const viewportRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(null);

  // compute aspect ratio from first image (use PNGs as requested)
  useEffect(() => {
    if (!items || items.length === 0) return;
    const first = items[0];
    if (!first || !first.image) return;
    const img = new Image();
    let canceled = false;
    img.onload = () => {
      if (canceled) return;
      if (img.naturalWidth && img.naturalHeight) {
        setAspectRatio(`${img.naturalWidth} / ${img.naturalHeight}`);
      }
    };
    img.onerror = () => {
      /* ignore */
    };
    img.src = first.image;
    return () => {
      canceled = true;
    };
  }, [items]);

  const getSlideWidth = () => {
    const vp = viewportRef.current;
    if (!vp) return 1;
    const slide = vp.querySelector(".carousel-item");
    return slide ? slide.getBoundingClientRect().width : vp.clientWidth || 1;
  };

  // sync currentIndex while user scrolls
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
    const onResize = () => vp.scrollTo({ left: currentIndex * getSlideWidth() });
    window.addEventListener("resize", onResize);

    const t = setTimeout(() => vp.scrollTo({ left: currentIndex * getSlideWidth() }), 60);
    return () => {
      clearTimeout(t);
      vp.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [currentIndex]);

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

  // fallback items if none provided
  const slides = items && items.length ? items : [{ image: "/public/assets/placeholder.png", title: "Slide 1" }];

  return (
    <div
      className="carousel-wrapper"
      style={{ width: "75%", margin: "0 auto", maxWidth: "1100px", position: "relative" }}
      aria-roledescription="carousel"
    >
      <div
        ref={viewportRef}
        className="carousel-viewport"
        role="list"
        style={{ aspectRatio: aspectRatio || undefined, height: !aspectRatio ? `${baseWidth}px` : undefined }}
      >
        {slides.map((it, i) => (
          <div
            key={i}
            className="carousel-item"
            role="listitem"
            aria-roledescription="slide"
            aria-label={it.title || `Slide ${i + 1}`}
          >
            <img
              src={it.image}
              alt={it.title || `Slide ${i + 1}`}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className="carousel-image"
              draggable={false}
            />
          </div>
        ))}
      </div>

      <div className="carousel-indicators" aria-hidden={slides.length <= 1}>
        {slides.map((_, i) => {
          const active = currentIndex === i;
          return (
            <button
              key={i}
              className={`carousel-dot ${active ? "active" : ""}`}
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