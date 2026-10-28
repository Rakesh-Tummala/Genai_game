'use strict';
// =====================================================================
//  MYTHBOUND - a 16-bit style creature-taming RPG
//  All art, music and text rendering are generated in code.
// =====================================================================

// ---- AI CONFIG -------------------------------------------------------
// Empty = offline mode (built-in keyword interpreter and fallback text).
// Set to e.g. "http://localhost:8787/api/ai" to use the optional server.
// No API key ever lives in this file.
const AI_ENDPOINT = "";

const W = 320, H = 240, TILE = 16;
const SAVE_KEY = 'mythbound_save_v1';
const SETTINGS_KEY = 'mythbound_settings_v1';
const BUILD_STAGE = 4;

// ---- small utils -----------------------------------------------------
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const randi = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const chance = p => Math.random() < p;
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

function hexToRgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function rgbToHex(r, g, b) { return '#' + [r, g, b].map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join(''); }
// amt > 0 lightens towards a warm white, amt < 0 darkens towards a cool dark (classic 16-bit hue shifting)
function shade(hex, amt) {
  const [r, g, b] = hexToRgb(hex);
  if (amt >= 0) return rgbToHex(r + (255 - r) * amt, g + (248 - g) * amt, b + (220 - b) * amt * 0.9);
  const k = -amt; return rgbToHex(r * (1 - k) + 20 * k, g * (1 - k) + 10 * k, b * (1 - k) + 40 * k);
}
function mixHex(a, b, t) { const A = hexToRgb(a), B = hexToRgb(b); return rgbToHex(lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t)); }

// ---- frame tasks (async helpers) ------------------------------------
const Tasks = [];
function wait(frames) { return new Promise(r => Tasks.push({ t: Math.max(0, frames | 0), r })); }
function tickTasks() {
  for (let i = Tasks.length - 1; i >= 0; i--) { const k = Tasks[i]; if (--k.t <= 0) { Tasks.splice(i, 1); k.r(); } }
}
function tween(obj, key, to, frames, ease = t => t) {
  const from = obj[key];
  return new Promise(r => Tweens.push({ obj, key, from, to, frames: Math.max(1, frames), f: 0, ease, done: r }));
}
const Tweens = [];
function tickTweens() {
  for (let i = Tweens.length - 1; i >= 0; i--) {
    const j = Tweens[i]; j.f++;
    const t = Math.min(1, j.f / j.frames); j.obj[j.key] = lerp(j.from, j.to, j.ease(t));
    if (t >= 1) { Tweens.splice(i, 1); j.done(); }
  }
}

// ---- settings --------------------------------------------------------
const Settings = Object.assign({ textSpeed: 2, music: true, sfx: true, muted: false }, (() => { try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'); } catch (e) { return {}; } })());
function saveSettings() { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(Settings)); } catch (e) { } }
