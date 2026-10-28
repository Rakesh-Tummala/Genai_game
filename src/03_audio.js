// =====================================================================
//  CHIPTUNE AUDIO  (Web Audio: pulse/triangle/saw/pluck voices, harmony lines, noise drums,
//  a theme per city plus battle, hall, shop, shrine, ending and fanfare tracks)
// =====================================================================
const Sound = (() => {
  let ac = null, master, musicBus, sfxBus, noiseBuf;
  let track = null, trackName = null, step = 0, nextT = 0, timer = null;
  const midi = n => 440 * Math.pow(2, (n - 69) / 12);
  const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function parseNote(t) { const m = /^([A-G])([#b]?)(\d)$/.exec(t); if (!m) return 0; return 12 * (+m[3] + 1) + NOTE[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0); }
  function parseLine(s) { // tokens: note | '-' hold | '.' rest   => events [{step,n,len}]
    const toks = s.replace(/\|/g, ' ').trim().split(/\s+/); const ev = []; let cur = null;
    toks.forEach((t, i) => { if (t === '-') { if (cur) cur.len++; } else if (t === '.') cur = null; else { cur = { step: i, n: parseNote(t), len: 1 }; ev.push(cur); } });
    return { len: toks.length, ev };
  }
  const T = {
    title: { voice: 'pulse', bpm: 84, drone: [36, 43], lead: 'C5 - - Db5 E5 - F5 - G5 - - - Ab5 G5 F5 E5 | F5 - E5 Db5 C5 - - - B4 - C5 Db5 C5 - - -', bass: 'C3 - - - - - - - C3 - - - G2 - - - F2 - - - - - - - G2 - - - C3 - - -', drums: 'k.......h...k...k.......h...s...' },
    city: { voice: 'pluck', bpm: 108, drone: [36, 43], lead: 'E5 F#5 G5 - A5 - G5 F#5 E5 - D5 - E5 - - - G5 A5 B5 - A5 G5 F#5 - E5 - D5 E5 C5 - - - B4 - D5 - E5 F#5 E5 D5 C5 - B4 - A4 - - - C5 - E5 F#5 G5 - F#5 E5 D5 E5 C5 B4 C5 - - -', bass: 'C3 . G3 . C3 . G3 . A2 . E3 . A2 . E3 . F2 . C3 . F2 . C3 . G2 . D3 . G2 . D3 . E3 . B3 . E3 . B3 . A2 . E3 . A2 . E3 . F2 . C3 . F2 . C3 . G2 . D3 . C3 . . .', drums: 'k.h.s.h.k.hks.h.' },
    route: { bpm: 132, lead: 'G4 - C5 - E5 - F5 E5 D5 - C5 - Bb4 - C5 - | E5 - G5 - A5 G5 F5 E5 D5 - Bb4 - C5 - - -', bass: 'C3 . C3 G2 Bb2 . C3 . F2 . F2 C3 G2 . C3 . C3 . C3 G2 Bb2 . C3 . F2 . G2 . C3 . . .', drums: 'k.hkh.s.k.hkh.sh' },
    battle: { voice: 'square', bpm: 160, lead: 'C5 Eb5 G5 Eb5 C5 Eb5 G5 Ab5 G5 F5 Eb5 Db5 C5 - Bb4 - | C5 Eb5 G5 Bb5 Ab5 G5 F5 Eb5 F5 - Db5 - C5 - - -', bass: 'C3 C3 C4 C3 C3 C3 Bb2 C3 Ab2 Ab2 Ab3 Ab2 Bb2 Bb2 Bb3 Bb2 C3 C3 C4 C3 C3 C3 Bb2 C3 Db3 Db3 Db4 Db3 C3 C3 C4 C3', drums: 'k.hsk.hsk.hsk.ss' },
    boss: { voice: 'saw', bpm: 168, drone: [36], lead: 'C5 Db5 E5 C5 F5 E5 Db5 C5 G5 - Ab5 G5 F5 E5 Db5 - | C6 B5 Ab5 G5 F5 E5 F5 G5 Ab5 G5 F5 E5 Db5 - C5 -', bass: 'C2 C3 C2 C3 C2 C3 Db2 Db3 C2 C3 C2 C3 C2 C3 Db2 Db3 F2 F3 F2 F3 G2 G3 G2 G3 Ab2 Ab3 G2 G3 Db2 Db3 C2 C3', drums: 'kkhsk.hskkhsk.ss' },
    greece: { voice: 'pluck', bpm: 116, lead: 'D5 - A4 - D5 E5 F5 - E5 D5 C5 - D5 - - - | F5 - G5 A5 - G5 F5 E5 D5 - E5 F5 E5 - - -', bass: 'D3 . A2 . D3 . A2 . C3 . G2 . D3 . . . F2 . C3 . G2 . D3 . A2 . E3 . A2 . . .', drums: 'k.h.k.h.s.h.k.hh' },
    norse: { voice: 'tri', bpm: 92, drone: [33, 40], lead: 'A4 - - C5 E5 - D5 C5 B4 - - - G4 - A4 - | C5 - D5 E5 - - G5 E5 D5 - C5 B4 A4 - - -', bass: 'A2 - - - - - - - G2 - - - - - - - F2 - - - - - - - E2 - - - G2 - - -', drums: 'k.......k...s...' },
    egypt: { voice: 'saw', bpm: 112, drone: [38], lead: 'D5 Eb5 F#5 - G5 F#5 Eb5 D5 C5 - D5 - - - - - | A4 - Bb4 C5 D5 - Eb5 D5 C5 Bb4 A4 - D5 - - -', bass: 'D3 . D3 . A2 . D3 . C3 . C3 . D3 . . . D3 . D3 . G2 . G2 . A2 . A2 . D3 . . .', drums: 'k.hk.hs.k.hk.sh.' },
    japan: { voice: 'pluck', bpm: 96, lead: 'E5 - F5 - A5 - - - B5 A5 F5 E5 - - - - | C5 - E5 F5 A5 - F5 E5 B4 - C5 - E5 - - -', bass: 'E2 - - - - - - - A2 - - - - - - - F2 - - - - - - - E2 - - - B2 - - -', drums: 'k...h...k.k.s...' },
    celtic: { voice: 'pulse', bpm: 132, lead: 'G5 A5 B5 A5 G5 E5 D5 E5 G5 - A5 - B5 - D6 - | E6 D6 B5 A5 G5 A5 B5 G5 A5 - E5 - G5 - - -', bass: 'G2 . D3 . G2 . D3 . F2 . C3 . F2 . C3 . A2 . E3 . A2 . E3 . D3 . G2 . . . . .', drums: 'k.hk.hs.hk.hs.h.' },
    meso: { voice: 'saw', bpm: 100, drone: [33], lead: 'A4 - Bb4 - C5 - D5 - E5 - F5 E5 D5 - - - | C5 - D5 E5 - D5 C5 Bb4 A4 - - - G4 - A4 -', bass: 'A2 - - - E2 - - - F2 - - - E2 - - - A2 - - - D3 - - - E2 - - - A2 - - -', drums: 'k..k..s.k..k.ss.' },
    slavic: { voice: 'pulse', bpm: 120, lead: 'A4 - C5 - E5 - D5 C5 B4 - G4 - A4 - - - | E5 - F5 E5 D5 - C5 B4 C5 - A4 - B4 - - -', bass: 'A2 . E3 . A2 . E3 . G2 . D3 . G2 . D3 . F2 . C3 . F2 . C3 . E2 . B2 . E2 . . .', drums: 'k.h.s.h.k.hks.h.' },
    trainer: { voice: 'pulse', bpm: 150, lead: 'G4 B4 D5 G5 F#5 - D5 - E5 D5 B4 G4 A4 - - - | G4 B4 D5 G5 A5 - B5 A5 G5 F#5 E5 D5 G5 - - -', bass: 'G2 G3 G2 G3 D2 D3 D2 D3 C2 C3 C2 C3 D2 D3 D2 D3 G2 G3 G2 G3 D2 D3 D2 D3 C2 C3 D2 D3 G2 G3 G2 G3', drums: 'k.hsk.hsk.hsk.hs' },
    lieutenant: { voice: 'saw', bpm: 164, drone: [38], lead: 'D5 F5 A5 F5 D5 F5 A5 C6 Bb5 A5 G5 F5 E5 - C5 - | D5 F5 A5 D6 C6 Bb5 A5 G5 A5 - F5 - D5 - - -', bass: 'D2 D3 D2 D3 D2 D3 C2 C3 Bb1 Bb2 Bb1 Bb2 A1 A2 A1 A2 D2 D3 D2 D3 F2 F3 F2 F3 G2 G3 A2 A3 D2 D3 D2 D3', drums: 'kkhsk.hskkhsk.ss' },
    god: { voice: 'pulse', bpm: 140, drone: [36, 43], lead: 'C5 - G4 - C5 D5 Eb5 - F5 - Eb5 D5 C5 - G5 - | Ab5 - G5 F5 Eb5 - D5 - C5 - D5 Eb5 D5 - - -', harm: 'Eb4 - - - G4 - - - Ab4 - - - G4 - - - F4 - - - G4 - - - Ab4 - - - G4 - - -', bass: 'C2 . C2 . C2 . G1 . Ab1 . Ab1 . G1 . G1 . C2 . C2 . C2 . F1 . F1 . G1 . G1 . C2 .', drums: 'k..sk.hsk..sk.ss' },
    hall: { voice: 'tri', bpm: 80, drone: [36], lead: 'C5 - - - - - Db5 - C5 - - - - - - - | G4 - - - - - Ab4 - G4 - - - - - - -', bass: 'C2 - - - - - - - - - - - - - - - G1 - - - - - - - - - - - - - - -', drums: 'k...............' },
    shop: { voice: 'pluck', bpm: 124, lead: 'C5 E5 G5 E5 F5 A5 G5 - E5 G5 C6 G5 A5 G5 E5 - | D5 F5 A5 F5 E5 G5 C6 - B5 A5 G5 F5 E5 D5 C5 -', bass: 'C3 . G2 . F2 . G2 . C3 . G2 . F2 . C3 . D3 . A2 . C3 . G2 . G2 . G2 . C3 . . .', drums: 'k.h.s.h.k.h.s.hh' },
    shrine: { voice: 'tri', bpm: 72, lead: 'E5 - G5 - B5 - - - A5 - G5 - E5 - - - | D5 - E5 - G5 - - - E5 - D5 - C5 - - -', bass: 'C3 - - - - - - - A2 - - - - - - - F2 - - - - - - - G2 - - - - - - -', drums: '................' },
    ending: { voice: 'pulse', bpm: 100, lead: 'C5 - E5 - G5 - C6 - B5 - G5 - A5 - - - | F5 - A5 - C6 - F5 - E5 - D5 - C5 - - -', harm: 'E4 - - - - - - - D4 - - - C4 - - - A3 - - - - - - - G3 - - - E4 - - -', bass: 'C3 - - - G2 - - - E2 - - - A2 - - - F2 - - - C3 - - - G2 - - - C3 - - -', drums: 'k...h...k...h.h.' },
    fanfare: { voice: 'pulse', bpm: 140, once: true, lead: 'C5 C5 C5 - G4 - - C5 - E5 - G5 - - - - C6 - - - - - - - . . . . . . . .', bass: 'C3 - - - - - - - G2 - - - - - - - C3 - - - - - - - . . . . . . . .', drums: 'k...k...k.s.k...' },
    victory: { voice: 'pulse', bpm: 150, once: true, lead: 'C5 E5 G5 C6 - - G5 C6 - - - - . . . .', bass: 'C3 - - - - - G2 C3 - - - - . . . .', drums: 'k...k...k.s.k...' },
  };
  for (const k in T) { T[k].L = parseLine(T[k].lead); T[k].B = parseLine(T[k].bass); if (T[k].harm) T[k].Hm = parseLine(T[k].harm); }

  function init() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
    try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
    master = ac.createGain(); master.connect(ac.destination);
    musicBus = ac.createGain(); musicBus.connect(master);
    sfxBus = ac.createGain(); sfxBus.connect(master);
    noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    applyVolumes();
    if (trackName) { const n = trackName; trackName = null; play(n); }
  }
  const LEVELS = [0, .12, .22, .32, .45], SFX_LEVELS = [0, .2, .38, .55, .75];
  if (Settings.musicVol === undefined) Settings.musicVol = Settings.music === false ? 0 : 3;
  if (Settings.sfxVol === undefined) Settings.sfxVol = Settings.sfx === false ? 0 : 3;
  function applyVolumes() {
    if (!ac) return;
    master.gain.value = Settings.muted ? 0 : 0.55;
    musicBus.gain.setTargetAtTime(LEVELS[Settings.musicVol] || 0, ac.currentTime, .05);
    sfxBus.gain.value = SFX_LEVELS[Settings.sfxVol] || 0;
  }
  function tone(f, t, dur, type = 'square', vol = 0.15, bus = musicBus, slideTo = 0) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    o.connect(g); g.connect(bus); o.start(t); o.stop(t + dur + 0.03);
  }
  function noise(t, dur, vol = 0.1, bus = musicBus, hp = 1000) {
    const s = ac.createBufferSource(); s.buffer = noiseBuf;
    const f = ac.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp;
    const g = ac.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    s.connect(f); f.connect(g); g.connect(bus); s.start(t); s.stop(t + dur + 0.02);
  }
  function scheduleStep(t) {
    const tr = track, spb = 60 / tr.bpm / 2;
    const sL = step % tr.L.len, sB = step % tr.B.len;
    for (const e of tr.L.ev) if (e.step === sL && e.n) {
      const f = midi(e.n), d = e.len * spb, v = tr.voice || 'square';
      if (v === 'tri') { tone(f, t, d * .95, 'triangle', .16); tone(f * 2, t, d * .5, 'sine', .025); }
      else if (v === 'saw') { tone(f, t, d * .95, 'sawtooth', .045); tone(f * 1.004, t, d * .9, 'square', .03); }
      else if (v === 'pluck') { tone(f, t, Math.min(d, .22), 'square', .085); tone(f * 2, t, .06, 'triangle', .04); }
      else if (v === 'pulse') { tone(f, t, d * .95, 'square', .06); tone(f * 1.007, t, d * .9, 'square', .045); }
      else { tone(f, t, d * .95, 'square', .075); tone(f * 1.003, t, d * .9, 'square', .03); }
    }
    if (tr.Hm) { const sH = step % tr.Hm.len; for (const e of tr.Hm.ev) if (e.step === sH && e.n) tone(midi(e.n), t, e.len * spb * .95, 'triangle', .08); }
    for (const e of tr.B.ev) if (e.step === sB && e.n) tone(midi(e.n), t, e.len * spb * 0.9, 'triangle', 0.2);
    const dc = tr.drums[step % tr.drums.length];
    if (dc === 'k') tone(140, t, 0.16, 'sine', 0.35, musicBus, 40);
    else if (dc === 's') { noise(t, 0.12, 0.13, musicBus, 1500); tone(220, t, 0.08, 'triangle', 0.1, musicBus, 120); }
    else if (dc === 'h') noise(t, 0.04, 0.05, musicBus, 6000);
    if (tr.drone && step % 16 === 0) for (const n of tr.drone) tone(midi(n), t, spb * 16, 'sawtooth', 0.018);
    step++;
    if (tr.once && step >= tr.L.len) { stop(); }
  }
  function pump() {
    if (!ac || !track) return;
    while (nextT < ac.currentTime + 0.15) { scheduleStep(nextT); if (!track) break; nextT += 60 / track.bpm / 2; }
  }
  function play(name) {
    if (trackName === name && track) return;
    trackName = name; track = null;
    if (!ac) return;
    track = T[name] || null; step = 0; nextT = ac.currentTime + 0.06;
    if (!timer) timer = setInterval(pump, 25);
  }
  function stop() { track = null; trackName = null; }
  const S = {
    cursor: t => tone(880, t, 0.04, 'square', 0.1, sfxBus),
    confirm: t => { tone(988, t, 0.05, 'square', 0.12, sfxBus); tone(1318, t + 0.05, 0.08, 'square', 0.12, sfxBus); },
    cancel: t => tone(440, t, 0.08, 'square', 0.1, sfxBus, 300),
    bump: t => tone(90, t, 0.08, 'square', 0.12, sfxBus, 60),
    door: t => { noise(t, 0.15, 0.12, sfxBus, 400); tone(200, t, 0.12, 'triangle', 0.2, sfxBus, 120); },
    text: t => tone(1400, t, 0.015, 'square', 0.03, sfxBus),
    encounter: t => { for (let i = 0; i < 6; i++) tone(i % 2 ? 660 : 880, t + i * 0.06, 0.06, 'square', 0.13, sfxBus); },
    hit: t => { noise(t, 0.18, 0.3, sfxBus, 300); tone(160, t, 0.15, 'square', 0.15, sfxBus, 60); },
    crit: t => { noise(t, 0.25, 0.35, sfxBus, 200); tone(300, t, 0.25, 'sawtooth', 0.15, sfxBus, 50); },
    weak: t => { noise(t, 0.1, 0.15, sfxBus, 1200); },
    heal: t => { [523, 659, 784, 1046].forEach((f, i) => tone(f, t + i * 0.07, 0.12, 'triangle', 0.2, sfxBus)); },
    status: t => { tone(300, t, 0.2, 'square', 0.1, sfxBus, 600); tone(320, t + 0.1, 0.2, 'square', 0.08, sfxBus, 200); },
    buff: t => { [440, 554, 659].forEach((f, i) => tone(f, t + i * 0.05, 0.1, 'square', 0.1, sfxBus)); },
    debuff: t => { [659, 554, 440].forEach((f, i) => tone(f, t + i * 0.05, 0.1, 'square', 0.1, sfxBus)); },
    shield: t => { tone(330, t, 0.35, 'triangle', 0.25, sfxBus, 660); tone(495, t + 0.05, 0.3, 'sine', 0.1, sfxBus, 990); },
    faint: t => tone(600, t, 0.6, 'square', 0.15, sfxBus, 80),
    levelup: t => { [523, 659, 784, 659, 784, 1046].forEach((f, i) => tone(f, t + i * 0.08, 0.1, 'square', 0.12, sfxBus)); },
    throw: t => { noise(t, 0.3, 0.12, sfxBus, 2000); tone(400, t, 0.3, 'triangle', 0.1, sfxBus, 900); },
    shake: t => { tone(180, t, 0.06, 'square', 0.15, sfxBus); noise(t, 0.05, 0.1, sfxBus, 800); },
    tamed: t => { [784, 988, 1175, 1568].forEach((f, i) => tone(f, t + i * 0.1, 0.2, 'square', 0.12, sfxBus)); },
    breakout: t => { noise(t, 0.25, 0.25, sfxBus, 600); tone(500, t, 0.2, 'square', 0.12, sfxBus, 150); },
    run: t => { [600, 500, 400].forEach((f, i) => tone(f, t + i * 0.05, 0.06, 'square', 0.1, sfxBus)); },
    buy: t => { tone(1318, t, 0.06, 'square', 0.12, sfxBus); tone(1760, t + 0.07, 0.12, 'square', 0.12, sfxBus); },
    thunder: t => { noise(t, 0.9, 0.45, sfxBus, 80); tone(70, t, 0.8, 'sawtooth', 0.2, sfxBus, 30); },
    evolve: t => { for (let i = 0; i < 12; i++) tone(400 + i * 60, t + i * 0.08, 0.1, 'square', 0.1, sfxBus); },
    magic: t => { [880, 1175, 1480, 1760].forEach((f, i) => tone(f, t + i * 0.04, 0.15, 'sine', 0.12, sfxBus)); },
    lowhp: t => { tone(1046, t, .07, 'square', .06, sfxBus); tone(880, t + .09, .07, 'square', .05, sfxBus); },
    step: t => noise(t, .05, .05, sfxBus, 3000),
    menu: t => { tone(660, t, .05, 'square', .1, sfxBus); tone(990, t + .05, .07, 'square', .1, sfxBus); },
    item: t => { tone(784, t, .06, 'triangle', .15, sfxBus); tone(1175, t + .06, .1, 'triangle', .15, sfxBus); },
    custom: t => { for (let i = 0; i < 8; i++) tone(500 + i * 110, t + i * .035, .12, i % 2 ? 'sine' : 'triangle', .1, sfxBus); noise(t, .4, .06, sfxBus, 4000); },
    seal: t => { [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => tone(f, t + i * .09, .16, 'square', .12, sfxBus)); },
    pickup: t => { [784, 1046, 1318].forEach((f, i) => tone(f, t + i * 0.06, 0.1, 'square', 0.12, sfxBus)); },
  };
  function sfx(name) { if (!ac) return; const f = S[name]; if (f) f(ac.currentTime + 0.005); }
  function toggleMute() { Settings.muted = !Settings.muted; saveSettings(); applyVolumes(); return Settings.muted; }
  return { init, play, stop, sfx, toggleMute, applyVolumes, LEVELS, get current() { return trackName; } };
})();
