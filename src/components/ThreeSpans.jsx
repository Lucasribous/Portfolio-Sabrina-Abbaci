import React from "react";

export default function ThreeSpans({
  texts = [],
  fontSizeClass = "text-sm sm:text-base",
}) {
  return (
    <section className="w-full flex justify-center px-4 my-6">
      <div className="container-centered text-center full-three-spans">
        {texts.map((text, idx) => (
          <p 
            key={idx}
            className={`${fontSizeClass} spans-text`}>
            {text.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < text.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        ))}
      </div>
    </section>
  );
}
