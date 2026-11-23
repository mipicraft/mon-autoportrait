/* Mini-jeu « recopie la page » — s'ajoute au livre sans modifier script.js */
(function () {
  /* ====== RÉGLAGES ====== */
  const GAME_PAGE = 2;                       // page du jeu : 0 = page 1, 2 = page 3
  const FRAMES = 43, FOLDER = 'images/monstre/', EXT = '.png';   // images/monstre/1.png ... 43.png
  const GHOST = 'images/fenetre.png';        // image sur le bord de la fenêtre d'explication
  const FPS_IN = 12, FPS_OUT = 24;           // apparition / disparition (si cliqué)
  const WAIT_MS = 5000;                      // attente sur la dernière image avant le game over
  const MAX_M = 3;                           // nombre max de personnages en même temps
  /* ====================== */

  if (typeof PAGES === 'undefined' || !PAGES[GAME_PAGE]) return;
  const P = PAGES[GAME_PAGE];
  const norm = s => String(s).replace(/[’‘]/g, "'");
  const T = norm(String(P.text || '').split('\n').map(l => l.trim()).filter(Boolean).join(' '));
  const $ = id => document.getElementById(id);

  const frames = [];
  for (let i = 1; i <= FRAMES; i++) { const im = new Image(); im.src = FOLDER + i + EXT; frames.push(im); }

  const ui = document.createElement('div');
  ui.innerHTML =
    '<div class="mj-ov" id="mj-intro" hidden><div class="mj-win"><img class="mj-ghost" alt="" draggable="false">' +
    '<div class="mj-body"><h3>Mini-jeu : recopie la page</h3><ul>' +
    '<li>Recopie le texte de la page, lettre par lettre. Il apparaît en gris : chaque lettre juste devient noire.</li>' +
    '<li>Si tu fais une faute, la lettre devient <b style="color:#c0161a">rouge</b>.</li>' +
    '<li>Attention : des créatures surgissent dans les bords noirs de l’écran. <b>Clique dessus</b> avant la fin de leur apparition + 5 secondes, sinon c’est le game over !</li></ul>' +
    '<div class="mj-row"><button class="mj-b" id="mj-go">Commencer</button><button class="mj-b" id="mj-back">Retour au livre</button></div></div></div></div>' +
    '<div class="mj-ov" id="mj-game" hidden><div class="mj-band t"></div><div class="mj-band b"></div><div class="mj-band l"></div><div class="mj-band r"></div>' +
    '<div class="mj-sheet"><h3 id="mj-title"></h3><div id="mj-text"></div><div id="mj-stat"><span id="mj-err"></span><button class="mj-b" id="mj-quit">✕ Quitter</button></div></div>' +
    '<input id="mj-in" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Zone de saisie"></div>' +
    '<div class="mj-ov lose" id="mj-end" hidden><img class="mj-big" alt=""><h2></h2><p></p>' +
    '<div class="mj-row"><button class="mj-b" id="mj-again">Rejouer</button><button class="mj-b" id="mj-quit2">Retour au livre</button></div></div>';
  while (ui.firstChild) document.body.append(ui.firstChild);
  $('mj-intro').querySelector('.mj-ghost').src = GHOST;
  $('mj-title').textContent = P.title || '';
  const game = $('mj-game'), txt = $('mj-text'), inp = $('mj-in'), end = $('mj-end');

  let active = false, running = false, typed = '', ms = [], raf = 0, last = 0, spawnT = 0, B = 80;

  /* ---------- bouton sur la page du jeu ---------- */
  const lf = document.querySelectorAll('#book .leaf')[GAME_PAGE], pg = lf && lf.querySelector('.back .pg');
  if (pg) {
    const b = document.createElement('button'); b.className = 'mj-btn'; b.textContent = 'Mini-jeu';
    b.onclick = e => { e.stopPropagation(); active = true; $('mj-intro').hidden = false; };
    pg.append(b);
  }

  /* ---------- ouverture / fermeture ---------- */
  function stop() { running = false; cancelAnimationFrame(raf); ms.forEach(m => m.el.remove()); ms = []; }
  function closeAll() { stop(); ['mj-intro', 'mj-game', 'mj-end'].forEach(id => $(id).hidden = true); active = false; inp.blur(); }
  function start() {
    stop(); typed = ''; inp.value = '';
    B = Math.max(44, Math.min(130, Math.min(innerWidth, innerHeight) * .12)); game.style.setProperty('--B', B + 'px');
    txt.innerHTML = ''; for (const c of T) { const s = document.createElement('span'); s.textContent = c; txt.append(s); }
    $('mj-intro').hidden = true; end.hidden = true; game.hidden = false;
    running = true; last = performance.now(); spawnT = 1500; raf = requestAnimationFrame(tick);
    render(); inp.focus();
  }
  $('mj-go').onclick = start; $('mj-again').onclick = start;
  $('mj-back').onclick = closeAll; $('mj-quit').onclick = closeAll; $('mj-quit2').onclick = closeAll;
  game.addEventListener('mousedown', e => { e.preventDefault(); inp.focus(); });
  // le clavier ne doit pas tourner les pages du livre pendant le jeu
  addEventListener('keydown', e => { if (!active) return; if (e.key === 'Escape') closeAll(); e.stopPropagation(); }, true);

  /* ---------- saisie ---------- */
  function render() {
    const sp = txt.children; let bad = 0;
    for (let i = 0; i < sp.length; i++) {
      let c = '';
      if (i < typed.length) { c = norm(typed[i]) === T[i] ? 'ok' : 'bad'; if (c === 'bad') bad++; }
      else if (i === typed.length) c = 'cur';
      sp[i].className = c;
    }
    $('mj-err').textContent = 'Fautes : ' + bad;
    const e = sp[Math.min(typed.length, sp.length - 1)]; if (e && e.scrollIntoView) e.scrollIntoView({ block: 'nearest' });
    return bad;
  }
  inp.addEventListener('input', () => {
    if (!running) return;
    if (inp.value.length > T.length) inp.value = inp.value.slice(0, T.length);
    typed = inp.value; const bad = render();
    if (typed.length >= T.length) finish(true, bad);
  });

  /* ---------- personnages ---------- */
  const ROT = { t: 180, b: 0, l: 90, r: -90 };       // la tête est tournée vers le centre de l'écran
  const showF = m => { m.el.src = frames[m.f].src; };
  function spawn() {
    const side = 'tblr'[Math.floor(Math.random() * 4)], band = game.querySelector('.mj-band.' + side);
    const el = new Image(); el.className = 'mj-m'; el.draggable = false; el.style.height = (B * .9) + 'px';
    const p = 12 + Math.random() * 76 + '%';
    if (side === 't' || side === 'b') { el.style.left = p; el.style.top = '50%'; } else { el.style.top = p; el.style.left = '50%'; }
    el.style.transform = 'translate(-50%,-50%) rotate(' + ROT[side] + 'deg)';
    const m = { el, state: 'in', f: 0, acc: 0, wait: 0 }; showF(m); band.append(el); ms.push(m);
    el.addEventListener('pointerdown', e => {
      e.preventDefault(); inp.focus();
      if (m.state === 'in' || m.state === 'wait') { m.state = 'out'; m.acc = 0; }   // animation inverse en x2
    });
  }
  function tick(now) {
    if (!running) return;
    const dt = Math.min(100, now - last); last = now;
    for (const m of ms) {
      if (m.state === 'wait') { m.wait -= dt; if (m.wait <= 0) { finish(false, 0, m); return; } continue; }
      m.acc += dt; const step = 1000 / (m.state === 'out' ? FPS_OUT : FPS_IN);
      while (m.acc >= step && m.state !== 'dead' && m.state !== 'wait') {
        m.acc -= step;
        if (m.state === 'in') { m.f++; if (m.f >= FRAMES - 1) { m.f = FRAMES - 1; m.state = 'wait'; m.wait = WAIT_MS; } showF(m); }
        else { m.f--; if (m.f < 0) { m.el.remove(); m.state = 'dead'; } else showF(m); }
      }
    }
    ms = ms.filter(m => m.state !== 'dead');
    spawnT -= dt; if (spawnT <= 0 && ms.length < MAX_M) { spawn(); spawnT = 1500 + Math.random() * 2500; }
    raf = requestAnimationFrame(tick);
  }

  /* ---------- fin de partie ---------- */
  function finish(win, bad, m) {
    stop(); inp.blur();
    end.className = 'mj-ov ' + (win ? 'win' : 'lose');
    end.querySelector('h2').textContent = win ? 'Bravo !' : 'GAME OVER';
    end.querySelector('p').textContent = win ? 'Page recopiée avec ' + bad + ' faute' + (bad > 1 ? 's' : '') + '.' : 'Tu n’as pas cliqué à temps…';
    if (!win) end.querySelector('.mj-big').src = frames[FRAMES - 1].src;
    end.hidden = false;
  }
})();
