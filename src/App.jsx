import "./styles/index.css";
import Header from "./components/Header";
import MarqueeText from "./components/MarqueeText";
import ThreeSpans from "./components/ThreeSpans";
import Carousel from "./components/Carousel";
import ShinyText from './components/ShinyText';

// import images depuis src/assets
import headerImg from "./assets/header.png";
import leftDeco from "./assets/decor-left.png";
import rightDeco from "./assets/decor-right.png";
import slide1 from "./assets/domestic-banana.png";
import slide2 from "./assets/les-paradis-artificiel.png";
import slide3 from "./assets/rubrique-love.png";
import slide4 from "./assets/frutiger.png";
import slide5 from "./assets/gbogh.png";
import slide6 from "./assets/slay.png";
import slide7 from "./assets/barbie-detournement.png";
import slide8 from "./assets/vitesse.png";
import slide9 from "./assets/collage-demultiplication.png";

export default function App() {
  const headerImage = { src: headerImg, alt: "Portfolio Sabrina Abbaci" };

  // Liste des images du carrousel
  const carouselImages = [
    { title: "Domestic Banana", image: slide1 },
    { title: "Les Paradis Artificiels", image: slide2 },
    { title: "Dessin Slay", image: slide6 },
    { title: "Rubrique Love", image: slide3 },
    { title: "Go Homme Or Go Back", image: slide5 },
    { title: "Dessin Frutiger", image: slide4 },
    { title: "Barbie détournement", image: slide7 },
    { title: "Dessin Vitesse", image: slide8 },
    { title: "Collage Démultiplication", image: slide9 },
  ];

  const cssVars = {
    "--gap-header-top": "2rem",
    "--gap-header-bottom": "2rem",
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-start text-rose"
      style={cssVars}
    >
      {/* HEADER */}
      <Header image={headerImage} />

      {/* MARQUEE */}
      <section className="w-full overflow-hidden py-2">
        <MarqueeText
          text="SABRINA ABBACI       "
          fontSizeClass="text-2xl sm:text-3xl"
          fontWeightClass="font-semibold"
          speedSeconds={30}
        />
      </section>

      {/* TEXTE INTRO */}
      <ThreeSpans
        texts={[
          "Étudiante en DNMADe Narration et Motion Design, je manie aussi bien les calques Photoshop que les refrains de mes artistes préférés. Mon terrain de jeu : l’image, le son, les univers visuels qui donnent une identité aux artistes.",
          "Ma spécialité ? Créer une narration graphique, un visuel qui fait danser autant qu’un bon drop électro. De la mise en page à mes prémices dans le motion, en passant par la création de chartes graphiques, je construis des passerelles entre la scène et l’écran.",
          "Ce qui me définit ? Un amour sincère pour la musique dans toutes ses diversités (rap, hyperpop, kpop, rnb, rock…), une énergie extravertie, et l’envie de mettre mon design au service de ma passion ; auprès d’artistes émergents comme confirmés.",
          "En résumé : je ne conçois pas de visuels sans bande-son.",
        ]}
        fontSizeClass="text-sm sm:text-base"
      />

     {/* CAROUSEL SECTION */}
      <section className="relative w-full flex justify-center mt-10 mb-20">
        <div className="relative w-full max-w-4xl flex justify-center items-center">
          {/* décor gauche — centré sur le coin haut-gauche, derrière le carrousel */}
          <img
            src={leftDeco}
            alt=""
            className="carousel-decor carousel-decor--left"
            aria-hidden="true"
            style={{ '--decor-offset-x': '2%', '--decor-offset-y': '-30%', zIndex: 5 }}
          />

          {/* carrousel (doit rester au-dessus du décor gauche) */}
          <div className="relative z-10 w-full flex justify-center">
            <Carousel items={carouselImages} baseWidth={600} autoplay={false} loop={false} />
          </div>

          {/* décor droite — centré sur le coin bas-droit, au-dessus du carrousel */}
          <img
            src={rightDeco}
            alt=""
            className="carousel-decor carousel-decor--right"
            aria-hidden="true"
            style={{ '--decor-offset-x': '-5%', '--decor-offset-y': '-30%', zIndex: 20 }}
          />
        </div>
      </section>
      
      <section className="w-full px-4 mb-20 max-w-3xl text-center">
        <p className="text-sm sm:text-base">
          Pour en découvrir plus sur mes projets et collaborations 👇🏼
        </p>
      </section>

      {/* Shiny text section */}
      <section className="w-full py-10 flex justify-center">
        <a className="shiny-link" href="#gallery">
          <ShinyText
            text="Gallerie"
            disabled={false}
            speed={3}
            className='custom-class'
          />
        </a>
      </section>
    </div>
  );
}
