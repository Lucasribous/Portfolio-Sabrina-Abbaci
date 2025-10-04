import React from "react";

export default function Header({ base = "/images/optimized/header", alt = "Header" }) {
  // header spacing managed by CSS variable --gap-header-top and --gap-header-bottom
  return (
    <header
      className="w-full flex justify-center"
      style={{
        marginTop: "var(--gap-header-top)",
        marginBottom: "var(--gap-header-bottom)",
      }}
    >
      <picture>
        <source
          srcSet={`${base}-320.webp 320w, ${base}-640.webp 640w, ${base}-1024.webp 1024w, ${base}-1600.webp 1600w`}
          sizes="(max-width:640px) 80vw, (max-width:1024px) 60vw, 40vw"
          type="image/webp"
        />
        <img
          src={`${base}-640.webp`}
          alt={alt}
          className="header-img"
          loading="lazy"
          decoding="async"
        />
      </picture>
    </header>
  );
}
