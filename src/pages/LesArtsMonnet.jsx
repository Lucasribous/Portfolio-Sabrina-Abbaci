import "../styles/index.css";
import "../styles/projets.css";

import SplitText from "../components/SplitText/SplitText";
import ShinyText from "../components/ShinyText/ShinyText";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import Back from "../assets/back.png";
import LesArtsMonnetImage from "../assets/les-arts-monnet.png";
import FestivalMonnetVideo from "../assets/festival-monnet.mp4";
import FestivalMonnetPoster from "../assets/festival-monnet.png";

export default function LesArtsMonnet() {
    // handler required par <SplitText />. Défini ici pour éviter une ReferenceError qui empêche le rendu.
    const handleAnimationComplete = () => {
        // no-op for now — put analytics / state changes here if needed
        // console.log('SplitText animation complete');
    };
    const navigate = useNavigate();

    return (
        <main className="page les-arts-monnet">
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
                    text="Les arts Monnet"
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
                <SplitText className="project-subtitle"
                    text="Projet académique pour un festival fictif"
                    delay={200}
                    duration={0.3}
                    ease="power3.out"
                    splitType="words"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                    onLetterAnimationComplete={handleAnimationComplete}
                />
            </section>
            <section className="project-image-section">
                <img src={LesArtsMonnetImage} alt="Affiche Les Arts Monnet" className="project-image" />
            </section>
            <section className="project-description">
                <p className="text">
                    Ce projet de groupe a été l’occasion de mettre à l’honneur différentes spécialités artistiques au sein du lycée Jean Monnet dans une vidéo ainsi qu’une affiche. Pour ce faire, nous avons décider de choisir une identité singulière, jeune et colorée en jouant avec des textures et bouts de papiers découpées. Le logo dialogue avec ces divers principes appliqués. 
                </p>
            </section>
            <section className="project-video">
                <video
                  className="project-video-player"
                  src={FestivalMonnetVideo}
                  poster={FestivalMonnetPoster}
                  controls
                  preload="none"
                  playsInline
                >
                  Votre navigateur ne prend pas en charge la balise vidéo.
                </video>
            </section>
            <section className="video-description">
                <p className="text">
                    Nous avons utiliser la freeze frame pour appliquer ces principes à des moments-clés de notre vidéo.
                </p>
            </section>
            <section className="project-nav">
                <Link to="/galerie" className="shiny-link">
                    <ShinyText
                        text="Projet précédent"
                        disabled={false}
                        speed={3}
                        className='custom-class'
                    />
                </Link>
                <Link to="/galerie" className="shiny-link">
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