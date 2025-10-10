import { useState } from "react";

/**
 * Carousel.jsx
 * - Pas d'autoplay (contrôle manuel uniquement)
 * - Pastilles rondes, accessibles et indiquant l'image active
 * - Images responsives via <picture> (attend fichiers -320/ -640 / -1024 / -1600)
 */

export default function Carousel({ images = [], dotSize = "0.8rem", dotGap = "0.9rem" }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl z-10">
      {/* Images */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {images.map((img, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 flex justify-center items-center bg-transparent"
          >
            <picture>
              <source srcSet={`${img.base}-1600.webp`} media="(min-width: 1280px)" />
              <source srcSet={`${img.base}-1024.webp`} media="(min-width: 768px)" />
              <source srcSet={`${img.base}-640.webp`} media="(min-width: 480px)" />
              <img
                src={`${img.base}-320.webp`}
                alt={img.alt}
                className="w-full h-auto object-contain select-none"
                draggable="false"
              />
            </picture>
          </div>
        ))}
      </div>

      {/* Flèches de navigation */}
      <button
        onClick={goToPrev}
        aria-label="Image précédente"
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/40 hover:bg-white/70 text-rose rounded-full p-2 backdrop-blur-md transition z-20"
      >
        ‹
      </button>

      <button
        onClick={goToNext}
        aria-label="Image suivante"
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/40 hover:bg-white/70 text-rose rounded-full p-2 backdrop-blur-md transition z-20"
      >
        ›
      </button>

      {/* Pastilles d’indication */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center items-center"
        style={{ gap: dotGap }}
        aria-hidden={images.length <= 1}
      >
        {images.map((_, index) => {
          const isActive = currentIndex === index;
          return (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`carousel-dot ${isActive ? "bg-rose" : "bg-white/70 hover:bg-white"}`}
              style={{
                width: dotSize,
                height: dotSize,
              }}
              aria-label={`Aller à l’image ${index + 1}`}
              aria-current={isActive ? "true" : "false"}
            />
          );
        })}
      </div>
    </div>
  );
}