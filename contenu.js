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
    text: "Voici une présentation de moi : mon prénom, mon âge, ce qui me définit en quelques mots.\nÉcris ici ce que tu veux montrer de toi.",
    image: "images/image1.jpg",
    video: null,
    music: "audio/musique1.wav"
  },
  {
    title: "Minecraft",
    text: "Voici ce que j'aime faire : dessiner, écouter de la musique, jouer, créer.\nChaque passion raconte un morceau de ma personnalité.",
    image: null,
    video: "videos/minecraft-cube.mp4",                         // exemple vidéo : video: "videos/video1.mp4", image: null
    music: "audio/musique2.wav"
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
