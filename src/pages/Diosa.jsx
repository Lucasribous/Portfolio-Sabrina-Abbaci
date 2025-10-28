import "../styles/index.css";
import "../styles/projets.css";

import SplitText from "../components/SplitText/SplitText";
import ShinyText from "../components/ShinyText/ShinyText";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import Back from "../assets/back.png";
import Diosa from "../assets/diosa.png";
import KaliUchis1 from "../assets/kali-uchis-1.png";
import KaliUchis2 from "../assets/kali-uchis-2.png";

export default function DiosaPage() {
    // handler required par <SplitText />. Défini ici pour éviter une ReferenceError qui empêche le rendu.
    const handleAnimationComplete = () => {
        // no-op for now — put analytics / state changes here if needed
        // console.log('SplitText animation complete');
    };
    const navigate = useNavigate();

    return (
        <main className="page-diosa">
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
                    text="Diosa"
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
                <img src={Diosa} alt="Diosa" className="project-image" />
            </section>
            <section className="project-description">
                <p className="text">
                    Conception d’un top inspiré par l’artiste Kali Uchis.
                </p>
            </section>
            <section className="two-images-no-caption">
                <img src={KaliUchis2} alt="Kali Uchis 2" className="project-image-1" />
                <img src={KaliUchis1} alt="Kali Uchis 1" className="project-image-2" />
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