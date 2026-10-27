// =====================================================================
//  EXTRA BODY PARTS for the procedural creature generator.
//  Templates call EXTRA(g, P, f, phase, K) at fixed points:
//    'back'    - before the body (things the body covers)
//    'front'   - after the body/legs, before the head (quadruped)
//    'preHead' - right before the head is drawn (behind the head)
//    'head'    - after the head (in front of it), before the eye
//    'hand'    - after the near arm (humanoid), K.hand = [x, y]
//  K holds the template's anchor points (head position hx/hy/hr, body cx/bcy ...).
// =====================================================================
function EXTRA(g, P, f, ph, K) {
  const A = P.acc, has = k => A.has(k), s = K.s, T = P.tpl;
  const hx = K.hx, hy = K.hy, hr = K.hr || 6 * s;
  // ---------------- generic parts (any template) ----------------
  if (ph === 'preHead') {
    if (has('sunDisk')) { g.oell(hx + 3 * s, hy - hr * 1.5, 5 * s, 5 * s, IX.GOLD); g.ell(hx + 3 * s, hy - hr * 1.5, 3 * s, 3 * s, IX.GLOW); }
    if (has('nemes')) {
      g.opoly([[hx - 1, hy - hr * 1.05], [hx + hr * 1.35, hy - hr * .55], [hx + hr * 1.45, hy + hr * 1.5], [hx + hr * .1, hy + hr * 1.25]], IX.GOLD);
      stripe(g, IX.GOLD, IX.ACC, hx - 2, hy - hr * 1.2, hr * 1.7, hr * 2.9, 3);
    }
    if (has('hairLong')) { const w = f ? 1 : -1; for (const d of [0, 3]) g.tube([[hx + 2, hy - hr * .6 + d], [hx + hr * 1.4, hy + hr * .5 + d], [hx + hr * 1.2 + w, hy + hr * 2.4 + d], [hx + hr * 1.8 + w * 2, hy + hr * 3.4]], 3.2 * s, 1.4, IX.ACC); }
    if (has('maneLion')) { for (let a = 0; a < 10; a++) { const an = a / 10 * Math.PI * 2; g.ell(hx + 1 + Math.cos(an) * hr * 1.05, hy + Math.sin(an) * hr * 1.05, hr * .5, hr * .5, IX.ACC); } }
  }
  if (ph === 'head') {
    if (has('antlers')) for (const o of [4 * s, 0]) {
      const c = o ? IX.FAR : IX.HORN, x0 = hx + o * .5, y0 = hy - hr * .75;
      g.tube([[x0, y0], [x0 + 2 * s, y0 - hr * 1.0], [x0 + 6 * s + o, y0 - hr * 1.8]], 1.3 * s, .7, c);
      g.tube([[x0 + 1.5 * s, y0 - hr * .7], [x0 - 2 * s, y0 - hr * 1.3]], 1, .6, c);
      g.tube([[x0 + 3.5 * s, y0 - hr * 1.3], [x0 + 2 * s, y0 - hr * 2.0]], 1, .6, c);
    }
    if (has('hornSingle')) g.tube([[hx - hr * .25, hy - hr * .65], [hx - hr * .85, hy - hr * 1.5], [hx - hr * 1.3, hy - hr * 2.3]], 1.8 * s, .6, IX.HORN, null, true);
    if (has('bullHorns')) { g.tube([[hx + hr * .2, hy - hr * .6], [hx + hr * .9, hy - hr * 1.3], [hx + hr * .5, hy - hr * 1.9]], 1.6 * s, .7, IX.FAR); g.tube([[hx - hr * .3, hy - hr * .6], [hx - hr * 1.1, hy - hr * 1.1], [hx - hr * 1.3, hy - hr * 1.8]], 1.7 * s, .7, IX.HORN, null, true); }
    if (has('hornsSmall')) { g.tube([[hx - hr * .2, hy - hr * .8], [hx - hr * .3, hy - hr * 1.4]], 1.3 * s, .6, IX.HORN, null, true); g.tube([[hx + hr * .4, hy - hr * .8], [hx + hr * .5, hy - hr * 1.4]], 1.2 * s, .6, IX.FAR); }
    if (has('leafHead')) { g.opoly([[hx - 1, hy - hr * .8], [hx + 3 * s, hy - hr * 2.0], [hx + 6 * s, hy - hr * .7]], IX.ACC); g.line(hx + 1, hy - hr * .9, hx + 3 * s, hy - hr * 1.8, IX.ACCFAR); }
    if (has('beard')) { g.opoly([[hx - hr * .75, hy + hr * .55], [hx + hr * .15, hy + hr * .65], [hx - hr * .05, hy + hr * 1.75], [hx - hr * .6, hy + hr * 1.65]], IX.HORN); stripe(g, IX.HORN, IX.FAR, hx - hr, hy + hr * .5, hr * 1.3, hr * 1.4, 3); }
    if (has('helmet')) { g.opoly([[hx - hr * 1.0, hy - hr * .1], [hx - hr * .7, hy - hr * .95], [hx + hr * .5, hy - hr * 1.05], [hx + hr * 1.0, hy - hr * .1]], IX.HORN); g.tube([[hx, hy - hr * 1.0], [hx + hr * .9, hy - hr * 1.7], [hx + hr * 1.6, hy - hr * 1.5]], 1.4 * s, .8, IX.ACC); }
    if (has('sunDisk') && T === 'spirit') g.ell(hx, hy, 1, 1, IX.GLOW);
  }
  // ---------------- per template ----------------
  if (T === 'quadruped' || T === 'winged') {
    const { cx, bcy, bRX, bRY, tx, ty, ground } = K;
    if (ph === 'back') {
      if (has('snakeTail')) { const w = f ? 1 : 0; g.tube([[tx, ty], [tx + 7 * s, ty - 2 * s], [tx + 10 * s, ty - 10 * s], [tx + 6 * s + w, ty - 16 * s]], 2.2 * s, 1.6 * s, IX.ACC, null, true); g.oell(tx + 4 * s + w, ty - 17 * s, 3.2 * s, 2.4 * s, IX.ACC); g.eye(tx + 2.5 * s + w, ty - 18 * s); }
      if (has('tailsMany')) for (let i = 0; i < 5; i++) { const a = -1.45 + i * .36 + (f ? .06 : 0), L = 15 * s; const t2 = [tx + Math.cos(a) * L, ty + Math.sin(a) * L]; g.tube([[tx, ty], [lerp(tx, t2[0], .5) - 1, lerp(ty, t2[1], .5) - 2], t2], 2.6 * s, 1.8 * s, IX.BASE, null, true); g.ell(t2[0], t2[1], 1.9 * s, 1.9 * s, IX.BELLY); }
      if (has('bushyTail')) { const w = f ? 1 : 0; g.oell(tx + 6 * s + w, ty - 9 * s, 6 * s, 9.5 * s, IX.BASE); g.ell(tx + 7 * s + w, ty - 9 * s, 3 * s, 6 * s, IX.ACC); }
      if (has('stingerTail')) { const w = f ? 1 : 0; const end = [tx - 3 * s + w, ty - 22 * s]; g.tube([[tx, ty], [tx + 9 * s, ty - 7 * s], [tx + 7 * s, ty - 18 * s], end], 2.8 * s, 1.8 * s, IX.BASE, null, true); stripe(g, IX.BASE, IX.PAT, tx - 6 * s, ty - 26 * s, 18 * s, 28 * s, 4); g.opoly([[end[0], end[1] - 1], [end[0] - 6 * s, end[1] + 3], [end[0] - 1, end[1] + 3]], IX.GLOW); }
      if (has('maneFlow')) { const w = f ? 1 : 0; g.tube([[K.hx + 3, K.hy - K.hr * .8], [K.hx + K.hr * 1.4, K.hy - K.hr * .3], [cx - bRX * .1, bcy - bRY * .9]], 3.2 * s, 2.2 * s, IX.ACC); for (let i = 0; i < 4; i++) g.tube([[K.hx + K.hr * (.6 + i * .45), K.hy - K.hr * .3 + i * 2], [K.hx + K.hr * (.9 + i * .45) + w, K.hy + K.hr * .6 + i * 2]], 1.6, .8, IX.ACC); }
      if (has('spikes')) for (let i = 0; i < 5; i++) { const x = cx - bRX * .55 + i * bRX * .27; g.opoly([[x - 2.4 * s, bcy - bRY + 3], [x + 1, bcy - bRY - 5 * s], [x + 3 * s, bcy - bRY + 3]], IX.ACC); }
      if (has('legs8')) for (const lx of [cx - bRX * .2 + 3, cx + bRX * .18 + 3]) g.rect(lx - 2.2 * s, bcy, 4.4 * s, ground - bcy, IX.FAR);
      if (has('wingsSmall')) drawWing(g, [cx - 2, bcy - bRY + 3], [cx + 8 * s, bcy - bRY - (f ? 8 : 14) * s], [cx + 10 * s, bcy - 3], IX.ACCFAR, false, 3);
    }
    if (ph === 'front') {
      if (has('legs8')) for (const lx of [cx - bRX * .22, cx + bRX * .12]) { g.rect(lx - 3 * s, bcy + 3, 6 * s + 2, ground - bcy - 2, IX.OUT); g.rect(lx - 2.3 * s, bcy + 3, 4.6 * s, ground - bcy - 3, IX.BASE); g.rect(lx - 2.3 * s, ground - 2, 4.6 * s, 2, IX.ACC); }
      if (has('shell')) {
        const pts = []; for (let i = 0; i <= 16; i++) { const a = Math.PI * i / 16; pts.push([cx + Math.cos(a) * (bRX + 1.5), bcy + 2 - Math.sin(a) * (bRY + 2.5)]); }
        g.opoly(pts, IX.ACC); g.line(cx + bRX * .1, bcy - bRY - 2, cx - bRX * .15, bcy + 2, IX.OUT);
        g.ell(cx - bRX * .45, bcy - bRY * .6, 2.4 * s, 1.5 * s, IX.GLOW);
      }
      if (has('wingsSmall')) drawWing(g, [cx - 5, bcy - 3], [cx + 3 * s, bcy - bRY - (f ? 8 : 16) * s], [cx + 8 * s, bcy + 1], IX.ACC, true, 3);
    }
    if (ph === 'preHead') {
      if (has('heads3')) for (const [ox, oy] of [[.75, -1.05], [1.35, -.25]]) { const x = hx + hr * ox, y = hy + hr * oy; g.oell(x, y, hr * .78, hr * .7, IX.FAR); g.ell(x - hr * .45, y + hr * .25, hr * .4, hr * .3, IX.BELLY); g.eye(x - hr * .35, y - hr * .25); }
    }
    if (ph === 'head') {
      if (has('humanFace')) { g.ell(hx - hr * .3, hy + hr * .1, hr * .62, hr * .72, IX.BELLY); g.line(hx - hr * .6, hy + hr * .45, hx - hr * .25, hy + hr * .45, IX.OUT); }
      if (has('longSnout')) { const sx = hx - hr * 1.15, sy = hy + hr * .35; g.ell(sx, sy, hr * 1.0, hr * .55, IX.BASE, 'under'); g.ell(sx, sy, hr * 1.0 + 1, hr * .55 + 1, IX.OUT, 'under'); g.ell(sx - hr * .55, sy + hr * .1, hr * .42, hr * .38, IX.BELLY, 'on'); g.put(Math.round(sx - hr * .8), Math.round(sy - hr * .05), IX.OUT); }
      if (has('crocSnout')) { g.opoly([[hx - hr * .4, hy - hr * .05], [hx - hr * 2.0, hy + hr * .25], [hx - hr * 2.0, hy + hr * .75], [hx - hr * .4, hy + hr * .85]], IX.BASE); g.line(hx - hr * 1.95, hy + hr * .5, hx - hr * .5, hy + hr * .5, IX.OUT); for (let i = 0; i < 4; i++) g.put(Math.round(hx - hr * (1.8 - i * .35)), Math.round(hy + hr * .5 - 1), IX.WHITE); }
      if (has('earsTall')) { g.poly([[hx + 2 * s, hy - hr * .5], [hx + 4 * s, hy - hr * 2.0], [hx + 7 * s, hy - hr * .4]], IX.FAR); g.opoly([[hx - 2 * s, hy - hr * .6], [hx, hy - hr * 2.1], [hx + 3 * s, hy - hr * .5]], IX.BASE); g.poly([[hx - 1 * s, hy - hr * .7], [hx, hy - hr * 1.7], [hx + 1.8 * s, hy - hr * .7]], IX.BELLY); }
      if (has('fangs')) { g.put(Math.round(hx - hr * .8), Math.round(hy + hr * .65), IX.WHITE); g.put(Math.round(hx - hr * .4), Math.round(hy + hr * .7), IX.WHITE); }
      if (has('whiskers')) for (const d of [0, 2]) g.line(hx - hr * .9, hy + hr * .3 + d, hx - hr * 1.7, hy + hr * .1 + d * 1.5, IX.HORN);
    }
  }
  if (T === 'avian') {
    const { bx, by } = K;
    if (ph === 'back') {
      if (has('flameTail')) { for (let i = 0; i < 3; i++) { const end = [bx + 26 * s, by - 6 * s + i * 7 * s + (f ? 2 : 0)]; g.tube([[bx + 8 * s, by + 2], [bx + 17 * s, by + i * 3 * s], end], 2.2 * s, 1, IX.ACC); g.flame(end[0] + 1, end[1] + 3, 7 * s, (f + i) % 2); } }
      if (has('tailLong')) for (let i = 0; i < 3; i++) g.tube([[bx + 8 * s, by + 2], [bx + 20 * s, by + 4 * s + i * 2], [bx + 28 * s, by + 12 * s + i * 4 * s + (f ? 1 : 0)]], 2, 1.2, i === 1 ? IX.GLOW : IX.ACC);
    }
    if (ph === 'head') {
      if (has('crestTall')) for (let i = 0; i < 4; i++) g.tube([[hx + i * 1.5, hy - 5 * s], [hx + 2 + i * 2, hy - 13 * s - i * 2], [hx + 7 + i * 3, hy - 17 * s]], 1.3, .6, i % 2 ? IX.GLOW : IX.ACC);
      if (has('earsLion')) { g.opoly([[hx + 1, hy - 5 * s], [hx + 3 * s, hy - 9 * s], [hx + 5 * s, hy - 4 * s]], IX.BASE); }
      if (has('lionMuzzle')) { g.ell(hx - 3 * s, hy + 2.5 * s, 3.4 * s, 2.6 * s, IX.BELLY); }
    }
  }
  if (T === 'serpentine') {
    const pts = K.pts;
    if (ph === 'back') {
      if (has('finsBack')) for (let i = 2; i < pts.length - 1; i++) { const [x, y] = pts[i]; g.opoly([[x - 2 * s, y - 4 * s], [x + 1, y - 10 * s], [x + 3 * s, y - 4 * s]], IX.ACC); }
    }
    if (ph === 'preHead') {
      if (has('maneS')) g.tube(pts.slice(-4).map(p => [p[0] + 4 * s, p[1] - 1]), 2 * s, 3 * s, IX.ACC);
      if (has('heads3')) { const n = pts[pts.length - 3]; for (const [ex, ey] of [[hx + 10 * s, hy - 2 * s], [hx + 12 * s, hy + 7 * s]]) { g.tube([n, [lerp(n[0], ex, .5) + 2, lerp(n[1], ey, .5) - 2], [ex, ey]], 3.4 * s, 2.6 * s, IX.FAR); g.oell(ex, ey, 4.2 * s, 3.2 * s, IX.FAR); g.ell(ex - 3.5 * s, ey + 1, 2.5 * s, 2 * s, IX.FAR); g.eye(ex - 2 * s, ey - 1.5 * s); } }
    }
    if (ph === 'head') {
      if (has('whiskers')) for (const d of [0, 3]) g.tube([[hx - 7 * s, hy + 1.5 * s + d * .3], [hx - 12 * s, hy + 4 * s + d], [hx - 10 * s, hy + 10 * s + d + (f ? 1 : 0)]], 1, .7, IX.GOLD);
      if (has('hornsS')) { g.tube([[hx + 1, hy - 3 * s], [hx + 5 * s, hy - 8 * s], [hx + 10 * s, hy - 9 * s]], 1.4 * s, .6, IX.HORN, null, true); g.tube([[hx + 3 * s, hy - 2 * s], [hx + 8 * s, hy - 5 * s]], 1, .6, IX.FAR); }
      if (has('frills')) g.opoly([[hx + 2 * s, hy - 1], [hx + 8 * s, hy - 5 * s], [hx + 7 * s, hy + 3 * s]], IX.ACC);
    }
  }
  if (T === 'humanoid') {
    const { cx, top, hipY, ground } = K;
    if (ph === 'back') {
      if (has('cloak')) g.poly([[cx - 4 * s, top - 1], [cx + 7 * s, top - 1], [cx + 11 * s, ground - 1], [cx - 1 * s, ground - 1]], IX.ACCFAR);
      if (has('shellBack')) { g.oell(cx + 6 * s, top + 9 * s, 6.5 * s, 9.5 * s, IX.ACC); for (let i = 0; i < 3; i++) g.line(cx + 1 * s, top + (3 + i * 5) * s, cx + 11 * s, top + (3 + i * 5) * s, IX.ACCFAR); }
      if (has('stingerTail')) { const w = f ? 1 : 0, end = [cx + 4 * s + w, top - 9 * s]; g.tube([[cx + 4 * s, hipY], [cx + 14 * s, hipY - 5 * s], [cx + 13 * s, top - 5 * s], end], 2.6 * s, 1.6 * s, IX.BASE, null, true); stripe(g, IX.BASE, IX.PAT, cx + 2 * s, top - 14 * s, 16 * s, 36 * s, 4); g.opoly([[end[0], end[1] - 1], [end[0] - 6 * s, end[1] + 3], [end[0] - 1, end[1] + 3]], IX.GLOW); }
      if (has('fishCloak')) g.poly([[cx - 3 * s, top - 2], [cx + 8 * s, top - 2], [cx + 10 * s, hipY + 6 * s], [cx + 2 * s, hipY + 4 * s]], IX.ACC);
    }
    if (ph === 'preHead') {
      if (has('snakeHair')) for (let i = 0; i < 6; i++) { const a = Math.PI * (1.05 + i * .2), w = ((f + i) % 2) ? 1 : -1; const x0 = hx + Math.cos(a) * hr * .7, y0 = hy + Math.sin(a) * hr * .7, x1 = hx + Math.cos(a) * hr * 1.6, y1 = hy + Math.sin(a) * hr * 1.6; g.tube([[x0, y0], [lerp(x0, x1, .5) + w, lerp(y0, y1, .5)], [x1, y1]], 1.5, 1.2, IX.ACC); g.oell(x1, y1, 1.8 * s, 1.5 * s, IX.ACC); g.put(Math.round(x1 - 1), Math.round(y1 - 1), IX.GLOW); }
      if (has('leafHair')) for (let i = 0; i < 8; i++) { const a = Math.PI * (.9 + i * .17); g.ell(hx + 1 + Math.cos(a) * hr * .95, hy + Math.sin(a) * hr * .95, 2.8 * s, 2 * s, i % 3 ? IX.ACC : IX.ACCFAR); }
      if (has('hairBack')) g.tube([[hx + 2 * s, hy - 2], [hx + 7 * s, hy + 6 * s], [hx + 6 * s + (f ? 1 : 0), top + 15 * s]], 4.2 * s, 2.4 * s, IX.ACC);
    }
    if (ph === 'head') {
      if (has('bullHead')) { g.oell(hx - hr * .55, hy + hr * .35, hr * .6, hr * .5, IX.BELLY); g.put(Math.round(hx - hr * .9), Math.round(hy + hr * .4), IX.OUT); g.put(Math.round(hx - hr * .6), Math.round(hy + hr * .45), IX.OUT); }
      if (has('cyclops')) { const x = Math.round(hx - 4 * s), y = Math.round(hy - 2.5 * s); g.rect(x - 1, y - 1, 6, 5, IX.OUT); g.rect(x, y, 4, 3, IX.WHITE); g.rect(x, y + 1, 2, 2, IX.EYE); }
      if (has('longNose')) g.tube([[hx - 4 * s, hy], [hx - 9 * s, hy + 1], [hx - 12 * s, hy + 2]], 1.8 * s, 1.2, IX.BASE, null, true);
      if (has('dish')) { g.oell(hx + 1, hy - hr * .85, hr * .7, hr * .28, IX.BELLY); g.ell(hx + 1, hy - hr * .9, hr * .4, hr * .12, IX.GLOW); }
      if (has('beakH')) g.opoly([[hx - 4 * s, hy + 1 * s], [hx - 9 * s, hy + 2.5 * s], [hx - 4 * s, hy + 4 * s]], IX.GOLD);
      if (has('frogHead')) { g.ell(hx - 1 * s, hy + 1.5 * s, hr * 1.05, hr * .7, IX.BELLY); g.line(hx - hr * .95, hy + 2.5 * s, hx + hr * .5, hy + 3 * s, IX.OUT); for (const ex of [hx - 3.5 * s, hx + 1.5 * s]) { g.oell(ex, hy - hr * .75, 2.4 * s, 2.4 * s, IX.BASE); g.eye(ex - 1, hy - hr * .8); } }
      if (has('fishHat')) { g.opoly([[hx - 5 * s, hy - hr * .55], [hx - 1 * s, hy - hr * 2.2], [hx + 6 * s, hy - hr * .45]], IX.ACC); g.put(Math.round(hx - 1.5 * s), Math.round(hy - hr * 1.6), IX.WHITE); stripe(g, IX.ACC, IX.ACCFAR, hx - 6 * s, hy - hr * 2.3, 13 * s, hr * 1.8, 3); }
      if (has('mask')) { g.ell(hx - 2 * s, hy - .5 * s, 4.6 * s, 2.4 * s, IX.ACC); }
    }
    if (ph === 'hand') {
      const [x, y] = K.hand;
      if (has('spear')) { g.line(x + 2, y + 8 * s, x - 3 * s, y - 24 * s, IX.GOLD, .8); g.opoly([[x - 4.5 * s, y - 24 * s], [x - 3 * s, y - 31 * s], [x - 1 * s, y - 24 * s]], IX.HORN); }
      if (has('hammer')) { g.line(x + 1, y + 3, x - 2, y - 12 * s, IX.GOLD, 1); g.rect(x - 8 * s - 1, y - 17 * s - 1, 12 * s + 2, 6 * s + 2, IX.OUT); g.rect(x - 8 * s, y - 17 * s, 12 * s, 6 * s, IX.HORN); }
      if (has('staff')) { g.line(x + 1, y + 10 * s, x - 2, y - 18 * s, IX.GOLD, .8); g.oell(x - 2, y - 20 * s, 2.4 * s, 2.4 * s, IX.GLOW); }
      if (has('lanternHand')) { g.line(x, y, x - 1, y + 5 * s, IX.OUT); g.oell(x - 1, y + 8 * s, 2.6 * s, 3.2 * s, IX.GLOW); }
    }
  }
  if (T === 'spirit') {
    if (ph === 'back') {
      if (has('hairFlow')) { const w = f ? 3 : 0; for (const d of [-3, 2, 7]) g.tube([[hx + 2, hy - 7 * s + d], [hx + 15 * s, hy + 1 * s + d + w], [hx + 26 * s, hy + 12 * s + d - w]], 3 * s, 1, IX.ACC); }
      if (has('wingsFairy')) { const u = f ? 3 : 0; g.opoly([[hx + 3, hy - 2], [hx + 18 * s, hy - 16 * s + u], [hx + 22 * s, hy - 6 * s + u], [hx + 6, hy + 4]], IX.BELLY); g.opoly([[hx + 3, hy + 2], [hx + 16 * s, hy + 6 * s - u], [hx + 12 * s, hy + 12 * s - u], [hx + 4, hy + 6]], IX.BELLY); }
    }
    if (ph === 'head') {
      if (has('lantern')) {
        for (let k = -2; k <= 2; k++) g.line(hx - 10 * s, hy + k * 3.6 * s, hx + 10 * s, hy + k * 3.6 * s, IX.ACCFAR, 0, 'onAny');
        g.rect(hx - 4 * s, hy - 11.5 * s, 8 * s, 2, IX.GOLD); g.rect(hx - 4 * s, hy + 10 * s, 8 * s, 2, IX.GOLD);
        g.line(hx - 5 * s, hy + 5 * s, hx + 1 * s, hy + 5 * s, IX.OUT);
        g.tube([[hx - 3 * s, hy + 5.5 * s], [hx - 4 * s, hy + 9 * s], [hx - 2 * s + (f ? 1 : -1), hy + 12 * s]], 1.6 * s, 1, IX.GLOW);
      }
      if (has('mossy')) for (let i = 0; i < 10; i++) { const r = P.rng; g.ell(hx + (r() - .5) * 18 * s, hy + (r() - .2) * 22 * s, 1.4, 1.2, IX.ACC, 'on'); }
      if (has('hornsSp')) { g.tube([[hx - 4 * s, hy - 8 * s], [hx - 6 * s, hy - 13 * s]], 1.4, .6, IX.HORN, null, true); g.tube([[hx + 4 * s, hy - 8 * s], [hx + 6 * s, hy - 13 * s]], 1.4, .6, IX.HORN, null, true); }
    }
  }
  if (T === 'aquatic') {
    const { cx, cy, rx, ry } = K;
    if (ph === 'back') {
      if (has('tentacles')) for (let i = 0; i < 4; i++) { const x = cx - rx * .4 + i * rx * .35, w = ((f + i) % 2) ? 2 : -2; g.tube([[x, cy + 3], [x + w, cy + ry + 5 * s], [x - 2 + w, cy + ry + 10 * s]], 2 * s, 1, IX.ACCFAR); }
      if (has('weedMane')) g.tube([[K.hx + 4 * s, K.hy - 5 * s], [cx, cy - ry - 2], [cx + rx * .5, cy - ry + 1]], 2.6 * s, 1.6 * s, IX.ACC);
    }
    if (ph === 'head') {
      if (has('sealFace')) { g.ell(K.hx - 5 * s, K.hy + 2 * s, 4 * s, 3 * s, IX.BELLY); g.rect(Math.round(K.hx - 8.5 * s), Math.round(K.hy + .5 * s), 2, 2, IX.EYE); for (const d of [0, 2]) g.line(K.hx - 7 * s, K.hy + 3 * s + d, K.hx - 12 * s, K.hy + 2 * s + d * 1.6, IX.HORN); }
      if (has('nemesA')) { g.opoly([[K.hx - 2, K.hy - 6 * s], [K.hx + 8 * s, K.hy - 4 * s], [K.hx + 10 * s, K.hy + 7 * s], [K.hx + 2 * s, K.hy + 5 * s]], IX.GOLD); stripe(g, IX.GOLD, IX.ACC, K.hx - 3, K.hy - 7 * s, 14 * s, 15 * s, 3); }
    }
  }
}
// recolour every 'n'-th row of pixels of colour 'from' inside a box
function stripe(g, from, to, x0, y0, w, h, n) {
  for (let y = Math.floor(y0); y < y0 + h; y++) { if (((y % n) + n) % n) continue; for (let x = Math.floor(x0); x < x0 + w; x++) if (g.get(x, y) === from) g.put(x, y, to); }
}
