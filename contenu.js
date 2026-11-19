/* ============ CONTENU DU LIVRE — c'est ici que tu modifies tout ============ */

const BOOK = {
  title: "Autoportrait",
  subtitle: "Carnet d'un esprit curieux",
  author: "Van acker Nathan",
  coverImage: "images/couverture.jpg",   // null = pas d'image
  ambient: "audio/ambiance.wav"          // musique d'ambiance, null = aucune
};

/* Une entrée = une double-page (texte à gauche, image OU vidéo à droite).
   Ajoute, supprime ou réordonne les blocs { ... } librement.
   Dans "text", une ligne vide ou un retour à la ligne (\n) crée un nouveau paragraphe. */
const PAGES = [
  {
    title: "Qui suis-je ?",
    text: "rien",
    image: "images/image1.jpg",
    video: null,
    music: "audio/musique1.wav"
  },
  {
    title: "Minecraft",
    text: "Minecraft est un jeu génial où tu peux libérer ta créativité et faire toutes sortes de choses, plus folles les unes que les autres !\n\nPar exemple, moi, j'adore faire de la redstone et créer des systèmes toujours plus complexes. Une fois, j'ai même fait une sorte de calculatrice capable d'additionner directement dans Minecraft !\n\nSi vous n'y avez jamais joué, je vous le conseille !\n\nAnimation réalisée par moi sur Blender.",
    image: null,
    video: "videos/video2.mp4",                         // exemple vidéo : video: "videos/video1.mp4", image: null
    music: "audio/musique2.mp3"
  },
  {
    title: "Mon univers",
    text: "Voici mon univers : les lieux, les objets et les couleurs qui m'entourent.\nCette page n'a pas de musique : l'ambiance générale reprend.",
    image: "images/couverture.jpg",
    video: null,
    music: null
  },
  {
    title: "Mes rêves",
    text: "Ici, je parle de ce que j'aimerais devenir et des choses que je veux accomplir.",
    image: null,                         // pas de média : un emplacement discret s'affiche
    video: null,
    music: "audio/musique1.wav"
  },
  {
    title: "Mes qualités et mes défauts",
    text: "Un autoportrait, c'est aussi savoir se regarder honnêtement.\nListe ici ce qui te rend fort, et ce que tu travailles encore.",
    image: "images/image1.jpg",
    video: null,
    music: null
  },
  {
    title: "Pour finir",
    text: "Merci d'avoir feuilleté mon carnet. Cet autoportrait n'est jamais tout à fait terminé.",
    image: null,
    video: "videos/video1.mp4",
    music: "audio/musique2.wav"
  }
];
