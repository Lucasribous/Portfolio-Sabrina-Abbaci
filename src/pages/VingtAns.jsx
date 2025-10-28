import "../styles/index.css";
import "../styles/projets.css";

import SplitText from "../components/SplitText/SplitText";
import ThreeSpans from "../components/ThreeSpans/ThreeSpans";
import ShinyText from "../components/ShinyText/ShinyText";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import Back from "../assets/back.png";
import BarbieDetournement from "../assets/barbie-detournement.png";
import Demultiplication from "../assets/collage-demultiplication.png";
import Mot from "../assets/collage-mot.png";

export default function VingtAnsPage() {
    // handler required par <SplitText />. Défini ici pour éviter une ReferenceError qui empêche le rendu.
    const handleAnimationComplete = () => {
        // no-op for now — put analytics / state changes here if needed
        // console.log('SplitText animation complete');
    };
    const navigate = useNavigate();

    return (
        <main className="page-vingt-ans">
            <header className="page-header">
                <Link to="/galerie" className="GoBack-link">
                    <img
                        src={Back}
                        alt="back"
                        className="GoBack"
                        style={{ cursor: 'pointer' }}
                    />
                </Link>
            </header>
            <section className="titre">
                <SplitText className="project-title"
                    text="20 ans"
                    delay={100}
                    duration={0.6}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                    onLetterAnimationComplete={handleAnimationComplete}
                />
            </section>
            <section className="project-image-section">
                <img src={Demultiplication} alt="Collage démultiplication" className="project-image" />
            </section>
            <section className="two-images-no-caption">
                <img src={BarbieDetournement} alt="Barbie Détournement" className="project-image-1" />
                <img src={Mot} alt="Mot" className="project-image-2" />
            </section>
            <section className="project-description">
                <ThreeSpans
                        texts={[
                          "Dans ce projet, j’explore la manière dont des idéologies autrefois jugées dangereuses (xénophobes, racistes, homophobes, misogynes) se banalisent par la manipulation du langage, des symboles et des médias. À travers des images où ces idées prennent une forme séduisante mais menaçante, j’interroge leur réintégration dans le discours public.",
                          "L’usage d’animaux (comme le cochon ou le singe), inspiré d’Orwell ou de La Fontaine, et de poupées au visage inoffensif, sert à personnifier ces idéaux et à illustrer la séduction du pouvoir. Ces figures politiques, présentées comme protectrices, incarnent pourtant des valeurs autoritaires et exclusives.",
                          "Réalisés sur Photoshop, ces photomontages combinent textures et symboles dans un style évoquant l’affiche militante, pour dénoncer la normalisation de ces discours et questionner notre rapport à la société contemporaine.",
                        ]}
                        fontSizeClass="text-sm sm:text-base"
                      />
            </section>
            <section className="project-nav">
                <Link to="/galerie/packshot" className="shiny-link">
                    <ShinyText
                        text="Projet précédent"
                        disabled={false}
                        speed={3}
                        className='custom-class'
                    />
                </Link>
                <Link to="/galerie/dessin-digital" className="shiny-link">
                    <ShinyText
                        text="Projet suivant"
                        disabled={false}
                        speed={3}
                        className='custom-class'
                    />
                </Link>
            </section>
        </main>
  );
}