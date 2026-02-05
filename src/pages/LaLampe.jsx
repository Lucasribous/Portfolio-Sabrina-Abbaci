import "../styles/index.css";
import "../styles/projets.css";

import SplitText from "../components/SplitText/SplitText";
import ShinyText from "../components/ShinyText/ShinyText";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import Back from "../assets/back.png";
import LaLampe from "../assets/la-lampe.png";
import CharteGraphique from "../assets/la-lampe-charte-graphique.png";

export default function LaLampePage() {
    // handler required par <SplitText />. Défini ici pour éviter une ReferenceError qui empêche le rendu.
    const handleAnimationComplete = () => {
        // no-op for now — put analytics / state changes here if needed
        // console.log('SplitText animation complete');
    };
    const navigate = useNavigate();

    return (
        <main className="page-la-lampe">
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
                    text="La Lampe"
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
                <img src={LaLampe} alt="La Lampe" className="project-image" />
            </section>
            <section className="project-video">
                            <video
                              className="project-video-player"
                              src="https://videos2.sendvid.com/e8/1b/zz25v4zz.mp4?validfrom=1770314487&validto=1770328887&rate=180k&ip=78.116.141.127&hash=pN8uaR%2Bri1SFokE%2FyzZWzATYF4w%3D"
                              volume={0.50}
                              poster={LaLampe}
                              controls
                              preload="none"
                              playsInline                      
                            ></video>
            </section>
            <section className="project-image-section">
                <img src={CharteGraphique} alt="Charte Graphique" className="project-image" />
            </section>
            <section className="project-nav">
                <Link to="/galerie/dessin-digital" className="shiny-link">
                    <ShinyText
                        text="Projet précédent"
                        disabled={false}
                        speed={3}
                        className='custom-class'
                    />
                </Link>
                <Link to="/galerie/diosa" className="shiny-link">
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