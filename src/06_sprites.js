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
    const legH = (ele ? 12 : 10) * s, bRX = (ele ? 19 : 16) * s, bRY = (ele ? 12 : 9.5) * s;
    const cx = 35, bcy = ground - legH - bRY * .45 + bob;
    // tail
    const tx = cx + bRX - 1, ty = bcy - bRY * .3;
    if (ele) g.tube([[tx, ty], [tx + 5 * s, ty + 4 * s], [tx + 6 * s, ty + 11 * s]], 1.3, .8, IX.BASE);
    else {
      const tip = [tx + 9 * s, ty - 13 * s + (f ? 1 : -1)];
      g.tube([[tx, ty], [tx + 8 * s, ty - 3 * s], tip], 1.8 * s, 1.1, IX.BASE);
      if (A.has('tailFlame')) g.flame(tip[0], tip[1] + 2, 7 * s, f);
      else g.ell(tip[0], tip[1], 2.2 * s, 2.2 * s, IX.ACC);
    }
    if (A.has('wingsBig')) drawWing(g, [cx - 2, bcy - bRY + 2], [cx + 10 * s, bcy - bRY - (f ? 14 : 24) * s], [cx + 14 * s, bcy - 2], IX.ACCFAR, false);
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
    // head
    const hr = (ele ? 9.5 : 8) * s, hx = cx - bRX * .82, hy = bcy - bRY * .75;
    if (A.has('mane') || A.has('maneBig')) {
      const R = hr * (A.has('maneBig') ? 1.65 : 1.35);
      for (let a = 0; a < 12; a++) { const an = a / 12 * Math.PI * 2; g.ell(hx + 2 + Math.cos(an) * R * .75, hy + Math.sin(an) * R * .75, R * .42, R * .42, IX.ACC); }
      g.ell(hx + 2, hy, R * .8, R * .8, IX.ACC);
    }
    if (A.has('earsBig')) g.ell(hx + hr * .9, hy - 1, hr * .55, hr * .9, IX.FAR);
    if (A.has('ears')) { g.poly([[hx + 1, hy - hr * .5], [hx + 4 * s, hy - hr * 1.45], [hx + 6 * s, hy - hr * .3]], IX.FAR); }
    g.oell(hx, hy, hr, hr * .92, IX.BASE);
    if (A.has('ears')) { g.opoly([[hx - 3 * s, hy - hr * .55], [hx - 1 * s, hy - hr * 1.5], [hx + 2.5 * s, hy - hr * .6]], IX.BASE); g.poly([[hx - 2 * s, hy - hr * .6], [hx - 1 * s, hy - hr * 1.2], [hx + 1.4 * s, hy - hr * .6]], IX.BELLY); }
    if (!ele) g.ell(hx - hr * .55, hy + hr * .3, hr * .55, hr * .42, IX.BELLY);
    if (A.has('trunk')) g.tube([[hx - hr * .7, hy + hr * .15], [hx - hr * 1.25, hy + hr * .8], [hx - hr * 1.15, hy + hr * 1.6], [hx - hr * 1.55 + (f ? 1 : 0), hy + hr * 2.0]], 2.6 * s, 1.3, IX.BASE, null, true);
    if (A.has('trunkSmall')) g.tube([[hx - hr * .8, hy + hr * .25], [hx - hr * 1.2, hy + hr * .75], [hx - hr * 1.05 + (f ? 1 : 0), hy + hr * 1.15]], 1.8 * s, 1, IX.BASE, null, true);
    if (A.has('tusks')) { g.line(hx - hr * .55, hy + hr * .55, hx - hr * 1.35, hy + hr * .95, IX.HORN, .9); }
    if (A.has('tusksMany')) for (let i = 0; i < 3; i++) g.line(hx - hr * .5, hy + hr * (.45 + i * .18), hx - hr * (1.3 + i * .15), hy + hr * (.6 + i * .35), IX.HORN, .8);
    if (A.has('earsBig')) { g.oell(hx + hr * .45, hy + 1, hr * .5, hr * .85, IX.BASE); g.ell(hx + hr * .45, hy + 1, hr * .3, hr * .6, IX.BELLY); }
    if (A.has('horns')) { g.tube([[hx + 1, hy - hr * .7], [hx + 3 * s, hy - hr * 1.5], [hx + 7 * s, hy - hr * 1.75]], 1.6 * s, .7, IX.HORN, null, true); }
    if (A.has('crown')) crown(g, hx + 1, hy - hr * .85, 5 * s);
    if (A.has('gem')) g.rect(hx - hr * .2, hy - hr * .55, 2, 2, IX.GLOW);
    g.eye(hx - hr * .35, hy - hr * .25);
  },
  winged(g, P, f) { P.acc.add('wingsBig'); TEMPLATES.quadruped(g, P, f); },
  avian(g, P, f) {
    const s = P.size, A = P.acc, bob = f ? 1 : 0, ground = 61;
    const bx = 36, by = ground - 18 * s + bob;
    // far wing
    if (f) drawWing(g, [bx, by - 7], [bx + 20 * s, by - 8 * s], [bx + 8, by + 3], IX.ACCFAR, false);
    else drawWing(g, [bx, by - 7], [bx + 14 * s, by - 27 * s], [bx + 12, by], IX.ACCFAR, false);
    // tail fan
    if (A.has('tailFan')) g.poly([[bx + 8 * s, by + 1], [bx + 22 * s, by - 4 * s], [bx + 26 * s, by + 4 * s], [bx + 22 * s, by + 12 * s], [bx + 8 * s, by + 7 * s]], IX.ACC);
    // legs
    for (const lx of [bx - 4 * s, bx + 3 * s]) { g.line(lx, by + 6 * s, lx - 1, ground - 1, IX.GOLD, .9); g.rect(lx - 3, ground - 1, 4, 1, IX.GOLD); }
    g.ell(bx, by, 12 * s, 10 * s, IX.BASE);
    g.ell(bx + 8 * s, by + 2 * s, 8 * s, 5 * s, IX.BASE);
    g.ell(bx - 5 * s, by + 3 * s, 7 * s, 6 * s, IX.BELLY, 'on');
    applyPattern(g, P);
    const hx = bx - 9 * s, hy = by - 12 * s;
    if (A.has('crest')) for (let i = 0; i < 3; i++) g.tube([[hx + 1 + i * 2, hy - 4 * s], [hx + 5 + i * 3, hy - 10 * s - i], [hx + 10 + i * 3, hy - 12 * s + i * 2]], 1.4, .6, IX.ACC);
    g.oell(hx, hy, 7 * s, 6.5 * s, IX.BASE);
    g.ell(hx - 2 * s, hy + 3 * s, 4 * s, 3 * s, IX.BELLY, 'on');
    g.opoly([[hx - 5 * s, hy - 1.5 * s], [hx - 13 * s, hy + 1.5 * s], [hx - 11 * s, hy + 3.5 * s], [hx - 5 * s, hy + 3 * s]], IX.GOLD);
    if (A.has('crown')) crown(g, hx + 1, hy - 6 * s, 4 * s);
    // near wing
    if (f) drawWing(g, [bx - 4, by - 3], [bx + 22 * s, by + 4 * s], [bx + 2, by + 7], IX.ACC, true);
    else drawWing(g, [bx - 4, by - 3], [bx + 6 * s, by - 29 * s], [bx + 8, by + 3], IX.ACC, true);
    g.eye(hx - 2 * s, hy - 1.5 * s);
  },
  serpentine(g, P, f) {
    const s = P.size, A = P.acc;
    const T = (x, y) => [34 + (x - 34) * s, 61 - (61 - y) * s];
    const sway = f ? -1 : 1;
    const pts = [[52, 57], [44, 60], [28, 60], [18, 53], [24, 45], [38, 44], [44, 36], [40, 26], [31 + sway, 19]].map(p => T(p[0], p[1]));
    const head = pts[pts.length - 1];
    g.tube(pts, 1.5, 6 * s, IX.BASE);
    g.tube(pts.slice(3).map(p => [p[0] - 2 * s, p[1] + 1]), 1, 3 * s, IX.BELLY, 'on');
    applyPattern(g, P);
    const hx = head[0] - 3 * s, hy = head[1] - 2;
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
    g.eye(hx - 2.5 * s, hy - 1.5 * s);
  },
  humanoid(g, P, f) {
    const s = P.size, A = P.acc, ground = 61, cx = 32, bird = A.has('birdLegs');
    const hipY = ground - 14 * s, top = hipY - 16 * s;
    if (A.has('wings')) {
      if (f) drawWing(g, [cx + 3, top + 3], [cx + 24 * s, top + 2 * s], [cx + 6, hipY], IX.ACC, true);
      else drawWing(g, [cx + 3, top + 3], [cx + 18 * s, top - 18 * s], [cx + 8, hipY - 2], IX.ACC, true);
    }
    if (A.has('tail')) g.tube([[cx + 4 * s, hipY - 2], [cx + 14 * s, hipY - 3 * s], [cx + 17 * s, hipY - 15 * s], [cx + 11 * s + (f ? 1 : 0), hipY - 20 * s]], 1.7 * s, 1, IX.BASE);
    // far arm & leg
    g.tube([[cx + 4 * s, top + 3], [cx + 8 * s, top + 9 * s], [cx + 6 * s, top + 15 * s]], 2.1 * s, 1.7 * s, IX.FAR);
    if (bird) { g.line(cx + 3 * s, hipY, cx + 4 * s, ground - 1, IX.GOLD, .9); g.rect(cx + 2 * s, ground - 1, 4, 1, IX.GOLD); }
    else g.tube([[cx + 2.5 * s, hipY], [cx + 3 * s, ground - 2]], 2.6 * s, 2.4 * s, IX.FAR);
    // torso
    const skinTorso = bird;
    g.poly([[cx - 6 * s, top], [cx + 6 * s, top], [cx + 5.5 * s, hipY + 1], [cx - 5.5 * s, hipY + 1]], skinTorso ? IX.BELLY : IX.BASE);
    if (!skinTorso) g.ell(cx - 1.5 * s, top + 8 * s, 3.8 * s, 6 * s, IX.BELLY, 'on');
    if (bird) g.ell(cx, hipY + 2 * s, 7 * s, 5 * s, IX.BASE);
    // near leg
    if (bird) { g.line(cx - 3 * s, hipY + 4 * s, cx - 4 * s, ground - 1, IX.GOLD, .9); g.rect(cx - 7 * s, ground - 1, 5, 1, IX.GOLD); }
    else { g.tube([[cx - 2.5 * s, hipY], [cx - 3.5 * s, ground - 2]], 2.8 * s, 2.5 * s, IX.BASE, null, true); g.rect(cx - 6 * s, ground - 2, 5 * s, 2, IX.BELLY); }
    if (A.has('sash') || A.has('garland')) g.poly([[cx - 6 * s, hipY - 3 * s], [cx + 6 * s, hipY - 3 * s], [cx + 6.5 * s, hipY + 4 * s], [cx - 7 * s, hipY + 4 * s]], IX.ACC);
    if (A.has('garland')) for (let i = 0; i < 6; i++) g.ell(cx - 5 * s + i * 2 * s, top + 3 * s + Math.sin(i / 5 * Math.PI) * 5 * s, 1.3, 1.3, i % 2 ? IX.GLOW : IX.ACC);
    if (A.has('veena')) { g.line(cx + 7 * s, top + 1, cx - 9 * s, hipY + 1, IX.GOLD, 1); g.ell(cx + 7 * s, top, 2.6 * s, 2.6 * s, IX.ACC); g.ell(cx - 9 * s, hipY + 2, 3.4 * s, 3.4 * s, IX.ACC); }
    // head
    const hx = cx - 1 * s, hy = top - 6.5 * s, hr = 6.5 * s;
    if (A.has('earsSide')) g.oell(hx + 5 * s, hy + 1, 2.2 * s, 2.8 * s, IX.BELLY);
    if (A.has('headdress')) for (let i = 0; i < 3; i++) g.tube([[hx + i * 2, hy - hr * .7], [hx + 3 + i * 3, hy - hr * 1.5], [hx + 8 + i * 3, hy - hr * 1.6 + i * 2]], 1.4, .6, IX.ACC);
    g.oell(hx, hy, hr, hr, IX.BASE);
    if (A.has('muzzle')) { g.ell(hx - 2.5 * s, hy + 1.5 * s, 4 * s, 3.4 * s, IX.BELLY); g.ell(hx - 1 * s, hy - 1.5 * s, 4.5 * s, 2.4 * s, IX.BELLY); }
    else { g.ell(hx - 2 * s, hy + 1 * s, 4.6 * s, 4.8 * s, IX.BELLY); }
    if (A.has('crown')) crown(g, hx, hy - hr * .9, 4.5 * s);
    // near arm
    const arm = f ? [[cx - 4 * s, top + 2], [cx - 9 * s, top + 5 * s], [cx - 12 * s, top + 9 * s]] : [[cx - 4 * s, top + 2], [cx - 8 * s, top + 8 * s], [cx - 9 * s, top + 14 * s]];
    g.tube(arm, 2.2 * s, 1.8 * s, IX.BASE, null, true);
    const hand = arm[2];
    if (A.has('armband')) g.ell(arm[1][0], arm[1][1], 2.2 * s, 1.2, IX.GOLD);
    if (A.has('mace')) { g.line(hand[0], hand[1] + 2, hand[0] - 3, hand[1] - 13 * s, IX.GOLD, 1.1); g.oell(hand[0] - 3.5, hand[1] - 15 * s, 3.6 * s, 4 * s, IX.GOLD); }
    g.ell(hand[0], hand[1], 1.8 * s + .3, 1.8 * s + .3, IX.BELLY);
    g.eye(hx - 3 * s, hy - 1.2 * s);
  },
  aquatic(g, P, f) {
    const s = P.size, A = P.acc, bob = f ? 1 : 0, ground = 61;
    const rx = 17 * s, ry = 8 * s, cx = 38, cy = ground - (A.has('legs') ? 10 : 6) * s - ry + bob;
    const t = f ? 3 : -2;
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
    g.eye(hx - 3 * s, hy - 3.5 * s);
  },
  spirit(g, P, f) {
    const s = P.size, A = P.acc, hx = 32, hy = 26;
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
    const P = { size: a.size, acc: new Set(a.acc), pattern: a.pattern, rng: mulberry32(hashStr(spId)) };
    TEMPLATES[a.tpl](g, P, f);
    frames.push(renderGrid(g, a.pal));
  }
  // white silhouette for evolution / taming flashes
  const sil = mkCanvas(SPR, SPR), sx = sil.getContext('2d');
  sx.drawImage(frames[0], 0, 0); sx.globalCompositeOperation = 'source-in'; sx.fillStyle = '#fff'; sx.fillRect(0, 0, SPR, SPR);
  return SpriteCache[spId] = { frames, sil };
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
//  TILES (16x16, procedurally painted; water, tall grass, fire animate)
// =====================================================================
const Tiles = (() => {
  const cache = {};
  function make(key, frame, painter) {
    const c = mkCanvas(16, 16), x = c.getContext('2d'), r = mulberry32(hashStr(key) + frame * 977);
    painter(x, r, frame); return c;
  }
  const px = (x, a, b, col) => { x.fillStyle = col; x.fillRect(a, b, 1, 1); };
  const fill = (x, col) => { x.fillStyle = col; x.fillRect(0, 0, 16, 16); };
  function grass(x, r) { fill(x, '#5aa84a'); for (let i = 0; i < 14; i++) { const a = r() * 16 | 0, b = r() * 16 | 0; px(x, a, b, '#4a9440'); px(x, a, b - 1, '#6cbc58'); } }
  function plaza(x) { fill(x, '#cdbd9f'); x.fillStyle = '#ad9d80'; x.fillRect(0, 0, 16, 1); x.fillRect(0, 8, 16, 1); x.fillRect(0, 0, 1, 8); x.fillRect(8, 8, 1, 8); x.fillStyle = '#ddd0b4'; x.fillRect(1, 1, 6, 1); x.fillRect(9, 9, 6, 1); }
  function floor(x) { fill(x, '#a8784a'); x.fillStyle = '#8f643c'; for (let y = 3; y < 16; y += 4) x.fillRect(0, y, 16, 1); x.fillRect(5, 0, 1, 3); x.fillRect(11, 4, 1, 3); x.fillRect(3, 8, 1, 3); x.fillRect(9, 12, 1, 3); }
  const P = {
    '.': (x, r) => grass(x, r),
    ',': (x, r, f) => { grass(x, r); for (let i = 0; i < 4; i++) { const bx = (i % 2) * 8 + 1, by = (i >> 1) * 8 + 2; x.fillStyle = '#2f7a34'; x.fillRect(bx, by + 2, 6, 4); for (let k = 0; k < 3; k++) { const sx = bx + k * 2 + (f ? 1 : 0); x.fillStyle = '#3f9a40'; x.fillRect(sx, by - 1, 1, 4); px(x, sx, by - 2, '#7fd060'); } } },
    ':': (x, r, f) => { grass(x, r); for (let i = 0; i < 4; i++) { const bx = (i % 2) * 8 + 1, by = (i >> 1) * 8 + 2; x.fillStyle = '#245f3a'; x.fillRect(bx, by + 2, 6, 4); for (let k = 0; k < 3; k++) { const sx = bx + k * 2 + (f ? 1 : 0); x.fillStyle = '#2e7f52'; x.fillRect(sx, by - 1, 1, 4); px(x, sx, by - 2, '#9be0a0'); } } },
    '_': (x, r) => { fill(x, '#d9b27a'); for (let i = 0; i < 8; i++) px(x, r() * 16 | 0, r() * 16 | 0, r() < .5 ? '#c49a62' : '#ead0a0'); },
    '=': x => plaza(x),
    '~': (x, r, f) => { fill(x, '#2f6fbf'); x.fillStyle = '#5f9fe8'; for (let y = 2; y < 16; y += 5) { const o = (f * 2 + y) % 8; x.fillRect(o, y, 4, 1); x.fillRect((o + 9) % 16, y + 2, 3, 1); } },
    'o': (x, r, f) => { P['~'](x, r, f); x.fillStyle = '#3fae5a'; x.beginPath(); x.arc(7, 9, 4, 0, Math.PI * 2); x.fill(); x.fillStyle = '#ff8fb8'; x.fillRect(6, 6, 3, 3); px(x, 7, 5, '#ffd0e0'); px(x, 5, 7, '#ffd0e0'); px(x, 9, 7, '#ffd0e0'); px(x, 7, 7, '#ffe36a'); },
    'T': (x, r) => { grass(x, r); x.fillStyle = '#5a3a20'; x.fillRect(6, 10, 4, 6); x.fillStyle = '#1f5a2c'; x.beginPath(); x.arc(8, 7, 7.5, 0, Math.PI * 2); x.fill(); x.fillStyle = '#2f7a3a'; x.beginPath(); x.arc(7, 6, 6, 0, Math.PI * 2); x.fill(); x.fillStyle = '#48a24c'; x.beginPath(); x.arc(6, 4, 3.5, 0, Math.PI * 2); x.fill(); px(x, 5, 3, '#7cc860'); px(x, 10, 6, '#7cc860'); },
    'f': (x, r) => { grass(x, r); for (let i = 0; i < 5; i++) { const a = 2 + r() * 12 | 0, b = 2 + r() * 12 | 0; x.fillStyle = r() < .5 ? '#ff9f1a' : '#ffd23a'; x.fillRect(a - 1, b, 3, 1); x.fillRect(a, b - 1, 1, 3); px(x, a, b, '#c84a10'); } },
    '|': (x, r) => { grass(x, r); x.fillStyle = '#8a5a32'; x.fillRect(0, 6, 16, 2); x.fillRect(0, 10, 16, 2); x.fillStyle = '#6a4224'; x.fillRect(2, 4, 3, 11); x.fillRect(11, 4, 3, 11); x.fillStyle = '#b07a48'; x.fillRect(2, 4, 3, 1); x.fillRect(11, 4, 3, 1); },
    'L': (x, r, f) => { plaza(x); x.fillStyle = '#5a4030'; x.fillRect(7, 5, 2, 10); x.fillRect(5, 14, 6, 2); x.fillStyle = '#e8b030'; x.fillRect(4, 4, 8, 2); x.fillStyle = f ? '#ffd040' : '#ff8a20'; x.fillRect(7, 1, 2, 3); px(x, 7 + f, 0, '#fff0a0'); },
    'S': (x, r) => { grass(x, r); x.fillStyle = '#6a4224'; x.fillRect(7, 9, 2, 7); x.fillStyle = '#b07a48'; x.fillRect(2, 2, 12, 8); x.fillStyle = '#8a5a32'; x.fillRect(2, 9, 12, 1); x.fillStyle = '#5a3a20'; x.fillRect(4, 4, 8, 1); x.fillRect(4, 6, 6, 1); },
    'R': (x, r) => { grass(x, r); x.fillStyle = '#6a6a72'; x.beginPath(); x.ellipse(8, 10, 7, 5.5, 0, 0, Math.PI * 2); x.fill(); x.fillStyle = '#8f8f98'; x.beginPath(); x.ellipse(7, 9, 5, 4, 0, 0, Math.PI * 2); x.fill(); px(x, 5, 7, '#c0c0c8'); px(x, 6, 7, '#c0c0c8'); },
    'B': (x, r, f) => { P['~'](x, r, f); x.fillStyle = '#a87a4a'; x.fillRect(0, 0, 16, 16); x.fillStyle = '#7a5430'; for (let i = 0; i < 16; i += 4) x.fillRect(i, 0, 1, 16); x.fillStyle = '#5a3a20'; x.fillRect(0, 0, 16, 1); x.fillRect(0, 15, 16, 1); },
    'X': x => fill(x, '#0b0714'),
    'p': x => floor(x),
    'w': x => { fill(x, '#e8d8b8'); x.fillStyle = '#c8b090'; x.fillRect(0, 12, 16, 4); x.fillStyle = '#9a7a50'; x.fillRect(0, 11, 16, 1); x.fillStyle = '#b8402a'; x.fillRect(0, 2, 16, 2); x.fillStyle = '#e8b030'; for (let i = 1; i < 16; i += 4) x.fillRect(i, 2, 2, 2); },
    'c': x => { fill(x, '#a8283a'); x.fillStyle = '#e8b030'; x.fillRect(0, 0, 16, 1); x.fillRect(0, 15, 16, 1); x.fillStyle = '#c8485a'; x.fillRect(6, 6, 4, 4); x.fillStyle = '#e8b030'; x.fillRect(7, 7, 2, 2); },
    'C': x => { floor(x); x.fillStyle = '#6a3a1a'; x.fillRect(0, 2, 16, 14); x.fillStyle = '#9a6234'; x.fillRect(0, 2, 16, 4); x.fillStyle = '#e8b030'; x.fillRect(0, 9, 16, 1); },
    'F': (x, r, f) => { floor(x); x.fillStyle = '#5a4a3a'; x.fillRect(3, 10, 10, 5); x.fillStyle = '#8a7a6a'; x.fillRect(2, 9, 12, 2); x.fillStyle = '#ff5a1f'; x.beginPath(); x.moveTo(3, 9); x.lineTo(8 + (f ? 1 : -1), 0); x.lineTo(13, 9); x.fill(); x.fillStyle = '#ffd040'; x.beginPath(); x.moveTo(5, 9); x.lineTo(8 + (f ? -1 : 1), 3); x.lineTo(11, 9); x.fill(); },
    'P': x => { floor(x); x.fillStyle = '#f2ead8'; x.fillRect(4, 0, 8, 16); x.fillStyle = '#d0c4a8'; x.fillRect(10, 0, 2, 16); x.fillStyle = '#e8b030'; x.fillRect(3, 0, 10, 2); x.fillRect(3, 14, 10, 2); },
    'g': x => { fill(x, '#d8b048'); x.fillStyle = '#b89030'; x.fillRect(0, 0, 16, 1); x.fillRect(0, 0, 1, 16); x.fillStyle = '#f0d070'; x.fillRect(2, 2, 3, 1); x.fillRect(9, 9, 3, 1); },
    'm': x => { floor(x); x.fillStyle = '#c84a3a'; x.fillRect(1, 3, 14, 11); x.fillStyle = '#e8b030'; x.fillRect(2, 4, 12, 1); x.fillRect(2, 12, 12, 1); },
    'K': x => { P.w(x); x.fillStyle = '#7a4a2a'; x.fillRect(1, 5, 14, 11); x.fillStyle = '#c87a3a'; x.fillRect(3, 7, 3, 3); x.fillRect(10, 7, 3, 3); x.fillStyle = '#3a8a6a'; x.fillRect(6, 11, 4, 4); },
    'A': (x, r, f) => { floor(x); x.fillStyle = '#9a9aa2'; x.fillRect(1, 6, 14, 10); x.fillStyle = '#c8c8d0'; x.fillRect(1, 6, 14, 2); x.fillStyle = '#ff9f1a'; x.fillRect(3, 3, 2, 3); x.fillRect(11, 3, 2, 3); x.fillStyle = f ? '#ffd040' : '#ff7a1a'; x.fillRect(7, 2, 2, 4); },
  };
  const ANIM = { ',': 2, ':': 2, '~': 4, 'o': 4, 'B': 1, 'L': 2, 'F': 2, 'A': 2 };
  function get(ch, t, x, y) {
    const n = ANIM[ch] || 1;
    // grass variety: pick from 3 variants by position
    const variant = (ch === '.' || ch === '_') ? ((x * 7 + y * 13) % 3) : 0;
    const f = n > 1 ? (ch === '~' || ch === 'o' ? ((t >> 4) + x) % n : ((t >> 5) + ((x + y) & 1)) % n) : 0;
    const key = ch + variant + ':' + f;
    if (!cache[key]) cache[key] = make(ch + variant, f, P[ch] || P['X']);
    return cache[key];
  }
  return { get };
})();

// ---- Buildings: pre-rendered composite sprites -----------------------
const BUILD_STYLE = {
  house: { wall: '#f0dcb0', band: '#c89860', roof: '#b8502a', roof2: '#8a3a1e' },
  house2: { wall: '#e8e0c8', band: '#a8906a', roof: '#3f8a6a', roof2: '#2a5a48' },
  shop: { wall: '#f0e6d0', band: '#7a9ac8', roof: '#2a6fb0', roof2: '#1a4a80', sign: 'SHOP' },
  shrine: { wall: '#fbf6ea', band: '#e8b030', roof: '#f4a261', roof2: '#c8702a', sign: 'SHRINE' },
  hall: { wall: '#c8603a', band: '#7a2a1a', roof: '#7a2a1a', roof2: '#4a1a10', sign: 'FIRE HALL' },
  palace: { wall: '#fbf2dc', band: '#e8b030', roof: '#e0b040', roof2: '#a87a20', sign: 'VAIJAYANTA' },
};
function renderBuilding(b) {
  const st = BUILD_STYLE[b.style], w = b.w * 16, h = b.h * 16, top = b.style === 'palace' ? 40 : (b.style === 'shrine' ? 18 : 0);
  const c = mkCanvas(w, h + top), x = c.getContext('2d');
  const wallY = top + (b.h - 2) * 16;
  // walls
  x.fillStyle = st.wall; x.fillRect(2, wallY, w - 4, 32);
  x.fillStyle = st.band; x.fillRect(2, wallY + 26, w - 4, 6); x.fillRect(2, wallY, w - 4, 2);
  // windows (jali screens)
  for (let i = 0; i < b.w; i++) {
    if (i === b.door - b.x || i === 0 || i === b.w - 1) continue;
    x.fillStyle = '#4a2a14'; x.fillRect(i * 16 + 3, wallY + 6, 10, 12);
    x.fillStyle = '#e8c890'; for (let a = 0; a < 3; a++) for (let q = 0; q < 3; q++) x.fillRect(i * 16 + 4 + a * 3, wallY + 7 + q * 4, 2, 2);
  }
  // door
  const dx = (b.door - b.x) * 16;
  x.fillStyle = '#3a1a08'; x.fillRect(dx + 2, wallY + 8, 12, 24);
  x.fillStyle = '#6a3a1a'; x.fillRect(dx + 3, wallY + 10, 10, 22);
  x.fillStyle = st.band; x.beginPath(); x.arc(dx + 8, wallY + 10, 6, Math.PI, 0); x.fill();
  x.fillStyle = '#3a1a08'; x.beginPath(); x.arc(dx + 8, wallY + 11, 4.5, Math.PI, 0); x.fill();
  x.fillStyle = '#e8b030'; x.fillRect(dx + 10, wallY + 20, 2, 2);
  // roof
  const roofH = wallY - 0;
  if (b.style === 'palace' || b.style === 'shrine') {
    // tiered temple roof with a curved spire (shikhara)
    x.fillStyle = st.roof2; x.fillRect(0, wallY - 6, w, 6);
    const tiers = b.style === 'palace' ? 4 : 3;
    for (let t = 0; t < tiers; t++) {
      const tw = w * (1 - t * .2) - 8, ty = wallY - 6 - (t + 1) * (roofH - 10) / (tiers + .6);
      const th = (roofH - 10) / (tiers + .6) + 1;
      x.fillStyle = t % 2 ? st.roof : st.roof2; x.fillRect((w - tw) / 2, ty, tw, th);
      x.fillStyle = shade(st.roof, .35); x.fillRect((w - tw) / 2, ty, tw, 2);
      x.fillStyle = shade(st.roof, -.35); for (let k = (w - tw) / 2 + 3; k < (w + tw) / 2 - 2; k += 6) x.fillRect(k, ty + 4, 2, th - 5);
    }
    // finial (kalasha)
    x.fillStyle = '#ffd040'; x.beginPath(); x.ellipse(w / 2, 6, 4, 5, 0, 0, Math.PI * 2); x.fill(); x.fillRect(w / 2 - 1, 0, 2, 4);
    if (b.style === 'shrine') { x.fillStyle = '#ff7a1a'; x.beginPath(); x.moveTo(w / 2 + 1, 0); x.lineTo(w / 2 + 12, 4); x.lineTo(w / 2 + 1, 8); x.fill(); }
    if (b.style === 'palace') { x.fillStyle = '#fbf2dc'; for (let i = 0; i < b.w; i += 2) { x.fillRect(i * 16 + 2, wallY - 2, 4, 30); x.fillStyle = '#e8b030'; x.fillRect(i * 16 + 1, wallY - 3, 6, 2); x.fillStyle = '#fbf2dc'; } }
  } else {
    x.fillStyle = st.roof2; x.fillRect(0, roofH - 6, w, 8);
    x.fillStyle = st.roof; x.beginPath(); x.moveTo(0, roofH - 2); x.lineTo(10, 2); x.lineTo(w - 10, 2); x.lineTo(w, roofH - 2); x.fill();
    x.fillStyle = shade(st.roof, -.25); for (let y = 8; y < roofH - 4; y += 5) x.fillRect(4, y, w - 8, 1);
    x.fillStyle = shade(st.roof, .35); x.fillRect(10, 2, w - 20, 2);
    if (b.style === 'shop') { for (let i = 0; i < w; i += 8) { x.fillStyle = (i / 8) % 2 ? '#ffffff' : '#2a6fb0'; x.fillRect(i, roofH - 6, 8, 6); } }
    if (b.style === 'hall') { x.fillStyle = '#ff7a1a'; x.beginPath(); x.moveTo(w / 2 - 6, roofH - 10); x.lineTo(w / 2, roofH - 26); x.lineTo(w / 2 + 6, roofH - 10); x.fill(); x.fillStyle = '#ffd040'; x.beginPath(); x.moveTo(w / 2 - 3, roofH - 10); x.lineTo(w / 2, roofH - 19); x.lineTo(w / 2 + 3, roofH - 10); x.fill(); }
  }
  if (st.sign) {
    const tw = Font.measure(st.sign) + 6, sx = (w - tw) / 2 | 0, sy = wallY - 12;
    x.fillStyle = '#3a1a08'; x.fillRect(sx - 1, sy - 1, tw + 2, 11); x.fillStyle = '#6a3a1a'; x.fillRect(sx, sy, tw, 9);
    Font.draw(x, st.sign, sx + 3, sy + 1, '#ffd040');
  }
  return { canvas: c, top };
}
