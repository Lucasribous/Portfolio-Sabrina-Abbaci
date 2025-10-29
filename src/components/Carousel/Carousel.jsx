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

    // --- mouse / pen drag (pointer events) ---
    let isMouseDragging = false;
    let mouseStartX = 0;
    let mouseStartScroll = 0;
    const onPointerDown = (e) => {
      if (e.pointerType === "mouse" || e.pointerType === "pen") {
        isMouseDragging = true;
        vp.classList.add("is-dragging");
        mouseStartX = e.pageX;
        mouseStartScroll = vp.scrollLeft;
        e.preventDefault();
      }
    };
    const onPointerMove = (e) => {
      if (!isMouseDragging) return;
      const dx = e.pageX - mouseStartX;
      vp.scrollLeft = mouseStartScroll - dx;
    };
    const endMouseDrag = () => {
      if (!isMouseDragging) return;
      isMouseDragging = false;
      vp.classList.remove("is-dragging");
    };
    vp.addEventListener("pointerdown", onPointerDown, { passive: false });
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", endMouseDrag);
    window.addEventListener("pointerleave", endMouseDrag);

    // --- touch drag (mobile) with vertical swipe detection ---
    let isTouching = false;
    let isTouchDragging = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartScroll = 0;
    const TOUCH_SLOP = 6; // px threshold to start horizontal drag

    const onTouchStart = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      isTouching = true;
      isTouchDragging = false;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartScroll = vp.scrollLeft;
    };

    const onTouchMove = (e) => {
      if (!isTouching || !e.touches || e.touches.length === 0) return;
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      const dx = x - touchStartX;
      const dy = y - touchStartY;

      // If vertical movement dominates and hasn't been classified as horizontal drag -> let browser handle (do nothing)
      if (!isTouchDragging) {
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > TOUCH_SLOP) {
          // horizontal intent -> take control
          isTouchDragging = true;
          // prevent page vertical scroll while we drag horizontally
          e.preventDefault();
        } else {
          // still vertical/noise -> let browser handle
          return;
        }
      } else {
        // already dragging horizontally via JS -> prevent native behavior and perform scroll
        e.preventDefault();
      }

      vp.scrollLeft = touchStartScroll - dx;
    };

    const onTouchEnd = () => {
      isTouching = false;
      isTouchDragging = false;
    };
    vp.addEventListener("touchstart", onTouchStart, { passive: true });
    vp.addEventListener("touchmove", onTouchMove, { passive: false });
    vp.addEventListener("touchend", onTouchEnd, { passive: true });

    // cleanup
    return () => {
      vp.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endMouseDrag);
      window.removeEventListener("pointerleave", endMouseDrag);
      vp.removeEventListener("touchstart", onTouchStart);
      vp.removeEventListener("touchmove", onTouchMove);
      vp.removeEventListener("touchend", onTouchEnd);
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