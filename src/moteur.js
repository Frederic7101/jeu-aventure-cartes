"use strict";
const IM = JSON.parse(document.getElementById('images').textContent);
const KEY = 'duel-cartes-ch1-v1', KEY_VUS = 'duel-cartes-repliques-v1';
const h = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const typo = (s) => String(s).replace(/ ([?!:;»])/g, ' $1').replace(/« /g, '« ');
const T = (s) => h(typo(s));
const $ = (id) => document.getElementById(id);

/* ---------- état ---------- */
function vide() {
  return { ecran: 'intro', lieu: 'redaction', inv: ['cafe'], f: {}, pas: 0, seq: [], prises: 2, early: 0, film: 0, essais: 0, cases: { croit: null, verif: null, inc: null }, fin: null, vrai: 0, vraiOk: 0 };
}
let S = vide();
let sel = null, zones = false, carnetOuvert = false, reglages = false;
try { const t = localStorage.getItem(KEY); if (t) { const o = JSON.parse(t); if (o && Array.isArray(o.inv)) { S = Object.assign(vide(), o); if (!['lieu', 'intro', 'plan'].includes(S.ecran)) S.ecran = 'lieu'; } } } catch (e) { /* stockage indisponible */ }
let vus = new Set();
try { vus = new Set(JSON.parse(localStorage.getItem(KEY_VUS) || '[]')); } catch (e) { /* idem */ }
function sauver() { try { localStorage.setItem(KEY, JSON.stringify(S)); localStorage.setItem(KEY_VUS, JSON.stringify([...vus])); } catch (e) { /* idem */ } }
const a = (o) => S.inv.includes(o);
const ajoute = (o) => { if (!a(o)) { S.inv.push(o); Son.fx('piece'); } };
const retire = (o) => { S.inv = S.inv.filter((x) => x !== o); if (sel === o) sel = null; };
const totalRepliques = () => Object.values(D).reduce((n, l) => n + l.filter((x) => x[0] !== 'd').length, 0);

/* ---------- portraits ---------- */
const QUI = {
  S: { nom: 'Sacha', img: 'portrait_sacha', couleur: '#3f5f7a' }, H: { nom: 'Hélène', img: 'portrait_helene', couleur: '#7a3b52' }, O: { nom: 'Hélène, dans l\'oreillette', img: 'portrait_helene', couleur: '#7a3b52', o: 1 },
  M: { nom: 'Montclair', img: 'portrait_montclair', couleur: '#a98a55' }, B: { nom: 'Bruno', img: 'portrait_bruno', couleur: '#55606b' },
  L: { nom: 'Lenoir', img: 'portrait_lenoir', couleur: '#7f3423' }, K: { nom: 'M. Lacote', img: 'portrait_lacote', couleur: '#5f5f6b' }
};
const INIT = { S: 'S', B: 'B', K: 'L' };
function vignette(q) {
  const p = QUI[q];
  if (p.img && IM.img[p.img]) return '<img src="' + IM.img[p.img] + '" alt="">';
  return '<span class="init" style="background:' + p.couleur + '">' + (INIT[q] || p.nom[0]) + '</span>';
}

/* ---------- dialogues ---------- */
let enCours = null;
let plateauOuverture = false;
const IMG_LIGNE = { 'placard_ouvert#0': 'objet_bertha', 'r_bertha_vide#0': 'objet_bertha', 'r_bertha_ok#0': 'objet_bertha' };
function dire(cle, ensuite) {
  const lignes = (D[cle] || []).map((l, i) => ({ q: l[0], t: l[1], id: cle + '#' + i }));
  enCours = { lignes, i: 0, ensuite };
  afficheLigne();
}
function afficheLigne() {
  const e = enCours, d = $('dlg');
  if (!e || e.i >= e.lignes.length) {
    d.hidden = true; $('dlgfond').hidden = true;
    const f = e && e.ensuite; enCours = null;
    sauver();
    if (f) f(); else rendre();
    return;
  }
  const l = e.lignes[e.i];
  $('dlgfond').hidden = false; d.hidden = false;
  if (l.q !== 'd') vus.add(l.id);
  Son.fx(l.q === 'd' ? 'souffle' : 'frappe');
  d.className = 'dlg' + (l.q === 'd' ? ' didas' : '') + (l.q === 'O' ? ' oreille' : '');
  const illus = IM.img[IMG_LIGNE[l.id]];
  d.innerHTML = l.q === 'd' ? (illus ? '<div class="qui objet"><img src="' + illus + '" alt=""></div>' : '') + '<p>' + T(l.t) + '</p><span class="suite">▸</span>' :
    '<div class="qui">' + vignette(l.q) + '</div><div class="txt"><strong>' + T(QUI[l.q].nom) + '</strong><p>' + T(l.t) + '</p></div><span class="suite">▸</span>';
}
function suivant() { if (enCours) { enCours.i++; afficheLigne(); } }
function menu(titre, items) {
  const liste = items.filter((x) => !x.si || x.si());
  const d = $('dlg');
  $('dlgfond').hidden = false; d.hidden = false;
  d.className = 'dlg menu';
  d.innerHTML = (titre ? '<strong>' + T(titre) + '</strong>' : '') + liste.map((x, i) => '<button data-m="' + i + '">' + T(x.t) + '</button>').join('');
  d.onclick = (ev) => {
    const b = ev.target.closest('[data-m]'); if (!b) return;
    d.onclick = null; d.hidden = true; $('dlgfond').hidden = true;
    Son.fx('clic');
    liste[+b.dataset.m].f();
  };
  const b0 = d.querySelector('button'); if (b0) b0.focus({ preventScroll: true });
}
$('dlgfond').addEventListener('click', suivant);
$('dlg').addEventListener('click', () => { if (enCours) suivant(); });
document.addEventListener('keydown', (ev) => {
  if (enCours && (ev.key === ' ' || ev.key === 'Enter')) { ev.preventDefault(); suivant(); return; }
  if (!enCours && (ev.key === 'Enter' || ev.key === ' ') && ev.target.classList && ev.target.classList.contains('hot')) { ev.preventDefault(); clicHot(ev.target.dataset.id); }
});

/* ---------- le fil de Montclair ---------- */
const FIL = [[2, 'En route vers la VÉRITÉ. Merci à mon écharpe.', 'fil2'], [5, 'Je vais rencontrer quelqu\'un qu\'ON ne veut PAS que vous rencontriez.', 'fil5'], [8, 'Cet homme a tout compris. Il est d\'accord avec moi.', 'fil8'], [11, 'On m\'a dit qu\'il y avait un parchemin mystère. Je n\'en dirai pas plus. J\'en dirai plus demain.', 'fil11']];
function avance(n) {
  S.pas += n;
  const t = FIL.filter((x) => S.pas >= x[0] && !S.f['fil' + x[0]]).pop();
  FIL.forEach((x) => { if (S.pas >= x[0]) S.f['fil' + x[0]] = 1; });
  if (t) {
    vus.add(t[2] + '#0');
    const e = $('fil');
    e.innerHTML = '<strong>📱 Valère Montclair</strong><p>' + T(t[1]) + '</p><em>🎧 ' + T(D[t[2]][0][1]) + '</em>';
    e.classList.remove('on'); void e.offsetWidth; e.classList.add('on');
    Son.fx('epingle');
    clearTimeout(avance.t); avance.t = setTimeout(() => e.classList.remove('on'), 7000);
  }
}
function toast(m) { const t = $('toast'); t.textContent = typo(m); t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 3200); }
function filme(id) {
  if (S.seq.includes(id)) return;
  S.seq.push(id); avance(1); Son.fx('coupe');
  toast('Séquence filmée : ' + SEQ[id].nom);
}

/* ---------- les lieux ---------- */
const LIEUX = {
  redaction: { nom: 'La rédaction', son: 'redaction', img: 'scene_redaction' },
  librairie: { nom: 'Le sous-sol de Lenoir', son: 'librairie', img: 'scene_librairie' },
  salle: { nom: 'La salle des cartes', son: 'bibliotheque', img: 'scene_salle_cartes' }
};
function zonesDe(l) {
  const f = S.f;
  if (l === 'redaction') return [
    ['plante', 'La plante', 0, 0, 330, 300], ['eiffel', 'La tour Eiffel', 410, 205, 60, 135], ['affiche', 'L\'affiche', 785, 52, 213, 316],
    ['petit_ecran', 'Le petit écran', 355, 408, 115, 85], ['ecran', 'Le grand écran', 10, 465, 280, 250], ['boitier', 'L\'enceinte', 285, 555, 80, 170],
    ['telecommande', 'La console', 120, 715, 215, 115], ['casque', 'Le casque', 0, 748, 145, 85], ['crayons', 'Le pot à crayons', 365, 665, 60, 85],
    ['magazines', 'Les magazines', 800, 485, 95, 70], ['placard', 'Le caisson', 636, 568, 84, 182], ['classeurs', 'Les classeurs', 1225, 225, 300, 120],
    ['helene', 'Hélène Vasseur', 1255, 345, 230, 255]
  ];
  if (l === 'librairie') return [
    ['lenoir', 'Gaspard Lenoir', 315, 90, 400, 720], ['carte', 'La carte aux fils rouges', 75, 100, 240, 500], ['micro', 'Le micro', 720, 290, 110, 240],
    ['ordi', 'L\'ordinateur', 1125, 565, 200, 140], ['mixage', 'La table de mixage', 1020, 705, 300, 65], ['casque_l', 'Le casque', 1330, 675, 155, 90],
    ['pot_l', 'Le pot à stylos', 480, 795, 120, 210], ['livres', 'Les livres', 0, 480, 170, 540], ['cartons', 'Les cartons', 1110, 115, 230, 110],
    ['lampes', 'La lampe', 895, 0, 170, 165]
  ].concat(f.lenoirApres ? [['serviette', 'La serviette signée', 820, 420, 130, 110]] : []);
  const z = [['comptoir', 'Le comptoir et ses molettes', 955, 500, 581, 345], ['panneau', 'Le panneau', 1140, 65, 345, 375], ['pot', 'Le pot à stylos', 1435, 455, 80, 110],
    ['meuble', 'Les meubles à plans', 0, 230, 320, 470], ['lampe', 'La lampe verte', 305, 365, 270, 340], ['table', 'La table', 0, 705, 1055, 255], ['lacote', 'M. Lacote', 1345, 320, 184, 580]];
  if (f.mcIci && !f.mcParti) z.push(['montclair', 'Valère Montclair', 545, 240, 300, 465], ['bruno', 'Bruno', 1068, 293, 315, 722]);
  return z;
}

/* ---------- actions sur les points ---------- */
function rencontre(cle) { dire(cle); }
const SIMPLE = { eiffel: 1, plante: 1, affiche: 1, magazines: 1, crayons: 1, casque: 1, petit_ecran: 1, boitier: 1, micro: 1, casque_l: 1, pot_l: 1, livres: 1, cartons: 1, lampes: 1, ordi: 1, serviette: 1 };
const ALIAS = { pot: 'sc_pot', meuble: 'sc_meuble', lampe: 'sc_lampe', panneau: 'sc_panneau' };
/* Ce qui se trouve dans le décor et peut se prendre (ou qu'on peut essayer de prendre). */
const PRENABLE = {
  crayons: { voir: () => dire(S.f.styloPris ? 'crayons_vide' : 'crayons'), prendre: () => { if (S.f.styloPris) return dire('crayons_vide'); dire('stylo_pris', () => { S.f.styloPris = 1; ajoute('stylo'); rendre(); }); } },
  telecommande: { voir: () => dire(a('telecommande') || S.f.berthaOk ? 'console_vide' : 'console_r'), prendre: () => clicConsole() },
  placard: { voir: () => dire(S.f.bertha ? 'placard_vide' : 'placard_ferme'), prendre: () => clicPlacard() },
  mixage: { voir: () => dire(S.f.usb ? 'table_mixage' : 'mixage_r'), prendre: () => clicMixage() },
  magazines: { voir: () => dire('magazines'), prendre: () => dire('mag_prendre') },
  pot: { voir: () => dire('sc_pot'), prendre: () => dire('pot_prendre') },
  pot_l: { voir: () => dire('pot_l'), prendre: () => dire('pot_l_prendre') }
};
function clicHot(id) {
  if (enCours) return;
  if (sel) { const o = sel; sel = null; utiliser(o, id); return; }
  Son.fx('clic');
  if (PRENABLE[id]) {
    const z = zonesDe(S.lieu).find((p) => p[0] === id), P = PRENABLE[id];
    return menu(z ? z[1] : '', [{ t: '👁 Regarder', f: P.voir }, { t: '✋ Prendre', f: P.prendre }, { t: 'Laisser', f: rendre }]);
  }
  if (SIMPLE[id]) return dire(id);
  if (ALIAS[id]) return dire(ALIAS[id]);
  ({ helene: parleHelene, montclair: parleMontclair, ecran: clicEcran, telecommande: clicConsole, classeurs: clicClasseurs, placard: clicPlacard,
    lenoir: parleLenoir, carte: ouvreFils, mixage: clicMixage, lacote: parleLacote, comptoir: clicComptoir, table: clicTable, bruno: parleBruno }[id] || (() => {}))();
}
const USE = {
  'cle>placard': ouvrePlacard, 'telecommande>ecran': clicEcran, 'bertha>ecran': filmeEcran, 'telecommande>bertha': allumeBertha, 'bertha>telecommande': allumeBertha,
  'bertha>lenoir': () => { if (S.f.lenoirOk) dire('deja_filme'); else montreBertha(); }, 'bertha>carte': () => { if (!S.f.lenoirOk) return parleLenoir(); filmeFils(); },
  'usb>montclair': () => { if (S.lieu === 'salle') solA(); else dire('x_defaut1'); }, 'bertha>table': clicTable,
  'coupure>helene': 'x_coupure_h', 'coupure>montclair': 'x_coupure_mc', 'coupure>lacote': 'x_coupure_k', 'coupure>lenoir': () => parleLenoir(),
  'cafe>bertha': 'x_cafe_bertha', 'bertha>cafe': 'x_cafe_bertha', 'cafe>montclair': 'x_cafe_mc', 'cafe>carte': 'x_cafe_fils',
  'telecommande>montclair': 'x_tel_mc', 'telecommande>lenoir': 'x_tel_l', 'telecommande>lacote': 'x_tel_k', 'bertha>eiffel': 'x_bertha_eiffel', 'bertha>montclair': 'mc_bertha',
  'gants>table': () => clicTable(), 'cafe>helene': () => donneCafe('x_cafe_h'), 'cafe>bruno': () => donneCafe('x_cafe_b'), 'cafe>lenoir': 'x_cafe_l', 'cafe>lacote': () => donneCafe('x_cafe_k'), 'bertha>lacote': 'x_bertha_k', 'gants>montclair': 'x_gants_mc', 'stylo>panneau': 'x_stylo_panneau', 'usb>lenoir': 'x_usb_l', 'usb>lacote': 'x_usb_k', 'stylo>plante': 'x_plante', 'cafe>plante': 'x_plante'
};
function utiliser(o, id) {
  const u = USE[o + '>' + id];
  if (typeof u === 'function') return u();
  if (u) return dire(u);
  rendre();
  // Utiliser un objet sur quelqu'un revient à le lui donner : la personne refuse.
  if (['helene', 'montclair', 'lenoir', 'lacote', 'bruno'].includes(id)) return dire('x_refus_' + id);
  dire('x_defaut' + (1 + Math.floor(Math.random() * 3)));
}
function donneCafe(cle) { dire(cle, () => { retire('cafe'); rendre(); }); }
function clicObjet(o) {
  if (enCours) return;
  Son.fx('clic');
  if (sel && sel !== o) { const a1 = sel; sel = null; rendre(); return utiliser(a1, o); }
  if (sel === o) { sel = null; return rendre(); }
  menu(OBJETS[o][1], [
    { t: '👁 Regarder', f: () => regarde(o) },
    { t: '🖐 Utiliser sur…', f: () => { sel = o; rendre(); toast('Cliquez sur ce qui doit recevoir l\'objet. Cliquez de nouveau dessus pour annuler.'); } },
    { t: 'Laisser', f: rendre }
  ]);
}
function regarde(o) {
  if (o === 'coupure') return lireCoupure();
  if (o === 'bertha') return dire(S.f.berthaOk ? 'r_bertha_ok' : 'r_bertha_vide');
  dire('r_' + o);
}
function lireCoupure() {
  const v = $('visio'), txt = D.coupure_trouvee[0][1].replace(/^« ?| ?»$/g, '');
  v.innerHTML = '<div class="visio-barre"><strong>Coupure de presse</strong><span class="bt"><button data-a="visio_fermer" id="visio-fermer">Fermer</button></span></div>' +
    '<div class="visio-cadre"><article class="coupure"><p>' + T(txt) + '</p></article></div><p class="small muted">' + T('Trouvée au bord de la carte aux fils rouges, chez Lenoir.') + '</p>';
  v.hidden = false; rendre(); $('visio-fermer').focus();
}

/* --- rédaction --- */
function parleHelene() {
  const f = S.f;
  if (f.ruses !== 3) return dire('he_attend');
  if (!f.cleDonnee) return dire('he_cle', () => { f.cleDonnee = 1; ajoute('cle'); rendre(); });
  if (!a('bertha') && !f.bertha) return dire('he_bertha');
  if (!f.berthaOk) return dire('he_piles');
  if (S.seq.length < 3) return dire('he_manque');
  dire('he_pret', () => menu('', [{ t: '« Allons au montage. »', f: lanceMontage }, { t: '« Pas encore, je retourne chercher. »', f: rendre }]));
}
// Montclair n'apparaît que dans la salle des cartes : on l'y rencontre, on peut le questionner (et le flatter).
function parleMontclair() { menuSalleMc(); }
function questionsMc() {
  menu('', [
    { t: '« Votre film est très convaincant. Comment travaillez-vous ? »', f: () => dire('mc_a', () => { S.f.flatte = 1; questionsMc(); }) },
    { t: '« D\'où tenez-vous ce que vous dites ? »', f: () => dire('mc_b', questionsMc) },
    { t: '« Avez-vous fait expertiser l\'encre de la carte ? »', f: () => dire('mc_c', questionsMc) },
    { t: '« Vous avez lu le dossier ? »', f: () => dire('mc_sc', questionsMc) },
    { t: '« Jolie écharpe. »', f: () => dire('mc_d', questionsMc) },
    { t: 'Assez parlé', f: menuSalleMc }
  ]);
}
function clicConsole() {
  if (a('telecommande') || S.f.berthaOk) return dire('telecommande_deja');
  dire('telecommande_prise', () => { ajoute('telecommande'); rendre(); });
}
function clicEcran() {
  const vu = (S.f.trouvees || 0) >= 3 ? 'ecran_vu' : 'ecran_vu2';
  if (S.f.berthaOk) return dire(S.seq.includes('ruses') ? 'ecran_sans_piles' : vu);
  if (!a('telecommande')) return dire('ecran_sans');
  if (S.f.ruses === 3) return dire(vu);
  S.ecran = 'film'; S.f.pause = false; rendre();
  dire('film_intro');
}
function filmeEcran() {
  if (!S.f.berthaOk || S.f.ruses !== 3) return dire('pas_bertha');
  if (S.seq.includes('ruses')) return dire('deja_filme');
  dire('film_ruses', () => { filme('ruses'); rendre(); });
}
function clicClasseurs() {
  if (S.f.date1957 && S.f.classeurs) return dire('classeurs_vu');
  dire('classeurs', () => { S.f.date1957 = 1; S.f.classeurs = 1; avance(1); toast('Noté dans le carnet : 1957'); rendre(); });
}
function clicPlacard() {
  if (S.f.bertha) return dire('placard_vide');
  if (a('cle')) return ouvrePlacard();
  dire('placard_ferme');
}
function ouvrePlacard() {
  if (!a('cle')) return dire('placard_ferme');
  dire('placard_ouvert', () => { S.f.bertha = 1; retire('cle'); ajoute('bertha'); rendre(); });
}
function allumeBertha() {
  if (S.f.berthaOk) return dire('deja_filme');
  if (!a('telecommande') || !a('bertha')) return dire('bertha_vide');
  dire('bertha_on', () => { S.f.berthaOk = 1; Son.fx('horloge'); avance(1); dire('he_pistes', () => { S.f.pistes = 1; rendre(); }); });
}

/* --- le sous-sol --- */
function parleLenoir() {
  if (!S.f.lenoirOk) return dire('le_camera', () => menu('', [{ t: 'Lui montrer Bertha', f: montreBertha }, { t: '« Et avec mon téléphone ? »', f: () => dire('le_tel', parleLenoir) }, { t: 'Reculer lentement', f: rendre }]));
  menuLenoir();
}
function montreBertha() { dire('le_bertha', () => { S.f.lenoirOk = 1; avance(1); menuLenoir(); }); }
function menuLenoir() {
  const lui = () => S.seq.includes('casier') || S.seq.includes('dates');
  menu('', [
    { t: 'Filmer tout de suite ce qu\'il dit du marchand', si: () => S.f.coupure && !lui(), f: () => dire('casier', () => { filme('casier'); menuLenoir(); }) },
    { t: 'Lui opposer les dates, caméra allumée', si: () => S.f.coupure && !lui(), f: () => dire('dates', () => { S.f.datesOpposees = 1; filme('dates'); menuLenoir(); }) },
    { t: 'Filmer la carte aux fils rouges', si: () => S.f.carteVue && !S.seq.includes('fils'), f: filmeFils },
    { t: '« Vous parlez du Japon et de la Polynésie. Sur quoi vous appuyez-vous ? »', f: () => dire('japon', menuLenoir) },
    { t: '« Si vous aviez raison, que devrait-on trouver ? »', si: () => S.f.datesOpposees, f: () => dire('preuve', menuLenoir) },
    { t: 'Examiner encore la pièce', f: rendre }
  ]);
}
function filmeFils() { if (S.seq.includes('fils')) return dire('deja_filme'); dire('film_fils', () => { filme('fils'); rendre(); }); }
function clicMixage() {
  if (a('usb') || S.f.usb) return dire('table_mixage');
  dire('cle_usb', () => { S.f.usb = 1; ajoute('usb'); rendre(); });
}
function ouvreFils() { S.f.carteVue = 1; S.ecran = 'fils'; Son.fx('fil'); rendre(); }
const EPINGLES = [[553, 162, 'epingle112'], [1421, 219, 'epingle112'], [600, 107, 'epingle87'], [136, 456, 'epingle112'], [855, 176, 'epingle112'], [544, 490, 'epingle87']];
function clicEpingle(i) {
  if (enCours) return;
  Son.fx('epingle');
  if (i === 'coupure') {
    if (S.f.coupure) return toast('Vous avez déjà la coupure.');
    return dire('coupure_trouvee', () => { S.f.coupure = 1; S.f.date1957 = 1; ajoute('coupure'); avance(1); rendre(); });
  }
  S.f.vuEp = (S.f.vuEp || 0) + 1;
  dire(EPINGLES[i][2], () => {
    if (S.f.vuEp >= 3 && !S.f.epToutes) { S.f.epToutes = 1; dire('epingles_toutes', rendre); } else rendre();
  });
}

/* --- salle des cartes --- */
function parleLacote() {
  const f = S.f;
  if (!f.regles) {
    const fin = () => dire('sc_gants', () => { ajoute('gants'); dire('sc_demande', () => { f.regles = 1; rendre(); }); });
    const cafe = () => { if (!a('cafe')) return fin(); dire('sc_cafe', () => menu('', [
      { t: 'Le finir d\'un trait', f: () => dire('sc_cafe_bu', () => { retire('cafe'); fin(); }) },
      { t: 'Le lui tendre', f: () => dire('sc_cafe_jete', () => { retire('cafe'); f.cafeJete = 1; fin(); }) }
    ])); };
    const stylo = () => { if (a('stylo')) return dire('sc_stylo', () => { retire('stylo'); cafe(); }); cafe(); };
    if (!f.accueilK) return dire('sc_accueil', () => { f.accueilK = 1; stylo(); });
    return stylo();
  }
  if (f.mcIci && !f.mcParti && f.poche) return menu('', [{ t: '« Pardon. Monsieur a un stylo. »', f: solB }, { t: 'Ne rien dire', f: rendre }]);
  if (!f.coteOk) return dire('sc_cote_rappel');
  dire('sc_k');
}
function clicComptoir() {
  if (!S.f.regles) return dire('sc_sans_regles');
  if (S.f.coteOk) return dire('sc_k');
  S.ecran = 'cote'; rendre();
}
function validerCote(l, an, ch) {
  const c = l + '-' + an + '-' + ch;
  Son.fx('clic');
  S.ecran = 'lieu'; rendre();
  // Sacha énonce la cote (didascalie : non comptée dans les répliques), puis M. Lacote répond sur le premier élément faux.
  D.c_dem = [['d', 'Sacha tend la fiche à M. Lacote : « ' + c + ' ».']];
  dire('c_dem', () => {
    if (c === 'V-1957-21') {
      S.f.coteOk = 1; S.f.date1957 = 1; avance(1);
      return dire('c_ok', () => {
        if (S.pas < 8) { S.early = 1; dire('sc_avance', rendre); } else arriveMontclair();
      });
    }
    S.essais++;
    const fin = () => { if (S.essais >= 5) dire('c_aide', () => { S.ecran = 'cote'; rendre(); }); else { S.ecran = 'cote'; rendre(); } };
    if (l !== 'V') {
      if (l === 'F') { S.f.merc = 1; return dire('c_f', fin); }
      return dire(l === 'A' ? 'c_a' : 'c_g', fin);
    }
    if (an !== '1957') {
      if (an === '1965') { S.f.livre = 1; return dire('c_1965', fin); }
      return dire({ 1492: 'c_1492', 1558: 'c_1558', 1960: 'c_1960' }[an] || 'c_autre', fin);
    }
    dire({ 65: 'c_65', 87: 'c_87', 95: 'c_95' }[ch] || 'c_autre', fin);
  });
}
function arriveMontclair() {
  S.early = 0; S.f.mcIci = 1;
  if (!S.seq.includes('fac')) S.f.facApres = 1;
  Son.fx('jour');
  dire('mc_arrive', rendre);
}
function clicTable() {
  const f = S.f;
  if (!f.coteOk) return dire('sc_cote_rappel');
  if (f.mcIci && !f.mcParti) return dire('mc_table');
  S.ecran = 'carton';
  const montre = () => { rendre(); };
  if (!f.prisesDit && !S.early) { f.prisesDit = 1; return dire('prises', montre); }
  montre();
}
function menuSalleMc() {
  if (!S.f.mcVu) { S.f.mcVu = 1; return dire('mc_intro', menuSalleMc); }
  menu('', [
    { t: 'Lui poser une question', f: questionsMc },
    { t: 'Regarder ses poches', f: () => dire('mc_poche', () => { S.f.poche = 1; rendre(); }) },
    { t: '« Il y a une équipe du 20 heures dehors. »', f: () => { if (S.f.flatte) solC(); else dire('sol_c_non', rendre); } },
    { t: 'Lui donner la clé USB', si: () => a('usb'), f: solA },
    { t: 'Le laisser', f: rendre }
  ]);
}
function part(comment) { S.f.mcParti = comment; Son.fx('bon'); avance(1); rendre(); }
function solA() { dire('sol_a', () => { retire('usb'); part('cle'); }); }
function solB() { dire('sol_b', () => part('stylo')); }
function solC() { dire('sol_c', () => part('faux20h')); }
function parleBruno() {
  const n = (S.f.bruno || 0) + 1; S.f.bruno = n;
  if (n === 1) return dire('br1');
  if (n === 2) return dire('br2');
  if (n === 3) return dire('br3', () => { S.prises += 1; S.f.piles = 1; dire('prises3', rendre); });
  dire('br4');
}
function filmePiece(id, cle) {
  if (enCours || S.seq.includes(id)) return;
  if (S.early <= 0 && S.prises <= 0) return dire('prises_0');
  dire(cle, () => {
    filme(id);
    if (S.early > 0) { S.early = 0; S.ecran = 'lieu'; return arriveMontclair(); }
    S.prises--; rendre();
  });
}
const ETIQ = [['parchemin', 'Datation du parchemin', 'ancien', 'et_ok1'], ['encre', 'Datation de l\'encre', 'titane', 'et_ok2'], ['auteur', 'Auteur', 'inconnu', 'et_ok3']];
const ETIQ_RES = [['inconnu', 'Inconnu'], ['titane', 'Moderne : une encre au titane, utilisée à partir des années 1920'], ['ancien', 'Ancien : XVe siècle']];
let etiqSel = null, glisse = null, vientDeGlisser = false;
function poseEtiquette(slot, res) {
  if (enCours) return;
  const f = S.f, c = ETIQ.find((x) => x[0] === slot);
  etiqSel = null;
  if (res !== c[2]) { Son.fx('refus'); rendre(); return dire('et_ko'); }
  Son.fx('tampon');
  f.etiqPose = Object.assign({}, f.etiqPose, { [slot]: res });
  rendre();
  dire(c[3], () => {
    if (Object.keys(f.etiqPose).length >= ETIQ.length) { f.etiq = 1; avance(1); return dire('et_fin', () => { S.ecran = 'carton'; rendre(); }); }
    rendre();
  });
}
function caseSous(ev) {
  const e = document.elementFromPoint(ev.clientX, ev.clientY);
  return e && e.closest('[data-slot]');
}
function finGlisse() {
  if (!glisse) return;
  glisse.el.classList.remove('glisse');
  glisse.el.style.transform = '';
  document.querySelectorAll('.f-case.vise').forEach((x) => x.classList.remove('vise'));
  glisse = null;
}
document.addEventListener('pointerdown', (ev) => {
  const l = ev.target.closest && ev.target.closest('.lab');
  if (!l || enCours || ev.button) return;
  glisse = { el: l, res: l.dataset.et, x: ev.clientX, y: ev.clientY, bouge: false };
});
document.addEventListener('pointermove', (ev) => {
  if (!glisse) return;
  const dx = ev.clientX - glisse.x, dy = ev.clientY - glisse.y;
  if (!glisse.bouge && Math.hypot(dx, dy) < 5) return;
  glisse.bouge = true;
  glisse.el.classList.add('glisse');
  glisse.el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
  const c = caseSous(ev);
  document.querySelectorAll('.f-case.vise').forEach((x) => { if (x !== c) x.classList.remove('vise'); });
  if (c) c.classList.add('vise');
});
document.addEventListener('pointerup', (ev) => {
  if (!glisse) return;
  const res = glisse.res, bouge = glisse.bouge, c = bouge ? caseSous(ev) : null;
  finGlisse();
  if (!bouge) return;
  vientDeGlisser = true; setTimeout(() => { vientDeGlisser = false; }, 0);
  if (c) poseEtiquette(c.dataset.slot, res);
});
document.addEventListener('pointercancel', finGlisse);

/* --- visionneuse des cartes --- */
const VISIO = {
  'doc_d.carte': ['La carte du Vinland', 'Reproduction de la carte conservée à Yale. À gauche, à l\'ouest du Groenland, une grande île accompagnée d\'une légende en latin.'],
  'doc_d.frisland': ['La carte de Mercator', 'Planche publiée en 1595. Cherchez l\'île de Frisland dans le médaillon en haut à gauche.']
};
function voir(k) {
  const v = $('visio');
  v.innerHTML = '<div class="visio-barre"><strong>' + T(VISIO[k][0]) + '</strong><span class="bt"><button data-a="visio_zoom" id="visio-zoom">🔍 Agrandir</button><button data-a="visio_fermer" id="visio-fermer">Fermer</button></span></div>' +
    '<div class="visio-cadre" id="visio-cadre"><img src="' + IM.img[k] + '" alt="' + h(VISIO[k][0]) + '" data-a="visio_zoom"></div>' +
    '<p class="small">' + T(VISIO[k][1]) + ' <span class="muted">' + T(IM.credits[k] || '') + '</span></p>';
  v.hidden = false;
  $('visio-fermer').focus();
}
function fermeVisio() { $('visio').hidden = true; $('visio').innerHTML = ''; }
document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && !$('visio').hidden) fermeVisio(); });

/* --- déplacements --- */
function voyager(l) {
  if (enCours) return;
  const quitte = S.lieu;
  if (l === quitte) { S.ecran = 'lieu'; return rendre(); }
  const part2 = () => {
    if (quitte === 'salle') S.early = 0;
    S.lieu = l; S.ecran = 'lieu'; avance(2); Son.fx('souffle');
    if (l === 'librairie' && !S.f.lenoirVu) {
      S.f.lenoirVu = 1;
      if (S.pas >= 8) { S.f.lenoirApres = 1; return dire('le_apres', rendre); }
      return dire('le_avant', rendre);
    }
    if (l === 'salle') {
      if (S.f.coteOk && !S.f.mcIci && S.early === 0) return arriveMontclair();
    }
    rendre();
  };
  if (quitte === 'salle' && S.f.mcParti && !S.f.sortieDite && S.seq.some((x) => ['fac', 'yale', 'livre', 'merc'].includes(x))) {
    S.f.sortieDite = 1; return dire('sc_sortie', part2);
  }
  part2();
}

/* --- montage et diffusion --- */
function lanceMontage() { S.ecran = 'montage'; S.choix = null; rendre(); dire('mt_intro'); }
function placeSeq(c) {
  if (enCours || !S.choix) return;
  Object.keys(S.cases).forEach((k) => { if (S.cases[k] === S.choix) S.cases[k] = null; });
  S.cases[c] = S.choix;
  const r = REACT[S.choix + '_' + c] || ('mt_' + c);
  S.choix = null; Son.fx('coupe'); rendre();
  dire(r);
}
function bilan() {
  let b = 0, c = 0;
  CASES.forEach(([k], i) => {
    const id = S.cases[k]; if (!id) return;
    const v = SEQ[id].v[i]; b += v[0]; c += v[1];
    if (SEQ[id].apres && S.f.lenoirApres) b -= 1;
    if (id === 'fac' && S.f.facApres) b -= 1;
  });
  const fin = b >= SEUIL.buzz && c >= SEUIL.cred ? 'A' : c >= SEUIL.cred ? 'B' : b >= SEUIL.buzz ? 'C' : 'D';
  return { b, c, fin };
}
const NOMS_FIN = { A: 'Le triomphe', B: 'Le sérieux l\'emporte', C: 'La démission', D: 'Trois heures du matin' };
function diffuser() {
  S.fin = bilan();
  S.ecran = 'diffusion'; S.etape = 'mc'; Son.musique(null); Son.fx('compte'); rendre();
  dire('dif_' + (S.f.mcParti || 'la'), () => { S.etape = 'score'; rendre(); });
}
function finScore() {
  Son.fx(S.fin.fin === 'A' || S.fin.fin === 'B' ? 'bon' : S.fin.fin === 'C' ? 'moyen' : 'mauvais');
  S.etape = 'fin'; rendre();
  dire('fin_' + S.fin.fin, () => dire('suite', () => { S.ecran = 'vrai'; S.vrai = 0; S.vraiOk = 0; S.vraiRep = null; rendre(); }));
}
function repVrai(r) {
  if (S.vraiRep) return;
  S.vraiRep = r; if (r === VRAI[S.vrai][1]) { S.vraiOk++; Son.fx('etoile', 2); } else Son.fx('refus');
  rendre();
}
function vraiSuivant() { S.vrai++; S.vraiRep = null; if (S.vrai >= VRAI.length) S.ecran = 'bilan'; rendre(); }
function recommencer() {
  if (!confirm('Recommencer le chapitre ? Votre carnet de répliques est conservé.')) return;
  S = vide(); sel = null; enCours = null; $('dlg').hidden = true; $('dlgfond').hidden = true; rendre();
}

/* ---------- affichage ---------- */
function decorSalle() {
  let l = '';
  for (let i = 0; i < 9; i++) l += '<rect x="' + (i * 171) + '" y="0" width="165" height="640" fill="#4a3322" stroke="#2c1d12" stroke-width="5"/>';
  let t = '';
  for (let y = 350; y < 640; y += 36) t += '<rect x="10" y="' + y + '" width="290" height="30" fill="#6b4c32" stroke="#2c1d12"/><rect x="130" y="' + (y + 12) + '" width="50" height="6" fill="#c9a85a"/>';
  return '<svg class="fond" viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><radialGradient id="lum" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".5"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient></defs>' +
    '<rect width="1536" height="1024" fill="#2c1d12"/>' + l + t + '<rect y="640" width="1536" height="384" fill="#5a3f28"/>' +
    '<rect x="260" y="700" width="660" height="40" fill="#7c5a38"/><rect x="290" y="740" width="30" height="240" fill="#3f2b1a"/><rect x="860" y="740" width="30" height="240" fill="#3f2b1a"/>' +
    '<rect x="420" y="660" width="330" height="40" fill="#e8dcbf" stroke="#8c7a55"/><rect x="540" y="400" width="10" height="260" fill="#3a2a18"/><ellipse cx="545" cy="400" rx="60" ry="26" fill="#2e6b4f"/><ellipse cx="545" cy="560" rx="190" ry="180" fill="url(#lum)"/>' +
    '<rect x="1050" y="690" width="450" height="60" fill="#7c5a38"/><rect x="1060" y="750" width="430" height="230" fill="#4a3322"/>' +
    '<rect x="1170" y="70" width="240" height="150" fill="#efe6cf" stroke="#2c1d12" stroke-width="4"/><path d="M1190 105h200M1190 135h200M1190 165h200M1190 195h120" stroke="#6a5f4b" stroke-width="6"/>' +
    '<rect x="1432" y="640" width="46" height="50" fill="#6d7276"/><path d="M1442 640l-4-34M1456 640l4-38M1468 640l6-30" stroke="#22201c" stroke-width="5"/>' +
    '<g font-family="Georgia,serif" font-size="30" fill="#efe6cf"><rect x="1110" y="720" width="60" height="24" fill="#2c1d12"/><rect x="1190" y="720" width="60" height="24" fill="#2c1d12"/><rect x="1270" y="720" width="60" height="24" fill="#2c1d12"/></g></svg>';
}
function persoScene(q, x, y, w) {
  const p = QUI[q];
  const dedans = p.img && IM.img[p.img] ? '<image href="' + IM.img[p.img] + '" width="' + w + '" height="' + w + '" preserveAspectRatio="xMidYMid slice"/>' : '<rect width="' + w + '" height="' + w + '" fill="' + p.couleur + '"/><text x="' + (w / 2) + '" y="' + (w * 0.62) + '" text-anchor="middle" font-family="Georgia,serif" font-size="' + (w * 0.42) + '" fill="#fff">' + (INIT[q] || p.nom[0]) + '</text>';
  return '<g transform="translate(' + x + ' ' + y + ')"><rect x="-6" y="-6" width="' + (w + 12) + '" height="' + (w + 12) + '" rx="10" fill="#c9b78e"/><clipPath id="c' + q + '"><rect width="' + w + '" height="' + w + '" rx="6"/></clipPath><g clip-path="url(#c' + q + ')">' + dedans + '</g></g>';
}
function rOuverture() {
  return '<div class="vue" id="vue"><img class="fond" src="' + IM.img.scene_plateau + '" alt=""><svg class="calque" viewBox="0 0 1536 1024">' +
    '<g font-family="Georgia,serif" fill="#fff4d6" text-anchor="middle"><text x="768" y="268" font-size="50" font-weight="700">LES CARTES OUBLIÉES 2</text><text x="768" y="318" font-size="30" font-style="italic">Ce qu\'on vous cache encore</text></g>' +
    persoScene('M', 628, 345, 280) + '</svg></div>';
}
// Image détourée posée dans le décor (coordonnées 1536 x 1024) ; coupeY masque ce qui passe derrière un meuble.
function enPied(img, q, x, y, w, hh, coupeY) {
  if (!IM.img[img]) return persoScene(q, x, y, Math.min(w, hh));
  const cp = coupeY ? '<clipPath id="cp_' + img + '"><rect x="0" y="0" width="1536" height="' + coupeY + '"/></clipPath>' : '';
  return cp + '<image href="' + IM.img[img] + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + hh + '" preserveAspectRatio="xMidYMax meet"' + (coupeY ? ' clip-path="url(#cp_' + img + ')"' : '') + '/>';
}
function rLieu() {
  if (plateauOuverture) return rOuverture();
  const l = LIEUX[S.lieu], src = IM.img[l.img];
  const z = zonesDe(S.lieu).map((p) => '<g class="hot" tabindex="0" role="button" data-id="' + p[0] + '" aria-label="' + h(p[1]) + '" data-l="' + h(p[1]) + '"><rect x="' + p[2] + '" y="' + p[3] + '" width="' + p[4] + '" height="' + p[5] + '" rx="10"/></g>').join('');
  let extra = '';
  if (S.lieu === 'salle') {
    // Personnages en pied : Lacote derrière le comptoir, Montclair derrière la table, Bruno debout devant le comptoir.
    // Taille selon la profondeur (horizon vers y = 530) : Lacote devant le bout du comptoir (pieds à y = 900),
    // Montclair juste derrière la table, au premier plan (coupé au bord de la table, y = 705), Bruno au premier plan à droite (pieds à y = 1015).
    extra += enPied('pied_lacote', 'K', 1345, 320, 184, 580, 0);
    // Montclair en pied, debout derrière la table : coupé au bord de la table (y = 705).
    if (S.f.mcIci && !S.f.mcParti) extra += enPied('pied_montclair', 'M', 528, 240, 337, 1032, 705) + enPied('pied_bruno', 'B', 1068, 293, 315, 722, 0);
  }
  if (S.lieu === 'redaction') {
    // La télécommande, posée sur la console tant qu'on ne l'a pas prise.
    if (!a('telecommande') && !S.f.berthaOk && OBJETS.telecommande) extra += '<g transform="translate(262 812) rotate(-68) scale(2.1)" style="pointer-events:none">' + OBJETS.telecommande[0] + '</g>';
  }
  if (S.lieu === 'librairie' && S.f.lenoirApres) extra += '<g transform="translate(830 430) rotate(-6)"><rect width="110" height="90" fill="#fdf8e6" stroke="#8c7a55"/><path d="M12 62 q20 -34 40 -4 t44 -14" fill="none" stroke="#22201c" stroke-width="3"/><circle cx="84" cy="24" r="10" fill="#c9962e" opacity=".6"/></g><circle cx="885" cy="432" r="6" fill="#c9231c"/>';
  const hover = sel ? 'Utiliser ' + OBJETS[sel][1] + ' sur…' : l.nom;
  return '<div class="vue' + (zones ? ' zones' : '') + (sel ? ' cible' : '') + '" id="vue">' + (src ? '<img class="fond" src="' + src + '" alt="">' : (S.lieu === 'salle' ? decorSalle() : '')) +
    '<svg class="calque" viewBox="0 0 1536 1024">' + extra + z + '</svg><div class="bulle" id="bulle">' + T(hover) + '</div></div>' + rInv();
}
function rInv() {
  const o = S.inv.map((k) => '<button class="obj' + (sel === k ? ' sel' : '') + '" data-o="' + k + '" title="' + h(OBJETS[k][1]) + '">' + (k === 'bertha' && IM.img.objet_bertha ? '<img class="ico" src="' + IM.img.objet_bertha + '" alt="">' : '<span>' + OBJETS[k][0] + '</span>') + '<small>' + T(OBJETS[k][1]) + (k === 'bertha' && S.f.berthaOk ? ' ●' : '') + '</small></button>').join('');
  const s = S.seq.length ? '<span class="seqs">🎬 ' + S.seq.length + (S.seq.length < 3 ? ' / 3' : '') + '</span>' : '';
  return '<div class="inv">' + o + s + '</div>';
}
// S.f.ruses = nombre de passages vus (3 = film terminé) ; S.f.trouvees = failles relevées.
function passageSuivant() {
  S.film++; S.f.pause = false; S.f.ruses = S.film;
  if (S.film >= FILM.length) { S.ecran = 'lieu'; S.f.ruses = 3; avance(1); return dire((S.f.trouvees || 0) >= 3 ? 'film_fin' : 'film_fin2', rendre); }
  rendre();
}
function rFilm() {
  const i = S.film, f = FILM[i];
  const rep = S.f.pause ? '<div class="reps">' + f.rep.map((r, k) => '<button data-r="' + k + '">' + T(r[0]) + '</button>').join('') + '</div>' : '<div class="row" style="justify-content:center"><button class="primary pause" data-pause="1">⏸ Pause</button><button class="pause" data-passe="1">⏭ Passer</button></div>';
  const bg = IM.img['doc_d.carte'] ? 'style="background-image:linear-gradient(rgba(0,0,0,.62),rgba(0,0,0,.8)),url(' + IM.img['doc_d.carte'] + ')"' : '';
  return '<div class="ecran-film" ' + bg + '><p class="etq">Les Cartes oubliées · passage ' + (i + 1) + ' sur 3</p><p class="cite">' + T(f.cite) + '</p>' + rep + '</div>';
}
function rFils() {
  const c = [[553, 162, 1421, 219], [600, 107, 136, 456], [855, 176, 544, 490]];
  const fils = c.map((x) => '<path d="M' + x[0] + ' ' + x[1] + ' Q' + ((x[0] + x[2]) / 2) + ' ' + (Math.max(x[1], x[3]) + 40) + ' ' + x[2] + ' ' + x[3] + '" fill="none" stroke="#c9231c" stroke-width="3.5"/>').join('');
  const pins = EPINGLES.map((p, i) => '<g class="pin" data-pin="' + i + '" tabindex="0" role="button" aria-label="Épingle"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="22" fill="transparent"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="10" fill="#c9231c" stroke="#5a0f0a" stroke-width="2"/></g>').join('');
  const cache = S.f.coupure ? '' : '<g class="pin" data-pin="coupure" tabindex="0" role="button" aria-label="Papier au bord de la carte"><rect x="1530" y="640" width="60" height="80" fill="#fdf8e6" stroke="#8c7a55" transform="rotate(8 1560 680)"/><path d="M1540 662h40M1540 678h40M1540 694h28" stroke="#6a5f4b" stroke-width="3" transform="rotate(8 1560 680)"/><circle cx="1560" cy="640" r="8" fill="#7ab0d6" stroke="#1f4e79" stroke-width="2"/></g>';
  return '<div class="plein"><h2>La carte aux fils rouges</h2><p class="muted">Cliquez sur les épingles. Regardez bien jusqu\'aux bords de la carte.</p><div class="carte"><img src="' + (IM.img.obj_mappemonde || '') + '" alt="Planisphère"><svg viewBox="0 0 1600 756">' + fils + pins + cache + '</svg></div><button class="primary" data-a="retour">Revenir dans le sous-sol</button></div>';
}
function rCote() {
  const col = (id, l, v) => '<label>' + l + '<select id="' + id + '">' + v.map((x) => '<option>' + x + '</option>').join('') + '</select></label>';
  return '<div class="plein"><h2>Les molettes du comptoir</h2><div class="reglement"><strong>Règlement, article 4</strong><p>' + T('La cote se compose ainsi : la lettre du lieu représenté sur la carte, l\'année de sa première apparition sur le marché, puis les deux derniers chiffres de l\'année de sa dernière analyse.') + '</p></div>' +
    '<div class="molettes">' + col('m1', 'Lieu', ['A', 'F', 'G', 'V']) + col('m2', 'Année', ['1492', '1558', '1957', '1960', '1965']) + col('m3', 'Analyse', ['21', '65', '87', '95']) + '</div>' +
    '<div class="row"><button class="primary" data-a="cote">Demander ce carton</button><button data-a="retour">Plus tard</button></div>' + rIndices() + '</div>';
}
function rIndices() {
  const f = S.f, i = [];
  if (f.ruses >= 3) i.push('Yale déclare la carte fausse en 2021.');
  i.push('Le sujet : la carte du Vinland.');
  if (f.date1957) i.push('La carte apparaît sur le marché en 1957.');
  return '<div class="indices"><strong>Votre carnet</strong><ul>' + i.map((x) => '<li>' + T(x) + '</li>').join('') + '</ul></div>';
}
function rCarton() {
  const f = S.f, reste = S.early > 0 ? 'Une prise libre avant son arrivée' : S.prises + (S.prises > 1 ? ' prises restantes' : ' prise restante');
  const p = (id, img, titre, desc, cle, cond) => {
    if (cond === false) return '';
    const deja = S.seq.includes(id);
    const filmer = '<button ' + (deja ? 'disabled' : '') + ' data-film="' + id + '" data-c="' + cle + '">' + (deja ? 'Filmé' : '🎥 Filmer') + '</button>';
    const boutons = id === 'yale' ? (f.etiq ? '<button data-a="yale">📄 Relire</button>' + filmer : '<button class="primary" data-a="yale">Lire le dossier</button>') :
      (img ? '<button class="primary" data-voir="' + img + '">🔍 Regarder</button>' : '') + filmer;
    return '<div class="piece">' + (img ? '<img class="voir" src="' + IM.img[img] + '" alt="' + h(titre) + '" data-voir="' + img + '">' : '<div class="txtdoc">📄</div>') + '<div><strong>' + T(titre) + '</strong><p>' + T(desc) + '</p><div class="row serre">' + boutons + '</div></div></div>';
  };
  return '<div class="plein"><h2>Sur la table</h2><p class="muted">🎥 Bertha : ' + T(reste) + '</p><div class="pieces">' +
    p('yale', null, 'Le dossier de Yale (2021)', 'Du texte, des tableaux, aucune image spectaculaire.', 'p_yale') +
    p('fac', 'doc_d.carte', 'Le fac-similé de la carte du Vinland', 'Très beau. Une île à l\'ouest du Groenland, et une légende en latin.', 'p_fac') +
    p('livre', null, 'Le livre de 1965', 'Trois spécialistes reconnus présentent la carte comme médiévale.', 'p_livre', !!f.livre) +
    p('merc', 'doc_d.frisland', 'La carte de Mercator', 'Une grande carte du Nord, publiée en 1595, avec une île nommée Frisland.', 'p_merc', !!f.merc) +
    '</div><button data-a="retour">Quitter la table</button></div>';
}
function rYale() {
  const suite = S.f.etiq ? '' : '<button class="primary" data-a="etiq">Compléter la fiche</button>';
  return '<div class="plein papier rapport"><p class="etq2">Annonce de l\'université Yale, 1er septembre 2021 · résumé</p><h2>' + T('La carte du Vinland est un faux') + '</h2>' +
    '<h3>L\'encre</h3><p>' + T('Un composé du titane, l\'anatase, se trouve partout dans les traits et le texte de la carte. Ce composé est utilisé dans les encres à partir des années 1920. Les encres médiévales, elles, sont surtout à base de fer. Or la carte n\'en contient presque pas.') + '</p>' +
    '<table class="tab"><thead><tr><th>Encre analysée</th><th>Titane</th><th>Fer</th></tr></thead><tbody><tr><td>' + T('La carte du Vinland') + '</td><td>Partout</td><td>Très peu ou pas</td></tr><tr><td>' + T('50 fragments de manuscrits du XVe siècle') + '</td><td>Bien moins</td><td>Bien plus</td></tr></tbody></table>' +
    '<h3>Le parchemin</h3><p>' + T('Il est ancien : le carbone 14 le place au XVe siècle. Ses trous de vers correspondent à ceux d\'un manuscrit médiéval, dont il provient probablement.') + '</p>' +
    '<h3>La tromperie</h3><p>' + T('Au dos de la carte, une inscription latine à l\'encre ancienne a été repassée avec l\'encre au titane. Pour les chercheurs, c\'est le signe d\'une volonté de tromper.') + '</p>' +
    '<h3>L\'auteur</h3><p>' + T('Ces analyses ne disent pas qui a fabriqué ce faux.') + '</p>' +
    '<p class="small"><a href="https://news.yale.edu/2021/09/01/analysis-unlocks-secret-vinland-map-its-fake" target="_blank" rel="noopener">Lire l\'annonce de Yale (en anglais)</a></p>' +
    '<div class="row">' + suite + '<button data-a="carton">Reposer le dossier</button></div></div>';
}
function rEtiq() {
  const pose = S.f.etiqPose || {};
  const lignes = ETIQ.map((c) => '<div class="f-ligne"><span class="f-nom">' + T(c[1]) + '</span>' +
    (pose[c[0]] ? '<span class="f-case pose">✓ ' + T(ETIQ_RES.find((r) => r[0] === c[2])[1]) + '</span>' :
      '<button class="f-case' + (etiqSel ? ' prete' : '') + '" data-slot="' + c[0] + '" aria-label="' + h('Déposer ici : ' + c[1]) + '">Déposez ici</button>') + '</div>').join('');
  const labs = ETIQ_RES.filter((r) => !Object.values(pose).includes(r[0])).map((r) => '<button class="lab' + (etiqSel === r[0] ? ' sel' : '') + '" data-et="' + r[0] + '">' + T(r[1]) + '</button>').join('');
  return '<div class="plein papier"><h2>La fiche du dossier</h2><p>' + T('Faites glisser chaque étiquette dans la case qui lui correspond. Vous pouvez aussi cliquer sur une étiquette, puis sur sa case.') + '</p><div class="fiche">' + lignes + '</div><div class="labs">' + labs + '</div>' +
    '<div class="row"><button data-a="yale">📄 Relire le dossier</button><button data-a="carton">Reposer le dossier</button></div></div>';
}
function rMontage() {
  const dispo = S.seq.filter((x) => !Object.values(S.cases).includes(x));
  const cases = CASES.map(([k, t]) => '<button class="case' + (S.cases[k] ? ' pleine' : '') + (S.choix ? ' prete' : '') + '" data-case="' + k + '"><small>' + T(t) + '</small><strong>' + (S.cases[k] ? T(SEQ[S.cases[k]].nom) : '…') + '</strong></button>').join('');
  const seq = S.seq.map((x) => '<button class="sq' + (S.choix === x ? ' sel' : '') + (dispo.includes(x) ? '' : ' place') + '" data-seq="' + x + '">🎬 ' + T(SEQ[x].nom) + '</button>').join('');
  const pret = Object.values(S.cases).every(Boolean);
  return '<div class="plein"><h2>La salle de montage</h2><p class="muted">Choisissez une séquence, puis la case où la placer. Vous pouvez changer d\'avis.</p><div class="banc"><img src="' + IM.img.scene_montage + '" alt=""><div class="cases">' + cases + '</div></div><div class="sqs">' + seq + '</div><button class="primary" data-a="diffuser"' + (pret ? '' : ' disabled') + '>Envoyer à l\'antenne</button></div>';
}
function rDiffusion() {
  const bg = IM.img.scene_plateau ? 'style="background-image:linear-gradient(rgba(8,5,2,.66),rgba(8,5,2,.66)),url(' + IM.img.scene_plateau + ')"' : '';
  if (S.etape !== 'score' && S.etape !== 'fin') return '<div class="plateau" ' + bg + '><p class="direct">● EN DIRECT</p><h2>Les Cartes oubliées 2</h2></div>';
  const j = (n, v, m, cl) => '<div class="jauge"><span>' + n + '</span><div class="bar"><i class="' + cl + '" style="width:' + Math.max(4, Math.min(100, (v + 4) / (m + 4) * 100)) + '%"></i></div><b>' + v + '</b></div>';
  return '<div class="plateau" ' + bg + '><p class="direct">Votre pilote vient de passer</p><h2>' + (S.etape === 'fin' ? T(NOMS_FIN[S.fin.fin]) : 'Les résultats') + '</h2>' + j('Buzz', S.fin.b, 9, 'b') + j('Crédibilité', S.fin.c, 10, 'c') + (S.etape === 'score' ? '<button class="primary" data-a="finscore">Voir la réaction d\'Hélène</button>' : '') + '</div>';
}
function rVrai() {
  const c = VRAI[S.vrai], r = S.vraiRep;
  return '<div class="plein vrai"><h2>Vrai ou inventé ?</h2><p class="muted">Carte ' + (S.vrai + 1) + ' sur ' + VRAI.length + ' · ' + S.vraiOk + ' bonne' + (S.vraiOk > 1 ? 's' : '') + ' réponse' + (S.vraiOk > 1 ? 's' : '') + '</p><div class="carte-vrai"><p>' + T(c[0]) + '</p>' +
    (r ? '<p class="' + (r === c[1] ? 'ok' : 'ko') + '"><strong>' + (c[1] === 'v' ? 'Vrai.' : 'Faux ou inventé.') + '</strong> ' + T(c[2]) + '</p><button class="primary" data-a="vraisuite">Suivant</button>' :
      '<div class="row"><button data-v="v">Vrai</button><button data-v="i">Faux ou inventé</button></div>') + '</div></div>';
}
function rBilan() {
  const f = S.fin, tot = totalRepliques(), trophee = f.fin === 'A' && !S.f.cafeJete;
  return '<div class="plein"><h2>' + T(NOMS_FIN[f.fin]) + '</h2><p>Buzz : <b>' + f.b + '</b> · Crédibilité : <b>' + f.c + '</b> · Vrai ou inventé : <b>' + S.vraiOk + ' / ' + VRAI.length + '</b></p>' +
    (trophee ? '<p class="ok">🏆 Trophée « Sans une tache » : le triomphe, sans avoir fait jeter votre café.</p>' : '') +
    '<p>📖 Carnet des répliques : <b>' + vus.size + ' / ' + tot + '</b>. Rejouez pour tout entendre : d\'autres fins, d\'autres façons de chasser Montclair, des pièces cachées…</p>' +
    '<h3>Sources réelles</h3><ul class="rap">' + SOURCES.map((s) => '<li><a href="' + h(s[1]) + '" target="_blank" rel="noopener">' + T(s[0]) + '</a></li>').join('') + '</ul>' +
    '<h3>Crédits des images</h3><ul class="rap small"><li>Scènes et portraits : illustrations générées par IA.</li><li>' + T(IM.credits['doc_d.carte'] || '') + '</li><li>' + T(IM.credits['doc_d.frisland'] || '') + '</li><li>' + T(IM.credits.obj_mappemonde || '') + '</li></ul>' +
    '<p class="muted small">Prototype du chapitre 1. Personnages et intrigue fictifs, faits et documents réels.</p><button class="primary" data-a="rejouer">Rejouer</button></div>';
}
function rIntro() {
  const reprise = S.seq.length || S.f.accueil;
  return '<div class="intro-cadre">' + (IM.img.pied_sacha ? '<img class="heros" src="' + IM.img.pied_sacha + '" alt="Sacha, documentaliste">' : '') + '<div class="intro"><h1>La course au meilleur doc sur les cartes anciennes</h1><p class="s">Chapitre 1 : Le pilote</p><button class="primary" data-a="commencer">' + (reprise ? 'Reprendre' : 'Commencer') + '</button>' + (reprise ? '<button data-a="rejouer">Recommencer</button>' : '') + '</div></div>';
}
function rPlan() {
  const c = (id, titre, desc) => '<button class="lieu-c' + (S.lieu === id ? ' ici' : '') + '" data-l="' + id + '"><span class="ph">' + (IM.img[LIEUX[id].img] ? '<img src="' + IM.img[LIEUX[id].img] + '" alt="">' : '🗺️') + '</span><strong>' + T(titre) + '</strong><small>' + T(desc) + '</small></button>';
  return '<div class="plein"><h2>Plan de Paris</h2><p class="muted">Chaque trajet donne un peu d\'avance à Montclair. Examiner les lieux, jamais.</p><div class="lieux">' +
    c('redaction', 'La rédaction', 'Hélène, le montage') + c('librairie', 'Le sous-sol de Lenoir', 'Derrière la gare de l\'Est') + c('salle', 'La salle des cartes', 'Silence obligatoire') + '</div><button data-a="retour">Rester ici</button></div>';
}
function rCarnet() {
  const par = {}; vus.forEach((id) => { const [k, i] = id.split('#'); const l = D[k] && D[k][+i]; if (l) par[l[0]] = (par[l[0]] || 0) + 1; });
  const tot = {}; Object.values(D).forEach((ls) => ls.forEach((l) => { if (l[0] !== 'd') tot[l[0]] = (tot[l[0]] || 0) + 1; }));
  const q = (k) => QUI[k].nom.split(',')[0];
  const ind = []; const f = S.f;
  if (f.ruses) ind.push('Ruses repérées dans le film : ' + (f.trouvees || 0) + ' sur 3.');
  if (f.date1957) ind.push('La carte apparaît sur le marché en 1957.');
  if (f.coupure) ind.push('Ferrajoli : vols signalés de 1960 à 1965. Rôle discuté.');
  if (f.etiq) ind.push('Parchemin ancien, encre moderne, auteur inconnu.');
  if (f.flatte) ind.push('Montclair croit tout ce qui lui fait plaisir.');
  return '<div class="carnet" role="dialog" aria-label="Carnet"><h2>Le carnet de Sacha</h2><h3>Indices</h3><ul class="rap">' + (ind.map((x) => '<li>' + T(x) + '</li>').join('') || '<li>Rien pour le moment.</li>') + '</ul><h3>Séquences filmées</h3><ul class="rap">' + (S.seq.map((x) => '<li>' + T(SEQ[x].nom) + '</li>').join('') || '<li>Aucune pour le moment.</li>') + '</ul><h3>Répliques découvertes : ' + vus.size + ' / ' + totalRepliques() + '</h3><ul class="rap small">' + Object.keys(tot).map((k) => '<li>' + T(q(k)) + ' : ' + (par[k] || 0) + ' / ' + tot[k] + '</li>').join('') + '</ul><button class="primary" data-a="fermecarnet">Fermer</button></div>';
}
function rTete() {
  if (S.ecran === 'intro') return '';
  const jeu = ['lieu', 'plan', 'fils', 'cote', 'carton', 'yale', 'etiq'].includes(S.ecran);
  const titre = plateauOuverture ? 'Le plateau de Montclair' : (S.ecran === 'montage' || S.ecran === 'diffusion') ? LIEUX.redaction.nom : LIEUX[S.lieu].nom;
  return '<strong>' + T(titre) + '</strong><span class="bt">' +
    (jeu ? '<button data-a="plan"' + (S.f.pistes ? '' : ' disabled title="Hélène n\'a pas encore donné de piste"') + '>🗺️ Plan de Paris</button>' : '') +
    '<button data-a="carnet">📖 Carnet</button><button data-a="muet" aria-label="Couper le son">' + (Son.cfg.muet ? '🔇' : '🔊') + '</button><button data-a="rejouer">↺</button></span>';
}
const RENDUS = { intro: rIntro, lieu: rLieu, plan: rPlan, film: rFilm, fils: rFils, cote: rCote, carton: rCarton, yale: rYale, etiq: rEtiq, montage: rMontage, diffusion: rDiffusion, vrai: rVrai, bilan: rBilan };
let dernier = null;
function rendre() {
  $('tete').innerHTML = rTete();
  const app = $('app');
  app.innerHTML = (RENDUS[S.ecran] || rLieu)();
  $('carnet').hidden = !carnetOuvert;
  if (carnetOuvert) $('carnet').innerHTML = rCarnet();
  const cle = S.ecran + S.lieu;
  if (cle !== dernier) { dernier = cle; app.classList.remove('fade'); void app.offsetWidth; app.classList.add('fade'); }
  const surPlace = ['lieu', 'fils', 'cote', 'carton', 'yale', 'etiq'].includes(S.ecran);
  Son.ambiance(surPlace ? LIEUX[S.lieu].son : null);
  Son.musique(surPlace || S.ecran === 'diffusion' ? null : (S.ecran === 'intro' || S.ecran === 'bilan' ? 'theme' : 'travail'));
  sauver();
}

/* ---------- clics ---------- */
document.addEventListener('pointerdown', () => Son.debloquer(), { once: true });
document.addEventListener('keydown', () => Son.debloquer(), { once: true });
document.addEventListener('pointerover', (ev) => {
  const g = ev.target.closest && ev.target.closest('.hot'), b = $('bulle');
  if (b) b.textContent = typo((sel ? 'Utiliser ' + OBJETS[sel][1] + ' sur ' : '') + (g ? g.dataset.l : (sel ? '…' : LIEUX[S.lieu].nom)));
});
document.addEventListener('click', (ev) => {
  if (ev.target.closest('#dlg') || ev.target.closest('#dlgfond')) return;
  const t = ev.target;
  const hot = t.closest('.hot'); if (hot) return clicHot(hot.dataset.id);
  const o = t.closest('[data-o]'); if (o) return clicObjet(o.dataset.o);
  const p = t.closest('[data-pin]'); if (p) return clicEpingle(p.dataset.pin === 'coupure' ? 'coupure' : +p.dataset.pin);
  const l = t.closest('[data-l]'); if (l && l.classList.contains('lieu-c')) { if (l.dataset.l === S.lieu) { S.ecran = 'lieu'; return rendre(); } return voyager(l.dataset.l); }
  if (t.closest('[data-pause]')) { S.f.pause = true; Son.fx('coupe'); return rendre(); }
  if (t.closest('[data-passe]')) { Son.fx('clic'); return dire('film_passe', passageSuivant); }
  const r = t.closest('[data-r]');
  if (r) {
    const rep = FILM[S.film].rep[+r.dataset.r];
    if (rep[2]) { Son.fx('tampon'); return dire(rep[1], () => { S.f.trouvees = (S.f.trouvees || 0) + 1; passageSuivant(); }); }
    Son.fx('refus'); return dire(rep[1], () => { S.f.pause = false; rendre(); });
  }
  const fi = t.closest('[data-film]'); if (fi) return filmePiece(fi.dataset.film, fi.dataset.c);
  const vo = t.closest('[data-voir]'); if (vo) { Son.fx('clic'); return voir(vo.dataset.voir); }
  const et = t.closest('[data-et]'); if (et) { if (vientDeGlisser) return; etiqSel = etiqSel === et.dataset.et ? null : et.dataset.et; Son.fx('clic'); return rendre(); }
  const sl = t.closest('[data-slot]'); if (sl) { if (etiqSel) poseEtiquette(sl.dataset.slot, etiqSel); return; }
  const s = t.closest('[data-seq]'); if (s) { S.choix = S.choix === s.dataset.seq ? null : s.dataset.seq; Son.fx('clic'); return rendre(); }
  const c = t.closest('[data-case]'); if (c) return placeSeq(c.dataset.case);
  const v = t.closest('[data-v]'); if (v) return repVrai(v.dataset.v);
  const b = t.closest('[data-a]'); if (!b || b.disabled) return;
  Son.fx('clic');
  switch (b.dataset.a) {
    case 'commencer':
      S.ecran = 'lieu';
      if (!S.f.accueil) {
        S.f.accueil = 1; plateauOuverture = true; rendre();
        dire('ouverture', () => { plateauOuverture = false; rendre(); dire('ouverture2', () => dire('accueil', rendre)); });
      } else rendre();
      break;
    case 'plan': S.ecran = 'plan'; rendre(); break;
    case 'zones': zones = !zones; rendre(); break;
    case 'carnet': carnetOuvert = true; rendre(); break;
    case 'fermecarnet': carnetOuvert = false; rendre(); break;
    case 'muet': Son.regler({ muet: !Son.cfg.muet }); rendre(); break;
    case 'rejouer': recommencer(); break;
    case 'retour': S.ecran = 'lieu'; rendre(); break;
    case 'cote': validerCote($('m1').value, $('m2').value, $('m3').value); break;
    case 'etiq': S.ecran = 'etiq'; rendre(); window.scrollTo(0, 0); break;
    case 'yale': S.ecran = 'yale'; rendre(); window.scrollTo(0, 0); break;
    case 'visio_fermer': fermeVisio(); break;
    case 'visio_zoom': {
      const z = $('visio-cadre').classList.toggle('zoom');
      $('visio-zoom').textContent = z ? '🔍 Réduire' : '🔍 Agrandir';
      break;
    }
    case 'carton': S.ecran = 'carton'; rendre(); break;
    case 'diffuser': diffuser(); break;
    case 'finscore': finScore(); break;
    case 'vraisuite': vraiSuivant(); break;
  }
});
rendre();
