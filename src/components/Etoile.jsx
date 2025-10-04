import React from "react";

/**
 * Props:
 *  - base: "/images/optimized/bg" -> bg-480.webp, bg-1024.webp, ...
 *  - alt: decorative -> alt=""
 *  - eager: boolean -> si true -> loading="eager" (hero important)
 */
export default function Background({ base = "/images/optimized/bg", eager = false }) {
  return (
    <picture aria-hidden="true" className="pointer-events-none">
      <source
        srcSet={`${base}-480.webp 480w, ${base}-1024.webp 1024w, ${base}-1600.webp 1600w`}
        sizes="100vw"
        type="image/webp"
      />
      <img
        src={`${base}-1024.webp`}
        alt=""
        className="fixed inset-0 w-full h-full object-cover -z-10"
        style={{ objectPosition: "center center" }}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    </picture>
  );
}
