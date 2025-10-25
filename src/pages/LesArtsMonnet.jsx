import "../styles/index.css";
import "../styles/projets.css";

import SplitText from "../components/SplitText/SplitText";
import ShinyText from "../components/ShinyText/ShinyText";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import Back from "../assets/back.png";
import LesArtsMonnetImage from "../assets/les-arts-monnet.png";

export default function LesArtsMonnet() {
    // handler required par <SplitText />. Défini ici pour éviter une ReferenceError qui empêche le rendu.
    const handleAnimationComplete = () => {
        // no-op for now — put analytics / state changes here if needed
        // console.log('SplitText animation complete');
    };
    const navigate = useNavigate();

    return (
        <main className="page les-arts-monnet">
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
                    text="Les arts Monnet"
                    delay={300}
                    duration={0.6}
                    ease="power3.out"
                    splitType="words"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                    onLetterAnimationComplete={handleAnimationComplete}
                />
                <SplitText className="project-subtitle"
                    text="Projet académique pour un festival fictif"
                    delay={200}
                    duration={0.3}
                    ease="power3.out"
                    splitType="words"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                    onLetterAnimationComplete={handleAnimationComplete}
                />
            </section>
            <section className="project-image-section">
                <img src={LesArtsMonnetImage} alt="Affiche Les Arts Monnet" className="project-image" />
            </section>
            <section className="project-description">
                <p className="text">
                    Ce projet de groupe a été l’occasion de mettre à l’honneur différentes spécialités artistiques au sein du lycée Jean Monnet dans une vidéo ainsi qu’une affiche. Pour ce faire, nous avons décider de choisir une identité singulière, jeune et colorée en jouant avec des textures et bouts de papiers découpées. Le logo dialogue avec ces divers principes appliqués. 
                </p>
            </section>
            <section className="project-video">
                <video
                    className="project-video-player"
                    src="https://d183lnwxwyo5i2.cloudfront.net/e3alpn%2Ffile%2F719a54d4811824ee2ac772748ebde413_28840a28f5130d462e6fa617cac7c812.mp4?response-content-disposition=inline%3Bfilename%3D%22719a54d4811824ee2ac772748ebde413_28840a28f5130d462e6fa617cac7c812.mp4%22%3B&response-content-type=video%2Fmp4&Expires=1761365536&Signature=QlbK7MQJk~hqBQ67TioLD3jnNVIKGq3JEW6dT3yt9XU9VJyVm8EzV6-JoG5owHY~ATktfROZYCwJtP6DFJkhZPMbUIZ~N0Aq3ICFN3wU01lxCOT19UBTzzIOMdvovDsHUkqNOA1DvBvFiW~CzE86oKd0V3XrypdtpD5PzQcSFYjSsqQpLcPmPR9A6F9sz5-pRmZr-IulAyBJwjSXHuIvv4kkSMA3FsgeCroUxvo2W8rgw4TdvPZxCfe3KAdX9bd1uPrjYISD1FYOD1yQuBmfTfuT~klXycAJLpUJz360OYb~LORRlDwtrxqa2sI9tpQUkqgCn-6z8dtw-pVyUBn-7A__&Key-Pair-Id=APKAJT5WQLLEOADKLHBQ"
                    controls
                    loop
                    muted
                    playsInline
                >
                    Votre navigateur ne prend pas en charge la balise vidéo.
                </video>
            </section>
            <section className="video-description">
                <p className="text">
                    Nous avons utiliser la freeze frame pour appliquer ces principes à des moments-clés de notre vidéo.
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