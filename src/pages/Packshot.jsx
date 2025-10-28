import "../styles/index.css";
import "../styles/projets.css";

import SplitText from "../components/SplitText/SplitText";
import ShinyText from "../components/ShinyText/ShinyText";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import Back from "../assets/back.png";
import Packshot from "../assets/packshot.png";
import PackshotBase from "../assets/packshot-base.png";
import Packshot3D from "../assets/packshot-3D.png";
import PackshotMockup from "../assets/packshot-mockup.png";
import PackshotMoodboard from "../assets/packshot-moodboard.png";

export default function PackshotPage() {
    // handler required par <SplitText />. Défini ici pour éviter une ReferenceError qui empêche le rendu.
    const handleAnimationComplete = () => {
        // no-op for now — put analytics / state changes here if needed
        // console.log('SplitText animation complete');
    };
    const navigate = useNavigate();

    return (
        <main className="page packshot">
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
                    text="Packshot"
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
                <img src={Packshot} alt="Packshot" className="project-image" />
            </section>
            
            <section className="project-description">
                <p className="text">
                    Mise en scène d’un produit après l’élaboration d’une copy strategy.
                </p>
            </section>
            <section className="three-images">
                <figure className="project-image-item">
                    <img src={PackshotBase} alt="Photo de base" className="project-image-1" />
                    <figcaption className="project-image-alt">Photo de base</figcaption>
                </figure>
                <figure className="project-image-item">
                    <img src={Packshot3D} alt="Ajout 3D" className="project-image-2" />
                    <figcaption className="project-image-alt">Ajout 3D</figcaption>
                </figure>
                <figure className="project-image-item">
                    <img src={PackshotMockup} alt="Mockup final" className="project-image-3" />
                    <figcaption className="project-image-alt">Mockup final</figcaption>
                </figure>
            </section>
            <section className="project-image-section">
                <figure className="project-image-item">
                    <img src={PackshotMoodboard} alt="Planche tendance" className="project-image-4" />
                    <figcaption className="project-image-alt">Planche tendance</figcaption>
                </figure>
            </section>
            <section className="project-nav">
                <Link to="/galerie/trajectoire" className="shiny-link">
                    <ShinyText
                        text="Projet précédent"
                        disabled={false}
                        speed={3}
                        className='custom-class'
                    />
                </Link>
                <Link to="/galerie/20-ans" className="shiny-link">
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