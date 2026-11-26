/* ============ CONTENU DU LIVRE — c'est ici que tu modifies tout ============ */

const BOOK = {
  title: "Autoportrait",
  subtitle: "Journal de moi même.",
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
    text: "Moi c'est Nathan Van acker j'ai 14 and quand j'écris sa dans ce livre je vais vous parler de choses que j'adore !",
    image: "images/image3.png",
    video: null,
    music: "audio/musique1.wav"
  },
  {
    title: "Minecraft",
    text: "Minecraft est un jeu génial où tu peux libérer ta créativité et faire toutes sortes de choses, plus folles les unes que les autres !\n\nPar exemple, moi, j'adore faire de la redstone et créer des systèmes toujours plus complexes. Une fois, j'ai même fait une sorte de calculatrice capable d'additionner directement dans Minecraft !\n\nSi vous n'y avez jamais joué, je vous le conseille !\n\nAnimation réalisée par moi sur Blender.",
    image: null,
    video: "videos/video2.mp4",                         // exemple vidéo : video: "videos/video1.mp4", image: null
    music: "audio/musique2.wav"
  },
  {
    title: "Angel engine",
    text: 
"Angel Engine est une série d'horreur analogique créée par Nicolai Leimer, connu sur TikTok sous le pseudo @theunearthlyhub. La série a commencé en 2025 et raconte une histoire se déroulant dans un futur où l'humanité est en crise. Un ange nommé Uriel descend sur Terre pour aider les humains, mais il finit capturé et utilisé dans une machine appelée l'Angel Engine, afin d'exploiter son énergie.\n\nLa série mélange science-fiction, religion et horreur, avec une ambiance très particulière qui la rend mystérieuse et inquiétante. Elle a rapidement gagné en popularité sur TikTok et d'autres plateformes. Les visuels ont notamment été réalisés avec l'aide de l'intelligence artificielle au début du projet.\n\nAngel Engine est devenue une série très connue dans le domaine de l'analog horror, notamment grâce à son histoire, ses mystères et ses nombreux détails à découvrir.\n\nMon personnage préféré est Barachiel, un ange créé par des scientifiques à partir d'ADN humain et angélique. Il a été rejeté car, étant un hybride, il ne produit pas d'énergie comme un ange normal.\n\nJe me suis même amusé à le dessiner pour mieux visualiser à quoi il ressemble. Tu peux aussi le voir et tester mon mini-jeu en haut de cette page !"
,
    image: "images/image2.png",
    video: null,
    music: "audio/musique3.wav"
  },
  {
    title: "page 4",
    text: "rien page 4",
    image: null,                         // pas de média : un emplacement discret s'affiche
    video: null,
    music: "audio/musique1.wav"
  },
  {
    title: "Le code !",
    text: "Ma partie préférée ! Le code, c'est quelque chose que j'adore. Je veux d'ailleurs en faire mon métier plus tard. Dans le code, il existe plusieurs langages qui ne sont pas tous pareils et qui ne servent pas à la même chose. Par exemple, moi, je code en Python et en Luau. Ce sont des langages de programmation plutôt simples, mais pour faire des sites comme celui sur lequel se trouve mon livre, il me faut du JavaScript et du HTML. Et holala, qu'est-ce que c'est difficile ! Donc, ce que j'ai fait, c'est que j'ai créé le site en Python directement sur mon ordinateur, puis j'ai tout envoyé à une IA appelée « Claude AI » pour qu'elle me traduise tout dans les bons langages (un peu comme Google Traduction, en gros). Le plus dur sur ce site, c'était l'animation du livre en 3D. Je me suis fait mal au cerveau en la faisant !",
    image: "images/couverture.jpg",
    video: null,
    music: "audio/musique4.mp3"
  },
  {
    title: "Pour finir",
    text: "rien fin",
    image: null,
    video: "videos/video1.mp4",
    music: "audio/musique2.wav"
  }
];
