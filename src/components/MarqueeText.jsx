import React, { useRef, useEffect, useState } from "react";

export default function MarqueeText({
  text = "",
  pxPerSec = 80,
  fontSizeClass = "text-lg",
  fontWeightClass = "font-semibold",
}) {
  const containerRef = useRef(null);
  const measureRef = useRef(null);
  const [duration, setDuration] = useState(8);
  const [distance, setDistance] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const compute = () => {
      const cw = containerRef.current?.offsetWidth || 0;
      const w = measureRef.current?.offsetWidth || 0;
      const travel = w + cw;
      const seconds = Math.max(3, travel / pxPerSec);
      setDistance(w);
      setDuration(seconds);
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (containerRef.current) ro.observe(containerRef.current);
    if (measureRef.current) ro.observe(measureRef.current);
    return () => ro.disconnect();
  }, [text, pxPerSec]);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      ref={containerRef}
      className="marquee-viewport"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-hidden={false}
    >
      <div className="marquee-inner" style={{ padding: "0.4rem 0" }}>
        {/* hidden measure */}
        <div ref={measureRef} aria-hidden="true" style={{ position: "absolute", left: -9999, whiteSpace: "nowrap" }}>
          <span className={`${fontWeightClass} ${fontSizeClass}`}>{text}</span>
        </div>

        {/* visible scrolling text */}
        <div
          className={`${fontWeightClass} ${fontSizeClass} marquee-text`}
          style={{
            animation: prefersReduced || paused ? "none" : `marquee ${duration}s linear infinite`,
            ["--t"]: `-${distance}px`,
            color: "var(--accent)",
          }}
        >
          <span className="mr-8">{text}</span>
          <span className="mr-8" aria-hidden="true">{text}</span>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(var(--t)); }
        }
      `}</style>
    </div>
  );
}
