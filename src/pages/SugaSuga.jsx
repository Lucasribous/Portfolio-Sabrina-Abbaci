import "../styles/index.css";
import "../styles/projets.css";

import SplitText from "../components/SplitText/SplitText";
import ShinyText from "../components/ShinyText/ShinyText";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import Back from "../assets/back.png";
import SugaSugaImage from "../assets/suga-suga.png";
import SugaSugaVideo from "../assets/suga-suga.mp4";
import SugaSugaMoodboard from "../assets/suga-suga-moodboard.png";
import SugaSugaPoster from "../assets/suga-suga-poster.png";

export default function SugaSuga() {
    // handler required par <SplitText />. Défini ici pour éviter une ReferenceError qui empêche le rendu.
    const handleAnimationComplete = () => {
        // no-op for now — put analytics / state changes here if needed
        // console.log('SplitText animation complete');
    };
    const navigate = useNavigate();

    return (
        <main className="page suga-suga">
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
                    text="Suga Suga"
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
                <img src={SugaSugaImage} alt="Affiche Suga Suga" className="project-image" />
            </section>
            <section className="project-description">
                <p className="text">
                    Ce motion design rétro-futuriste revisite l’esthétique psychédélique des années 60 à travers un jeu de dégradés liquides et de formes organiques qui rappellent les lampes à lave.
                </p>
            </section>
            <section className="project-video">
                <video
                  className="project-video-player"
                  src="https://videos2.sendvid.com/b0/30/hhcq6qrn.mp4?validfrom=1769790696&validto=1769805096&rate=180k&ip=78.116.141.127&hash=V0L5L9RSZFBh%2FbbAWIRrzYSfFhs%3D"
                  poster={SugaSugaPoster}
                  controls
                  preload="none"
                  playsInline
                >
                  Votre navigateur ne prend pas en charge la balise vidéo.
                </video>
            </section>
            <section className="video-description">
                <p className="text">
                    Le but étant de créer une ambiance sensorielle où les textures chromatiques et le mouvement fluide s’unissent pour capturer l'essence envoûtante de l'instrumental. 
                </p>
            </section>
            <section className="project-image-section">
                <img src={SugaSugaMoodboard} alt="Moodboard Suga Suga" className="project-image" />
            </section>

            <section className="project-nav">
                <Link to="/galerie/la-lampe" className="shiny-link">
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