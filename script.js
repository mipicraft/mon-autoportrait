/* Livre interactif 3D — logique. Le contenu se modifie dans contenu.js */
(function () {
  const B = BOOK, P = PAGES, N = P.length, L = N + 1;          // L = nombre de feuilles (couverture + 1 par double-page)
  const $ = id => document.getElementById(id);
  const book = $('book'), tilt = $('tilt'), shadow = $('shadow'), ui = $('ui');
  const prev = $('prev'), next = $('next'), ind = $('ind'), root = document.documentElement;
  let s = -1, lock = false, W, H, T;                           // s = double-page affichée (-1 = livre fermé)
  const leaves = [];

  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  const wait = ms => new Promise(r => setTimeout(r, ms));
  // profondeur de chaque feuille : pile de droite (non tournées) et pile de gauche (tournées)
  const zOf = (i, flipped) => { const e = T / (L + 1); return flipped ? -T / 2 + i * e : T / 2 - i * e; };

  /* ---------- taille : le livre ne dépasse jamais de l'écran ---------- */
  function fit() {
    H = Math.max(180, Math.min(780, innerHeight - 110, innerWidth * .92 / 1.44));
    W = H * .72; T = Math.max(12, W * .06);
    root.style.setProperty('--W', W + 'px'); root.style.setProperty('--H', H + 'px'); root.style.setProperty('--T', T + 'px');
    leaves.forEach((lf, i) => lf.style.setProperty('--z', zOf(i, i <= s) + 'px'));
  }

  /* ---------- construction des pages ---------- */
  const ph = t => el('div', 'ph', t);
  function textPage(p, i, cb) {
    const d = el('div', 'pg L' + (cb ? ' cb' : '')), t = el('div', 'tx');
    d.append(el('h2', 0, p.title || ''));
    String(p.text || '').split('\n').forEach(l => l.trim() && t.append(el('p', 0, l.trim())));
    d.append(t, el('div', 'orn', '❦'), el('div', 'num', 2 * i + 2));
    return d;
  }
  function endPage() { const d = el('div', 'pg L'); d.append(el('h2', 0, 'Fin'), el('div', 'orn', '❦')); return d; }
  function mediaPage(p, i) {
    const d = el('div', 'pg R'), f = el('div', 'fr'); let m;
    if (p.video) {
      m = el('video'); m.src = p.video; m.controls = true; m.playsInline = true; m.preload = 'metadata';
      m.onerror = () => m.replaceWith(ph('Vidéo introuvable : ' + p.video));
    } else if (p.image) {
      m = el('img'); m.src = p.image; m.alt = p.title || ''; m.draggable = false;
      m.onerror = () => m.replaceWith(ph('Image introuvable : ' + p.image));
    } else m = ph('Emplacement pour une image ou une vidéo');
    f.append(m); d.append(f, el('div', 'num', 2 * i + 3));
    return d;
  }
  function coverFront() {
    const d = el('div', 'cv'); d.append(el('h1', 0, B.title || ''));
    if (B.subtitle) d.append(el('div', 'sub', B.subtitle));
    if (B.coverImage) { const m = el('img', 'cimg'); m.src = B.coverImage; m.alt = ''; m.draggable = false; m.onerror = () => m.remove(); d.append(m); }
    else d.append(el('div', 'cimg'));
    if (B.author) d.append(el('div', 'auth', B.author));
    d.append(el('div', 'opn', 'OUVRIR LE LIVRE'));
    return d;
  }
  // feuille 0 = couverture (dos = texte de la 1re double-page) ; feuille i = média de la page i-1 au recto, texte de la page i au verso
  for (let i = 0; i < L; i++) {
    const lf = el('div', 'leaf' + (i ? '' : ' cover')), f = el('div', 'face front'), b = el('div', 'face back');
    f.append(i ? mediaPage(P[i - 1], i - 1) : coverFront());
    b.append(i < N ? textPage(P[i], i, i === 0) : endPage());
    lf.append(f, b); lf.style.setProperty('--a', '0deg'); book.append(lf); leaves.push(lf);
  }
  book.append(el('div', 'spine'), el('div', 'bcov'));

  /* ---------- moteur d'animation ---------- */
  const setClosed = c => [book, tilt, shadow].forEach(e => e.classList.toggle('closed', c));
  function upd() {
    ind.textContent = s >= 0 ? 'Page ' + (s + 1) + ' / ' + N : '';
    prev.disabled = lock || s <= 0; next.disabled = lock || s < 0 || s >= N - 1; $('close').disabled = lock || s < 0;
    ui.classList.toggle('hidden', s < 0);
  }
  // Fait tourner toutes les feuilles nécessaires pour atteindre la double-page t (avec un décalage st entre chaque feuille)
  function go(t, dur, st) {
    const ch = []; leaves.forEach((_, i) => { if ((i <= s) !== (i <= t)) ch.push(i); });
    if (!ch.length) return Promise.resolve();
    if (t < s) ch.reverse();
    ch.forEach((i, k) => {
      const lf = leaves[i], fl = i <= t;
      lf.style.setProperty('--d', dur + 's'); lf.style.setProperty('--dl', (k * st) + 's'); lf.classList.add('turning');
      lf.style.setProperty('--a', fl ? '-180deg' : '0deg');
      lf.style.setProperty('--z', (zOf(i, fl) + 30) + 'px');        // la feuille en mouvement passe au-dessus des autres
    });
    if (t < 0) setTimeout(() => setClosed(true), (ch.length - 1) * st * 1000);   // le livre se recentre quand la couverture se ferme
    else if (s < 0) setClosed(false);
    s = t; upd();
    return wait((dur + (ch.length - 1) * st) * 1000 + 60).then(() => {
      ch.forEach(i => { const lf = leaves[i]; lf.classList.remove('turning'); lf.style.transition = 'none'; lf.style.setProperty('--z', zOf(i, i <= s) + 'px'); });
      void book.offsetWidth;
      ch.forEach(i => leaves[i].style.transition = '');
    });
  }

  /* ---------- musique (une seule à la fois) ---------- */
  const amb = new Audio(), pa = new Audio(); amb.loop = pa.loop = true; amb.volume = pa.volume = .6;
  let snd = true, started = false;
  const play = (a, src) => { if (a.dataset.s !== src) { a.dataset.s = src; a.src = src; } a.play().catch(() => {}); };
  function setMusic() {
    if (!started) return;
    amb.pause(); pa.pause();
    if (!snd) return;
    const m = s >= 0 && P[s].music;
    if (m) play(pa, m); else if (B.ambient) play(amb, B.ambient);
  }
  const pauseVideos = () => document.querySelectorAll('video').forEach(v => v.pause());

  /* ---------- actions ---------- */
  async function open() {
    if (lock || s >= 0) return;
    lock = true; started = true; setMusic(); upd();             // démarré dans le clic : autorisé par le navigateur
    await go(0, 1.5, 0);                                         // la couverture pivote autour de la tranche
    if (N > 1) {                                                 // feuilletage d'introduction, puis retour à la 1re page
      await go(Math.min(N - 1, 5), .55, .14);
      await go(0, .6, .12);
    }
    setMusic(); lock = false; upd();
  }
  async function step(d) {
    if (lock || s < 0 || s + d < 0 || s + d > N - 1) return;
    lock = true; upd(); pauseVideos();
    await go(s + d, 1.1, 0);
    setMusic(); lock = false; upd();
  }
  async function closeBook() {
    if (lock || s < 0) return;
    lock = true; upd(); pauseVideos();
    await go(-1, 1.5, Math.min(.1, 1 / Math.max(1, s)));
    setMusic(); lock = false; upd();
  }

  book.addEventListener('click', () => { if (s < 0) open(); });
  next.onclick = () => step(1); prev.onclick = () => step(-1); $('close').onclick = closeBook;
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') step(1); else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'Enter' && s < 0 && document.activeElement === document.body) open();
  });
  $('mute').onclick = () => { snd = !snd; started = true; $('mute').classList.toggle('off', !snd); setMusic(); };
  $('vol').oninput = e => { amb.volume = pa.volume = +e.target.value; };
  addEventListener('resize', fit);
  fit(); setClosed(true); upd();
})();
