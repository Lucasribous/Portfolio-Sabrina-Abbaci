import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import "./Masonry.css";

const useMeasure = () => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, size];
};

const preloadImagesMeta = async (urls) => {
  const meta = {};
  await Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            meta[src] = { w: img.naturalWidth || 1, h: img.naturalHeight || 1 };
            resolve();
          };
          img.onerror = () => {
            meta[src] = { w: 1, h: 1 };
            resolve();
          };
        })
    )
  );
  return meta;
};

export default function Masonry({
  items = [],
  columns = 2,
  breakpoints = { 1200: 3, 800: 2 },
  columnGap = 16,
  rowGap = 12,
  containerPadding = 16,
  // animation options
  animateFrom = "bottom",
  duration = 0.5,
  stagger = 0.04,
  ease = "power3.out",
  scaleOnHover = true,
  hoverScale = 0.96,
  blurToFocus = false,
}) {
  const [containerRef, { width }] = useMeasure();
  const [meta, setMeta] = useState({});
  const [ready, setReady] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!items || items.length === 0) {
      setReady(true);
      return;
    }
    const urls = items.map((i) => i.img);
    preloadImagesMeta(urls).then((m) => {
      setMeta(m);
      setReady(true);
    });
  }, [items]);

  const resolvedColumns = useMemo(() => {
    if (!width) return columns;
    const entries = Object.entries(breakpoints)
      .map(([k, v]) => ({ min: Number(k), cols: Number(v) }))
      .sort((a, b) => b.min - a.min);
    for (const e of entries) if (width >= e.min) return e.cols;
    return columns;
  }, [width, breakpoints, columns]);

  const { grid, containerHeight } = useMemo(() => {
    if (!width || !items || items.length === 0) return { grid: [], containerHeight: 0 };
    const pad = Number(containerPadding) || 0;
    const gap = Number(columnGap) || 0;
    const vgap = Number(rowGap) || 0;
    const usable = Math.max(0, width - pad * 2);
    const totalGap = Math.max(0, (resolvedColumns - 1) * gap);
    const colW = (usable - totalGap) / Math.max(1, resolvedColumns);

    const colHeights = new Array(resolvedColumns).fill(0);
    const gridArr = items.map((it) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = pad + col * (colW + gap);
      const m = meta[it.img];
      const h = it.height
        ? Number(it.height)
        : m && m.w && m.h
        ? Math.round(colW * (m.h / m.w))
        : Math.round(colW * 0.75);
      const y = colHeights[col];
      colHeights[col] = colHeights[col] + h + vgap;
      return { ...it, x: Math.round(x), y: Math.round(y), w: Math.round(colW), h: Math.round(h) };
    });

    const maxH = Math.max(...colHeights, 0);
    return { grid: gridArr, containerHeight: Math.max(0, maxH - vgap) };
  }, [resolvedColumns, columnGap, containerPadding, rowGap, meta, items, width]);

  const getInitialPosition = (item) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: item.x, y: item.y };
    let dir = animateFrom;
    if (animateFrom === "random") {
      const dirs = ["top", "bottom", "left", "right"];
      dir = dirs[Math.floor(Math.random() * dirs.length)];
    }
    switch (dir) {
      case "top":
        return { x: item.x, y: -200 };
      case "bottom":
        return { x: item.x, y: window.innerHeight + 200 };
      case "left":
        return { x: -200, y: item.y };
      case "right":
        return { x: window.innerWidth + 200, y: item.y };
      case "center":
        return { x: rect.width / 2 - item.w / 2, y: rect.height / 2 - item.h / 2 };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  useLayoutEffect(() => {
    if (!ready) return;
    if (!containerRef.current) return;

    grid.forEach((item, index) => {
      const el = containerRef.current.querySelector(`[data-key="${item.id}"]`);
      if (!el) return;

      // animate CSS left/top/width/height instead of transform x/y to avoid doubling offset
      const toProps = {
        left: item.x,
        top: item.y,
        width: item.w,
        height: item.h,
        overwrite: "auto",
        duration,
        ease,
      };

      if (!hasMounted.current) {
        const initial = getInitialPosition(item);
        const fromProps = {
          opacity: 0,
          left: initial.x,
          top: initial.y,
          width: item.w,
          height: item.h,
          ...(blurToFocus && { filter: "blur(8px)" }),
        };

        // ensure element is positioned absolutely (should already be)
        gsap.set(el, { position: "absolute", transformOrigin: "center center" });
        gsap.fromTo(
          el,
          fromProps,
          {
            ...toProps,
            opacity: 1,
            ...(blurToFocus && { filter: "blur(0px)" }),
            delay: index * stagger,
          }
        );
      } else {
        gsap.to(el, toProps);
      }
    });

    hasMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, ready, duration, stagger, ease, blurToFocus, animateFrom, containerRef]);

  const handleMouseEnter = (e, item) => {
    if (!scaleOnHover) return;
    const el = e.currentTarget;
    gsap.to(el, { scale: hoverScale, duration: 0.28, ease: "power2.out" });
  };
  const handleMouseLeave = (e) => {
    if (!scaleOnHover) return;
    const el = e.currentTarget;
    gsap.to(el, { scale: 1, duration: 0.28, ease: "power2.out" });
  };

  return (
    <div
      ref={containerRef}
      className="masonry-list"
      style={{ position: "relative", height: containerHeight ? `${containerHeight}px` : "auto" }}
    >
      {ready &&
        grid.map((item) => (
          <div
            key={item.id}
            data-key={item.id}
            className="masonry-item"
            onClick={() => item.url && window.open(item.url, "_blank", "noopener")}
            onMouseEnter={(e) => handleMouseEnter(e, item)}
            onMouseLeave={handleMouseLeave}
            style={{
              position: "absolute",
              left: item.x,
              top: item.y,
              width: item.w,
              height: item.h,
              boxSizing: "border-box",
            }}
          >
            <img
              src={item.img}
              alt={item.title || ""}
              className="masonry-img"
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
              draggable={false}
            />
          </div>
        ))}
    </div>
  );
}