# Portfolio Sabrina — site

Site portfolio React (Vite) pour Sabrina. Contient galerie de projets, carrousel responsive (mobile tactile & desktop drag/wheel), composant Balatro en background, et page Contact avec téléchargement du CV.

## Fonctionnalités
- Interface mobile-first (fenêtre mobile émulée sur desktop)
- Carrousel horizontal :
  - Drag with mouse (desktop)
  - Wheel → horizontal scroll (desktop)
  - Native horizontal swipe (mobile)
  - Dots navigation with smooth auto-scroll
- Composant Balatro utilisé comme background dynamique
- Téléchargement du CV (via attribut `download` ou fetch+blob forcé)
- Assets servis depuis `public/` pour fiabilité en déploiement

## Tech / dépendances
- React
- Vite
- Tailwind CSS
- (composants maison : SplitText, MarqueeText, Balatro, Carousel, ShinyText)

## Structure importante
- src/
  - components/Carousel/
  - components/Balatro/
  - pages/ (Home, Gallery, Contact, projets...)
  - styles/ (index.css, projets.css, components/Carousel.css, ...)
  - assets/ (images, SVGs, importés pour bundling)
- public/
  - assets/ (fichiers statiques servis tels quels, ex: GIF/PNG/PDF à référencer par `/assets/...`)

## Installation (développement local)
1. Cloner le dépôt
2. Installer :
   ```
   npm install
   ```
3. Lancer le serveur de dev :
   ```
   npm run dev
   ```

## Scripts utiles
- `npm run dev` — démarre Vite en dev
- `npm run build` — build de production
- `npm run preview` — preview de production local
- `npm run lint` / `npm run test` — si présents dans le projet

## Déploiement (Vercel recommandé)
- Déployer la racine du projet (`site`) sur Vercel.
- Placer les assets statiques (GIF, PDF, etc.) dans `public/assets/` pour éviter les problèmes de hash/path après build.
- Si vous utilisez `base` dans `vite.config.js`, adaptez les chemins absolus des assets (ex: `url('/<base>/assets/...')`).

## Remarques & troubleshooting
- Si un asset sert `Content-Type: text/html` -> le serveur renvoie `index.html` (fichier introuvable). Vérifier :
  - Chemin exact et casse du nom (Linux est case-sensitive).
  - Que le fichier est commité (pas uniquement en Git LFS) et présent dans `public/`.
- Si GIF apparaît en `304 Not Modified` : vider le cache (DevTools Disable cache / Ctrl+F5) ou redéployer.
- Carrousel :
  - Sur mobile la logique JS n'empêche pas le comportement natif : swipe horizontal doit fonctionner.
  - Si le carrousel ne répond pas au tactile, vérifier `touch-action` et les listeners `touchstart`/`touchmove` (le code du composant gère un threshold pour différencier scroll vertical/horizontal).
- Téléchargement CV :
  - Lien simple avec `href="/assets/CV.pdf" download="Sabrina_CV.pdf"` suffit dans la majorité des cas.
  - Pour forcer le téléchargement si le serveur renvoie headers problématiques, fetch + blob est implémenté en fallback.

## Tests & debug rapides
- Ouvrir DevTools → Network & Console pour voir erreurs JS, 404/304, ou content-type.
- Vérifier l’existence d’assets avec :
  ```
  git ls-files | grep public/assets
  ```
- Pour vérifier un asset côté déployé :
  ```
  curl -I https://<your-site>/assets/YourFile.ext
  ```

## Contribution
- Créer une branche, faire des commits clairs, ouvrir une PR.
- Respecter le style Tailwind/CSS existant et ne pas casser les comportements touch/drag du carrousel.

## Licence
- MIT (ou préciser la licence du projet)
