import "./index.css";
import Header from "./components/Header";
import MarqueeText from "./components/MarqueeText";
import ThreeSpans from "./components/ThreeSpans";
import Carousel from "./components/Carousel";

export default function App() {
  // Image du header (webp ou png dans /public/images/)
  const headerImage = { base: "/images/header", alt: "Portfolio Sabrina Abbaci" };

  // Images du carrousel (les fichiers doivent exister en -320.webp, -640.webp, -1024.webp, -1600.webp)
  const carouselImages = [
    { base: "/images/domestic-banana", alt: "Domestic banana" },
    { base: "/images/les-paradis-artificiels", alt: "Les paradis artificiels" },
    { base: "/images/rubrique-love", alt: "Rubrique Love" },
  ];

  // Variables CSS globales (tu peux modifier les valeurs depuis App ou CSS vars)
  const cssVars = {
    "--gap-header-top": "2rem",
    "--gap-header-bottom": "2rem",
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start text-rose" style={cssVars}>
      {/* ========== HEADER ========== */}
      <Header image={headerImage} />

      {/* ========== MARQUEE ========== */}
      <section className="w-full overflow-hidden py-2">
        <MarqueeText
          text="SABRINA ABBACI       "
          fontSizeClass="text-2xl sm:text-3xl"
          fontWeightClass="font-semibold"
          speedSeconds={30}
        />
      </section>

      {/* ========== TEXT SECTION ========== */}
      <ThreeSpans
        texts={[
          "Étudiante en DNMADe Narration et Motion Design, je manie aussi bien les calques Photoshop que les refrains de mes artistes préférés. Mon terrain de jeu : l’image, le son, les univers visuels qui donnent une identité aux artistes.",
          "Ma spécialité ? Créer une narration graphique, un visuel qui fait danser autant qu’un bon drop électro. De la mise en page à mes prémices dans le motion, en passant par la création de chartes graphiques, je construis des passerelles entre la scène et l’écran.",
          "Ce qui me définit ? Un amour sincère pour la musique dans toutes ses diversités (rap, hyperpop, kpop, rnb, rock…), une énergie extravertie, et l’envie de mettre mon design au service de ma passion ; auprès d’artistes émergents comme confirmés.",
          "En résumé : je ne conçois pas de visuels sans bande-son.",
        ]}
        fontSizeClass="text-sm sm:text-base"
      />

      {/* ========== CAROUSEL SECTION ========== */}
      <section className="relative w-full flex justify-center mt-10 mb-20">
        {/* Container du carrousel pour positionner précisément les décors par rapport au carrousel */}
        <div className="relative w-full max-w-4xl flex justify-center items-center">
          {/* Décor gauche : centre de l vignette aligné au coin haut-gauche du carrousel */}
          <img
            src="/images/left.png"
            alt="Décor gauche"
            className="decor-center-on-corner w-40 sm:w-56 md:w-64 decoration left-0 top-0 pointer-events-none select-none"
            aria-hidden="true"
            style={{ zIndex: 0 }}
          />

          {/* Le carrousel (z inférieur à right.png) */}
          <div className="relative z-10 w-full">
            <Carousel images={carouselImages} dotSize="0.9rem" dotGap="0.9rem" />
          </div>

          {/* Décor droite : centre de la vignette aligné au coin bas-droit du carrousel, au-dessus */}
          <img
            src="/images/right.png"
            alt="Décor droite"
            className="decor-center-on-corner--br w-40 sm:w-56 md:w-64 decoration right-0 bottom-0 pointer-events-none select-none"
            aria-hidden="true"
            style={{ zIndex: 30 }}
          />
        </div>
      </section>
    </div>
  );
}