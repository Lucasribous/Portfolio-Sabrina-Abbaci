import "../styles/index.css";
import Masonry from "../components/Masonry/Masonry";
import ASCIIText from "../components/ASCIIText/ASCIIText";
import ShinyText from "../components/ShinyText/ShinyText";
import { Link } from "react-router-dom";

import BookCovers from "../assets/domestic-banana.png";
import VingtAns from "../assets/collage-demultiplication.png";
import Trajectoire from "../assets/trajectoire.png";
import DessinDigital from "../assets/slay.png";
import Packshot from "../assets/packshot.png";
import LesArtsMonnet from "../assets/les-arts-monnet.png";
import Diosa from "../assets/diosa.png";
import LaLampe from "../assets/la-lampe.png";
import SugaSuga from "../assets/suga-suga.png";
import Threshold from "../assets/threshold-mockup.png";
import Photoshoot from "../assets/photoshoot1.png";


const items = [
  { id: "1", img: BookCovers, url: "/galerie/book-covers" },
  { id: "2", img: Trajectoire, url: "/galerie/trajectoire" },
  { id: "3", img: Packshot, url: "/galerie/packshot" },
  { id: "4", img: VingtAns, url: "/galerie/20-ans" },
  { id: "5", img: Threshold, url: "/galerie/threshold" },
  { id: "6", img: SugaSuga, url: "/galerie/suga-suga" },
  { id: "7", img: LesArtsMonnet, url: "/galerie/les-arts-monnet" },
  { id: "8", img: DessinDigital, url: "/galerie/dessin-digital" },
  { id: "9", img: LaLampe, url: "/galerie/la-lampe" },
  { id: "10", img: Diosa, url: "/galerie/diosa" },
  { id: "11", img: Photoshoot, url: "/galerie/photoshoot" },
];

export default function Gallery() {
  return (<>
    <section className="ASCIIText">
      <ASCIIText
      text='galerie'
        enableWaves={false}
        asciiFontSize={5}
        textFontSize={100}
        planeBaseHeight={3}
        textColor="#f19fd3"
      />
    </section>
    <section className="masonry-gallery">
      <div style={{ padding: 8 }}>
        <Masonry
          items={items}
          columns={2}
          breakpoints={{ 1200: 3, 900: 2 }} // width>=1200 => 3 cols, >=900 => 2 cols, otherwise columns prop
          columnGap={20}      // px horizontal gap
          rowGap={16}         // px vertical gap
          containerPadding={20} // px left/right padding
        />
      </div>
    </section>
    <section className="contact-section">
      <p className="contact-text">
        Vous souhaitez collaborer ou en savoir plus sur mon travail ? Contactez moi
      </p>
      <Link to="/contact" className="shiny-link">
          <ShinyText
              text="contact"
              disabled={false}
              speed={3}
              className='custom-class'
          />
      </Link>
    </section>
    </>
  );
}