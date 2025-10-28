import "../styles/index.css";
import "../styles/projets.css";

import SplitText from "../components/SplitText/SplitText";
import ShinyText from "../components/ShinyText/ShinyText";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import Back from "../assets/back.png";
import Slay from "../assets/slay.png";
import Frutiger from "../assets/frutiger.png";
import Vitesse from "../assets/vitesse.png";
import Ken from "../assets/ken.png";

export default function DessinDigitalPage() {
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
                    text="Dessin Digital"
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
                <img src={Slay} alt="Slay" className="project-image" />
            </section>
            
            <section className="project-description">
                <p className="text">
                    Dessins réalisés dans le cadre de ma pratique personnelle.
                </p>
            </section>
            <section className="three-images-no-caption">
                <img src={Frutiger} alt="Photo de base" className="project-image-1" />
                <img src={Vitesse} alt="Ajout 3D" className="project-image-2" />
                <img src={Ken} alt="Mockup final" className="project-image-3" />
            </section>
            <section className="project-description">
                <p className="text">
                    Utilisation de Photoshop afin d’expérimenter différents rendus.
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