import React, { useEffect, useRef, useState } from "react";

export default function Carousel({
  images = [],
  dotSize = "0.75rem",
  dotGap = "0.75rem",
}) {
  const [active, setActive] = useState(0);
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  const [heightPx, setHeightPx] = useState(null);
  const [ratio, setRatio] = useState(null); // height / width

  // compute ratio from first image
  useEffect(() => {
    const firstSrc = images?.[0]?.base ? `${images[0].base}-640.webp` : null;
    if (!firstSrc) return;

    const img = new Image();
    img.src = firstSrc;
    const setImgRatio = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setRatio(img.naturalHeight / img.naturalWidth);
      }
    };
    if (img.complete) setImgRatio();
    else img.onload = setImgRatio;
    return () => { img.onload = null; };
  }, [images]);

  // update height based on wrapper width and ratio
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || ratio == null) return;
    const update = () => {
      const w = wrapper.offsetWidth || 0;
      setHeightPx(Math.round(w * ratio));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrapper);
    window.addEventListener("resize", update);
    return () => { ro.disconnect(); window.removeEventListener("resize", update); };
  }, [ratio]);

  // swipe / drag for desktop & touch
  useEffect(() => {
    const track = trackRef.current;
    const wrapper = wrapperRef.current;
    if (!track || !wrapper) return;

    let pointerId = null;
    let startX = 0;
    let currentX = 0;
    let dragging = false;
    let animFrame = null;

    const width = () => wrapper.offsetWidth || 1;
    const setTranslate = (tx) => {
      track.style.transform = `translateX(${tx}px)`;
    };

    const render = () => {
      const tx = -active * width() + (dragging ? currentX - startX : 0);
      setTranslate(tx);
      animFrame = requestAnimationFrame(render);
    };

    const onPointerDown = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      pointerId = e.pointerId;
      (e.target).setPointerCapture?.(pointerId);
      startX = e.clientX;
      currentX = startX;
      dragging = true;
      track.style.transition = "none";
      if (!animFrame) render();
    };

    const onPointerMove = (e) => {
      if (!dragging || e.pointerId !== pointerId) return;
      currentX = e.clientX;
    };

    const finishDrag = () => {
      if (!dragging) return;
      dragging = false;
      cancelAnimationFrame(animFrame);
      animFrame = null;
      track.style.transition = "transform 350ms cubic-bezier(.2,.8,.2,1)";
      const dx = currentX - startX;
      const threshold = Math.max(40, width() * 0.15);
      if (dx > threshold && active > 0) setActive((s) => s - 1);
      else if (dx < -threshold && active < images.length - 1) setActive((s) => s + 1);
      else {
        // snap back (re-render transform by applying active)
        track.style.transform = `translateX(${-active * width()}px)`;
      }
    };

    const onPointerUp = (e) => {
      if (e.pointerId !== pointerId) return finishDrag();
    };
    const onPointerCancel = () => finishDrag();

    // attach pointer events
    wrapper.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerCancel, { passive: true });

    // ensure track position follows active when not dragging
    const updatePos = () => {
      if (!dragging) track.style.transform = `translateX(${-active * width()}px)`;
    };
    updatePos();

    return () => {
      wrapper.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      cancelAnimationFrame(animFrame);
    };
  }, [active, images.length]);

  // keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") setActive((s) => Math.min(s + 1, images.length - 1));
      if (e.key === "ArrowLeft") setActive((s) => Math.max(s - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length]);

  if (!images?.length) return null;

  return (
    <section className="relative w-full mt-6">
      <div className="flex flex-col items-center relative">
        <div
          ref={wrapperRef}
          className="carousel-wrapper relative w-full max-w-[75vw] mx-auto isolate"
          style={{ height: heightPx ? `${heightPx}px` : undefined, touchAction: "pan-y" }}
        >
          <div
            ref={trackRef}
            className="carousel-track absolute left-0 top-0 h-full flex"
            style={{ width: `${images.length * 100}%`, transform: `translateX(${-active * 100}%)`, transition: "transform 350ms cubic-bezier(.2,.8,.2,1)" }}
          >
            {images.map((img, i) => (
              <div key={i} className="carousel-slide flex-shrink-0 w-full flex items-center justify-center px-2 h-full">
                <a href={img.link || "#"} className="block w-full h-full">
                  <picture>
                    <source
                      srcSet={`${img.base}-320.webp 320w, ${img.base}-640.webp 640w, ${img.base}-1024.webp 1024w, ${img.base}-1600.webp 1600w`}
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 80vw, 60vw"
                      type="image/webp"
                    />
                    <img
                      src={`${img.base}-640.webp`}
                      alt={img.alt || ""}
                      className="carousel-img rounded-xl shadow-md"
                      loading="lazy"
                      decoding="async"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </picture>
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="carousel-dots flex items-center mt-4 z-[10]" style={{ columnGap: dotGap }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Aller à la diapo ${i + 1}`}
              type="button"
              className={`carousel-dot rounded-full inline-flex items-center justify-center p-0 min-w-0 border-0 outline-none appearance-none ${i === active ? "active" : ""}`}
              style={{
                width: dotSize,
                height: dotSize,
                opacity: i === active ? 1 : 0.5,
                transform: i === active ? "scale(1.15)" : "none",
                background: "var(--accent)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}