import "../styles/index.css";

import SplitText from "../components/SplitText/SplitText";
import ShinyText from "../components/ShinyText/ShinyText";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import Back from "../assets/back.png";
import Lucas from "../assets/Lucas.png";
import Lucasribous from "../assets/Lucasribous.png";
import Gif from "../assets/Lucasribous.gif";

export default function ContactPage() {
    // handler required par <SplitText />. Défini ici pour éviter une ReferenceError qui empêche le rendu.
    const handleAnimationComplete = () => {
        // no-op for now — put analytics / state changes here if needed
        // console.log('SplitText animation complete');
    };
    const navigate = useNavigate();

    return (
        <main className="page-contact">
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
                    text="Contact"
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
            <section className="sabrina-section">
                <p className="credit-site">bla bla bla contact et tout ça...</p>
            </section>
            <section
              className="lucasribous-section"
              style={{
                backgroundImage: `url(${Gif})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
                <p className="credit-site">Développé et designé par Lucasribous</p>
                <div className="lucas-row">
                  <img src={Lucas} alt="Lucas" className="lucas-image" />
                  <p className="lucas-description">Développeur web passionné par la création d'expériences utilisateur uniques.</p>
                </div>
                <p className="contact-info">
                    Pour toute demande de collaboration ou d'information, n'hésitez pas à me contacter <br/>
                    <a
                        href="mailto:lucasribous@gmail.com"
                        className="shiny-link"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open('mailto:lucasribous@gmail.com', '_blank', 'noopener');
                        }}
                        rel="noopener noreferrer"
                        style={{
                          ['--shiny-base-color']: '#0301b4',
                          ['--rose']: '#fff',
                          ['--shiny-border-color']: '#fff',
                          ['--shiny-bg-color']: 'rgba(46,46,46,0.7)',
                          textDecoration: 'none',
                          display: 'inline-block',
                          border: '1px solid var(--shiny-border-color)',
                          backgroundColor: 'var(--shiny-bg-color)',
                        }}
                    >
                        <ShinyText
                            text="contactez moi"
                            disabled={false}
                            speed={3}
                            className='custom-class'
                        />
                    </a>
                </p>
            </section>
        </main>
    );
}