import "../styles/index.css";

import SplitText from "../components/SplitText/SplitText";
import ShinyText from "../components/ShinyText/ShinyText";
import Balatro from '../components/Balatro/Balatro';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import Back from "../assets/back.png";
import Lucas from "../assets/Lucas.png";
import CV from "../assets/cv.png";
import CVPDF from "../assets/cv2026.pdf";

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
                    <img src={CV} alt="CV" className="cv-image" /><br />
            </section>
            <section className="cv-download-section">
              <a
                  href={CVPDF}
                  download="Sabrina_CV_2026.pdf"
                  className="shiny-link"
                  rel="noopener noreferrer"
              >
                  <ShinyText
                      text="Télécharger mon CV"
                      disabled={false}
                      speed={3}
                      className='custom-class'
                  />
              </a>
            </section>
            <section className="sabrina-contact">
                <p className="contact-info">
                    Pour toute demande de collaboration ou d'information, n'hésitez pas à me contacter <br/>
                    <a
                  href="mailto:sabrinaabbc@gmail.com"
                  className="shiny-link"
                  onClick={(e) => {
                          e.preventDefault();
                          window.open('mailto:sabrinaabbc@gmail.com', '_blank', 'noopener');
                        }}
              >
                  <ShinyText
                      text="Contactez moi"
                      disabled={false}
                      speed={3}
                      className='custom-class'
                  />
                    </a>
                </p>
            </section>
            <hr></hr>
            <section className="lucasribous-credit-section">
            <div className="lucasribous-section">
              <div className="lucasribous-bg">
                <Balatro
                  spinRotation={-2}
                  spinSpeed={7}
                  mouseInteraction={false}
                />
              </div>
              <div className="lucasribous-content">
                <p className="credit-site">Développé et designé par Lucasribous</p>
                <div className="lucas-row">
                  <img src={Lucas} alt="Lucas" className="lucas-image" />
                  <p className="lucas-description">Designer et développeur web passionné par la création d'expériences utilisateur uniques.</p>
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
                            text="Contactez moi"
                            disabled={false}
                            speed={3}
                            className='custom-class'
                        />
                    </a>
                </p>
              </div>
            </div>
            </section>
        </main>
    );
}