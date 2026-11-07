"use strict";
/* Son : tout est synthétisé en direct, il n'y a aucun fichier audio à fournir ni de droits à gérer. */
const Son = (() => {
  const KS = 'cartes-oubliees-reglages', PUISSANCE = 3;
  const cfg = { vol: 0.7, muet: false, instant: false };
  try { Object.assign(cfg, JSON.parse(localStorage.getItem(KS) || '{}')); } catch (e) { /* stockage indisponible */ }
  let ctx = null, maitre, busAmb, busMus, busFx, reverb, blanc, brun;
  let amb = null, ambNom = null, mus = null, musNom = null, proj = null;
  let veutAmb = null, veutMus = null;

  function tampon(brunien) {
    const n = ctx.sampleRate * 4, b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
    let dernier = 0;
    for (let i = 0; i < n; i++) {
      const w = Math.random() * 2 - 1;
      if (brunien) { dernier = (dernier + 0.02 * w) / 1.02; d[i] = dernier * 3.5; } else d[i] = w;
    }
    return b;
  }
  function impulsion(s) {
    const n = Math.floor(ctx.sampleRate * s), b = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3); }
    return b;
  }
  function debloquer() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return true; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    maitre = ctx.createGain(); maitre.gain.value = cfg.muet ? 0 : cfg.vol * PUISSANCE;
    busAmb = ctx.createGain(); busMus = ctx.createGain(); busFx = ctx.createGain();
    busAmb.gain.value = 0.9; busMus.gain.value = 0.55; busFx.gain.value = 0.9;
    reverb = ctx.createConvolver(); reverb.buffer = impulsion(2.6);
    const rv = ctx.createGain(); rv.gain.value = 0.5;
    reverb.connect(rv); rv.connect(maitre);
    [busAmb, busMus, busFx].forEach((b) => b.connect(maitre));
    maitre.connect(comp); comp.connect(ctx.destination);
    blanc = tampon(false); brun = tampon(true);
    if (veutAmb) ambiance(veutAmb, true);
    if (veutMus) musique(veutMus, true);
    return true;
  }

  /* briques */
  function ton(f, t, dur, g, type, dest, f2) {
    const o = ctx.createOscillator(), a = ctx.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    a.gain.setValueAtTime(0.0001, t);
    a.gain.exponentialRampToValueAtTime(g, t + 0.006);
    a.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(a); a.connect(dest || busFx);
    o.start(t); o.stop(t + dur + 0.02);
  }
  function souffle(t, dur, g, filtre, f, q, dest, f2, source) {
    const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), a = ctx.createGain();
    s.buffer = source || blanc; s.loop = true;
    fl.type = filtre; fl.frequency.setValueAtTime(f, t); fl.Q.value = q || 1;
    if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur);
    a.gain.setValueAtTime(0.0001, t);
    a.gain.exponentialRampToValueAtTime(g, t + Math.min(0.02, dur / 3));
    a.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(fl); fl.connect(a); a.connect(dest || busFx);
    s.start(t, Math.random() * 3); s.stop(t + dur + 0.02);
  }
  function nappe(sortie, source, filtre, f, q, g, lfoF, lfoG, lfoCible) {
    const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), a = ctx.createGain(), noeuds = [s];
    s.buffer = source; s.loop = true;
    fl.type = filtre; fl.frequency.value = f; fl.Q.value = q || 0.7; a.gain.value = g;
    s.connect(fl); fl.connect(a); a.connect(sortie); s.start(0, Math.random() * 3);
    if (lfoF) {
      const l = ctx.createOscillator(), lg = ctx.createGain();
      l.frequency.value = lfoF; lg.gain.value = lfoG;
      l.connect(lg); lg.connect(lfoCible === 'f' ? fl.frequency : a.gain); l.start();
      noeuds.push(l);
    }
    return noeuds;
  }
  function bourdon(sortie, f, g, type) {
    const o = ctx.createOscillator(), a = ctx.createGain();
    o.type = type || 'sine'; o.frequency.value = f; a.gain.value = g;
    o.connect(a); a.connect(sortie); o.start();
    return [o];
  }

  /* ambiances de lieux */
  const AMB = {
    redaction(s, ev) {
      const n = nappe(s, brun, 'lowpass', 350, 0.7, 0.16).concat(bourdon(s, 60, 0.012));
      ev(3000, 9000, (t) => { for (let i = 0, k = 3 + Math.floor(Math.random() * 6); i < k; i++) souffle(t + i * (0.09 + Math.random() * 0.1), 0.03, 0.025, 'highpass', 2400, 1, s); });
      ev(25000, 50000, (t) => { [0, 0.45].forEach((d) => { ton(880, t + d, 0.32, 0.008, 'sine', s); ton(1100, t + d, 0.32, 0.006, 'sine', s); }); });
      return n;
    },
    librairie(s, ev) {
      const n = nappe(s, brun, 'lowpass', 210, 0.7, 0.2);
      ev(18000, 38000, (t) => souffle(t, 5.5, 0.32, 'lowpass', 90, 0.7, s, 170, brun));
      ev(14000, 32000, (t) => ton(120, t, 0.5, 0.012, 'sawtooth', s, 165));
      return n;
    },
    diner(s, ev) {
      const n = nappe(s, blanc, 'bandpass', 520, 0.6, 0.035, 0.13, 0.012).concat(nappe(s, brun, 'lowpass', 280, 0.7, 0.12));
      ev(7000, 16000, (t) => { ton(2400 + Math.random() * 500, t, 0.22, 0.012, 'sine', s); ton(3300, t + 0.07, 0.16, 0.008, 'sine', s); });
      ev(20000, 45000, (t) => souffle(t, 2.4, 0.03, 'highpass', 2600, 0.8, s));
      return n;
    },
    labo(s, ev) {
      const n = bourdon(s, 100, 0.012).concat(bourdon(s, 200, 0.005), nappe(s, brun, 'lowpass', 240, 0.7, 0.08));
      ev(950, 1050, (t) => souffle(t, 0.02, 0.012, 'highpass', 3000, 1, s));
      ev(7000, 16000, (t) => { for (let i = 0; i < 5; i++) souffle(t + i * 0.16, 0.11, 0.009, 'bandpass', 3400, 2, s); });
      return n;
    },
    bibliotheque(s, ev) {
      const n = nappe(s, brun, 'lowpass', 240, 0.7, 0.07);
      ev(9000, 24000, (t) => { souffle(t, 0.26, 0.018, 'bandpass', 2600, 0.9, s, 4200); souffle(t + 0.18, 0.2, 0.012, 'bandpass', 3400, 0.9, s, 1800); });
      ev(30000, 60000, (t) => ton(150, t, 0.4, 0.006, 'sawtooth', s, 190));
      return n;
    },
    site(s, ev) {
      const n = nappe(s, blanc, 'bandpass', 520, 0.8, 0.075, 0.09, 280, 'f').concat(nappe(s, brun, 'lowpass', 520, 0.7, 0.2, 0.11, 0.09));
      ev(8000, 22000, (t) => {
        for (let i = 0, k = 2 + Math.floor(Math.random() * 3); i < k; i++) {
          const d = t + i * 0.42, f = 1300 + Math.random() * 300;
          ton(f, d, 0.32, 0.011, 'triangle', reverb, f * 0.62);
          ton(f, d, 0.32, 0.008, 'triangle', s, f * 0.62);
        }
      });
      return n;
    },
    centre(s, ev) {
      const n = nappe(s, brun, 'lowpass', 300, 0.7, 0.11).concat(nappe(s, blanc, 'lowpass', 380, 0.7, 0.012, 0.07, 0.006), bourdon(s, 80, 0.007));
      ev(15000, 35000, (t) => ton(1900, t, 0.3, 0.005, 'sine', s));
      return n;
    }
  };
  Object.assign(AMB, { musee: AMB.centre, universite: AMB.labo, maine: AMB.site, reykjavik: AMB.bibliotheque, topkapi: AMB.librairie, bosphore: AMB.site, port: AMB.site, labo_nz: AMB.labo, palazzo: AMB.librairie, kirkwall: AMB.site, archives_or: AMB.bibliotheque, musee_st: AMB.centre });
  function arreter(a, duree) {
    if (!a) return;
    a.timers.forEach((x) => (x.stop = true));
    const t = ctx.currentTime;
    a.g.gain.cancelScheduledValues(t);
    a.g.gain.setValueAtTime(a.g.gain.value, t);
    a.g.gain.linearRampToValueAtTime(0, t + duree);
    setTimeout(() => { a.noeuds.forEach((n) => { try { n.stop(); } catch (e) { /* déjà arrêté */ } }); a.g.disconnect(); }, duree * 1000 + 100);
  }
  function ambiance(nom, force) {
    veutAmb = nom;
    if (!ctx || (nom === ambNom && !force)) return;
    arreter(amb, 1.2);
    amb = null; ambNom = nom;
    if (!nom || !AMB[nom]) return;
    const g = ctx.createGain(); g.gain.value = 0;
    g.connect(busAmb);
    g.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.5);
    const timers = [];
    const ev = (min, max, fn) => {
      const x = { stop: false }; timers.push(x);
      const boucle = () => { if (x.stop) return; setTimeout(() => { if (x.stop) return; if (ctx.state === 'running') fn(ctx.currentTime + 0.02); boucle(); }, min + Math.random() * (max - min)); };
      boucle();
    };
    amb = { g, timers, noeuds: AMB[nom](g, ev) };
  }

  /* musique : modes médiévaux en ré dorien, générée sans boucle audible */
  const ACC = [[146.83, 220, 349.23, 440], [130.81, 196, 329.63, 392], [110, 220, 329.63, 523.25], [98, 196, 293.66, 493.88]];
  const GAMME = [293.66, 349.23, 392, 440, 523.25, 587.33, 698.46];
  function musique(nom, force) {
    veutMus = nom;
    if (!ctx || (nom === musNom && !force)) return;
    if (mus) { mus.stop = true; const m = mus, t = ctx.currentTime; m.g.gain.cancelScheduledValues(t); m.g.gain.setValueAtTime(m.g.gain.value, t); m.g.gain.linearRampToValueAtTime(0, t + 2); setTimeout(() => m.g.disconnect(), 9500); }
    mus = null; musNom = nom;
    if (!nom) return;
    const g = ctx.createGain(); g.gain.value = 0;
    g.gain.linearRampToValueAtTime(nom === 'theme' ? 1 : 0.6, ctx.currentTime + 2.5);
    const fl = ctx.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = nom === 'theme' ? 900 : 620;
    g.connect(fl); fl.connect(busMus); fl.connect(reverb);
    const etat = { g, stop: false };
    mus = etat;
    let i = 0;
    const accord = () => {
      if (etat.stop) return;
      if (ctx.state === 'running') {
        const t = ctx.currentTime + 0.05, a = ACC[i++ % ACC.length];
        a.forEach((f) => [-3, 3].forEach((det) => {
          const o = ctx.createOscillator(), e = ctx.createGain();
          o.type = 'triangle'; o.frequency.value = f; o.detune.value = det;
          e.gain.setValueAtTime(0.0001, t);
          e.gain.linearRampToValueAtTime(0.022, t + 3);
          e.gain.setValueAtTime(0.022, t + 5.5);
          e.gain.linearRampToValueAtTime(0.0001, t + 9);
          o.connect(e); e.connect(g); o.start(t); o.stop(t + 9.1);
        }));
      }
      setTimeout(accord, 8000);
    };
    accord();
    const pince = () => {
      if (etat.stop) return;
      if (ctx.state === 'running') {
        const t = ctx.currentTime + 0.03, f = GAMME[Math.floor(Math.random() * GAMME.length)];
        ton(f, t, 2.4, 0.05, 'triangle', g);
        ton(f * 2, t, 1.1, 0.012, 'sine', g);
      }
      setTimeout(pince, (nom === 'theme' ? 1600 : 3200) + Math.random() * 3200);
    };
    setTimeout(pince, 1500);
  }

  /* projecteur de la séquence finale */
  function projecteur(actif) {
    if (!ctx) return;
    if (actif && !proj) {
      const g = ctx.createGain(); g.gain.value = 0;
      g.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.5);
      g.connect(busFx);
      const porte = ctx.createGain(); porte.gain.value = 0.02;
      const l = ctx.createOscillator(), lg = ctx.createGain();
      l.type = 'square'; l.frequency.value = 18; lg.gain.value = 0.02;
      l.connect(lg); lg.connect(porte.gain); l.start();
      porte.connect(g);
      const n = nappe(porte, blanc, 'bandpass', 2100, 1.2, 1).concat(nappe(g, brun, 'lowpass', 180, 0.7, 0.1), bourdon(g, 110, 0.012, 'sawtooth'), [l]);
      proj = { g, n };
    } else if (!actif && proj) {
      const p = proj; proj = null;
      p.g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      setTimeout(() => { p.n.forEach((x) => { try { x.stop(); } catch (e) { /* déjà arrêté */ } }); p.g.disconnect(); }, 750);
    }
  }

  /* effets */
  const FX = {
    clic(t) { souffle(t, 0.025, 0.05, 'highpass', 1800); ton(760, t, 0.04, 0.025); },
    frappe(t) { souffle(t, 0.014, 0.012 + Math.random() * 0.006, 'bandpass', 2200 + Math.random() * 900, 1.5); },
    page(t) { souffle(t, 0.28, 0.1, 'bandpass', 2400, 0.8, null, 5200); souffle(t + 0.2, 0.22, 0.06, 'bandpass', 3800, 0.8, null, 1500); },
    tampon(t) { souffle(t, 0.09, 0.32, 'lowpass', 420, 0.9, null, null, brun); ton(95, t, 0.12, 0.24); souffle(t, 0.02, 0.09, 'highpass', 1600); },
    epingle(t) { souffle(t, 0.02, 0.1, 'highpass', 2800); ton(3100, t + 0.005, 0.1, 0.018); },
    fil(t) { ton(196, t, 0.35, 0.05, 'sawtooth', null, 186); ton(392, t, 0.2, 0.012, 'triangle'); souffle(t, 0.16, 0.022, 'highpass', 3400); },
    horloge(t) { [0, 0.16, 0.32].forEach((d) => souffle(t + d, 0.018, 0.14, 'bandpass', 3000 - d * 1200, 3)); },
    jour(t) { ton(523.25, t, 1.2, 0.06, 'sine'); ton(1046.5, t, 0.8, 0.012); ton(392, t + 0.2, 1.3, 0.05, 'sine'); },
    piece(t) { souffle(t, 0.12, 0.05, 'bandpass', 3000, 0.8, null, 1800); ton(587.33, t + 0.05, 0.4, 0.05, 'triangle'); ton(880, t + 0.16, 0.6, 0.05, 'triangle'); },
    scan(t) { for (let i = 0; i < 6; i++) ton(1100 + (i % 2) * 340, t + i * 0.08, 0.05, 0.03, 'square'); souffle(t, 0.6, 0.06, 'bandpass', 1400, 2, null, 3400); },
    coupe(t) { souffle(t, 0.022, 0.1, 'highpass', 2200); souffle(t + 0.075, 0.03, 0.12, 'highpass', 1500); },
    souffle(t) { souffle(t, 0.6, 0.09, 'bandpass', 300, 0.8, null, 2100); },
    compte(t) { ton(1000, t, 0.14, 0.05, 'sine'); },
    avion(t, duree) { const d = duree || 3; souffle(t, d, 0.2, 'bandpass', 220, 0.6, null, 620, brun); souffle(t, d, 0.03, 'highpass', 1800, 0.5, null, 3600); ton(95, t, d, 0.03, 'sawtooth', null, 145); },
    etoile(t, n) { const f = 523.25 * Math.pow(1.122, n || 0); ton(f, t, 0.9, 0.06, 'triangle'); ton(f * 2, t, 0.5, 0.018); },
    bon(t) { [293.66, 440, 587.33, 739.99].forEach((f, i) => ton(f, t + i * 0.13, 1.8, 0.05, 'triangle')); },
    moyen(t) { [293.66, 440, 523.25].forEach((f, i) => ton(f, t + i * 0.16, 1.6, 0.045, 'triangle')); },
    mauvais(t) { ton(146.83, t, 1.4, 0.09, 'triangle'); ton(155.56, t + 0.18, 1.4, 0.07, 'triangle'); souffle(t, 0.2, 0.2, 'lowpass', 240, 0.8, null, null, brun); },
    refus(t) { ton(180, t, 0.16, 0.05, 'square', null, 130); }
  };
  function fx(nom, arg) {
    if (!ctx || ctx.state !== 'running' || !FX[nom]) return;
    FX[nom](ctx.currentTime + 0.005, arg);
  }
  function regler(c) {
    Object.assign(cfg, c);
    try { localStorage.setItem(KS, JSON.stringify(cfg)); } catch (e) { /* ignoré */ }
    if (ctx) maitre.gain.setTargetAtTime(cfg.muet ? 0 : cfg.vol * PUISSANCE, ctx.currentTime, 0.04);
  }
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else ctx.resume();
  });
  /* mesure du niveau, pour contrôler qu'on n'écrête pas */
  function etat() { return { ctx: ctx ? ctx.state : 'absent', amb: ambNom, mus: musNom, cfg: Object.assign({}, cfg) }; }
  function analyser(ms) {
    return new Promise((ok) => {
      const a = ctx.createAnalyser(); a.fftSize = 2048; maitre.connect(a);
      const b = new Float32Array(a.fftSize); let crete = 0, somme = 0, n = 0;
      const fin = performance.now() + ms;
      const iv = setInterval(() => {
        a.getFloatTimeDomainData(b);
        for (let i = 0; i < b.length; i++) { crete = Math.max(crete, Math.abs(b[i])); somme += b[i] * b[i]; n++; }
        if (performance.now() > fin) { clearInterval(iv); maitre.disconnect(a); ok({ crete: +crete.toFixed(3), rms: +Math.sqrt(somme / n).toFixed(4) }); }
      }, 40);
    });
  }
  return { cfg, debloquer, ambiance, musique, projecteur, fx, regler, etat, analyser };
})();
