"use strict";
/* Animations : particules des lieux, séquences plein écran, envols de pièces. */
const BOUGE = !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

/* ---------- particules posées sur les scènes (fonctionnent aussi sur les images ChatGPT) ---------- */
const Ambi = (() => {
  const GENRE = { diner: 'vapeur', site: 'vent', maine: 'vent', bosphore: 'pluie', port: 'vent', kirkwall: 'vent' };
  let raf = null;
  const hasard = (a, b) => a + Math.random() * (b - a);
  function stop() { if (raf) cancelAnimationFrame(raf); raf = null; }
  function lancer(cv) {
    stop();
    if (!cv || !BOUGE) return;
    const w = cv.width = cv.offsetWidth, ht = cv.height = cv.offsetHeight;
    if (!w || !ht) return;
    const c = cv.getContext('2d'), genre = GENRE[cv.dataset.fx] || 'poussiere';
    let p = [];
    if (genre === 'poussiere') p = Array.from({ length: 34 }, () => ({ x: hasard(0, w), y: hasard(0, ht), r: hasard(0.5, 1.7), a: hasard(0.1, 0.5), v: hasard(0.03, 0.14), ph: hasard(0, 6) }));
    if (genre === 'vapeur' && !cv.closest('.conv-ban')) p = Array.from({ length: 10 }, () => ({ x: w * hasard(0.585, 0.615), y: ht * hasard(0.42, 0.64), r: hasard(3, 8), v: hasard(0.15, 0.35), ph: hasard(0, 6) }));
    if (genre === 'pluie') p = Array.from({ length: 60 }, () => ({ x: hasard(0, w), y: hasard(0, ht), l: hasard(7, 16), v: hasard(3.5, 6.5), a: hasard(0.1, 0.28) }));
    if (genre === 'vent') p = Array.from({ length: 24 }, () => ({ x: hasard(0, w), y: hasard(ht * 0.45, ht), l: hasard(18, 70), v: hasard(1.6, 4.2), a: hasard(0.06, 0.2) }));
    const gouttes = genre === 'vapeur' ? Array.from({ length: 6 }, () => ({ x: hasard(w * 0.02, w * 0.34), y: hasard(ht * 0.05, ht * 0.38), v: hasard(0.06, 0.25) })) : [];
    /* Sur les décors où le personnage occupe le ciel, chaque oiseau garde un pan libre et s'efface en approchant de lui.
       Le bandeau des dialogues montre le visage sans ce ciel : pas d'oiseaux là. */
    const ciels = {
      site: [{ x: w * 0.05, y: ht * 0.1, v: 0.32, s: 7, deb: -20, fin: w * 0.25 }, { x: w * 0.7, y: ht * 0.06, v: 0.22, s: 5, deb: w * 0.6, fin: w + 20 }],
      port: [{ x: w * 0.08, y: ht * 0.12, v: 0.3, s: 6, deb: -20, fin: w * 0.42 }, { x: w * 0.28, y: ht * 0.06, v: 0.2, s: 5, deb: -20, fin: w * 0.42 }],
      kirkwall: [{ x: w * 0.62, y: ht * 0.05, v: 0.28, s: 6, deb: w * 0.58, fin: w * 0.82 }, { x: w * 0.72, y: ht * 0.11, v: 0.2, s: 5, deb: w * 0.58, fin: w * 0.82 }],
      maine: [{ x: w * 0.72, y: ht * 0.1, v: 0.3, s: 6, deb: w * 0.62, fin: w + 20 }, { x: w * 0.88, y: ht * 0.2, v: 0.2, s: 5, deb: w * 0.62, fin: w + 20 }]
    };
    const ciel = ciels[cv.dataset.fx];
    const oiseaux = genre !== 'vent' || (ciel && cv.closest('.conv-ban')) ? [] : ciel ||
      [{ x: w * 0.2, y: ht * 0.16, v: 0.32, s: 7, deb: -20, fin: w + 20 }, { x: w * 0.62, y: ht * 0.24, v: 0.22, s: 5, deb: -20, fin: w + 20 }];
    const tour = (t) => {
      raf = requestAnimationFrame(tour);
      if (document.hidden) return;
      c.clearRect(0, 0, w, ht);
      if (genre === 'poussiere') {
        c.fillStyle = '#ffe9b8';
        p.forEach((d) => {
          d.y -= d.v; d.x += Math.sin(t / 1800 + d.ph) * 0.12;
          if (d.y < -3) { d.y = ht + 3; d.x = hasard(0, w); }
          c.globalAlpha = d.a * (0.65 + 0.35 * Math.sin(t / 900 + d.ph));
          c.beginPath(); c.arc(d.x, d.y, d.r, 0, 6.3); c.fill();
        });
      } else if (genre === 'vapeur') {
        c.fillStyle = '#fff';
        p.forEach((d) => {
          d.y -= d.v; d.x += Math.sin(t / 700 + d.ph) * 0.25; d.r += 0.03;
          if (d.y < ht * 0.42) { d.y = ht * 0.64; d.x = w * hasard(0.585, 0.615); d.r = hasard(3, 6); }
          c.globalAlpha = Math.max(0, 0.11 * ((d.y - ht * 0.42) / (ht * 0.22)));
          c.beginPath(); c.arc(d.x, d.y, d.r, 0, 6.3); c.fill();
        });
        c.strokeStyle = '#fff'; c.globalAlpha = 0.28; c.lineWidth = 1;
        gouttes.forEach((g) => {
          g.y += g.v;
          if (g.y > ht * 0.42) { g.y = hasard(ht * 0.05, ht * 0.2); g.x = hasard(w * 0.02, w * 0.34); }
          c.beginPath(); c.moveTo(g.x, g.y - 8); c.lineTo(g.x, g.y); c.stroke();
        });
      } else if (genre === 'pluie') {
        c.strokeStyle = '#dfe8f2'; c.lineWidth = 1;
        p.forEach((d) => {
          d.y += d.v; d.x -= d.v * 0.08;
          if (d.y > ht + d.l) { d.y = -d.l; d.x = hasard(0, w); }
          c.globalAlpha = d.a;
          c.beginPath(); c.moveTo(d.x, d.y); c.lineTo(d.x + d.l * 0.08, d.y - d.l); c.stroke();
        });
      } else {
        c.strokeStyle = '#fff'; c.lineWidth = 1;
        p.forEach((d) => {
          d.x += d.v;
          if (d.x > w + d.l) { d.x = -d.l; d.y = hasard(ht * 0.45, ht); }
          c.globalAlpha = d.a;
          c.beginPath(); c.moveTo(d.x - d.l, d.y); c.lineTo(d.x, d.y); c.stroke();
        });
        c.globalAlpha = 0.75; c.strokeStyle = '#2a2a2a'; c.lineWidth = 1.5;
        oiseaux.forEach((o) => {
          o.x += o.v; if (o.x > o.fin) o.x = o.deb;
          c.globalAlpha = 0.75 * Math.max(0, Math.min(1, o.deb > 0 ? (o.x - o.deb) / (w * 0.04) : 1, o.fin < w ? (o.fin - o.x) / (w * 0.04) : 1));
          const b = Math.sin(t / 240 + o.x) * o.s * 0.5;
          c.beginPath(); c.moveTo(o.x - o.s, o.y + b); c.quadraticCurveTo(o.x - o.s * 0.4, o.y - 2, o.x, o.y); c.quadraticCurveTo(o.x + o.s * 0.4, o.y - 2, o.x + o.s, o.y + b); c.stroke();
        });
      }
      c.globalAlpha = 1;
    };
    raf = requestAnimationFrame(tour);
  }
  return { lancer, stop };
})();

/* ---------- mer de nuit : écran-titre et ouverture ---------- */
const DRAKKAR = '<g class="drakkar"><path d="M-92 0 C-70 26 66 26 92 -2 C100 -14 104 -26 98 -40 C92 -30 86 -18 74 -10 C30 2 -36 2 -74 -8 C-86 -16 -94 -30 -90 -44 C-98 -32 -100 -12 -92 0Z" fill="#0d0b09"/><rect x="-3" y="-92" width="5" height="92" fill="#0d0b09"/><path d="M-44 -86 Q0 -74 44 -86 L50 -24 Q0 -12 -50 -24Z" fill="#7b2f22"/><path d="M-30 -83 L-34 -21 M-10 -79 L-11 -17 M10 -79 L11 -17 M30 -83 L34 -21" stroke="#e3c79a" stroke-width="5" opacity=".55"/><path d="M-60 6 L-76 28 M-30 11 L-44 32 M0 12 L-12 34 M30 11 L20 32 M60 5 L50 27" stroke="#0d0b09" stroke-width="2"/></g>';
function merDeNuit() {
  const im = IM.img.titre;
  if (im) return '<div class="fond-titre" style="background-image:url(' + im + ')"></div>';
  let etoiles = '';
  for (let i = 0; i < 70; i++) etoiles += '<circle cx="' + (i * 97 % 1000) + '" cy="' + ((i * i * 13) % 250) + '" r="' + (0.5 + (i % 3) * 0.4) + '" fill="#fff" opacity="' + (0.25 + (i % 5) * 0.13) + '"/>';
  return '<svg class="fond-titre" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="nuit" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset=".7" stop-color="#16263a"/><stop offset="1" stop-color="#24404d"/></linearGradient><linearGradient id="auro" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#6fe0b0" stop-opacity="0"/><stop offset=".6" stop-color="#6fe0b0" stop-opacity=".32"/><stop offset="1" stop-color="#3f7fa8" stop-opacity="0"/></linearGradient></defs>' +
    '<rect width="1000" height="500" fill="url(#nuit)"/>' + etoiles +
    '<path class="auro a1" d="M-50 40 C180 -10 300 170 520 90 S820 10 1050 120 V230 C830 130 700 200 520 210 S200 120 -50 170Z" fill="url(#auro)"/><path class="auro a2" d="M-50 90 C200 30 380 200 610 110 S900 70 1050 60 V180 C900 190 760 230 600 220 S190 170 -50 220Z" fill="url(#auro)"/>' +
    '<g class="vague v1"><path d="M-400 345 q50 -14 100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 t100 0 V500 H-400Z" fill="#1a3442"/></g>' +
    '<g transform="translate(610 348)">' + DRAKKAR + '</g>' +
    '<g class="vague v2"><path d="M-400 372 q70 -18 140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 V500 H-400Z" fill="#12262f"/></g>' +
    '<g class="vague v3"><path d="M-400 418 q90 -20 180 0 t180 0 t180 0 t180 0 t180 0 t180 0 t180 0 t180 0 V500 H-400Z" fill="#0a161c"/></g></svg>';
}

/* ---------- cadre commun des séquences plein écran ---------- */
let cineFin = null;
function cine(html, derouler, fin) {
  const o = document.getElementById('cine');
  const minuteurs = []; let fini = false, raf = null;
  const attendre = (ms, f) => minuteurs.push(setTimeout(f, ms));
  const finir = () => {
    if (fini) return;
    fini = true; cineFin = null;
    minuteurs.forEach(clearTimeout); if (raf) cancelAnimationFrame(raf);
    o.classList.add('sort');
    setTimeout(() => { o.hidden = true; o.classList.remove('sort'); o.innerHTML = ''; if (fin) fin(); }, 240);
  };
  cineFin = finir;
  o.innerHTML = html + '<button class="passer" data-cine="passer">Passer ▸</button>';
  o.hidden = false;
  o.querySelector('.passer').focus({ preventScroll: true });
  derouler({ o, attendre, finir, anim: (f) => { const b = (t) => { if (!fini && f(t) !== false) raf = requestAnimationFrame(b); }; raf = requestAnimationFrame(b); } });
}
document.addEventListener('click', (ev) => { if (ev.target.closest('[data-cine="passer"]') && cineFin) cineFin(); });
document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && cineFin) cineFin(); });

/* ---------- ouverture : ne révèle rien du dossier ---------- */
function ouverture(fin) {
  if (!BOUGE) { fin(); return; }
  const cartes = [
    M.meta.question,
    'Tout le monde a une réponse. Des sagas, des cartes, des ruines dans l\'herbe. Des experts, et des gens qui jurent savoir.',
    'Une productrice vous confie le film. Vous avez ' + (M.meta.demi_journees / 2) + ' jours pour vous faire une opinion.',
    'Ce que vous montrerez, il faudra pouvoir le prouver.'
  ];
  Son.musique('theme');
  cine('<div class="ouverture">' + merDeNuit() + '<div class="voile"></div><p class="carton" aria-live="polite"></p></div>', ({ o, attendre, finir }) => {
    const p = o.querySelector('.carton');
    let t = 300;
    cartes.forEach((txt, i) => {
      attendre(t, () => { p.textContent = typo(txt); p.classList.remove('vu'); void p.offsetWidth; p.classList.add('vu'); Son.fx('souffle'); });
      t += i === 0 ? 3400 : 4200;
    });
    attendre(t, finir);
  }, fin);
}

/* ---------- carte de l'Atlantique Nord (écran Carte et voyages) ---------- */
const TERRES = [
  [[-168,66],[-156,71],[-125,70],[-95,72],[-80,73],[-65,62],[-78,62],[-82,52],[-78,56],[-65,60],[-56,52],[-66,48],[-60,46],[-70,43],[-75,38],[-81,31],[-80,25],[-84,30],[-97,28],[-97,20],[-90,21],[-88,16],[-83,10],[-78,8],[-85,10],[-95,16],[-105,20],[-115,31],[-122,37],[-125,48],[-135,58],[-150,60],[-165,55]],
  [[-78,8],[-72,12],[-60,9],[-50,0],[-35,-6],[-39,-16],[-48,-25],[-57,-36],[-65,-42],[-68,-54],[-74,-50],[-72,-30],[-71,-18],[-81,-5],[-78,2]],
  [[-53,60],[-42,60],[-22,70],[-18,76],[-30,78],[-70,78],[-68,72],[-52,66]],
  [[-24,65],[-14,66],[-14,64],[-22,63]],
  [[-56,52],[-53,47],[-59,47.5]],
  [[-5,50],[1,51],[-2,58],[-6,58]],
  [[-9,37],[-9,43],[-1,44],[-4,48],[3,51],[8,54],[9,57],[12,54],[20,55],[22,59],[17,61],[21,65],[14,65],[6,59],[5,62],[14,68],[26,71],[42,67],[68,69],[100,77],[140,72],[178,69],[170,60],[156,52],[140,54],[130,42],[122,40],[121,30],[110,20],[106,10],[100,13],[98,8],[103,2],[95,15],[90,22],[80,13],[77,8],[72,20],[62,25],[56,26],[50,30],[59,22],[52,16],[43,13],[35,28],[36,36],[27,37],[24,40],[22,37],[19,41],[13,45],[17,40],[12,38],[8,44],[3,43],[-1,37],[-6,36]],
  [[-6,36],[10,37],[11,33],[20,31],[32,31],[36,22],[43,12],[51,12],[40,-4],[38,-17],[33,-26],[20,-35],[14,-22],[12,-6],[9,4],[-8,5],[-17,14],[-13,27]],
  [[113,-22],[122,-18],[131,-12],[137,-16],[142,-11],[153,-27],[150,-37],[140,-38],[131,-32],[115,-34]],
  [[172.7,-34.5],[178,-38],[175,-41.5],[173,-39]],
  [[172,-41],[174,-42],[168,-46.5],[166.5,-45.5]],
  [[130,31],[136,34],[141,41],[140,36],[133,33]],
  [[95,5],[105,-5],[115,-8],[105,-7]],
  [[132,-2],[150,-10],[141,-9]]
];
const lonX = (l) => (l + 180) * 640 / 360, latY = (l) => (85 - l) / 170 * 302;
function fondCarte() {
  const im = IM.img.obj_mappemonde;
  const terres = im ? '<image href="' + im + '" width="640" height="302" preserveAspectRatio="none"/>' :
    '<rect width="640" height="302" fill="#8ca0be"/>' + TERRES.map((p) => '<polygon points="' + p.map((c) => lonX(c[0]).toFixed(1) + ',' + latY(c[1]).toFixed(1)).join(' ') + '" fill="#ead8b0" stroke="#5c3e22" stroke-width="1" stroke-linejoin="round"/>').join('');
  const oceans = [['Océan Pacifique', 72, 150], ['Océan Atlantique', 262, 132], ['Océan Indien', 462, 196], ['Océan Arctique', 400, 13], ['Océan Austral', 430, 250]]
    .map((o) => '<text x="' + o[1] + '" y="' + o[2] + '" text-anchor="middle">' + o[0] + '</text>').join('');
  const lettres = [['N', 0, -24], ['S', 0, 30], ['E', 28, 3], ['O', -28, 3]].map((l) => '<text x="' + l[1] + '" y="' + l[2] + '" text-anchor="middle">' + l[0] + '</text>').join('');
  const rose = '<g transform="translate(272 214)"><circle r="18" fill="#ead8b0" fill-opacity=".55" stroke="#5c3e22" stroke-width=".8"/><circle r="14" fill="none" stroke="#5c3e22" stroke-width=".4"/>' +
    '<path d="M0 -20 L3.5 -3.5 L20 0 L3.5 3.5 L0 20 L-3.5 3.5 L-20 0 L-3.5 -3.5Z" fill="#ead8b0" stroke="#5c3e22" stroke-width=".6"/>' +
    '<path d="M0 -20 L3.5 -3.5 L0 0Z M20 0 L3.5 3.5 L0 0Z M0 20 L-3.5 3.5 L0 0Z M-20 0 L-3.5 -3.5 L0 0Z" fill="#5c3e22"/>' +
    '<path d="M9 -9 L2 -2 L0 -4Z M9 9 L2 2 L4 0Z M-9 9 L-2 2 L0 4Z M-9 -9 L-2 -2 L-4 0Z" fill="#a07a48"/>' +
    '<g font-family="Georgia,serif" font-size="9" font-weight="700" fill="#2a3a55" stroke="#c6d2e2" stroke-width="1.6" paint-order="stroke">' + lettres + '</g></g>';
  return terres + '<g font-family="Georgia,serif" font-style="italic" font-size="9.5" letter-spacing=".6" fill="#2a3a55" stroke="#a9b9d0" stroke-width="1.6" paint-order="stroke">' + oceans + '</g>' + rose;
}
const coutTrajet = (a, b) => M.trajets[a + '|' + b] || M.trajets[b + '|' + a];
const courbe = (A, B) => 'M' + A.x + ' ' + A.y + ' Q' + ((A.x + B.x) / 2) + ' ' + ((A.y + B.y) / 2 + 26) + ' ' + B.x + ' ' + B.y;

/* ---------- voyage ---------- */
function voyage(deId, versId, fin) {
  if (!BOUGE) { fin(); return; }
  const A = VILLE[deId], B = VILLE[versId], duree = 3000;
  const svg = '<svg class="carte-voyage" viewBox="0 0 640 258" aria-hidden="true">' + fondCarte() +
    '<path id="v-route" d="' + courbe(A, B) + '" fill="none" stroke="#7b2f22" stroke-width="2.4" stroke-linecap="round"/>' +
    [A, B].map((v) => '<circle cx="' + v.x + '" cy="' + v.y + '" r="4.5" fill="#efe9d6" stroke="#22201c" stroke-width="1.5"/>' + etiquetteVille(v)).join('') +
    '<g id="v-avion"><path d="M14 0 L4 -3 L-2 -14 L-6 -14 L-3 -3 L-11 -2.5 L-14 -7 L-17 -7 L-15 0 L-17 7 L-14 7 L-11 2.5 L-3 3 L-6 14 L-2 14 L4 3Z" fill="#1c1a16" stroke="#fff" stroke-width=".6"/></g></svg>';
  cine('<div class="voyage"><p class="v-tete">' + h(A.nom) + ' → ' + h(B.nom) + '</p>' + svg + '<p class="v-pied muted">' + h(fmtDuree(coutTrajet(deId, versId))) + ' de voyage</p><div class="arrivee"><h2>' + h(B.nom) + '</h2><p>' + h(libelleTemps()) + '</p></div></div>', ({ o, attendre, finir, anim }) => {
    const route = o.querySelector('#v-route'), av = o.querySelector('#v-avion'), L = route.getTotalLength();
    route.style.strokeDasharray = L; route.style.strokeDashoffset = L;
    Son.ambiance(null); Son.musique(null); Son.fx('avion', duree / 1000);
    const t0 = performance.now();
    anim((t) => {
      const u = Math.min((t - t0) / duree, 1), e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
      const p = route.getPointAtLength(L * e), q = route.getPointAtLength(Math.min(L * e + 1, L));
      const ang = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
      const ech = 0.55 + 0.3 * Math.sin(u * Math.PI);
      av.setAttribute('transform', 'translate(' + p.x + ' ' + p.y + ') rotate(' + (u >= 1 ? 180 * (B.x < A.x) : ang) + ') scale(' + ech + ')');
      route.style.strokeDashoffset = L * (1 - e);
      return u < 1;
    });
    attendre(duree + 100, () => { o.querySelector('.arrivee').classList.add('vu'); Son.fx('jour'); });
    attendre(duree + 1900, finir);
  }, fin);
}

/* ---------- le temps passe : lecture ---------- */
function lecture(fin) {
  if (!BOUGE) { fin(); return; }
  cine('<div class="lecture"><svg viewBox="0 0 100 100" class="pendule" aria-hidden="true"><circle cx="50" cy="50" r="44" fill="#efe6cf" stroke="#3a3327" stroke-width="3"/><g stroke="#3a3327" stroke-width="2"><path d="M50 10v7M50 83v7M10 50h7M83 50h7"/></g><path class="aig g" d="M50 50V22" stroke="#22201c" stroke-width="3" stroke-linecap="round"/><path class="aig p" d="M50 50V32" stroke="#7b2f22" stroke-width="4" stroke-linecap="round"/></svg><p>Vous passez la demi-journée à lire…</p></div>', ({ attendre, finir }) => {
    Son.fx('page');
    attendre(650, () => Son.fx('page'));
    attendre(1400, finir);
  }, fin);
}

/* ---------- projection du film ---------- */
function projection(f, fin) {
  if (!BOUGE) { fin(); return; }
  const mots = M.fiche.liens.mots;
  const etapes = [];
  f.chapitres.forEach((ch, ci) => {
    etapes.push({ k: 'titre', sur: 'Chapitre ' + (ci + 1), t: ch.titre, ms: 2000 });
    ch.seqs.forEach((s, i) => {
      const a = AFF[s.aff], l = ch.liens[i] ? mots.find((w) => w.id === ch.liens[i].mot) : null;
      etapes.push({ k: 'seq', sur: 'Séquence ' + (i + 1), t: a.texte, sous: 'Vous affirmez : ' + STAT[s.statut].label, pcs: s.pieces.map((id) => PIECE[id].titre), ms: 2400 + 400 * Math.min(s.pieces.length, 3) });
      if (l) etapes.push({ k: 'mot', t: l.label, ms: 800 });
    });
    etapes.push({ k: 'seq', sur: 'En conclusion de ce chapitre', t: ch.c.texte, sous: '', pcs: [], ms: 3200 });
  });
  etapes.push({ k: 'seq', sur: 'Conclusion du documentaire', t: f.c.texte, sous: '', pcs: [], ms: 4400 });
  etapes.push({ k: 'mot', t: 'Fin', ms: 1200 });
  cine('<div class="film"><div class="grain"></div><div class="ecran-film" aria-live="polite"></div></div>', ({ o, attendre, finir }) => {
    const e = o.querySelector('.ecran-film');
    Son.ambiance(null); Son.musique(null); Son.projecteur(true);
    [3, 2, 1].forEach((n, i) => attendre(i * 800, () => {
      e.innerHTML = '<div class="amorce"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="none" stroke="#efe7d6" stroke-width="1.5"/><circle cx="50" cy="50" r="36" fill="none" stroke="#efe7d6" stroke-width="1.5"/><path d="M50 0V100M0 50H100" stroke="#efe7d6" stroke-width=".6"/><circle class="balaye" cx="50" cy="50" r="23" fill="none" stroke="#efe7d6" stroke-opacity=".3" stroke-width="46" pathLength="100" transform="rotate(-90 50 50)"/></svg><b>' + n + '</b></div>';
      Son.fx('compte');
    }));
    let t = 2500;
    etapes.forEach((x) => {
      attendre(t, () => {
        e.innerHTML = x.k === 'mot' ? '<p class="f-mot">' + T(x.t) + '</p>' : x.k === 'titre' ? '<div class="f-seq"><p class="f-sur">' + T(x.sur) + '</p><p class="f-mot">' + T(x.t) + '</p></div>' :
          '<div class="f-seq"><p class="f-sur">' + T(x.sur) + '</p><p class="f-t">' + T(x.t) + '</p>' + (x.sous ? '<p class="f-sous">' + T(x.sous) + '</p>' : '') +
          (x.pcs.length ? '<ul class="f-pcs">' + x.pcs.map((p) => '<li>' + T(p) + '</li>').join('') + '</ul>' : '') + '</div>';
        Son.fx(x.k === 'mot' ? 'coupe' : 'souffle');
      });
      t += x.ms;
    });
    attendre(t, finir);
  }, () => { Son.projecteur(false); fin(); });
}

/* ---------- petits gestes ---------- */
function banniere(txt) {
  const b = document.getElementById('banniere');
  b.textContent = typo(txt);
  b.classList.remove('on');
  if (!BOUGE) return;
  void b.offsetWidth; b.classList.add('on');
  Son.fx('jour');
}
let attentePiece = 0;
function volPiece(titre) {
  const cible = document.querySelector('nav button[data-e="dossier"]');
  if (!cible) return;
  const pulse = () => { Son.fx('piece'); cible.classList.remove('pulse'); void cible.offsetWidth; cible.classList.add('pulse'); };
  if (!BOUGE) { pulse(); return; }
  const delai = attentePiece; attentePiece += 450;
  setTimeout(() => {
    attentePiece = Math.max(0, attentePiece - 450);
    const d = document.createElement('div');
    d.className = 'vol'; d.textContent = typo(titre);
    document.body.appendChild(d);
    const r = d.getBoundingClientRect(), c = cible.getBoundingClientRect();
    const dx = c.left + c.width / 2 - (r.left + r.width / 2), dy = c.top + c.height / 2 - (r.top + r.height / 2);
    Son.fx('tampon');
    d.animate([
      { transform: 'translate(-50%,-50%) scale(1.25) rotate(-3deg)', opacity: 0, offset: 0 },
      { transform: 'translate(-50%,-50%) scale(1) rotate(-3deg)', opacity: 1, offset: 0.14 },
      { transform: 'translate(-50%,-50%) scale(1) rotate(-3deg)', opacity: 1, offset: 0.58 },
      { transform: 'translate(calc(-50% + ' + dx + 'px),calc(-50% + ' + dy + 'px)) scale(.15) rotate(8deg)', opacity: 0.2, offset: 1 }
    ], { duration: 1500, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = () => { d.remove(); pulse(); };
  }, delai);
}

/* ---------- portraits de secours, tant que les images ne sont pas fournies ---------- */
const BUSTES = {
  helene: { peau: '#e2bfa3', veste: '#5b2b40', col: '#e9e1d2', ch: '#8f8a84', coupe: 'carre', lun: 1 },
  montclair: { peau: '#dcb08d', veste: '#a98a55', col: '#3d2f1b', ch: '#3a2a1c', coupe: 'soigne', ech: '#c9962e' },
  lenoir: { peau: '#d9ad90', veste: '#7f3423', col: '#2a1c15', ch: '#2c2019', coupe: 'hirsute', barbe: 1 },
  penhallow: { peau: '#e6cdb8', veste: '#384b5e', col: '#d7d0be', ch: '#e4e0d8', coupe: 'degarni', lun: 1, cravate: '#6d2e2a' },
  adler: { peau: '#c79a78', veste: '#27594e', col: '#e7e1cf', ch: '#2a211b', coupe: 'chignon', lun: 1 },
  pike: { peau: '#d8a988', veste: '#4d6a2a', col: '#37481d', ch: '#6d4a2c', coupe: 'queue', capuche: 1 },
  whitaker: { peau: '#dfb898', veste: '#6a5a2f', col: '#e4dcc8', ch: '#b9b4a8', coupe: 'degarni' },
  holm: { peau: '#ecd2bd', veste: '#2c4154', col: '#d7d0be', ch: '#d0b98a', coupe: 'chignon', lun: 1 },
  hanley: { peau: '#d9a884', veste: '#55613a', col: '#2e3320', ch: '#8d7a5c', coupe: 'soigne', barbe: 1 },
  sigrun: { peau: '#eed7c5', veste: '#4d3f5e', col: '#e7e1cf', ch: '#c9c5bd', coupe: 'chignon' },
  aksoy: { peau: '#cf9f7c', veste: '#7a4a2f', col: '#e7e1cf', ch: '#1f1814', coupe: 'carre' },
  murat: { peau: '#c99872', veste: '#8a6a1f', col: '#efe9d6', ch: '#2c2019', coupe: 'soigne', ech: '#a32929' },
  aagaard: { peau: '#caa07e', veste: '#2f5a6b', col: '#e7e1cf', ch: '#e4e0d8', coupe: 'hirsute', barbe: 1 },
  mose: { peau: '#9c6a4a', veste: '#2f6b4f', col: '#e7e1cf', ch: '#15100c', coupe: 'chignon', lun: 1 },
  chiara: { peau: '#e0bda0', veste: '#6a2433', col: '#e9e1d2', ch: '#2a1c15', coupe: 'chignon', ech: '#c9a85a' },
  fergus: { peau: '#e2b89a', veste: '#3f5f4a', col: '#e7e1cf', ch: '#a8552f', coupe: 'hirsute', barbe: 1 },
  morag: { peau: '#e8d4c4', veste: '#55555f', col: '#d7d0be', ch: '#8f8a84', coupe: 'carre', lun: 1 },
  elin: { peau: '#ecd2bd', veste: '#3a5866', col: '#e7e1cf', ch: '#c9b58a', coupe: 'queue' }
};
function buste(id) {
  const b = BUSTES[id] || BUSTES.helene;
  const cheveux = {
    carre: '<path d="M60 92 C56 44 144 44 140 92 L144 122 C136 128 130 124 130 112 C130 84 70 84 70 112 C70 124 64 128 56 122Z" fill="' + b.ch + '"/>',
    soigne: '<path d="M64 86 C60 46 140 44 137 84 C126 66 92 76 76 70 C70 74 67 80 64 86Z" fill="' + b.ch + '"/>',
    hirsute: '<path d="M60 88 C50 72 62 62 66 58 C70 44 88 50 94 44 C106 42 114 48 122 48 C136 52 148 72 139 90 C132 70 118 72 100 72 C86 72 70 72 60 88Z" fill="' + b.ch + '"/>',
    degarni: '<path d="M62 92 C58 76 66 66 74 62 C72 74 68 82 68 94Z M138 92 C142 76 134 66 126 62 C128 74 132 82 132 94Z" fill="' + b.ch + '"/>',
    chignon: '<circle cx="100" cy="42" r="17" fill="' + b.ch + '"/><path d="M64 88 C60 50 140 50 136 88 C126 68 74 68 64 88Z" fill="' + b.ch + '"/>',
    queue: '<path d="M64 86 C60 48 140 48 136 86 C126 68 74 70 64 86Z M134 76 C152 88 150 122 140 136 C140 112 134 98 130 88Z" fill="' + b.ch + '"/>'
  }[b.coupe];
  return '<svg class="buste" viewBox="0 0 200 200" aria-hidden="true"><rect width="200" height="200" fill="#2a241b"/><circle cx="100" cy="80" r="86" fill="' + b.veste + '" opacity=".18"/>' +
    (b.capuche ? '<path d="M46 150 C40 60 160 60 154 150Z" fill="' + b.veste + '"/>' : '') +
    '<path d="M26 200 C30 150 66 132 100 132 C134 132 170 150 174 200Z" fill="' + b.veste + '"/><path d="M82 132 L100 164 L118 132 C108 128 92 128 82 132Z" fill="' + b.col + '"/>' +
    (b.cravate ? '<path d="M96 146 L104 146 L108 190 L100 198 L92 190Z" fill="' + b.cravate + '"/>' : '') +
    (b.ech ? '<path d="M76 134 C90 150 112 150 126 134 L132 148 C112 164 90 164 70 148Z" fill="' + b.ech + '"/>' : '') +
    '<rect x="88" y="112" width="24" height="26" rx="8" fill="' + b.peau + '" filter="brightness(.9)"/><ellipse cx="100" cy="90" rx="35" ry="41" fill="' + b.peau + '"/>' +
    (b.barbe ? '<path d="M66 96 C66 140 134 140 134 96 C130 112 118 110 100 110 C82 110 70 112 66 96Z" fill="' + b.ch + '"/>' : '') + cheveux +
    '<g class="yeux" fill="#1d1712"><ellipse cx="86" cy="88" rx="3.4" ry="3.8"/><ellipse cx="114" cy="88" rx="3.4" ry="3.8"/></g><path d="M78 79 q8 -4 15 0 M107 79 q7 -4 15 0" stroke="#2a1c15" stroke-width="2.2" fill="none"/><path d="M100 92 q-4 10 0 13" stroke="#000" stroke-opacity=".3" fill="none" stroke-width="1.6"/><path class="bouche" d="M90 116 q10 4 20 0" stroke="#6a2f25" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
    (b.lun ? '<g fill="#fff" fill-opacity=".12" stroke="#15120e" stroke-width="2.2"><circle cx="86" cy="88" r="11"/><circle cx="114" cy="88" r="11"/><path d="M97 88h6" fill="none"/></g>' : '') + '</svg>';
}
function portrait(id) {
  const im = IM.img['portrait_' + id];
  return im ? '<img class="buste" src="' + im + '" alt="">' : buste(id);
}
