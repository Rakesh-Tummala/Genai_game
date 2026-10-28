// =====================================================================
//  PROCEDURAL PIXEL ART
//  Creatures: body templates (serpentine, winged, quadruped, avian, humanoid,
//  aquatic, spirit) + per-species palette, pattern and accessories, 2 idle frames.
// =====================================================================
const SPR = 64;
// palette indices used while painting
const IX = { OUT: 1, BASE: 2, ACC: 3, BELLY: 4, WHITE: 5, EYE: 6, GLOW: 7, FAR: 8, HORN: 9, ACCFAR: 10, GOLD: 11, PAT: 12 };
class Pix {
  constructor() { this.a = new Uint8Array(SPR * SPR); }
  get(x, y) { return (x < 0 || y < 0 || x >= SPR || y >= SPR) ? 0 : this.a[y * SPR + x]; }
  put(x, y, c, mode) {
    if (x < 0 || y < 0 || x >= SPR || y >= SPR) return;
    const i = y * SPR + x, v = this.a[i];
    if (mode === 'under') { if (v === 0) this.a[i] = c; }
    else if (mode === 'on') { if (v === IX.BASE) this.a[i] = c; }
    else if (mode === 'onAny') { if (v !== 0) this.a[i] = c; }
    else this.a[i] = c;
  }
  ell(cx, cy, rx, ry, c, mode) {
    rx = Math.max(.5, rx); ry = Math.max(.5, ry);
    for (let y = Math.floor(cy - ry - 1); y <= Math.ceil(cy + ry + 1); y++)
      for (let x = Math.floor(cx - rx - 1); x <= Math.ceil(cx + rx + 1); x++) {
        const dx = (x + .5 - cx) / rx, dy = (y + .5 - cy) / ry;
        if (dx * dx + dy * dy <= 1) this.put(x, y, c, mode);
      }
  }
  oell(cx, cy, rx, ry, c) { this.ell(cx, cy, rx + 1, ry + 1, IX.OUT); this.ell(cx, cy, rx, ry, c); }
  rect(x, y, w, h, c, mode) { for (let j = Math.floor(y); j < y + h; j++) for (let i = Math.floor(x); i < x + w; i++) this.put(i, j, c, mode); }
  poly(pts, c, mode) {
    let minY = 1e9, maxY = -1e9; for (const p of pts) { minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); }
    for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
      const yy = y + .5, xs = [];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], b = pts[(i + 1) % pts.length];
        if ((a[1] <= yy && b[1] > yy) || (b[1] <= yy && a[1] > yy)) xs.push(a[0] + (yy - a[1]) / (b[1] - a[1]) * (b[0] - a[0]));
      }
      xs.sort((p, q) => p - q);
      for (let k = 0; k + 1 < xs.length; k += 2) for (let x = Math.round(xs[k]); x < Math.round(xs[k + 1]); x++) this.put(x, y, c, mode);
    }
  }
  opoly(pts, c) { // outlined polygon: paint outline ring by offsetting
    for (const [ox, oy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) this.poly(pts.map(p => [p[0] + ox, p[1] + oy]), IX.OUT);
    this.poly(pts, c);
  }
  line(x0, y0, x1, y1, c, r = 0, mode) {
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2));
    for (let i = 0; i <= n; i++) { const t = i / n, x = lerp(x0, x1, t), y = lerp(y0, y1, t); if (r > .6) this.ell(x, y, r, r, c, mode); else this.put(Math.floor(x), Math.floor(y), c, mode); }
  }
  // smooth tube through points (Catmull-Rom), radius r0 -> r1
  tube(pts, r0, r1, c, mode, outline) {
    const P = [pts[0], ...pts, pts[pts.length - 1]], samples = [];
    for (let i = 1; i < P.length - 2; i++) for (let k = 0; k < 10; k++) {
      const t = k / 10, p0 = P[i - 1], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2];
      const f = (a, b, c2, d) => .5 * ((2 * b) + (-a + c2) * t + (2 * a - 5 * b + 4 * c2 - d) * t * t + (-a + 3 * b - 3 * c2 + d) * t * t * t);
      samples.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
    samples.push(pts[pts.length - 1]);
    const N = samples.length;
    if (outline) samples.forEach((s, i) => { const r = lerp(r0, r1, i / (N - 1)); this.ell(s[0], s[1], r + 1, r + 1, IX.OUT, mode); });
    samples.forEach((s, i) => { const r = lerp(r0, r1, i / (N - 1)); this.ell(s[0], s[1], r, r, c, mode); });
    return samples;
  }
  eye(x, y, big) {
    x = Math.round(x); y = Math.round(y);
    this.rect(x, y, 2, 2, IX.WHITE); if (big) this.rect(x - 1, y, 1, 2, IX.WHITE);
    this.rect(x, y, 1, 2, IX.EYE); this.put(x + 1, y - 1, IX.OUT);
  }
  flame(x, y, h, f) {
    const w = h * .45, t = f ? 1 : -1;
    this.poly([[x - w, y], [x + t, y - h], [x + w, y]], IX.GLOW);
    this.poly([[x - w * .5, y], [x + t * .5, y - h * .55], [x + w * .5, y]], IX.ACC);
  }
}

// ---------------- body templates (all face LEFT) ----------------------
const TEMPLATES = {
  quadruped(g, P, f) {
    const s = P.size, A = P.acc, bob = f ? 1 : 0, ground = 61, ele = A.has('elephant');
    const legH = (ele ? 12 : 10) * s + (A.has('tall') ? 5 * s : 0), bRX = (ele ? 19 : 16) * s, bRY = (ele ? 12 : 9.5) * s;
    const cx = 35, bcy = ground - legH - bRY * .45 + bob;
    const hr = (ele ? 9.5 : 8) * s, hx = cx - bRX * .82, hy = bcy - bRY * .75;
    const tx = cx + bRX - 1, ty = bcy - bRY * .3, tip = [tx + 9 * s, ty - 13 * s + (f ? 1 : -1)];
    const K = { s, cx, bcy, bRX, bRY, hx, hy, hr, ground, tx, ty, tip, f };
    const customTail = ['tailsMany', 'bushyTail', 'stingerTail', 'noTail', 'snakeTail'].some(k => A.has(k));
    // tail
    if (customTail) { }
    else if (ele) g.tube([[tx, ty], [tx + 5 * s, ty + 4 * s], [tx + 6 * s, ty + 11 * s]], 1.3, .8, IX.BASE);
    else {
      g.tube([[tx, ty], [tx + 8 * s, ty - 3 * s], tip], 1.8 * s, 1.1, IX.BASE);
      if (A.has('tailFlame')) g.flame(tip[0], tip[1] + 2, 7 * s, f);
      else g.ell(tip[0], tip[1], 2.2 * s, 2.2 * s, IX.ACC);
    }
    if (A.has('wingsBig')) drawWing(g, [cx - 2, bcy - bRY + 2], [cx + 10 * s, bcy - bRY - (f ? 14 : 24) * s], [cx + 14 * s, bcy - 2], IX.ACCFAR, false);
    EXTRA(g, P, f, 'back', K);
    // far legs
    for (const lx of [cx - bRX * .55 + 3, cx + bRX * .5 + 3]) g.rect(lx - 2.4 * s, bcy, 4.8 * s, ground - bcy, IX.FAR);
    // body + belly
    g.ell(cx, bcy, bRX, bRY, IX.BASE);
    g.ell(cx - 1, bcy + bRY * .5, bRX * .78, bRY * .5, IX.BELLY, 'on');
    applyPattern(g, P);
    if (A.has('flames')) for (let i = 0; i < 3; i++) g.flame(cx - bRX * .35 + i * bRX * .38, bcy - bRY + 2, (6 + (i === 1 ? 3 : 0)) * s, (f + i) % 2);
    // near legs
    for (const lx of [cx - bRX * .62, cx + bRX * .42]) {
      g.rect(lx - 3.4 * s, bcy + 2, 6.8 * s + 2, ground - bcy - 2 + 1, IX.OUT);
      g.rect(lx - 2.6 * s, bcy + 2, 5.2 * s, ground - bcy - 2, IX.BASE);
      g.rect(lx - 2.6 * s, ground - 2, 5.2 * s, 2, ele ? IX.BELLY : IX.ACC);
    }
    if (A.has('cloud')) for (let i = 0; i < 5; i++) g.ell(cx - bRX + i * bRX * .5, ground - 1, 5 * s, 2.5, IX.BELLY, 'under');
    if (A.has('wingsBig')) drawWing(g, [cx - 6, bcy - 3], [cx + 4 * s, bcy - bRY - (f ? 12 : 25) * s], [cx + 10 * s, bcy + 2], IX.ACC, true);
    EXTRA(g, P, f, 'front', K);
    // head
    if (A.has('mane') || A.has('maneBig')) {
      const R = hr * (A.has('maneBig') ? 1.65 : 1.35);
      for (let a = 0; a < 12; a++) { const an = a / 12 * Math.PI * 2; g.ell(hx + 2 + Math.cos(an) * R * .75, hy + Math.sin(an) * R * .75, R * .42, R * .42, IX.ACC); }
      g.ell(hx + 2, hy, R * .8, R * .8, IX.ACC);
    }
    if (A.has('earsBig')) g.ell(hx + hr * .9, hy - 1, hr * .55, hr * .9, IX.FAR);
    if (A.has('ears')) { g.poly([[hx + 1, hy - hr * .5], [hx + 4 * s, hy - hr * 1.45], [hx + 6 * s, hy - hr * .3]], IX.FAR); }
    EXTRA(g, P, f, 'preHead', K);
    g.oell(hx, hy, hr, hr * .92, IX.BASE);
    if (A.has('ears')) { g.opoly([[hx - 3 * s, hy - hr * .55], [hx - 1 * s, hy - hr * 1.5], [hx + 2.5 * s, hy - hr * .6]], IX.BASE); g.poly([[hx - 2 * s, hy - hr * .6], [hx - 1 * s, hy - hr * 1.2], [hx + 1.4 * s, hy - hr * .6]], IX.BELLY); }
    if (!ele && !A.has('noMuzzle')) g.ell(hx - hr * .55, hy + hr * .3, hr * .55, hr * .42, IX.BELLY);
    if (A.has('trunk')) g.tube([[hx - hr * .7, hy + hr * .15], [hx - hr * 1.25, hy + hr * .8], [hx - hr * 1.15, hy + hr * 1.6], [hx - hr * 1.55 + (f ? 1 : 0), hy + hr * 2.0]], 2.6 * s, 1.3, IX.BASE, null, true);
    if (A.has('trunkSmall')) g.tube([[hx - hr * .8, hy + hr * .25], [hx - hr * 1.2, hy + hr * .75], [hx - hr * 1.05 + (f ? 1 : 0), hy + hr * 1.15]], 1.8 * s, 1, IX.BASE, null, true);
    if (A.has('tusks')) { g.line(hx - hr * .55, hy + hr * .55, hx - hr * 1.35, hy + hr * .95, IX.HORN, .9); }
    if (A.has('tusksMany')) for (let i = 0; i < 3; i++) g.line(hx - hr * .5, hy + hr * (.45 + i * .18), hx - hr * (1.3 + i * .15), hy + hr * (.6 + i * .35), IX.HORN, .8);
    if (A.has('earsBig')) { g.oell(hx + hr * .45, hy + 1, hr * .5, hr * .85, IX.BASE); g.ell(hx + hr * .45, hy + 1, hr * .3, hr * .6, IX.BELLY); }
    if (A.has('horns')) { g.tube([[hx + 1, hy - hr * .7], [hx + 3 * s, hy - hr * 1.5], [hx + 7 * s, hy - hr * 1.75]], 1.6 * s, .7, IX.HORN, null, true); }
    if (A.has('crown')) crown(g, hx + 1, hy - hr * .85, 5 * s);
    if (A.has('gem')) g.rect(hx - hr * .2, hy - hr * .55, 2, 2, IX.GLOW);
    EXTRA(g, P, f, 'head', K);
    if (!A.has('noEye')) g.eye(hx - hr * .35, hy - hr * .25);
  },
  winged(g, P, f) { P.acc.add('wingsBig'); TEMPLATES.quadruped(g, P, f); },
  avian(g, P, f) {
    const s = P.size, A = P.acc, bob = f ? 1 : 0, ground = 61;
    const bx = 36, by = ground - 18 * s + bob;
    const hx = bx - 9 * s, hy = by - (A.has('longNeck') ? 21 : 12) * s;
    const K = { s, bx, by, hx, hy, hr: 7 * s, ground, f };
    // far wing
    if (f) drawWing(g, [bx, by - 7], [bx + 20 * s, by - 8 * s], [bx + 8, by + 3], IX.ACCFAR, false);
    else drawWing(g, [bx, by - 7], [bx + 14 * s, by - 27 * s], [bx + 12, by], IX.ACCFAR, false);
    // tail fan
    EXTRA(g, P, f, 'back', K);
    if (A.has('tailFan')) g.poly([[bx + 8 * s, by + 1], [bx + 22 * s, by - 4 * s], [bx + 26 * s, by + 4 * s], [bx + 22 * s, by + 12 * s], [bx + 8 * s, by + 7 * s]], IX.ACC);
    // legs
    for (const lx of [bx - 4 * s, bx + 3 * s]) { g.line(lx, by + 6 * s, lx - 1, ground - 1, IX.GOLD, .9); g.rect(lx - 3, ground - 1, 4, 1, IX.GOLD); }
    g.ell(bx, by, 12 * s, 10 * s, IX.BASE);
    g.ell(bx + 8 * s, by + 2 * s, 8 * s, 5 * s, IX.BASE);
    g.ell(bx - 5 * s, by + 3 * s, 7 * s, 6 * s, IX.BELLY, 'on');
    applyPattern(g, P);
    if (A.has('longNeck')) g.tube([[bx - 6 * s, by - 5 * s], [hx + 3 * s, hy + 10 * s], [hx + 1, hy + 2]], 3.4 * s, 2.6 * s, IX.BASE);
    EXTRA(g, P, f, 'preHead', K);
    if (A.has('crest')) for (let i = 0; i < 3; i++) g.tube([[hx + 1 + i * 2, hy - 4 * s], [hx + 5 + i * 3, hy - 10 * s - i], [hx + 10 + i * 3, hy - 12 * s + i * 2]], 1.4, .6, IX.ACC);
    g.oell(hx, hy, 7 * s, 6.5 * s, IX.BASE);
    g.ell(hx - 2 * s, hy + 3 * s, 4 * s, 3 * s, IX.BELLY, 'on');
    g.opoly([[hx - 5 * s, hy - 1.5 * s], [hx - 13 * s, hy + 1.5 * s], [hx - 11 * s, hy + 3.5 * s], [hx - 5 * s, hy + 3 * s]], IX.GOLD);
    if (A.has('crown')) crown(g, hx + 1, hy - 6 * s, 4 * s);
    // near wing
    if (f) drawWing(g, [bx - 4, by - 3], [bx + 22 * s, by + 4 * s], [bx + 2, by + 7], IX.ACC, true);
    else drawWing(g, [bx - 4, by - 3], [bx + 6 * s, by - 29 * s], [bx + 8, by + 3], IX.ACC, true);
    EXTRA(g, P, f, 'head', K);
    g.eye(hx - 2 * s, hy - 1.5 * s);
  },
  serpentine(g, P, f) {
    const s = P.size, A = P.acc;
    const T = (x, y) => [34 + (x - 34) * s, 61 - (61 - y) * s];
    const sway = f ? -1 : 1;
    const pts = [[52, 57], [44, 60], [28, 60], [18, 53], [24, 45], [38, 44], [44, 36], [40, 26], [31 + sway, 19]].map(p => T(p[0], p[1]));
    const head = pts[pts.length - 1];
    const K = { s, pts, hx: head[0] - 3 * s, hy: head[1] - 2, f };
    EXTRA(g, P, f, 'back', K);
    g.tube(pts, 1.5, 6 * s, IX.BASE);
    g.tube(pts.slice(3).map(p => [p[0] - 2 * s, p[1] + 1]), 1, 3 * s, IX.BELLY, 'on');
    applyPattern(g, P);
    const hx = head[0] - 3 * s, hy = head[1] - 2;
    EXTRA(g, P, f, 'preHead', K);
    if (A.has('multihood')) {
      g.oell(hx + 3 * s, hy + 6 * s, 15 * s, 12 * s, IX.ACC);
      g.ell(hx + 3 * s, hy + 7 * s, 9 * s, 7 * s, IX.BELLY);
      for (let i = 0; i < 4; i++) {
        const an = -Math.PI * .85 + i * Math.PI * .23 + (i > 1 ? .5 : 0);
        const x = hx + 3 * s + Math.cos(an) * 12 * s, y = hy + 6 * s + Math.sin(an) * 11 * s;
        g.oell(x, y, 3.6 * s, 3 * s, IX.BASE); g.eye(x - 2, y - 1);
      }
    } else if (A.has('hood')) {
      g.oell(hx + 3 * s, hy + 6 * s, 8 * s, 9.5 * s, IX.ACC);
      g.ell(hx + 1 * s, hy + 7 * s, 2, 2, IX.BELLY); g.ell(hx + 6 * s, hy + 7 * s, 2, 2, IX.BELLY);
      g.put(Math.round(hx + 1 * s), Math.round(hy + 7 * s), IX.EYE); g.put(Math.round(hx + 6 * s), Math.round(hy + 7 * s), IX.EYE);
    }
    g.oell(hx, hy, 5.5 * s, 4.3 * s, IX.BASE);
    g.ell(hx - 4.5 * s, hy + 1, 3.2 * s, 2.6 * s, IX.BASE);
    g.line(hx - 7 * s, hy + 2 * s, hx - 1, hy + 2 * s, IX.OUT);
    if (A.has('tongue') && f) { const tx = hx - 8 * s, ty = hy + 2 * s; g.line(tx, ty, tx - 4, ty, IX.GLOW); g.put(Math.round(tx - 5), Math.round(ty - 1), IX.GLOW); g.put(Math.round(tx - 5), Math.round(ty + 1), IX.GLOW); }
    if (A.has('crown')) crown(g, hx + 1, hy - 4 * s, 4 * s);
    if (A.has('gem')) g.rect(hx, hy - 4 * s, 2, 2, IX.GLOW);
    EXTRA(g, P, f, 'head', K);
    g.eye(hx - 2.5 * s, hy - 1.5 * s);
  },
  humanoid(g, P, f) {
    const s = P.size, A = P.acc, ground = 61, cx = 32, bird = A.has('birdLegs');
    const hipY = ground - 14 * s, top = hipY - 16 * s;
    const fish = A.has('fishTail');
    const K = { s, cx, hipY, top, ground, hx: cx - 1 * s, hy: top - 6.5 * s, hr: 6.5 * s, f };
    EXTRA(g, P, f, 'back', K);
    if (A.has('wings')) {
      if (f) drawWing(g, [cx + 3, top + 3], [cx + 24 * s, top + 2 * s], [cx + 6, hipY], IX.ACC, true);
      else drawWing(g, [cx + 3, top + 3], [cx + 18 * s, top - 18 * s], [cx + 8, hipY - 2], IX.ACC, true);
    }
    if (A.has('tail')) g.tube([[cx + 4 * s, hipY - 2], [cx + 14 * s, hipY - 3 * s], [cx + 17 * s, hipY - 15 * s], [cx + 11 * s + (f ? 1 : 0), hipY - 20 * s]], 1.7 * s, 1, IX.BASE);
    // far arm & leg
    g.tube([[cx + 4 * s, top + 3], [cx + 8 * s, top + 9 * s], [cx + 6 * s, top + 15 * s]], 2.1 * s, 1.7 * s, IX.FAR);
    if (fish) { }
    else if (bird) { g.line(cx + 3 * s, hipY, cx + 4 * s, ground - 1, IX.GOLD, .9); g.rect(cx + 2 * s, ground - 1, 4, 1, IX.GOLD); }
    else g.tube([[cx + 2.5 * s, hipY], [cx + 3 * s, ground - 2]], 2.6 * s, 2.4 * s, IX.FAR);
    // torso
    const skinTorso = bird;
    g.poly([[cx - 6 * s, top], [cx + 6 * s, top], [cx + 5.5 * s, hipY + 1], [cx - 5.5 * s, hipY + 1]], skinTorso ? IX.BELLY : IX.BASE);
    if (!skinTorso) g.ell(cx - 1.5 * s, top + 8 * s, 3.8 * s, 6 * s, IX.BELLY, 'on');
    if (bird) g.ell(cx, hipY + 2 * s, 7 * s, 5 * s, IX.BASE);
    // near leg
    if (fish) { const w = f ? 2 : -2; g.tube([[cx, hipY], [cx - 2 * s, hipY + 7 * s], [cx + 4 * s, ground - 3], [cx + 12 * s + w, ground - 5]], 5.5 * s, 2, IX.ACC, null, true); g.opoly([[cx + 11 * s + w, ground - 5], [cx + 19 * s + w, ground - 12 * s], [cx + 17 * s + w, ground - 3], [cx + 20 * s + w, ground]], IX.ACC); }
    else if (bird) { g.line(cx - 3 * s, hipY + 4 * s, cx - 4 * s, ground - 1, IX.GOLD, .9); g.rect(cx - 7 * s, ground - 1, 5, 1, IX.GOLD); }
    else { g.tube([[cx - 2.5 * s, hipY], [cx - 3.5 * s, ground - 2]], 2.8 * s, 2.5 * s, IX.BASE, null, true); g.rect(cx - 6 * s, ground - 2, 5 * s, 2, IX.BELLY); }
    if (A.has('sash') || A.has('garland')) g.poly([[cx - 6 * s, hipY - 3 * s], [cx + 6 * s, hipY - 3 * s], [cx + 6.5 * s, hipY + 4 * s], [cx - 7 * s, hipY + 4 * s]], IX.ACC);
    if (A.has('garland')) for (let i = 0; i < 6; i++) g.ell(cx - 5 * s + i * 2 * s, top + 3 * s + Math.sin(i / 5 * Math.PI) * 5 * s, 1.3, 1.3, i % 2 ? IX.GLOW : IX.ACC);
    if (A.has('veena')) { g.line(cx + 7 * s, top + 1, cx - 9 * s, hipY + 1, IX.GOLD, 1); g.ell(cx + 7 * s, top, 2.6 * s, 2.6 * s, IX.ACC); g.ell(cx - 9 * s, hipY + 2, 3.4 * s, 3.4 * s, IX.ACC); }
    // head
    const hx = cx - 1 * s, hy = top - 6.5 * s, hr = 6.5 * s;
    EXTRA(g, P, f, 'preHead', K);
    if (A.has('earsSide')) g.oell(hx + 5 * s, hy + 1, 2.2 * s, 2.8 * s, IX.BELLY);
    if (A.has('headdress')) for (let i = 0; i < 3; i++) g.tube([[hx + i * 2, hy - hr * .7], [hx + 3 + i * 3, hy - hr * 1.5], [hx + 8 + i * 3, hy - hr * 1.6 + i * 2]], 1.4, .6, IX.ACC);
    g.oell(hx, hy, hr, hr, IX.BASE);
    if (A.has('muzzle')) { g.ell(hx - 2.5 * s, hy + 1.5 * s, 4 * s, 3.4 * s, IX.BELLY); g.ell(hx - 1 * s, hy - 1.5 * s, 4.5 * s, 2.4 * s, IX.BELLY); }
    else { g.ell(hx - 2 * s, hy + 1 * s, 4.6 * s, 4.8 * s, IX.BELLY); }
    if (A.has('crown')) crown(g, hx, hy - hr * .9, 4.5 * s);
    EXTRA(g, P, f, 'head', K);
    // near arm
    const arm = f ? [[cx - 4 * s, top + 2], [cx - 9 * s, top + 5 * s], [cx - 12 * s, top + 9 * s]] : [[cx - 4 * s, top + 2], [cx - 8 * s, top + 8 * s], [cx - 9 * s, top + 14 * s]];
    g.tube(arm, 2.2 * s, 1.8 * s, IX.BASE, null, true);
    const hand = arm[2];
    if (A.has('armband')) g.ell(arm[1][0], arm[1][1], 2.2 * s, 1.2, IX.GOLD);
    if (A.has('mace')) { g.line(hand[0], hand[1] + 2, hand[0] - 3, hand[1] - 13 * s, IX.GOLD, 1.1); g.oell(hand[0] - 3.5, hand[1] - 15 * s, 3.6 * s, 4 * s, IX.GOLD); }
    K.hand = hand; EXTRA(g, P, f, 'hand', K);
    g.ell(hand[0], hand[1], 1.8 * s + .3, 1.8 * s + .3, IX.BELLY);
    if (!A.has('noEye')) g.eye(hx - 3 * s, hy - 1.2 * s);
  },
  aquatic(g, P, f) {
    const s = P.size, A = P.acc, bob = f ? 1 : 0, ground = 61;
    const rx = 17 * s, ry = 8 * s, cx = 38, cy = ground - (A.has('legs') ? 10 : 6) * s - ry + bob;
    const t = f ? 3 : -2;
    const K = { s, cx, cy, rx, ry, ground, hx: cx - rx + 3, hy: cy - 2 * s, f };
    EXTRA(g, P, f, 'back', K);
    g.poly([[cx + rx * .8, cy - 1], [cx + rx + 11 * s, cy - 10 * s + t], [cx + rx + 6 * s, cy + 1], [cx + rx + 11 * s, cy + 9 * s + t]], IX.ACC);
    if (A.has('legs')) g.tube([[cx - 6 * s + 3, cy + 3], [cx - 8 * s + 3, ground - 1]], 2.6 * s, 2.2 * s, IX.FAR);
    g.ell(cx, cy, rx, ry, IX.BASE);
    g.ell(cx + rx * .7, cy, rx * .45, ry * .55, IX.BASE);
    g.ell(cx - 2, cy + ry * .5, rx * .85, ry * .5, IX.BELLY, 'on');
    applyPattern(g, P);
    if (A.has('dorsal')) { g.opoly([[cx - 7 * s, cy - ry + 2], [cx + 1 * s, cy - ry - 8 * s], [cx + 7 * s, cy - ry + 2]], IX.ACC); g.opoly([[cx + 8 * s, cy - ry + 3], [cx + 12 * s, cy - ry - 3 * s], [cx + 15 * s, cy - ry + 4]], IX.ACC); }
    if (A.has('legs')) { g.tube([[cx - 10 * s, cy + 4], [cx - 12 * s, ground - 2]], 2.8 * s, 2.4 * s, IX.BASE, null, true); g.rect(cx - 15 * s, ground - 2, 5 * s, 2, IX.BELLY); }
    else g.opoly([[cx - 6 * s, cy + 3], [cx + 2 * s, cy + ry + 6 * s], [cx + 4 * s, cy + 3]], IX.ACC);
    // head + crocodile snout
    const hx = cx - rx + 3, hy = cy - 2 * s;
    g.oell(hx, hy, 8 * s, 6.5 * s, IX.BASE);
    if (A.has('snout')) {
      g.opoly([[hx - 3 * s, hy - 3.5 * s], [hx - 15 * s, hy - 1.5 * s], [hx - 15 * s, hy + 3 * s], [hx - 3 * s, hy + 4 * s]], IX.BASE);
      g.line(hx - 14 * s, hy + .8 * s, hx - 2, hy + .8 * s, IX.OUT);
      for (let i = 0; i < 5; i++) g.put(Math.round(hx - 13 * s + i * 2.4 * s), Math.round(hy + .8 * s - 1), IX.WHITE);
    }
    if (A.has('trunk')) g.tube([[hx - 14 * s, hy - 1 * s], [hx - 17 * s, hy - 8 * s], [hx - 13 * s, hy - 12 * s], [hx - 10 * s + (f ? 1 : 0), hy - 9 * s]], 2.2 * s, 1, IX.BASE, null, true);
    if (A.has('trunkSmall')) g.tube([[hx - 14 * s, hy - 1 * s], [hx - 16 * s, hy - 6 * s], [hx - 13 * s + (f ? 1 : 0), hy - 8 * s]], 1.8 * s, 1, IX.BASE, null, true);
    if (A.has('horns')) g.tube([[hx + 1, hy - 5 * s], [hx + 4 * s, hy - 10 * s], [hx + 8 * s, hy - 11 * s]], 1.5 * s, .7, IX.HORN, null, true);
    if (A.has('crown')) crown(g, hx - 1, hy - 6 * s, 4 * s);
    EXTRA(g, P, f, 'head', K);
    g.eye(hx - 3 * s, hy - 3.5 * s);
  },
  spirit(g, P, f) {
    const s = P.size, A = P.acc, hx = 32, hy = 26;
    const K = { s, hx, hy, f };
    EXTRA(g, P, f, 'back', K);
    if (A.has('batWings')) {
      const u = f ? 5 : 0;
      g.poly([[hx + 4, hy - 2], [hx + 24 * s, hy - 14 * s + u], [hx + 27 * s, hy + 4 * s + u], [hx + 21 * s, hy + 1 * s + u], [hx + 17 * s, hy + 9 * s + u], [hx + 12 * s, hy + 5 * s], [hx + 6, hy + 10]], IX.ACCFAR);
    }
    const w = f ? 3 : -3;
    g.tube([[hx + 1, hy + 6], [hx + 6 * s, hy + 18 * s], [hx + 1 * s + w, hy + 27 * s], [hx + 11 * s, hy + 34 * s]], 9 * s, 1, IX.BASE);
    if (A.has('ribbons')) for (const d of [0, 5]) g.tube([[hx + 6, hy + 2 + d], [hx + 16 * s, hy + (f ? 0 : 5) + d], [hx + 27 * s, hy + (f ? 8 : 1) + d]], 1.8, 1, IX.ACC);
    if (A.has('arms')) g.tube([[hx + 6 * s, hy + 6 * s], [hx + 11 * s, hy + 10 * s], [hx + 9 * s, hy + 14 * s]], 2 * s, 1.5, IX.FAR);
    g.oell(hx, hy, 10 * s, 10 * s, IX.BASE);
    g.ell(hx - 2 * s, hy + 3 * s, 6 * s, 5 * s, IX.BELLY, 'on');
    if (A.has('batWings')) {
      const u = f ? 5 : 0;
      g.opoly([[hx - 4, hy - 2], [hx - 22 * s, hy - 16 * s + u], [hx - 25 * s, hy + 2 * s + u], [hx - 19 * s, hy - 1 * s + u], [hx - 15 * s, hy + 7 * s + u], [hx - 10 * s, hy + 3 * s], [hx - 5, hy + 7]], IX.ACC);
      g.tube([[hx + 3, hy - 7 * s], [hx + 6 * s, hy - 13 * s]], 1.5, .6, IX.BASE); g.tube([[hx - 3, hy - 7 * s], [hx - 5 * s, hy - 13 * s]], 1.5, .6, IX.BASE);
    }
    if (A.has('halo')) { g.ell(hx + 2, hy - 13 * s, 8 * s, 2.6 * s, IX.GOLD); g.ell(hx + 2, hy - 13 * s, 5.5 * s, 1.2 * s, 0); }
    if (A.has('arms')) {
      const arm = [[hx - 6 * s, hy + 6 * s], [hx - 11 * s, hy + (f ? 6 : 9) * s], [hx - 13 * s, hy + (f ? 2 : 6) * s]];
      if (A.has('flute')) g.line(arm[2][0] - 6 * s, arm[2][1] - 4 * s, arm[2][0] + 6 * s, arm[2][1] + 3 * s, IX.GOLD, .9);
      g.tube(arm, 2.2 * s, 1.6, IX.BASE, null, true);
    }
    EXTRA(g, P, f, 'head', K);
    if (A.has('glowEyes')) { g.rect(hx - 6 * s, hy - 2, 3, 3, IX.GLOW); g.rect(hx - 1 * s, hy - 2, 3, 3, IX.GLOW); g.put(Math.round(hx - 6 * s), Math.round(hy - 2), IX.WHITE); }
    else { g.eye(hx - 5 * s, hy - 2, true); g.eye(hx + 1 * s, hy - 2, true); }
    if (A.has('fangs')) { g.line(hx - 6 * s, hy + 4 * s, hx + 1 * s, hy + 4 * s, IX.OUT); g.put(Math.round(hx - 5 * s), Math.round(hy + 4 * s + 1), IX.WHITE); g.put(Math.round(hx), Math.round(hy + 4 * s + 1), IX.WHITE); }
    else g.line(hx - 4 * s, hy + 4 * s, hx - 1 * s, hy + 4 * s, IX.OUT);
  },
};
// feathered wing outline: leading edge root->tip, scalloped trailing edge tip->back
function wingPts(root, tip, back, n = 4, out = 3.2) {
  const pts = [root, tip];
  for (let k = 1; k <= n; k++) {
    const t = (k - .5) / n, mx = lerp(tip[0], back[0], t), my = lerp(tip[1], back[1], t);
    const dx = mx - root[0], dy = my - root[1], d = Math.hypot(dx, dy) || 1;
    pts.push([mx + dx / d * out, my + dy / d * out]);
    const t2 = k / n; pts.push([lerp(tip[0], back[0], t2), lerp(tip[1], back[1], t2)]);
  }
  return pts;
}
function drawWing(g, root, tip, back, idx, outlined, n = 4) {
  const pts = wingPts(root, tip, back, n);
  if (outlined) g.opoly(pts, idx); else g.poly(pts, idx);
  const lineIdx = idx === IX.ACC ? IX.ACCFAR : IX.FAR;
  for (let k = 1; k < n; k++) { const t = k / n; g.line(lerp(root[0], tip[0], .25), lerp(root[1], tip[1], .25), lerp(tip[0], back[0], t), lerp(tip[1], back[1], t), lineIdx, 0); }
  g.line(root[0], root[1], tip[0], tip[1], idx === IX.ACC ? IX.BELLY : IX.ACC, 0, 'onAny');
}
function crown(g, x, y, w) {
  g.rect(x - w, y, w * 2, 2.2, IX.GOLD);
  for (let i = 0; i < 3; i++) { const px = x - w + w * i; g.poly([[px - 1.2, y + .5], [px, y - 3.5], [px + 1.4, y + .5]], IX.GOLD); }
  g.put(Math.round(x), Math.round(y + 1), IX.GLOW);
}
function applyPattern(g, P) {
  const pat = P.pattern, r = P.rng;
  if (!pat || pat === 'none') return;
  if (pat === 'spots' || pat === 'bolts') {
    let minX = 64, maxX = 0, minY = 64, maxY = 0;
    for (let y = 0; y < SPR; y++) for (let x = 0; x < SPR; x++) if (g.get(x, y) === IX.BASE) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
    if (pat === 'spots') for (let i = 0; i < 9; i++) g.ell(lerp(minX, maxX, r()), lerp(minY, maxY, r()), 1 + r() * 1.5, 1 + r() * 1.2, IX.PAT, 'on');
    else for (let i = 0; i < 3; i++) { let x = lerp(minX, maxX, .2 + i * .25), y = minY + 2; for (let k = 0; k < 5; k++) { const nx = x + (k % 2 ? 3 : -2), ny = y + 3; g.line(x, y, nx, ny, IX.GLOW, 0, 'on'); x = nx; y = ny; } }
    return;
  }
  for (let y = 0; y < SPR; y++) for (let x = 0; x < SPR; x++) {
    if (g.get(x, y) !== IX.BASE) continue;
    if (pat === 'stripes' && (((x * .7 + y) | 0) % 7) < 2) g.put(x, y, IX.PAT);
    else if (pat === 'rings' && (((x + y * .6) | 0) % 8) < 2) g.put(x, y, IX.ACC);
    else if (pat === 'scales' && y % 3 === 0 && ((x + ((y / 3) | 0) * 2) % 4) === 0) g.put(x, y, IX.PAT);
  }
}
// grid -> canvas with 16-bit style shading and auto outline
function renderGrid(g, pal) {
  const ramp = c => [shade(c, -.32), c, shade(c, .34)];
  const R = {
    [IX.BASE]: ramp(pal.base), [IX.ACC]: ramp(pal.accent), [IX.BELLY]: ramp(pal.belly), [IX.FAR]: ramp(shade(pal.base, -.3)),
    [IX.HORN]: ramp(pal.horn), [IX.ACCFAR]: ramp(shade(pal.accent, -.3)), [IX.GOLD]: ramp('#e8b030'), [IX.PAT]: ramp(shade(pal.base, -.22)),
  };
  const outline = shade(pal.base, -.78);
  const c = mkCanvas(SPR, SPR), cx = c.getContext('2d'), img = cx.createImageData(SPR, SPR), d = img.data;
  const setPx = (x, y, hex) => { const [r, gg, b] = hexToRgb(hex), i = (y * SPR + x) * 4; d[i] = r; d[i + 1] = gg; d[i + 2] = b; d[i + 3] = 255; };
  for (let y = 0; y < SPR; y++) for (let x = 0; x < SPR; x++) {
    const v = g.get(x, y);
    if (v === 0) { if (g.get(x - 1, y) || g.get(x + 1, y) || g.get(x, y - 1) || g.get(x, y + 1)) setPx(x, y, outline); continue; }
    if (v === IX.OUT) { setPx(x, y, outline); continue; }
    if (v === IX.WHITE) { setPx(x, y, '#fbf8ee'); continue; }
    if (v === IX.EYE) { setPx(x, y, pal.eye); continue; }
    if (v === IX.GLOW) { setPx(x, y, pal.glow); continue; }
    const rr = R[v]; if (!rr) continue;
    const em = (a, b) => { const q = g.get(a, b); return q === 0 || q === IX.OUT; };
    let col = rr[1];
    if (em(x, y - 1) || (em(x - 1, y) && em(x - 1, y - 1))) col = rr[2];
    else if (em(x, y + 1) || em(x + 1, y) || em(x, y + 2)) col = rr[0];
    setPx(x, y, col);
  }
  cx.putImageData(img, 0, 0);
  return c;
}
const SpriteCache = {};
function creatureFrames(spId) {
  if (SpriteCache[spId]) return SpriteCache[spId];
  const sp = SPECIES[spId], a = sp.art, frames = [];
  for (let f = 0; f < 2; f++) {
    const g = new Pix();
    const P = { tpl: a.tpl, size: a.size, acc: new Set(a.acc), pattern: a.pattern, rng: mulberry32(hashStr(spId)) };
    TEMPLATES[a.tpl](g, P, f);
    frames.push(renderGrid(g, a.pal));
  }
  // white silhouette for evolution / taming flashes
  const sil = mkCanvas(SPR, SPR), sx = sil.getContext('2d');
  sx.drawImage(frames[0], 0, 0); sx.globalCompositeOperation = 'source-in'; sx.fillStyle = '#fff'; sx.fillRect(0, 0, SPR, SPR);
  const dark = mkCanvas(SPR, SPR), dx = dark.getContext('2d');
  dx.drawImage(frames[0], 0, 0); dx.globalCompositeOperation = 'source-in'; dx.fillStyle = '#4e3d70'; dx.fillRect(0, 0, SPR, SPR);
  return SpriteCache[spId] = { frames, sil, dark };
}

// =====================================================================
//  PEOPLE SPRITES (16x16, 4 directions x 3 walk frames)
// =====================================================================
const PERSON_TPL = {
  down: ['................', '.....hhhhhh.....', '....hhhhhhhh....', '...hhhhhhhhhh...', '...hhsssssshh...', '...hssessessh...', '...hssssssssh...', '.....ssssss.....', '....oooooooo....', '...soooooooos...', '...soooooooos...', '...saaaaaaaas...'],
  up: ['................', '.....hhhhhh.....', '....hhhhhhhh....', '...hhhhhhhhhh...', '...hhhhhhhhhh...', '...hhhhhhhhhh...', '...hhhhhhhhhh...', '.....ssssss.....', '....oooooooo....', '...soooooooos...', '...soooooooos...', '...saaaaaaaas...'],
  left: ['................', '.....hhhhhh.....', '....hhhhhhhh....', '...hhhhhhhhhh...', '..ssshhhhhhh....', '..sesshhhhhh....', '..sssshhhhhh....', '....sssssh......', '.....ooooooo....', '.....oosoooo....', '.....oosoooo....', '.....aasaaaa....'],
};
const PERSON_LEGS = {
  down: [['....pppppppp....', '....ppp..ppp....', '....ppp..ppp....', '....kkk..kkk....'], ['....pppppppp....', '....ppp..ppp....', '....ppp...kk....', '....kkk.........'], ['....pppppppp....', '....ppp..ppp....', '....kk...ppp....', '.........kkk....']],
  left: [['.....ppppppp....', '......pppp......', '......pppp......', '.....kkkkk......'], ['.....ppppppp....', '.....pp..pp.....', '....pp....pp....', '...kk......kk...'], ['.....ppppppp....', '......ppp.......', '.....pppp.......', '....kkkk........']],
  robe: [['....oooooooo....', '....oooooooo....', '...oooooooooo...', '....kk....kk....'], ['....oooooooo....', '....oooooooo....', '...oooooooooo...', '....kk..........'], ['....oooooooo....', '....oooooooo....', '...oooooooooo...', '..........kk....']],
};
function personFrames(look) {
  const key = JSON.stringify(look);
  if (SpriteCache[key]) return SpriteCache[key];
  const pal = { h: look.hair, s: look.skin, e: '#1a1020', o: look.outfit, a: look.accent, p: look.pants, k: look.shoes || '#2a1a10', g: '#ffd040', f: '#ff7a1a' };
  const out = {};
  for (const dir of ['down', 'up', 'left']) {
    out[dir] = [];
    for (let fr = 0; fr < 3; fr++) {
      const rows = PERSON_TPL[dir].map(r => r.split(''));
      const legs = look.style2 === 'robe' ? PERSON_LEGS.robe[fr] : PERSON_LEGS[dir === 'left' ? 'left' : 'down'][fr];
      legs.forEach(r => rows.push(r.split('')));
      const S = (x, y, ch) => { if (rows[y] && x >= 0 && x < 16) rows[y][x] = ch; };
      if (look.style === 'long') { if (dir === 'down') { for (const y of [7, 8, 9]) { S(3, y, 'h'); S(12, y, 'h'); } } else if (dir === 'up') { for (let y = 7; y <= 10; y++) for (let x = 4; x <= 11; x++) S(x, y, 'h'); } else for (let y = 7; y <= 10; y++) { S(10, y, 'h'); S(11, y, 'h'); } }
      if (look.style === 'bun') { if (dir === 'left') { S(10, 0, 'h'); S(11, 0, 'h'); S(10, 1, 'h'); S(11, 1, 'h'); S(12, 1, 'h'); } else for (let x = 6; x <= 9; x++) S(x, 0, 'h'); }
      if (look.beard && dir !== 'up') { if (dir === 'down') { for (let x = 5; x <= 10; x++) S(x, 7, 'h'); S(4, 6, 'h'); S(11, 6, 'h'); } else { S(2, 6, 'h'); S(3, 6, 'h'); S(4, 7, 'h'); S(5, 7, 'h'); S(6, 7, 'h'); } }
      if (look.style === 'ponytail') { if (dir === 'down') { S(12, 3, 'h'); S(13, 4, 'h'); S(13, 5, 'h'); } else if (dir === 'up') { for (let y = 6; y <= 10; y++) { S(7, y, 'h'); S(8, y, 'h'); } } else { for (let y = 3; y <= 8; y++) S(12, y, 'h'); S(13, 4, 'h'); S(13, 5, 'h'); } }
      if (look.style === 'braids') { if (dir === 'down') { for (let y = 7; y <= 10; y++) { S(3, y, 'h'); S(12, y, 'h'); } S(3, 11, 'a'); S(12, 11, 'a'); } else if (dir === 'up') { for (let y = 7; y <= 10; y++) { S(4, y, 'h'); S(11, y, 'h'); } S(4, 11, 'a'); S(11, 11, 'a'); } else { for (let y = 7; y <= 10; y++) S(10, y, 'h'); S(10, 11, 'a'); } }
      if (look.style === 'spiky') { const xs = dir === 'left' ? [4, 6, 8, 10] : [4, 6, 8, 10, 12]; for (const x of xs) S(x, 0, 'h'); if (dir !== 'up') { S(2, 3, 'h'); S(13, 3, 'h'); } }
      if (look.band) { if (dir === 'left') { for (let x = 3; x <= 12; x++) if (rows[3][x] === 'h') S(x, 3, 'a'); } else for (let x = 3; x <= 12; x++) S(x, 3, 'a'); }
      if (look.cap) { const x0 = dir === 'left' ? 3 : 4, x1 = dir === 'left' ? 11 : 11; for (let x = x0; x <= x1; x++) { S(x, 1, 'a'); S(x, 2, 'a'); } if (dir === 'down') for (let x = 3; x <= 12; x++) S(x, 3, 'k'); else if (dir === 'left') for (let x = 1; x <= 6; x++) S(x, 3, 'k'); }
      if (look.crown) { const xs = dir === 'left' ? [4, 9] : [5, 10]; for (let x = xs[0]; x <= xs[1]; x++) S(x, 1, 'g'); S(xs[0], 0, 'g'); S((xs[0] + xs[1]) >> 1, 0, 'g'); S(xs[1], 0, 'g'); }
      if (look.flame) { const xs = dir === 'left' ? [5, 10] : [4, 11]; for (let x = xs[0]; x <= xs[1]; x += 2) S(x + (fr === 1 ? 1 : 0), 0, 'f'); }
      const c = mkCanvas(16, 16), cx = c.getContext('2d');
      const filled = (x, y) => rows[y] && rows[y][x] && rows[y][x] !== '.';
      for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
        if (filled(x, y)) { cx.fillStyle = pal[rows[y][x]] || '#f0f'; cx.fillRect(x, y, 1, 1); }
        else if (filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1)) { cx.fillStyle = '#1a1020'; cx.fillRect(x, y, 1, 1); }
      }
      // simple shading: darken bottom-right edge of outfit/hair
      out[dir].push(c);
    }
  }
  out.right = out.left.map(c => { const m = mkCanvas(16, 16), mx = m.getContext('2d'); mx.translate(16, 0); mx.scale(-1, 1); mx.drawImage(c, 0, 0); return m; });
  return SpriteCache[key] = out;
}

// =====================================================================
//  TILES (16x16, procedurally painted per city theme; water, grass, fire animate)
// =====================================================================
const THEMES = {
  india: {
    grass: ['#5aa84a', '#4a9440', '#6cbc58'], tall: ['#2f7a34', '#3f9a40', '#7fd060'], deep: ['#245f3a', '#2e7f52', '#9be0a0'],
    path: ['#d9b27a', '#c49a62', '#ead0a0'], plaza: ['#cdbd9f', '#ad9d80', '#ddd0b4'], water: ['#2f6fbf', '#5f9fe8'],
    tree: 'round', treeC: ['#5a3a20', '#1f5a2c', '#2f7a3a', '#48a24c', '#7cc860'], flowers: ['#ff9f1a', '#ffd23a', '#c84a10'],
    floor: ['#a8784a', '#8f643c'], wall: ['#e8d8b8', '#c8b090', '#9a7a50', '#b8402a', '#e8b030'], carpet: ['#a8283a', '#e8b030', '#c8485a'],
    pillar: ['#f2ead8', '#d0c4a8', '#e8b030'], lamp: ['#5a4030', '#e8b030'], rock: ['#6a6a72', '#8f8f98', '#c0c0c8'], gold: ['#d8b048', '#b89030', '#f0d070'], fence: ['#8a5a32', '#6a4224', '#b07a48'],
  },
  greece: {
    grass: ['#9ab45a', '#84a04a', '#b4c86e'], tall: ['#5a7a32', '#6e9040', '#c8d880'], deep: ['#3a6a4a', '#4a805a', '#a8d8a0'],
    path: ['#e4d8b8', '#cfc09a', '#f2ead2'], plaza: ['#eeece6', '#c8c6bc', '#ffffff'], water: ['#1e78d0', '#6ab4ff'],
    tree: 'cypress', treeC: ['#5a4a30', '#1e4a2a', '#2a5e34', '#3a7a42', '#6aa060'], flowers: ['#e8384a', '#b070e0', '#40202a'],
    floor: ['#e8e4dc', '#c8c4b8'], wall: ['#f4f2ea', '#d8d4c8', '#a8a49a', '#2a5ab0', '#e8e8f0'], carpet: ['#2a4a98', '#e8c040', '#3a6ac0'],
    pillar: ['#ffffff', '#d8d8d0', '#c8b878'], lamp: ['#a8a090', '#d8d0c0'], rock: ['#b8b0a0', '#d8d0c0', '#f0ece0'], gold: ['#e8d8a0', '#c8b878', '#fff4c8'], fence: ['#e8e4d8', '#c8c4b8', '#ffffff'],
  },
  norse: {
    grass: ['#e6edf3', '#cdd8e2', '#ffffff'], tall: ['#6a8a8a', '#86a6a0', '#e8f4f4'], deep: ['#4a6a7a', '#5a8090', '#d8f0ff'],
    path: ['#a0948a', '#887c70', '#c0b6aa'], plaza: ['#8a6a48', '#6a4e32', '#a8845c'], water: ['#2a4a6a', '#5a80a8'],
    tree: 'pine', treeC: ['#4a3a2a', '#1a3a2e', '#244a3a', '#2f5e48', '#ffffff'], flowers: ['#ffffff', '#9fc8ff', '#4a6a8a'],
    floor: ['#7a5a3a', '#5e4430'], wall: ['#7a5434', '#5e3e24', '#3a2614', '#c8a040', '#e8d8b0'], carpet: ['#2a3a6a', '#c8a040', '#3a5a9a'],
    pillar: ['#8a6a48', '#5e4430', '#c8a040'], lamp: ['#3a2a1a', '#c8a040'], rock: ['#5a6470', '#7a8490', '#d8e4ee'], gold: ['#b8a060', '#8a7440', '#d8c080'], fence: ['#6a4e32', '#4a3420', '#8a6a48'],
  },
};
Object.assign(THEMES, {
  egypt: {
    grass: ['#e8c888', '#d8b070', '#f4dca8'], tall: ['#7a9a3a', '#8aaa4a', '#c8d870'], deep: ['#5a7a2a', '#6a8a3a', '#a8c860'],
    path: ['#c8a060', '#b08850', '#d8b880'], plaza: ['#d8b878', '#b89858', '#ecd098'], water: ['#2a7aa8', '#5ab0d8'],
    tree: 'palm', treeC: ['#7a5a30', '#2f6a2a', '#3f8a3a', '#5aa84a', '#8ac860'], flowers: ['#5a8ad8', '#ffffff', '#e8c040'],
    floor: ['#d8b878', '#b89858'], wall: ['#e8d0a0', '#c8a870', '#8a6a40', '#2a5ab0', '#e8c040'], carpet: ['#2a4a98', '#e8c040', '#c84a3a'],
    pillar: ['#e8d0a0', '#c8a870', '#2a8a9a'], lamp: ['#c8a060', '#e8c040'], rock: ['#b89060', '#d8b080', '#f0d8a8'], gold: ['#e8c040', '#c8a020', '#fff0a0'], fence: ['#c8a060', '#a88040', '#e8c890'], bridge: ['#a87a4a', '#7a5430'],
  },
  japan: {
    grass: ['#6aa84a', '#5a9440', '#86c060'], tall: ['#3a7a3a', '#4a9a48', '#9ad070'], deep: ['#2a6a4a', '#3a8a5a', '#a8e0a0'],
    path: ['#c8c0b0', '#a8a090', '#e0d8c8'], plaza: ['#a8a8a0', '#888880', '#c8c8c0'], water: ['#2a6a9a', '#6aa8d8'],
    tree: 'cherry', treeC: ['#5a3a2a', '#e88aa8', '#f4a8c0', '#ffd0e0', '#ffffff'], flowers: ['#ff6a8a', '#ffffff', '#e8c040'],
    floor: ['#c8c890', '#a8a870'], wall: ['#e8e0d0', '#c8c0b0', '#5a3a2a', '#c83a2a', '#2a2a2a'], carpet: ['#c83a2a', '#e8c040', '#e85a4a'],
    pillar: ['#c83a2a', '#8a2a1a', '#2a2a2a'], lamp: ['#888880', '#a8a8a0'], rock: ['#7a7a7a', '#9a9a9a', '#c8c8c8'], gold: ['#e8c040', '#c8a020', '#fff0a0'], fence: ['#c83a2a', '#8a2a1a', '#e85a4a'], bridge: ['#c83a2a', '#8a2a1a'],
  },
  celtic: {
    grass: ['#4a9a4a', '#3a843c', '#68b85a'], tall: ['#5a7a3a', '#7a5a8a', '#b088c8'], deep: ['#2a5a3a', '#3a704a', '#88c088'],
    path: ['#a89a78', '#8a7c5a', '#c8b898'], plaza: ['#9a9a90', '#7a7a70', '#b8b8b0'], water: ['#2a5a7a', '#5a8ab0'],
    tree: 'round', treeC: ['#4a3420', '#1e4a2a', '#2a5e34', '#3a7a42', '#6aa860'], flowers: ['#b088e8', '#ffe060', '#4a2a6a'],
    floor: ['#8a6a4a', '#6a4e32'], wall: ['#a8a090', '#888070', '#5a5040', '#2a6a3a', '#e8c040'], carpet: ['#2a6a3a', '#e8c040', '#3a8a4a'],
    pillar: ['#9a9a90', '#7a7a70', '#c8b878'], lamp: ['#5a5040', '#e8c040'], rock: ['#7a7a80', '#9a9aa0', '#c8c8d0'], gold: ['#c8b060', '#a89040', '#e8d890'], fence: ['#7a5a3a', '#5a3a20', '#9a7a5a'], bridge: ['#8a8a80', '#6a6a60'],
  },
  meso: {
    grass: ['#c8b078', '#b09860', '#d8c490'], tall: ['#8a9a3a', '#9aaa4a', '#d8d870'], deep: ['#6a7a2a', '#7a8a3a', '#b8c860'],
    path: ['#b87a4a', '#9a6038', '#d8986a'], plaza: ['#c8a878', '#a88858', '#e0c898'], water: ['#3a6a8a', '#6a9ab8'],
    tree: 'palm', treeC: ['#6a4a28', '#3a6a2a', '#4a7a32', '#6a9a42', '#9ac060'], flowers: ['#e8c040', '#3a6ab8', '#8a2a1a'],
    floor: ['#c8a878', '#a88858'], wall: ['#3a5a9a', '#2a4a7a', '#1a2a4a', '#e8c050', '#ffffff'], carpet: ['#3a5a9a', '#e8c050', '#4a6ab8'],
    pillar: ['#c8a878', '#a88858', '#e8c050'], lamp: ['#8a6a40', '#e8c050'], rock: ['#a88860', '#c8a880', '#e8d0a8'], gold: ['#e8c050', '#c8a030', '#fff0a0'], fence: ['#a87a4a', '#8a5a30', '#c89a6a'], bridge: ['#a87a4a', '#7a5430'],
  },
  slavic: {
    grass: ['#7a9a4a', '#6a8a3a', '#9ab85a'], tall: ['#a87a2a', '#c89a3a', '#e8c860'], deep: ['#5a6a3a', '#6a7a4a', '#a8b878'],
    path: ['#8a7058', '#6a5440', '#a8907a'], plaza: ['#9a7a58', '#7a5a3a', '#b89a78'], water: ['#3a5a7a', '#6a8aa8'],
    tree: 'birch', treeC: ['#f0f0e8', '#c8a030', '#e8b840', '#f0d060', '#3a3a3a'], flowers: ['#e83a3a', '#3a5ae8', '#f0d040'],
    floor: ['#9a7a58', '#7a5a3a'], wall: ['#e8dcc8', '#c8b8a0', '#8a6a4a', '#c83a2a', '#2a5ab0'], carpet: ['#c83a2a', '#f0d040', '#e85a4a'],
    pillar: ['#8a6a48', '#6a4a30', '#c83a2a'], lamp: ['#5a4030', '#e8b030'], rock: ['#7a7a70', '#9a9a90', '#c8c8c0'], gold: ['#e8b030', '#c89020', '#fff0a0'], fence: ['#8a6a48', '#6a4a30', '#a88a68'], bridge: ['#8a6a48', '#6a4a30'],
  },
});
const Tiles = (() => {
  const cache = {};
  const px = (x, a, b, col) => { x.fillStyle = col; x.fillRect(a, b, 1, 1); };
  const fill = (x, col) => { x.fillStyle = col; x.fillRect(0, 0, 16, 16); };
  let T = THEMES.india;
  function grass(x, r) { fill(x, T.grass[0]); for (let i = 0; i < 14; i++) { const a = r() * 16 | 0, b = r() * 16 | 0; px(x, a, b, T.grass[1]); px(x, a, b - 1, T.grass[2]); } }
  function plaza(x) { const c = T.plaza; fill(x, c[0]); x.fillStyle = c[1]; x.fillRect(0, 0, 16, 1); x.fillRect(0, 8, 16, 1); x.fillRect(0, 0, 1, 8); x.fillRect(8, 8, 1, 8); x.fillStyle = c[2]; x.fillRect(1, 1, 6, 1); x.fillRect(9, 9, 6, 1); }
  function floor(x) { fill(x, T.floor[0]); x.fillStyle = T.floor[1]; for (let y = 3; y < 16; y += 4) x.fillRect(0, y, 16, 1); x.fillRect(5, 0, 1, 3); x.fillRect(11, 4, 1, 3); x.fillRect(3, 8, 1, 3); x.fillRect(9, 12, 1, 3); }
  function tuft(x, r, f, c) { grass(x, r); for (let i = 0; i < 4; i++) { const bx = (i % 2) * 8 + 1, by = (i >> 1) * 8 + 2; x.fillStyle = c[0]; x.fillRect(bx, by + 2, 6, 4); for (let k = 0; k < 3; k++) { const sx = bx + k * 2 + (f ? 1 : 0); x.fillStyle = c[1]; x.fillRect(sx, by - 1, 1, 4); px(x, sx, by - 2, c[2]); } } }
  function water(x, f) { fill(x, T.water[0]); x.fillStyle = T.water[1]; for (let y = 2; y < 16; y += 5) { const o = (f * 2 + y) % 8; x.fillRect(o, y, 4, 1); x.fillRect((o + 9) % 16, y + 2, 3, 1); } }
  function tree(x, r) {
    grass(x, r); const c = T.treeC;
    if (T.tree === 'cypress') { x.fillStyle = c[0]; x.fillRect(7, 12, 2, 4); x.fillStyle = c[1]; x.beginPath(); x.ellipse(8, 7.5, 5, 7.5, 0, 0, 7); x.fill(); x.fillStyle = c[2]; x.beginPath(); x.ellipse(7.5, 7, 3.6, 6.4, 0, 0, 7); x.fill(); x.fillStyle = c[3]; x.fillRect(6, 3, 2, 6); px(x, 6, 2, c[4]); px(x, 7, 6, c[4]); }
    else if (T.tree === 'pine') { x.fillStyle = c[0]; x.fillRect(7, 12, 2, 4); for (let k = 0; k < 3; k++) { const y = 2 + k * 4, hw = 3 + k * 2; x.fillStyle = c[1 + (k % 2)]; x.beginPath(); x.moveTo(8, y); x.lineTo(8 + hw, y + 6); x.lineTo(8 - hw, y + 6); x.fill(); x.fillStyle = c[4]; x.fillRect(8 - hw + 1, y + 5, hw, 1); px(x, 8, y, c[4]); } }
    else if (T.tree === 'palm') {
      for (let k = 0; k < 6; k++) { x.fillStyle = k % 2 ? c[0] : shade(c[0], .2); x.fillRect(7 + (k > 3 ? 1 : 0), 15 - k * 2, 2, 2); }
      for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * .62; x.fillStyle = c[1 + (k % 3)]; x.save(); x.translate(9 + Math.cos(a) * 3, 4 + Math.sin(a) * 1.5 + 1); x.rotate(a); x.beginPath(); x.ellipse(1, 0, 5, 1.6, 0, 0, 7); x.fill(); x.restore(); }
      x.fillStyle = '#7a4a20'; x.fillRect(8, 4, 2, 2);
    }
    else if (T.tree === 'cherry') { x.fillStyle = c[0]; x.fillRect(7, 9, 2, 7); x.fillRect(5, 9, 2, 2); for (const [ax, ay, rr, ci] of [[8, 7, 7, 1], [6, 6, 4.5, 2], [10, 5, 4, 2], [7, 4, 3, 3]]) { x.fillStyle = c[ci]; x.beginPath(); x.arc(ax, ay, rr, 0, 7); x.fill(); } for (let k = 0; k < 6; k++) px(x, 2 + r() * 12 | 0, 1 + r() * 10 | 0, c[4]); }
    else if (T.tree === 'birch') { x.fillStyle = c[0]; x.fillRect(7, 6, 2, 10); x.fillStyle = c[4]; x.fillRect(7, 8, 1, 1); x.fillRect(8, 11, 1, 1); x.fillRect(7, 13, 1, 1); for (const [ax, ay, rr, ci] of [[8, 5, 5.5, 1], [6, 6, 3.5, 2], [10, 4, 3, 3]]) { x.fillStyle = c[ci]; x.beginPath(); x.arc(ax, ay, rr, 0, 7); x.fill(); } }
    else { x.fillStyle = c[0]; x.fillRect(6, 10, 4, 6); x.fillStyle = c[1]; x.beginPath(); x.arc(8, 7, 7.5, 0, 7); x.fill(); x.fillStyle = c[2]; x.beginPath(); x.arc(7, 6, 6, 0, 7); x.fill(); x.fillStyle = c[3]; x.beginPath(); x.arc(6, 4, 3.5, 0, 7); x.fill(); px(x, 5, 3, c[4]); px(x, 10, 6, c[4]); }
  }
  const P = {
    '.': (x, r) => grass(x, r),
    ',': (x, r, f) => tuft(x, r, f, T.tall),
    ':': (x, r, f) => tuft(x, r, f, T.deep),
    '_': (x, r) => { fill(x, T.path[0]); for (let i = 0; i < 8; i++) px(x, r() * 16 | 0, r() * 16 | 0, r() < .5 ? T.path[1] : T.path[2]); },
    '=': x => plaza(x),
    '~': (x, r, f) => water(x, f),
    'o': (x, r, f) => { water(x, f); x.fillStyle = '#3fae5a'; x.beginPath(); x.arc(7, 9, 4, 0, 7); x.fill(); x.fillStyle = '#ff8fb8'; x.fillRect(6, 6, 3, 3); px(x, 7, 5, '#ffd0e0'); px(x, 5, 7, '#ffd0e0'); px(x, 9, 7, '#ffd0e0'); px(x, 7, 7, '#ffe36a'); },
    'i': (x, r, f) => { water(x, f); x.fillStyle = '#d8eaf8'; x.beginPath(); x.ellipse(8, 9, 6, 4, 0, 0, 7); x.fill(); x.fillStyle = '#ffffff'; x.fillRect(5, 7, 4, 1); },   // ice floe
    'T': (x, r) => tree(x, r),
    'f': (x, r) => { grass(x, r); for (let i = 0; i < 5; i++) { const a = 2 + r() * 12 | 0, b = 2 + r() * 12 | 0; x.fillStyle = r() < .5 ? T.flowers[0] : T.flowers[1]; x.fillRect(a - 1, b, 3, 1); x.fillRect(a, b - 1, 1, 3); px(x, a, b, T.flowers[2]); } },
    '|': (x, r) => { grass(x, r); const c = T.fence; x.fillStyle = c[0]; x.fillRect(0, 6, 16, 2); x.fillRect(0, 10, 16, 2); x.fillStyle = c[1]; x.fillRect(2, 4, 3, 11); x.fillRect(11, 4, 3, 11); x.fillStyle = c[2]; x.fillRect(2, 4, 3, 1); x.fillRect(11, 4, 3, 1); },
    'L': (x, r, f) => { plaza(x); x.fillStyle = T.lamp[0]; x.fillRect(7, 5, 2, 10); x.fillRect(5, 14, 6, 2); x.fillStyle = T.lamp[1]; x.fillRect(4, 4, 8, 2); x.fillStyle = f ? '#ffd040' : '#ff8a20'; x.fillRect(7, 1, 2, 3); px(x, 7 + f, 0, '#fff0a0'); },
    'S': (x, r) => { grass(x, r); x.fillStyle = '#6a4224'; x.fillRect(7, 9, 2, 7); x.fillStyle = '#b07a48'; x.fillRect(2, 2, 12, 8); x.fillStyle = '#8a5a32'; x.fillRect(2, 9, 12, 1); x.fillStyle = '#5a3a20'; x.fillRect(4, 4, 8, 1); x.fillRect(4, 6, 6, 1); },
    'R': (x, r) => { grass(x, r); const c = T.rock; x.fillStyle = c[0]; x.beginPath(); x.ellipse(8, 10, 7, 5.5, 0, 0, 7); x.fill(); x.fillStyle = c[1]; x.beginPath(); x.ellipse(7, 9, 5, 4, 0, 0, 7); x.fill(); px(x, 5, 7, c[2]); px(x, 6, 7, c[2]); },
    'B': x => { const bc = T.bridge || ['#a87a4a', '#7a5430']; x.fillStyle = bc[0]; x.fillRect(0, 0, 16, 16); x.fillStyle = bc[1]; for (let i = 0; i < 16; i += 4) x.fillRect(i, 0, 1, 16); x.fillStyle = '#5a3a20'; x.fillRect(0, 0, 16, 1); x.fillRect(0, 15, 16, 1); },
    'Y': (x, r, f) => { const c = ['#ff5a5a', '#ffa040', '#ffe060', '#60d070', '#50a0ff', '#a070ff']; c.forEach((col, i) => { x.fillStyle = col; x.fillRect(0, i * 2 + 2, 16, 2); }); x.fillStyle = 'rgba(255,255,255,' + (f ? .35 : .15) + ')'; x.fillRect((f * 5) % 16, 2, 3, 12); x.fillStyle = '#e8e8f8'; x.fillRect(0, 0, 16, 2); x.fillRect(0, 14, 16, 2); },  // rainbow bridge
    'X': x => fill(x, '#0b0714'),
    'p': x => floor(x),
    'w': x => { const c = T.wall; fill(x, c[0]); x.fillStyle = c[1]; x.fillRect(0, 12, 16, 4); x.fillStyle = c[2]; x.fillRect(0, 11, 16, 1); x.fillStyle = c[3]; x.fillRect(0, 2, 16, 2); x.fillStyle = c[4]; for (let i = 1; i < 16; i += 4) x.fillRect(i, 2, 2, 2); },
    'c': x => { const c = T.carpet; fill(x, c[0]); x.fillStyle = c[1]; x.fillRect(0, 0, 16, 1); x.fillRect(0, 15, 16, 1); x.fillStyle = c[2]; x.fillRect(6, 6, 4, 4); x.fillStyle = c[1]; x.fillRect(7, 7, 2, 2); },
    'C': x => { floor(x); x.fillStyle = '#6a3a1a'; x.fillRect(0, 2, 16, 14); x.fillStyle = '#9a6234'; x.fillRect(0, 2, 16, 4); x.fillStyle = '#e8b030'; x.fillRect(0, 9, 16, 1); },
    'F': (x, r, f) => { floor(x); x.fillStyle = '#5a4a3a'; x.fillRect(3, 10, 10, 5); x.fillStyle = '#8a7a6a'; x.fillRect(2, 9, 12, 2); x.fillStyle = '#ff5a1f'; x.beginPath(); x.moveTo(3, 9); x.lineTo(8 + (f ? 1 : -1), 0); x.lineTo(13, 9); x.fill(); x.fillStyle = '#ffd040'; x.beginPath(); x.moveTo(5, 9); x.lineTo(8 + (f ? -1 : 1), 3); x.lineTo(11, 9); x.fill(); },
    'P': x => { floor(x); const c = T.pillar; x.fillStyle = c[0]; x.fillRect(4, 0, 8, 16); x.fillStyle = c[1]; x.fillRect(10, 0, 2, 16); x.fillRect(6, 2, 1, 12); x.fillStyle = c[2]; x.fillRect(3, 0, 10, 2); x.fillRect(3, 14, 10, 2); },
    'g': x => { const c = T.gold; fill(x, c[0]); x.fillStyle = c[1]; x.fillRect(0, 0, 16, 1); x.fillRect(0, 0, 1, 16); x.fillStyle = c[2]; x.fillRect(2, 2, 3, 1); x.fillRect(9, 9, 3, 1); },
    'm': x => { floor(x); x.fillStyle = '#c84a3a'; x.fillRect(1, 3, 14, 11); x.fillStyle = '#e8b030'; x.fillRect(2, 4, 12, 1); x.fillRect(2, 12, 12, 1); },
    'K': x => { P.w(x); x.fillStyle = '#7a4a2a'; x.fillRect(1, 5, 14, 11); x.fillStyle = '#c87a3a'; x.fillRect(3, 7, 3, 3); x.fillRect(10, 7, 3, 3); x.fillStyle = '#3a8a6a'; x.fillRect(6, 11, 4, 4); },
    'A': (x, r, f) => { floor(x); const c = T.rock; x.fillStyle = c[0]; x.fillRect(1, 6, 14, 10); x.fillStyle = c[1]; x.fillRect(1, 6, 14, 2); x.fillStyle = '#ff9f1a'; x.fillRect(3, 3, 2, 3); x.fillRect(11, 3, 2, 3); x.fillStyle = f ? '#ffd040' : '#ff7a1a'; x.fillRect(7, 2, 2, 4); },
  };
  const ANIM = { ',': 2, ':': 2, '~': 4, 'o': 4, 'i': 4, 'L': 2, 'F': 2, 'A': 2, 'Y': 2 };
  function get(ch, t, x, y, theme = 'india') {
    const n = ANIM[ch] || 1;
    const variant = (ch === '.' || ch === '_' || ch === 'T') ? ((x * 7 + y * 13) % 3) : 0;
    const f = n > 1 ? (ch === '~' || ch === 'o' || ch === 'i' ? ((t >> 4) + x) % n : ((t >> 5) + ((x + y) & 1)) % n) : 0;
    const key = theme + ch + variant + ':' + f;
    let c = cache[key];
    if (!c) { T = THEMES[theme] || THEMES.india; c = mkCanvas(16, 16); (P[ch] || P.X)(c.getContext('2d'), mulberry32(hashStr(ch + variant) + f * 977), f); cache[key] = c; }
    return c;
  }
  return { get };
})();

// ---- Buildings: pre-rendered composite sprites -----------------------
// roof: gable | tiered | pediment | turf | dragon ;  win: jali | arched | shutter
const BUILD_STYLE = {
  house: { wall: '#f0dcb0', band: '#c89860', roof: '#b8502a', roof2: '#8a3a1e' },
  house2: { wall: '#e8e0c8', band: '#a8906a', roof: '#3f8a6a', roof2: '#2a5a48' },
  shop: { wall: '#f0e6d0', band: '#7a9ac8', roof: '#2a6fb0', roof2: '#1a4a80', sign: 'SHOP', awning: '#2a6fb0' },
  shrine: { wall: '#fbf6ea', band: '#e8b030', roof: '#f4a261', roof2: '#c8702a', sign: 'SHRINE', roofType: 'tiered', top: 18, flag: true },
  hall: { wall: '#c8603a', band: '#7a2a1a', roof: '#7a2a1a', roof2: '#4a1a10', sign: 'FIRE HALL', flame: true },
  palace: { wall: '#fbf2dc', band: '#e8b030', roof: '#e0b040', roof2: '#a87a20', sign: 'VAIJAYANTA', roofType: 'tiered', top: 40, pillars: true },
  // Greece
  gr_house: { wall: '#f6f4ec', band: '#2a5ab0', roof: '#c8683a', roof2: '#8a4224', win: 'arched' },
  gr_house2: { wall: '#f6f4ec', band: '#2a5ab0', roof: '#3a6ab8', roof2: '#1a3a80', win: 'arched' },
  gr_shop: { wall: '#f6f4ec', band: '#2a5ab0', roof: '#2a6fb0', roof2: '#1a4a80', sign: 'SHOP', win: 'arched', awning: '#2a5ab0' },
  gr_shrine: { wall: '#ffffff', band: '#e8c040', roof: '#eeeae0', roof2: '#c8c4b8', sign: 'SHRINE', roofType: 'pediment', top: 14, columns: '#ffffff' },
  arena: { wall: '#f0e4d0', band: '#8a2a1a', roof: '#c84a3a', roof2: '#8a2a1a', sign: 'ARENA OF ARES', roofType: 'pediment', top: 14, columns: '#f8f0e0' },
  hadesgate: { wall: '#4a3a5a', band: '#2a1a3a', roof: '#3a2a4a', roof2: '#1a1028', sign: 'GATE OF HADES', roofType: 'pediment', top: 14, columns: '#6a5a7a', signCol: '#c8a0ff' },
  seatemple: { wall: '#e8f0f8', band: '#1e78d0', roof: '#2a8ac0', roof2: '#1a5a8a', sign: 'SEA TEMPLE', roofType: 'pediment', top: 14, columns: '#f0f8ff' },
  zeustemple: { wall: '#ffffff', band: '#e8c040', roof: '#f4f0e6', roof2: '#c8b878', sign: 'TEMPLE OF ZEUS', roofType: 'pediment', top: 30, columns: '#ffffff', bolt: true },
  // Norse
  no_house: { wall: '#7a5434', band: '#5e3e24', roof: '#5a8a4a', roof2: '#3a5a2a', roofType: 'turf', win: 'shutter', logs: true, snow: true },
  no_house2: { wall: '#6a4a30', band: '#4e3420', roof: '#6a9a5a', roof2: '#3a5a2a', roofType: 'turf', win: 'shutter', logs: true, snow: true },
  no_shop: { wall: '#7a5434', band: '#5e3e24', roof: '#2a5a8a', roof2: '#1a3a5a', sign: 'SHOP', win: 'shutter', logs: true, snow: true, awning: '#2a5a8a' },
  no_shrine: { wall: '#8a6444', band: '#5e3e24', roof: '#4a3020', roof2: '#2a1a10', sign: 'SHRINE', roofType: 'dragon', top: 14, win: 'shutter', logs: true, snow: true },
  forge: { wall: '#5a4a40', band: '#3a2a20', roof: '#4a3a30', roof2: '#2a1a14', sign: 'THUNDER FORGE', win: 'shutter', snow: true, chimney: true },
  oathhall: { wall: '#7a5434', band: '#5e3e24', roof: '#4a3020', roof2: '#2a1a10', sign: 'HALL OF OATHS', roofType: 'dragon', top: 14, win: 'shutter', logs: true, snow: true },
  // Egypt
  eg_house: { wall: '#e8d0a0', band: '#c8a870', roof: '#d8b878', roof2: '#b89858', roofType: 'flat', win: 'dark' },
  eg_house2: { wall: '#f0dcb0', band: '#2a8a9a', roof: '#e0c088', roof2: '#c0a068', roofType: 'flat', win: 'dark' },
  eg_shop: { wall: '#e8d0a0', band: '#2a5ab0', roof: '#d8b878', roof2: '#b89858', roofType: 'flat', win: 'dark', sign: 'SHOP', awning: '#2a5ab0' },
  eg_shrine: { wall: '#f0dcb0', band: '#2a8a9a', roof: '#e8c040', roof2: '#b89858', roofType: 'pylon', top: 10, win: 'none', sign: 'SHRINE' },
  anubis_tomb: { wall: '#3a3040', band: '#e8c040', roof: '#2a2030', roof2: '#e8c040', roofType: 'pylon', top: 12, win: 'none', sign: 'TOMB OF ANUBIS' },
  sekhmet_hall: { wall: '#c86a3a', band: '#e8c040', roof: '#8a3a1a', roof2: '#e8c040', roofType: 'pylon', top: 12, win: 'none', sign: 'HALL OF SEKHMET' },
  ra_temple: { wall: '#f4e0b0', band: '#2a5ab0', roof: '#e8c040', roof2: '#c8a020', roofType: 'pylon', top: 24, win: 'none', sign: 'TEMPLE OF RA', sun: true },
  // Japan
  jp_house: { wall: '#ece4d4', band: '#5a3a2a', roof: '#4a4a52', roof2: '#2a2a32', roofType: 'pagoda', win: 'shoji', timber: true },
  jp_house2: { wall: '#ece4d4', band: '#5a3a2a', roof: '#5a4a3a', roof2: '#3a2a1a', roofType: 'pagoda', win: 'shoji', timber: true },
  jp_shop: { wall: '#ece4d4', band: '#2a3a6a', roof: '#3a4a6a', roof2: '#1a2a4a', roofType: 'pagoda', win: 'shoji', timber: true, sign: 'SHOP', awning: '#2a3a6a' },
  jp_shrine: { wall: '#ece4d4', band: '#c83a2a', roof: '#3a3a42', roof2: '#c83a2a', roofType: 'pagoda', top: 8, win: 'none', redPosts: true, sign: 'SHRINE' },
  moon_hall: { wall: '#d8d8e8', band: '#2a2a5a', roof: '#2a2a5a', roof2: '#14143a', roofType: 'pagoda', top: 8, win: 'shoji', timber: true, sign: 'MOON HALL', moon: true },
  thunder_hall: { wall: '#e0d8c8', band: '#c83a2a', roof: '#3a3a42', roof2: '#c83a2a', roofType: 'pagoda', top: 8, win: 'shoji', timber: true, sign: 'HALL OF THUNDER', drums: true },
  sun_shrine: { wall: '#f4ece0', band: '#c83a2a', roof: '#3a3a42', roof2: '#e8c040', roofType: 'pagoda', tiers: 2, top: 26, win: 'none', redPosts: true, sign: 'SUN SHRINE' },
  // Celtic
  ce_house: { wall: '#a8a090', band: '#6a5a40', roof: '#c8a050', roof2: '#a07a30', roofType: 'thatch', top: 4, win: 'shutter' },
  ce_house2: { wall: '#b8b0a0', band: '#6a5a40', roof: '#b89040', roof2: '#906a20', roofType: 'thatch', top: 4, win: 'shutter' },
  ce_shop: { wall: '#a8a090', band: '#2a6a3a', roof: '#c8a050', roof2: '#a07a30', roofType: 'thatch', top: 4, win: 'shutter', sign: 'SHOP', awning: '#2a6a3a' },
  ce_shrine: { wall: '#b8b8b0', band: '#2a6a3a', roof: '#88a060', roof2: '#5a7a3a', roofType: 'thatch', top: 8, win: 'none', sign: 'SHRINE', knot: true },
  crow_hall: { wall: '#4a4a52', band: '#7a2a3a', roof: '#3a3a3a', roof2: '#1a1a1a', roofType: 'thatch', top: 10, win: 'shutter', sign: 'HALL OF THE MORRIGAN' },
  lugh_hall: { wall: '#e8e0c8', band: '#e8c040', roof: '#d8b048', roof2: '#a88020', roofType: 'thatch', top: 10, win: 'shutter', sign: 'HALL OF LUGH', knot: true },
  dagda_hall: { wall: '#8a7a60', band: '#2a6a3a', roof: '#b8903a', roof2: '#7a5a1a', roofType: 'thatch', top: 24, win: 'shutter', sign: 'HALL OF THE DAGDA', knot: true },
  // Mesopotamia
  me_house: { wall: '#c8a878', band: '#a88858', roof: '#b89868', roof2: '#987848', roofType: 'flat', win: 'dark', crenel: true },
  me_house2: { wall: '#d8b888', band: '#3a5a9a', roof: '#c8a878', roof2: '#a88858', roofType: 'flat', win: 'dark', crenel: true },
  me_shop: { wall: '#c8a878', band: '#3a5a9a', roof: '#b89868', roof2: '#987848', roofType: 'flat', win: 'dark', crenel: true, sign: 'SHOP', awning: '#3a5a9a' },
  me_shrine: { wall: '#d8b888', band: '#3a5a9a', roof: '#c8a878', roof2: '#a88858', roofType: 'ziggurat', top: 10, win: 'none', sign: 'SHRINE' },
  ishtar_gate: { wall: '#2a5aa8', band: '#e8c050', roof: '#2a5aa8', roof2: '#1a3a78', roofType: 'flat', win: 'none', crenel: true, figures: true, sign: 'GATE OF ISHTAR' },
  nergal_hall: { wall: '#8a3a2a', band: '#e8c050', roof: '#6a2a1a', roof2: '#4a1a10', roofType: 'flat', win: 'dark', crenel: true, sign: 'HALL OF NERGAL' },
  esagila: { wall: '#d8b888', band: '#2a5aa8', roof: '#c8a070', roof2: '#a88050', roofType: 'ziggurat', top: 30, win: 'none', sign: 'ESAGILA' },
  // Slavic
  sl_house: { wall: '#9a7a58', band: '#c83a2a', roof: '#6a4a30', roof2: '#4a3020', win: 'carved', logs: true },
  sl_house2: { wall: '#8a6a48', band: '#2a5ab0', roof: '#7a5a38', roof2: '#4a3020', win: 'carved', logs: true },
  sl_shop: { wall: '#9a7a58', band: '#c83a2a', roof: '#3a6a3a', roof2: '#1a4a1a', win: 'carved', logs: true, sign: 'SHOP', awning: '#c83a2a' },
  sl_shrine: { wall: '#e8dcc8', band: '#2a5ab0', roof: '#4a6a3a', roof2: '#2a4a1a', roofType: 'onion', top: 22, win: 'arched', sign: 'SHRINE', dome: '#3a8ac8' },
  svarog_forge: { wall: '#6a5a50', band: '#c83a2a', roof: '#4a3a30', roof2: '#2a1a14', win: 'carved', chimney: true, sign: 'FORGE OF SVAROG' },
  mokosh_hall: { wall: '#e8dcc8', band: '#c83a2a', roof: '#8a3a2a', roof2: '#5a2a1a', roofType: 'onion', top: 22, win: 'arched', sign: 'HALL OF MOKOSH', dome: '#3a9a5a' },
  perun_hall: { wall: '#f0e8d8', band: '#2a5ab0', roof: '#3a5a9a', roof2: '#1a3a6a', roofType: 'onion', top: 30, win: 'arched', sign: 'OAK HALL OF PERUN', dome: '#e8b030', domes: 3 },
  valgrind: { wall: '#7a5434', band: '#c8a040', roof: '#c8a040', roof2: '#8a6a20', sign: 'VALGRIND', roofType: 'dragon', top: 26, win: 'shutter', logs: true, shields: true },
};
function renderBuilding(b) {
  const st = BUILD_STYLE[b.style], w = b.w * 16, h = b.h * 16, top = st.top || 0;
  const c = mkCanvas(w, h + top), x = c.getContext('2d');
  const wallY = top + (b.h - 2) * 16, roofH = wallY, rt = st.roofType || 'gable';
  // walls
  x.fillStyle = st.wall; x.fillRect(2, wallY, w - 4, 32);
  if (st.logs) { x.fillStyle = shade(st.wall, -.25); for (let y = wallY + 3; y < wallY + 26; y += 4) x.fillRect(2, y, w - 4, 1); }
  x.fillStyle = st.band; x.fillRect(2, wallY + 26, w - 4, 6); x.fillRect(2, wallY, w - 4, 2);
  const doorI = b.door - b.x;
  if (st.timber) { x.fillStyle = st.band; for (let i = 0; i <= b.w; i++) x.fillRect(i * 16 - (i === b.w ? 4 : 0) + 1, wallY, 2, 32); }
  if (rt === 'pylon') drawPylon(x, st, w, top, wallY);
  // windows
  if (!st.columns && st.win !== 'none') for (let i = 0; i < b.w; i++) {
    if (i === doorI || i === 0 || i === b.w - 1) continue;
    const wx = i * 16 + 3, wy = wallY + 6;
    if (st.win === 'arched') { x.fillStyle = '#1a2a50'; x.fillRect(wx + 1, wy + 2, 8, 10); x.beginPath(); x.arc(wx + 5, wy + 3, 4, Math.PI, 0); x.fill(); x.fillStyle = st.band; x.fillRect(wx, wy + 12, 10, 2); }
    else if (st.win === 'dark') { x.fillStyle = '#2a1a0a'; x.fillRect(wx + 2, wy + 2, 6, 8); x.fillStyle = shade(st.wall, -.2); x.fillRect(wx + 1, wy + 10, 8, 2); }
    else if (st.win === 'shoji') { x.fillStyle = '#f8f4e8'; x.fillRect(wx, wy, 10, 12); x.fillStyle = st.band; x.fillRect(wx + 4, wy, 1, 12); x.fillRect(wx, wy + 5, 10, 1); x.strokeStyle = st.band; x.strokeRect(wx + .5, wy + .5, 9, 11); }
    else if (st.win === 'carved') { x.fillStyle = '#2a1a0a'; x.fillRect(wx + 2, wy + 2, 6, 8); x.fillStyle = '#ffd890'; x.fillRect(wx + 3, wy + 3, 4, 6); x.fillStyle = st.band; x.fillRect(wx, wy, 10, 2); x.fillRect(wx + 3, wy - 2, 4, 2); x.fillRect(wx, wy + 10, 10, 2); }
    else if (st.win === 'shutter') { x.fillStyle = '#2a1a0a'; x.fillRect(wx + 2, wy + 2, 6, 7); x.fillStyle = '#ffd890'; x.fillRect(wx + 3, wy + 3, 4, 5); x.fillStyle = shade(st.wall, -.4); x.fillRect(wx - 1, wy + 1, 3, 9); x.fillRect(wx + 8, wy + 1, 3, 9); }
    else { x.fillStyle = '#4a2a14'; x.fillRect(wx, wy, 10, 12); x.fillStyle = '#e8c890'; for (let a = 0; a < 3; a++) for (let q = 0; q < 3; q++) x.fillRect(wx + 1 + a * 3, wy + 1 + q * 4, 2, 2); }
  }
  if (st.columns) { for (let i = 0; i < b.w; i++) { if (i === doorI) continue; const cx0 = i * 16 + 5; x.fillStyle = st.columns; x.fillRect(cx0, wallY + 1, 6, 26); x.fillStyle = shade(st.columns, -.18); x.fillRect(cx0 + 4, wallY + 1, 2, 26); x.fillRect(cx0 + 2, wallY + 4, 1, 20); x.fillStyle = shade(st.columns, .1); x.fillRect(cx0 - 1, wallY, 8, 2); x.fillRect(cx0 - 1, wallY + 25, 8, 2); } x.fillStyle = shade(st.wall, -.12); x.fillRect(0, wallY + 29, w, 3); }
  if (st.shields) for (let i = 0; i < b.w; i++) { if (i === doorI) continue; const sx = i * 16 + 8, sy = wallY + 12; x.fillStyle = i % 2 ? '#c84a3a' : '#2a5a9a'; x.beginPath(); x.arc(sx, sy, 5, 0, 7); x.fill(); x.fillStyle = '#c8a040'; x.beginPath(); x.arc(sx, sy, 1.5, 0, 7); x.fill(); }
  // door
  const dx = doorI * 16;
  x.fillStyle = '#3a1a08'; x.fillRect(dx + 2, wallY + 8, 12, 24);
  x.fillStyle = b.style === 'hadesgate' ? '#1a0a20' : '#6a3a1a'; x.fillRect(dx + 3, wallY + 10, 10, 22);
  x.fillStyle = st.band; x.beginPath(); x.arc(dx + 8, wallY + 10, 6, Math.PI, 0); x.fill();
  x.fillStyle = '#3a1a08'; x.beginPath(); x.arc(dx + 8, wallY + 11, 4.5, Math.PI, 0); x.fill();
  x.fillStyle = '#e8b030'; x.fillRect(dx + 10, wallY + 20, 2, 2);
  // roof
  if (rt === 'tiered') {
    x.fillStyle = st.roof2; x.fillRect(0, wallY - 6, w, 6);
    const tiers = top > 30 ? 4 : 3;
    for (let t = 0; t < tiers; t++) {
      const tw = w * (1 - t * .2) - 8, ty = wallY - 6 - (t + 1) * (roofH - 10) / (tiers + .6), th = (roofH - 10) / (tiers + .6) + 1;
      x.fillStyle = t % 2 ? st.roof : st.roof2; x.fillRect((w - tw) / 2, ty, tw, th);
      x.fillStyle = shade(st.roof, .35); x.fillRect((w - tw) / 2, ty, tw, 2);
      x.fillStyle = shade(st.roof, -.35); for (let k = (w - tw) / 2 + 3; k < (w + tw) / 2 - 2; k += 6) x.fillRect(k, ty + 4, 2, th - 5);
    }
    x.fillStyle = '#ffd040'; x.beginPath(); x.ellipse(w / 2, 6, 4, 5, 0, 0, 7); x.fill(); x.fillRect(w / 2 - 1, 0, 2, 4);
    if (st.flag) { x.fillStyle = '#ff7a1a'; x.beginPath(); x.moveTo(w / 2 + 1, 0); x.lineTo(w / 2 + 12, 4); x.lineTo(w / 2 + 1, 8); x.fill(); }
    if (st.pillars) { for (let i = 0; i < b.w; i += 2) { x.fillStyle = '#fbf2dc'; x.fillRect(i * 16 + 2, wallY - 2, 4, 30); x.fillStyle = '#e8b030'; x.fillRect(i * 16 + 1, wallY - 3, 6, 2); } }
  } else if (rt === 'pediment') {
    // entablature, frieze and a low triangular pediment, Greek-temple style
    const eY = wallY - 10;
    x.fillStyle = st.roof2; x.fillRect(0, eY, w, 10);
    x.fillStyle = st.band; for (let i = 2; i < w - 2; i += 8) { x.fillRect(i, eY + 3, 4, 1); x.fillRect(i + 3, eY + 3, 1, 4); x.fillRect(i, eY + 6, 4, 1); }
    x.fillStyle = shade(st.roof2, .3); x.fillRect(0, eY, w, 1);
    x.fillStyle = st.roof; x.beginPath(); x.moveTo(-2, eY + 1); x.lineTo(w / 2, Math.max(1, top - 2)); x.lineTo(w + 2, eY + 1); x.fill();
    x.fillStyle = shade(st.roof, -.2); x.beginPath(); x.moveTo(10, eY - 1); x.lineTo(w / 2, Math.max(4, top + 3)); x.lineTo(w - 10, eY - 1); x.fill();
    x.fillStyle = shade(st.roof, .3); x.fillRect(0, eY, w, 2);
    if (st.bolt) { x.fillStyle = '#ffd040'; x.beginPath(); x.moveTo(w / 2 + 2, eY - 26); x.lineTo(w / 2 - 4, eY - 13); x.lineTo(w / 2 + 1, eY - 13); x.lineTo(w / 2 - 3, eY - 3); x.lineTo(w / 2 + 6, eY - 17); x.lineTo(w / 2 + 1, eY - 17); x.fill(); }
    // fill the space between pediment and wall with the entablature if the roof is taller than the pediment
    if (eY + 10 < wallY) { x.fillStyle = st.wall; x.fillRect(2, eY + 10, w - 4, wallY - eY - 10); }
  } else if (rt === 'turf') {
    x.fillStyle = st.roof2; x.beginPath(); x.moveTo(-1, roofH + 1); x.quadraticCurveTo(w / 2, -4, w + 1, roofH + 1); x.fill();
    x.fillStyle = st.roof; x.beginPath(); x.moveTo(3, roofH - 2); x.quadraticCurveTo(w / 2, 0, w - 3, roofH - 2); x.fill();
    x.fillStyle = shade(st.roof, .25); for (let i = 6; i < w - 6; i += 5) x.fillRect(i, Math.max(3, roofH - 4 - Math.sin(i / w * Math.PI) * (roofH - 8)), 1, 3);
  } else if (rt === 'pylon') {
    // drawn before the door by drawPylon
  } else if (rt === 'flat') {
    x.fillStyle = st.wall; x.fillRect(2, 6, w - 4, roofH - 6);
    x.fillStyle = st.band; x.fillRect(2, roofH - 3, w - 4, 3);
    if (roofH > 22 && st.win !== 'none') for (let i = 1; i < b.w - 1; i++) { x.fillStyle = '#2a1a0a'; x.fillRect(i * 16 + 6, 12, 4, 6); }
    x.fillStyle = st.roof; x.fillRect(0, 2, w, 6); x.fillStyle = st.roof2; x.fillRect(0, 7, w, 1);
    if (st.crenel) { x.fillStyle = st.roof; for (let i = 0; i < w; i += 8) x.fillRect(i, 0, 5, 3); }
    if (st.figures) for (let i = 0; i < 3; i++) { const fx = 12 + i * (w - 24) / 2, fy = roofH - 16; x.fillStyle = '#e8c050'; x.fillRect(fx - 6, fy, 12, 5); x.fillRect(fx + 4, fy - 3, 4, 4); x.fillRect(fx - 5, fy + 5, 2, 4); x.fillRect(fx + 3, fy + 5, 2, 4); x.fillRect(fx - 8, fy - 1, 3, 2); }
    if (st.figures) { x.fillStyle = '#e8c050'; for (let y = 12; y < roofH - 18; y += 8) for (let i = 4; i < w - 4; i += 8) x.fillRect(i, y, 2, 2); }
  } else if (rt === 'pagoda') {
    const eaveY = roofH - 6, ridgeY = top + 6;
    const eave = (y, inset) => { x.fillStyle = st.roof2; x.beginPath(); x.moveTo(inset - 4, y - 3); x.lineTo(w - inset + 4, y - 3); x.lineTo(w - inset - 4, y + 4); x.lineTo(inset + 4, y + 4); x.fill(); x.beginPath(); x.moveTo(inset - 6, y - 9); x.lineTo(inset + 2, y - 2); x.lineTo(inset - 4, y); x.fill(); x.beginPath(); x.moveTo(w - inset + 6, y - 9); x.lineTo(w - inset - 2, y - 2); x.lineTo(w - inset + 4, y); x.fill(); };
    x.fillStyle = st.roof; x.beginPath(); x.moveTo(6, eaveY - 3); x.lineTo(w - 6, eaveY - 3); x.lineTo(w - 18, ridgeY); x.lineTo(18, ridgeY); x.fill();
    x.fillStyle = shade(st.roof, -.25); for (let i = 10; i < w - 10; i += 4) x.fillRect(i, Math.max(ridgeY + 2, ridgeY + Math.abs(i - w / 2) * 0), 1, eaveY - ridgeY - 4);
    if (st.tiers === 2) { const my = (ridgeY + eaveY) / 2 + 2; eave(my, 14); }
    eave(eaveY, 0);
    x.fillStyle = st.roof2; x.fillRect(16, ridgeY - 4, w - 32, 4); x.fillRect(13, ridgeY - 7, 4, 4); x.fillRect(w - 17, ridgeY - 7, 4, 4);
    if (st.moon) { x.fillStyle = '#f8f4d8'; x.beginPath(); x.arc(w / 2, ridgeY + 10, 5, 0, 7); x.fill(); x.fillStyle = st.roof; x.beginPath(); x.arc(w / 2 + 3, ridgeY + 9, 4.5, 0, 7); x.fill(); }
    if (st.drums) for (const dxp of [w * .3, w * .7]) { x.fillStyle = '#c83a2a'; x.beginPath(); x.arc(dxp, ridgeY + 12, 5, 0, 7); x.fill(); x.fillStyle = '#e8c040'; x.beginPath(); x.arc(dxp, ridgeY + 12, 2, 0, 7); x.fill(); }
  } else if (rt === 'thatch') {
    const peak = top + 1;
    x.fillStyle = st.roof2; x.beginPath(); x.moveTo(-3, roofH + 2); x.quadraticCurveTo(w / 2, 2 * peak - roofH, w + 3, roofH + 2); x.fill();
    x.fillStyle = st.roof; x.beginPath(); x.moveTo(2, roofH - 1); x.quadraticCurveTo(w / 2, 2 * peak - roofH + 6, w - 2, roofH - 1); x.fill();
    x.fillStyle = shade(st.roof, -.2); for (let i = 5; i < w - 5; i += 3) { const yy = roofH - 2 - Math.sin(i / w * Math.PI) * (roofH - peak - 6); x.fillRect(i, yy, 1, 4); }
    x.fillStyle = shade(st.roof, .25); x.fillRect(4, roofH - 3, w - 8, 2);
    if (st.knot) { x.strokeStyle = '#e8c040'; x.lineWidth = 1; x.beginPath(); x.arc(w / 2 - 3, roofH - 14, 4, 0, 7); x.arc(w / 2 + 3, roofH - 14, 4, 0, 7); x.stroke(); }
  } else if (rt === 'ziggurat') {
    const tiers = 4, base = roofH, th = (roofH - top + 2) / (tiers + .5);
    for (let t = 0; t < tiers; t++) { const tw = w * (1 - t * .17), ty = base - (t + 1) * th; x.fillStyle = t % 2 ? st.roof : st.roof2; x.fillRect((w - tw) / 2, ty, tw, th + 1); x.fillStyle = shade(st.roof, .3); x.fillRect((w - tw) / 2, ty, tw, 1); }
    x.fillStyle = shade(st.roof, .35); x.fillRect(w / 2 - 4, base - tiers * th, 8, tiers * th);
    x.fillStyle = shade(st.roof, -.2); for (let y = base - tiers * th + 2; y < base; y += 3) x.fillRect(w / 2 - 4, y, 8, 1);
    x.fillStyle = st.band; x.fillRect(w / 2 - 8, base - tiers * th - 8, 16, 8); x.fillStyle = '#e8c050'; x.fillRect(w / 2 - 2, base - tiers * th - 12, 4, 4);
  } else if (rt === 'onion') {
    x.fillStyle = st.roof2; x.fillRect(0, roofH - 6, w, 8);
    x.fillStyle = st.roof; x.beginPath(); x.moveTo(0, roofH - 2); x.lineTo(12, top + 12); x.lineTo(w - 12, top + 12); x.lineTo(w, roofH - 2); x.fill();
    x.fillStyle = shade(st.roof, -.25); for (let y = top + 16; y < roofH - 4; y += 5) x.fillRect(6, y, w - 12, 1);
    const dome = (cx, base, r) => { x.fillStyle = shade(st.wall, -.1); x.fillRect(cx - r * .6, base - r * .5, r * 1.2, r * .6); x.fillStyle = st.dome; x.beginPath(); x.moveTo(cx - r * .7, base - r * .5); x.bezierCurveTo(cx - r * 1.4, base - r * 1.4, cx - r * .2, base - r * 1.7, cx, base - r * 2.4); x.bezierCurveTo(cx + r * .2, base - r * 1.7, cx + r * 1.4, base - r * 1.4, cx + r * .7, base - r * .5); x.fill(); x.fillStyle = shade(st.dome, .35); x.fillRect(cx - r * .45, base - r * 1.2, 2, r * .5); x.fillStyle = '#e8c040'; x.fillRect(cx - .5, base - r * 2.4 - 5, 1, 5); x.fillRect(cx - 2, base - r * 2.4 - 4, 5, 1); };
    if (st.domes === 3) { dome(w * .22, top + 16, 6); dome(w * .78, top + 16, 6); }
    dome(w / 2, top + 14, 9);
  } else if (rt === 'dragon') {
    const peak = Math.max(2, top - 4);
    x.fillStyle = st.roof2; x.beginPath(); x.moveTo(-2, roofH + 1); x.lineTo(w / 2, peak); x.lineTo(w + 2, roofH + 1); x.fill();
    x.fillStyle = st.roof; x.beginPath(); x.moveTo(3, roofH - 1); x.lineTo(w / 2, peak + 4); x.lineTo(w - 3, roofH - 1); x.fill();
    x.fillStyle = shade(st.roof, -.3); for (let y = peak + 8; y < roofH - 2; y += 4) { const hw = (y - peak) / (roofH - peak) * (w / 2 - 4); for (let k = w / 2 - hw; k < w / 2 + hw; k += 5) x.fillRect(k, y, 3, 1); }
    // crossed carved gable beams with curled dragon heads
    x.strokeStyle = '#2a1a0a'; x.lineWidth = 2; x.beginPath(); x.moveTo(w / 2 - 10, peak + 10); x.lineTo(w / 2 + 6, peak - 8); x.moveTo(w / 2 + 10, peak + 10); x.lineTo(w / 2 - 6, peak - 8); x.stroke();
    x.fillStyle = '#c8a040'; x.fillRect(w / 2 + 5, peak - 10, 3, 3); x.fillRect(w / 2 - 8, peak - 10, 3, 3);
  } else {
    x.fillStyle = st.roof2; x.fillRect(0, roofH - 6, w, 8);
    x.fillStyle = st.roof; x.beginPath(); x.moveTo(0, roofH - 2); x.lineTo(10, 2); x.lineTo(w - 10, 2); x.lineTo(w, roofH - 2); x.fill();
    x.fillStyle = shade(st.roof, -.25); for (let y = 8; y < roofH - 4; y += 5) x.fillRect(4, y, w - 8, 1);
    x.fillStyle = shade(st.roof, .35); x.fillRect(10, 2, w - 20, 2);
    if (st.flame) { x.fillStyle = '#ff7a1a'; x.beginPath(); x.moveTo(w / 2 - 6, roofH - 10); x.lineTo(w / 2, roofH - 26); x.lineTo(w / 2 + 6, roofH - 10); x.fill(); x.fillStyle = '#ffd040'; x.beginPath(); x.moveTo(w / 2 - 3, roofH - 10); x.lineTo(w / 2, roofH - 19); x.lineTo(w / 2 + 3, roofH - 10); x.fill(); }
    if (st.chimney) { x.fillStyle = '#3a3a40'; x.fillRect(w - 22, 0, 8, 14); x.fillStyle = '#ff7a1a'; x.fillRect(w - 20, 1, 4, 2); }
  }
  if (st.redPosts) { x.fillStyle = '#c83a2a'; x.fillRect(4, wallY - 4, 5, 36); x.fillRect(w - 9, wallY - 4, 5, 36); x.fillStyle = '#2a2a2a'; x.fillRect(2, wallY - 6, w - 4, 3); }
  if (st.awning) { for (let i = 0; i < w; i += 8) { x.fillStyle = (i / 8) % 2 ? '#ffffff' : st.awning; x.fillRect(i, wallY - 6, 8, 6); } }
  if (st.snow) { x.fillStyle = '#f4f8fc'; if (rt === 'gable') { x.fillRect(8, 0, w - 16, 3); } else if (rt === 'dragon') { const peak = Math.max(2, top - 4); x.beginPath(); x.moveTo(w / 2 - 14, peak + 14); x.lineTo(w / 2, peak + 2); x.lineTo(w / 2 + 14, peak + 14); x.fill(); } else { x.beginPath(); x.moveTo(8, roofH * .45); x.quadraticCurveTo(w / 2, -2, w - 8, roofH * .45); x.lineTo(w - 12, roofH * .5); x.quadraticCurveTo(w / 2, 5, 12, roofH * .5); x.fill(); } }
  if (st.sign) {
    const tw = Font.measure(st.sign) + 6, sx = (w - tw) / 2 | 0, sy = wallY - (rt === 'pediment' ? 9 : 12);
    x.fillStyle = '#3a1a08'; x.fillRect(sx - 1, sy - 1, tw + 2, 11); x.fillStyle = rt === 'pediment' ? shade(st.roof2, -.2) : '#6a3a1a'; x.fillRect(sx, sy, tw, 9);
    Font.draw(x, st.sign, sx + 3, sy + 1, st.signCol || '#ffd040');
  }
  return { canvas: c, top };
}
// Egyptian pylon gateway: two sloping towers with a lintel between them
function drawPylon(x, st, w, top, wallY) {
  const bot = wallY + 32, tw = w * .4;
  x.fillStyle = st.wall;
  x.beginPath(); x.moveTo(0, bot); x.lineTo(5, top + 2); x.lineTo(tw - 3, top + 2); x.lineTo(tw, bot); x.fill();
  x.beginPath(); x.moveTo(w, bot); x.lineTo(w - 5, top + 2); x.lineTo(w - tw + 3, top + 2); x.lineTo(w - tw, bot); x.fill();
  x.fillStyle = st.roof; x.fillRect(3, top, tw - 4, 5); x.fillRect(w - tw + 1, top, tw - 4, 5);
  x.fillStyle = shade(st.wall, -.15); x.fillRect(tw - 3, top + 6, 3, bot - top - 6); x.fillRect(w - 6, top + 6, 3, bot - top - 6);
  x.fillStyle = st.wall; x.fillRect(tw - 2, wallY - 10, w - 2 * tw + 4, 42);
  x.fillStyle = st.roof; x.fillRect(tw - 4, wallY - 14, w - 2 * tw + 8, 5);
  // carved glyph rows
  x.fillStyle = shade(st.wall, -.35);
  for (let y = top + 10; y < bot - 6; y += 6) for (let i = 8; i < tw - 8; i += 5) if (((i * 7 + y) % 3) !== 0) { x.fillRect(i, y, 2, 3); x.fillRect(w - i - 2, y, 2, 3); }
  x.fillStyle = st.band; x.fillRect(2, bot - 4, w - 4, 4);
  if (st.sun) { const cy = wallY - 18; x.fillStyle = '#e8c040'; x.beginPath(); x.moveTo(w / 2 - 22, cy); x.lineTo(w / 2 - 6, cy - 3); x.lineTo(w / 2 - 6, cy + 3); x.fill(); x.beginPath(); x.moveTo(w / 2 + 22, cy); x.lineTo(w / 2 + 6, cy - 3); x.lineTo(w / 2 + 6, cy + 3); x.fill(); x.fillStyle = '#ff7a1a'; x.beginPath(); x.arc(w / 2, cy, 6, 0, 7); x.fill(); x.fillStyle = '#ffd040'; x.beginPath(); x.arc(w / 2, cy, 4, 0, 7); x.fill(); }
}
