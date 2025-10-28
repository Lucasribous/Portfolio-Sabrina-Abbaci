import React, { useEffect, useRef, useState } from "react";
// correction : CSS centralisé sous src/styles/components
import "./Carousel.css";

export default function Carousel(props) {
  // normalize props: accept either `items` (used in Home.jsx) or `slides`
  const items = props.items || props.slides || [];
  const baseWidth = props.baseWidth ?? 600;
  const viewportRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(null);
  // ref flags to make dot-click scrolling robust
  const isAutoScrollingRef = useRef(false);
  const autoScrollTimerRef = useRef(null);

  // debug rapide : voir si le composant monte et combien de slides
  console.log("Carousel render", { itemsLength: items.length, currentIndex });

  // fallback lisible si slides manquent ou erreur de données
  if (!items || items.length === 0) {
    return (
      <div className="carousel-empty" style={{ padding: 24, textAlign: "center" }}>
        Aucune slide disponible
      </div>
    );
  }

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
        // store numeric ratio like 16/9 or "800 / 600" which CSS accepts as aspect-ratio
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
    return vp ? vp.clientWidth : 0;
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
        const idx = slideW ? Math.round(vp.scrollLeft / slideW) : 0;
        // ignore scroll events while we intentionally auto-scroll from a dot click
        if (isAutoScrollingRef.current) return;
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

  // scroll helper used by dot clicks
  const scrollToIndex = (index) => {
    const vp = viewportRef.current;
    if (!vp) return;
    const slideW = getSlideWidth();
    const targetLeft = Math.round(index * slideW);

    // cancel previous auto-scroll timers
    if (autoScrollTimerRef.current) {
      clearTimeout(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }

    // mark auto-scrolling so onScroll handler doesn't fight it
    isAutoScrollingRef.current = true;
    // use smooth scroll; fallback to instant if browser doesn't support
    try {
      vp.scrollTo({ left: targetLeft, behavior: "smooth" });
    } catch (err) {
      vp.scrollLeft = targetLeft;
    }

    // after animation expected duration, clear flag and ensure index sync
    autoScrollTimerRef.current = setTimeout(() => {
      isAutoScrollingRef.current = false;
      setCurrentIndex(index);
      autoScrollTimerRef.current = null;
    }, 520); // 520ms is a safe duration for smooth scroll; adjust if needed
  };

  // ensure cleanup of timer if component unmounts
  useEffect(() => {
    return () => {
      if (autoScrollTimerRef.current) {
        clearTimeout(autoScrollTimerRef.current);
        autoScrollTimerRef.current = null;
      }
    };
  }, []);

  // allow mouse wheel to scroll carousel horizontally on desktop
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const onWheel = (e) => {
      // if mostly vertical wheel, translate to horizontal scroll
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        vp.scrollBy({ left: e.deltaY, behavior: "smooth" });
      }
    };
    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  }, []);

  // enable drag-to-scroll (mouse and touch) for the carousel
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    // Implementation note:
    // - On mobile we prefer native touch scrolling (don't preventDefault on touchstart),
    //   so we only intercept pointer events coming from a mouse to provide click-drag.
    // - Keep touch-action: pan-y in CSS so vertical page scroll still works and horizontal
    //   scroll is available for user gestures.
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onPointerDown = (e) => {
      // pointerType might be "mouse", "pen", or "touch"
      // Only preventDefault and start a JS drag for mouse/pen — let touch use native scroll
      if (e.pointerType === "mouse" || e.pointerType === "pen") {
        isDown = true;
        vp.classList.add("is-dragging");
        startX = e.pageX;
        scrollLeft = vp.scrollLeft;
        e.preventDefault();
      }
    };

    const onPointerMove = (e) => {
      if (!isDown) return;
      const x = e.pageX;
      const walk = x - startX;
      vp.scrollLeft = scrollLeft - walk;
    };

    const stopDrag = () => {
      if (!isDown) return;
      isDown = false;
      vp.classList.remove("is-dragging");
    };

    vp.addEventListener("pointerdown", onPointerDown, { passive: false });
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", stopDrag);
    window.addEventListener("pointerleave", stopDrag);

    return () => {
      vp.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stopDrag);
      window.removeEventListener("pointerleave", stopDrag);
    };
  }, []);

  // ensure slides variable used later is the normalized items array
  const slides = items && items.length ? items : [{ image: "/public/assets/placeholder.png", title: "Slide 1" }];

  return (
    <div
      className="carousel-wrapper"
      style={{
        width: "calc(75% - 1px)",      // réduit la largeur de 1px
        paddingLeft: "1px",            // compense sur la gauche (déplace le contenu de 1px)
        margin: "0 auto",
        maxWidth: "1100px",
        position: "relative",
        boxSizing: "border-box"
      }}
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