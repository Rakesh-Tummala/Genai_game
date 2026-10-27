// =====================================================================
//  MAIN LOOP
// =====================================================================
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
function resize() {
  const touch = document.body.classList.contains('touch');
  const vw = window.innerWidth, vh = window.innerHeight - (touch && window.innerHeight > window.innerWidth ? 190 : 0);
  let s = Math.min(vw / W, vh / H);
  s = s >= 2 ? Math.floor(s) : Math.max(1, s);
  canvas.style.width = Math.floor(W * s) + 'px'; canvas.style.height = Math.floor(H * s) + 'px';
  document.getElementById('wrap').style.marginBottom = (touch && window.innerHeight > window.innerWidth ? 190 : 0) + 'px';
}
window.addEventListener('resize', resize); resize();

buildMaps();
const World = new Overworld();
World.load('city', 15, 18, 'down');
Scenes.replaceAll(new TitleScene());

function update() {
  Game.frames++;
  tickTasks(); tickTweens();
  const top = Scenes.top();
  if (top && top.update) top.update();
  Input.endFrame();
}
function draw() {
  let base = Scenes.stack.length - 1;
  while (base > 0 && !Scenes.stack[base].opaque) base--;
  ctx.save();
  if (Overlay.shake > 0) { Overlay.shake--; ctx.translate((Math.random() - .5) * Overlay.shake * .5, (Math.random() - .5) * Overlay.shake * .5); }
  for (let i = Math.max(0, base); i < Scenes.stack.length; i++) Scenes.stack[i].draw(ctx);
  ctx.restore();
  drawOverlay(ctx);
}
let last = performance.now(), acc = 0;
function loop(now) {
  acc += Math.min(100, now - last); last = now;
  let n = 0;
  while (acc >= 1000 / 60 && n < 4) { update(); acc -= 1000 / 60; n++; }
  draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
// debug hook for automated testing (harmless in normal play)
window.MB = { Game, Scenes, World, SPECIES, startBattle, buildCustomMove, interpretIdeaOffline, newCreature, saveGame, loadGame };
