import "./index.css";
import Header from "./components/Header";
import Marquee from "./components/MarqueeText";
import ThreeSpans from "./components/ThreeSpans";
import Carousel from "./components/Carousel";

export default function App() {
  const carrouselImages = [
    { base: "/images/optimized/domestic-banana", alt: "Domestic banana", link: "/page1" },
    { base: "/images/optimized/les-paradis-artificiels", alt: "Les paradis artificiels" },
    { base: "/images/optimized/rubrique-love", alt: "Rubrique Love", link: "/page3" },
  ];

  // You can change these values to tune layout globally
  const cssVars = {
    "--decor-scale": "0.1rem",      // 0.33 => decor images much smaller; change to 0.66 if you meant 2/3 size
    "--header-scale": "0.75",     // 0.75 => header reduced by 25%
    "--gap-header-top": "1rem",
    "--gap-header-bottom": "0.75rem",
  };

  return (
    <div className="page-wrapper" style={cssVars}>
      <Header base="/images/optimized/header" />
      <Marquee text="Sabrina Abbaci     Sabrina Abbaci     Sabrina Abbaci     " fontSizeClass="text-base" fontWeightClass="font-semibold" />
      <ThreeSpans className="spans-text"
        texts={[
          "Étudiante en DNMADe Narration et Motion Design,\nje manie aussi bien les calques Photoshop que les\nrefrains de mes artistes préférés. Mon terrain de jeu :\nl’image, le son, les univers visuels qui donnent\nune identité aux artistes.",
          "Ma spécialité ?\nCréer une narration graphique, un visuel qui fait\ndanser autant qu’un bon drop électro. De la mise en\npage à mes prémices dans le motion, en passant par\nla création de chartes graphiques, je construis des\npasserelles entre la scène et l’écran.",
          "Ce qui me définit ?\nUn amour sincère pour la musique dans toutes\nses diversités (rap, hyperpop, kpop, rnb, rock…),\nune énergie extravertie, et l’envie de mettre mon\ndesign au service de ma passion ; auprès\nd’artistes émergents comme confirmés.\n",
          "En résumé :\nje ne conçois pas de visuels sans bande-son.",
        ]}
      />
      <Carousel images={carrouselImages} dotSize="0.6rem" />
    </div>
  );
}
