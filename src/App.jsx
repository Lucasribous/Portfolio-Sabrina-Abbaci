// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import BookCovers from "./pages/BookCovers";
import VingtAns from "./pages/VingtAns";
import Trajectoire from "./pages/Trajectoire";
import DessinDigital from "./pages/DessinDigital";
import Packshot from "./pages/Packshot";
import LesArtsMonnet from "./pages/LesArtsMonnet";
import Diosa from "./pages/Diosa";
import LaLampe from "./pages/LaLampe";
import Contact from "./pages/Contact";
import Threshold from "./pages/Threshold";
import SugaSuga from "./pages/SugaSuga";
import Photoshoot from "./pages/Photoshoot";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/galerie" element={<Gallery />} />
        <Route path="/galerie/book-covers" element={<BookCovers />} />
        <Route path="/galerie/20-ans" element={<VingtAns />} />
        <Route path="/galerie/trajectoire" element={<Trajectoire />} />
        <Route path="/galerie/dessin-digital" element={<DessinDigital />} />
        <Route path="/galerie/packshot" element={<Packshot />} />
        <Route path="/galerie/les-arts-monnet" element={<LesArtsMonnet />} />
        <Route path="/galerie/diosa" element={<Diosa />} />
        <Route path="/galerie/suga-suga" element={<SugaSuga />} />
        <Route path="/galerie/threshold" element={<Threshold />} />
        <Route path="/galerie/la-lampe" element={<LaLampe />} />
        <Route path="/galerie/photoshoot" element={<Photoshoot />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}
