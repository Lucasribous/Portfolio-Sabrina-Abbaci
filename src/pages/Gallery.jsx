import "../styles/index.css";
import Masonry from "../components/Masonry/Masonry";
import ASCIIText from "../components/ASCIIText/ASCIIText";
import BookCovers from "../assets/domestic-banana.png";
import VingtAns from "../assets/collage-demultiplication.png";
import Trajectoire from "../assets/trajectoire.png";
import DessinDigital from "../assets/slay.png";
import Packshot from "../assets/packshot.png";
import LesArtsMonnet from "../assets/les-arts-monnet.png";
import Diosa from "../assets/diosa.png";
import LaLampe from "../assets/la-lampe.png";


const items = [
  { id: "1", img: BookCovers, url: "/galerie/book-covers" },
  { id: "2", img: VingtAns, url: "/galerie/20-ans" },
  { id: "3", img: Trajectoire, url: "/galerie/trajectoire" },
  { id: "4", img: DessinDigital, url: "/galerie/dessin-digital" },
  { id: "5", img: Packshot, url: "/galerie/packshot" },
  { id: "6", img: LesArtsMonnet, url: "/galerie/les-arts-monnet" },
  { id: "7", img: Diosa, url: "/galerie/diosa" },
  { id: "8", img: LaLampe, url: "/galerie/la-lampe" },
];

export default function Gallery() {
  return (<>
    <section className="ASCIIText">
      <ASCIIText
      text='galerie'
        enableWaves={false}
        asciiFontSize={5}
        textFontSize={200}
        planeBaseHeight={3}
        textColor="#f19fd3"
      />
    </section>

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
    </>
  );
}