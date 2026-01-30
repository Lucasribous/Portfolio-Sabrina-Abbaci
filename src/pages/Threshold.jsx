import "../styles/index.css";
import "../styles/projets.css";

import SplitText from "../components/SplitText/SplitText";
import ShinyText from "../components/ShinyText/ShinyText";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import Back from "../assets/back.png";
import ThresholdMockup from "../assets/threshold-mockup.png";
import Threshold from "../assets/threshold.png";
import ThresholdMoodboard from "../assets/threshold-moodboard.png";

export default function ThresholdPage() {
    // handler required par <SplitText />. Défini ici pour éviter une ReferenceError qui empêche le rendu.
    const handleAnimationComplete = () => {
        // no-op for now — put analytics / state changes here if needed
        // console.log('SplitText animation complete');
    };
    const navigate = useNavigate();

    return (
        <main className="page-threshold">
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
                    text="Threshold"
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
                <img src={Threshol} alt="Threshold Mockup" className="project-image" />
            </section>
            <section className="project-description">
                <p className="text">
                    Threshold interroge ainsi la frontière invisible entre l’intime et l’imaginaire, et propose une esthétique douce mais légèrement inquiétante, inspirée des univers numériques et oniriques contemporains.
                </p>
            </section>
            <section className="project-image-section">
                <img src={ThresholdMockup} alt="Threshold" className="project-image" />
            </section>
            <section className="project-image-section">
                <img src={ThresholdMoodboard} alt="Threshold Moodboard" className="project-image" />
            </section>
            <section className="project-description">
                <p className="text">
                    Threshold est un projet visuel explorant les notions de liminal space, de dreamcore et d’entre-deux. À travers des paysages flottants, des couleurs pastel et une atmosphère irréelle, le projet met en scène un espace suspendu entre le rêve et la réalité, le familier et l’étrange.
                </p>
            </section>
            <section className="project-nav">
                <Link to="/galerie/20-ans" className="shiny-link">
                    <ShinyText
                        text="Projet précédent"
                        disabled={false}
                        speed={3}
                        className='custom-class'
                    />
                </Link>
                <Link to="/galerie/suga-suga" className="shiny-link">
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