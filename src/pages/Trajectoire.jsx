import "../styles/index.css";
import "../styles/projets.css";

import SplitText from "../components/SplitText/SplitText";
import ShinyText from "../components/ShinyText/ShinyText";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import Back from "../assets/back.png";
import Trajectoire from "../assets/trajectoire.png";
import TrajectoireCalque from "../assets/trajectoire-calque.png";
import TrajectoireCalqueComplet from "../assets/trajectoire+calque.png";

export default function TrajectoirePage() {
    // handler required par <SplitText />. Défini ici pour éviter une ReferenceError qui empêche le rendu.
    const handleAnimationComplete = () => {
        // no-op for now — put analytics / state changes here if needed
        // console.log('SplitText animation complete');
    };
    const navigate = useNavigate();

    return (
        <main className="page-trajectoire">
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
                    text="Trajectoire"
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
                <img src={TrajectoireCalqueComplet} alt="Trajectoire" className="project-image" />
            </section>
            <section className="project-description">
                <p className="text">
                    Mise en page mettant à l’honneur le rappeur décédé Népal, notamment sa chanson «trajectoire» aux messages forts. 
                </p>
            </section>
            <section className="two-images-no-caption">
                <img src={Trajectoire} alt="Trajectoire" className="project-image-1" />
                <img src={TrajectoireCalque} alt="Trajectoire Calque" className="project-image-2" />
            </section>
            <section className="project-description">
                <p className="text">
                    Des références à son univers sont disposés dans la composition.  Une feuille  transparente vient faire apparaitre de nouveaux éléments, dont les paroles de la chanson.
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