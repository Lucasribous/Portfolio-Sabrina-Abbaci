import "../styles/index.css";
import "../styles/projets.css";

import SplitText from "../components/SplitText/SplitText";
import ShinyText from "../components/ShinyText/ShinyText";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import Back from "../assets/back.png";
import DomesticBanana from "../assets/domestic-banana.png";
import RubriqueLove from "../assets/rubrique-love.png";
import ParadisArtificiels from "../assets/les-paradis-artificiel.png";
import HarleyrsInHawai from "../assets/harleys-in-hawaii.png";

export default function BookCoversPage() {
    // handler required par <SplitText />. Défini ici pour éviter une ReferenceError qui empêche le rendu.
    const handleAnimationComplete = () => {
        // no-op for now — put analytics / state changes here if needed
        // console.log('SplitText animation complete');
    };
    const navigate = useNavigate();

    return (
        <main className="page-dessin-digital">
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
                    text="Book Covers"
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
                <img src={DomesticBanana} alt="Domestic Banana" className="project-image" />
            </section>
            
            <section className="project-description">
                <p className="text">
                    Covers réalisés dans le cadre de ma pratique personnelle.
                </p>
            </section>
            <section className="three-images-no-caption">
                <img src={RubriqueLove} alt="Rubrique Love" className="project-image-1" />
                <img src={ParadisArtificiels} alt="Les paradis artificiels" className="project-image-2" />
                <img src={HarleyrsInHawai} alt="Harleys in Hawaii" className="project-image-3" />
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