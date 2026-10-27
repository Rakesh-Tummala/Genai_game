// =====================================================================
//  CHIPTUNE AUDIO  (Web Audio: square/triangle voices, noise drums, raga-flavoured loops)
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
    title: { bpm: 84, drone: [36, 43], lead: 'C5 - - Db5 E5 - F5 - G5 - - - Ab5 G5 F5 E5 | F5 - E5 Db5 C5 - - - B4 - C5 Db5 C5 - - -', bass: 'C3 - - - - - - - C3 - - - G2 - - - F2 - - - - - - - G2 - - - C3 - - -', drums: 'k.......h...k...k.......h...s...' },
    city: { bpm: 108, drone: [36, 43], lead: 'E5 F#5 G5 - A5 - G5 F#5 E5 - D5 - E5 - - - G5 A5 B5 - A5 G5 F#5 - E5 - D5 E5 C5 - - - B4 - D5 - E5 F#5 E5 D5 C5 - B4 - A4 - - - C5 - E5 F#5 G5 - F#5 E5 D5 E5 C5 B4 C5 - - -', bass: 'C3 . G3 . C3 . G3 . A2 . E3 . A2 . E3 . F2 . C3 . F2 . C3 . G2 . D3 . G2 . D3 . E3 . B3 . E3 . B3 . A2 . E3 . A2 . E3 . F2 . C3 . F2 . C3 . G2 . D3 . C3 . . .', drums: 'k.h.s.h.k.hks.h.' },
    route: { bpm: 132, lead: 'G4 - C5 - E5 - F5 E5 D5 - C5 - Bb4 - C5 - | E5 - G5 - A5 G5 F5 E5 D5 - Bb4 - C5 - - -', bass: 'C3 . C3 G2 Bb2 . C3 . F2 . F2 C3 G2 . C3 . C3 . C3 G2 Bb2 . C3 . F2 . G2 . C3 . . .', drums: 'k.hkh.s.k.hkh.sh' },
    battle: { bpm: 160, lead: 'C5 Eb5 G5 Eb5 C5 Eb5 G5 Ab5 G5 F5 Eb5 Db5 C5 - Bb4 - | C5 Eb5 G5 Bb5 Ab5 G5 F5 Eb5 F5 - Db5 - C5 - - -', bass: 'C3 C3 C4 C3 C3 C3 Bb2 C3 Ab2 Ab2 Ab3 Ab2 Bb2 Bb2 Bb3 Bb2 C3 C3 C4 C3 C3 C3 Bb2 C3 Db3 Db3 Db4 Db3 C3 C3 C4 C3', drums: 'k.hsk.hsk.hsk.ss' },
    boss: { bpm: 168, drone: [36], lead: 'C5 Db5 E5 C5 F5 E5 Db5 C5 G5 - Ab5 G5 F5 E5 Db5 - | C6 B5 Ab5 G5 F5 E5 F5 G5 Ab5 G5 F5 E5 Db5 - C5 -', bass: 'C2 C3 C2 C3 C2 C3 Db2 Db3 C2 C3 C2 C3 C2 C3 Db2 Db3 F2 F3 F2 F3 G2 G3 G2 G3 Ab2 Ab3 G2 G3 Db2 Db3 C2 C3', drums: 'kkhsk.hskkhsk.ss' },
    victory: { bpm: 150, once: true, lead: 'C5 E5 G5 C6 - - G5 C6 - - - - . . . .', bass: 'C3 - - - - - G2 C3 - - - - . . . .', drums: 'k...k...k.s.k...' },
  };
  for (const k in T) { T[k].L = parseLine(T[k].lead); T[k].B = parseLine(T[k].bass); }

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
  function applyVolumes() {
    if (!ac) return;
    master.gain.value = Settings.muted ? 0 : 0.55;
    musicBus.gain.value = Settings.music ? 0.32 : 0;
    sfxBus.gain.value = Settings.sfx ? 0.55 : 0;
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
    for (const e of tr.L.ev) if (e.step === sL && e.n) { tone(midi(e.n), t, e.len * spb * 0.95, 'square', 0.075); tone(midi(e.n) * 1.003, t, e.len * spb * 0.9, 'square', 0.03); }
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
    pickup: t => { [784, 1046, 1318].forEach((f, i) => tone(f, t + i * 0.06, 0.1, 'square', 0.12, sfxBus)); },
  };
  function sfx(name) { if (!ac) return; const f = S[name]; if (f) f(ac.currentTime + 0.005); }
  function toggleMute() { Settings.muted = !Settings.muted; saveSettings(); applyVolumes(); return Settings.muted; }
  return { init, play, stop, sfx, toggleMute, applyVolumes, get current() { return trackName; } };
})();
