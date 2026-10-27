# MYTHBOUND

A browser-based, 16-bit style creature-taming RPG. You are a young Tamer travelling through mythic cities, each home to creatures from one culture's folklore. Tame creatures, beat the city's trainers and lieutenants, then face the city's god in a ceremonial trial.

- **One self-contained file:** `mythbound.html` (HTML + CSS + vanilla JS, Canvas). Open it in a browser and play. No network access, no external fonts, no image files.
- **All art is generated in code:** creatures come from a procedural pixel-art generator (body templates + palettes + patterns + accessories, 2-frame idle animation). Text uses a bitmap pixel font drawn from a glyph table. Music and sound effects are chiptune-style Web Audio.
- **Custom AI attacks:** type any attack idea in battle. An AI (or the built-in offline interpreter) describes it; the game code validates it and decides every number.
- **Optional AI server:** `server.js` adds live AI. The game works fully without it.

All creature designs, names and artwork are original and inspired only by traditional folklore. Gods are portrayed respectfully, as fictional divine trials.

---

## Quick start

**Play offline (no setup):** double-click `mythbound.html`, or open it in any modern browser.

**Play with the optional AI server** (Node 18 or newer):

```bash
node server.js
```

Then open <http://localhost:8787/>. Without an API key the server runs in **MOCK mode** (canned AI replies, useful for testing). For live AI, see [Optional AI server](#optional-ai-server).

---

## Controls

| Action | Keyboard | Touch |
|---|---|---|
| Move | Arrow keys / WASD | D-pad |
| Confirm / talk / interact | Z, Enter, Space | A |
| Back / cancel | X, Backspace | B |
| Open menu | Esc, C or M | MENU |
| Run (hold while walking) | Shift or X | hold B |
| Mute | N or the music-note button | music-note button |

On phones and tablets an on-screen D-pad with A/B/MENU buttons appears automatically.

---

## Stage 1: what is playable

This build is **Stage 2 of 4**. It contains one complete, playable city (India, "Indrapuri") plus the full creature roster, all orbs and items, and the Bestiary.

**Playable now**

- Title screen, 3 playable characters (Ira, Tarun, Saanvi), each with a small perk (+10% taming chance, +10% XP, 15% shop discount).
- Choice of 3 starter creatures (Yalicub, Makarin, Vanarling).
- Overworld: the city of Indrapuri (palace, Fire Hall, shrine, shop, houses, lotus pond) and the Monsoon Trail route with two grass zones (Lv 3-7 and the Sacred Grove at Lv 10-16), river and bridge, pickup items. Tile-based movement, following camera, day/night tint with lamp glow, animated water/grass/fire, marigold petals by day and fireflies by night.
- **69 creatures** with procedural sprites, stats, 4+ learnable moves, rarity, lore and home city:
  - India (13): Yalicub, Makarin, Vanarling, Nagling, Garudin, Kinnarel, Vetalix, Gandharin, evolutions Yalidhar, Makaraja, Vanaveer, Nagaraja, and Airavat (Indra's team only).
  - 8 each for Greece, Norse, Egypt, Japan, Celtic, Mesopotamia and Slavic folklore (56), including evolutions such as Pegafoal > Pegasorn, Fenrisk > Fenrimaw, Bennuling > Bennurah, Kitsunko > Kyubirei, Selkin > Selkara, Lamassel > Lamassar and Zharling > Zharplume.
  - Only India's creatures can be met in the wild or in battles right now. The other 56 live in cities that arrive in Stage 3; you can view them all with **Options > Bestiary preview**.
- 59 moves across the 8 types plus Neutral, including draining, priority, stun, sleep and stat moves.
- Turn-based battles: speed order and priority, STAB, critical hits, 8-type chart (2x / 0.5x / 0x), burn, poison, sleep, stun, bind, stat stages, shields, terrain, PP and energy (EN), switching, items, running, XP and levelling (cap 50), learning moves, evolution.
- Battle presentation: swirl intro, platforms, animated sprites, type-coloured move effects, screen shake, damage numbers, HP/EN/XP bars, typewriter text box.
- Taming with all 7 orbs (Bana, Agneyastra, Varunastra (bonus vs Ember), Vayavyastra (bonus vs Sky), Nagastra (bonus vs sleeping or bound targets), Gandiva (high rate, sold after beating Agni), Brahmastra (never fails, only one per game - Indra gives it to you)) and a shaking-orb animation. Chance depends on remaining HP, status, rarity and orb. Each tamed creature awakens a **Mythic Form** (epithet + small stat tilt).
- All 7 items: Soma Drop, Amrita Vial, Sanjivani Herb, Tulsi Leaf (cures one status), Ganga Jal (cures every status in the party), Akshaya Patra Meal, Kavach Charm (sharp Defense boost). Shop (Bazaar), free healing shrine, Sanctum Stone storage for creatures beyond the party of 6, money rewards, blackout back to the shrine.
- **Custom AI attacks** in battle, with the offline interpreter and the optional server.
- Trainers: Pilgrim Rohan (regular trainer, 4 creatures, spots you on the road), Agni (lieutenant, 4 creatures), and Indra's trial (god, 5 creatures, unique intro, signature move *Vajra Thunderbolt*).
- AI-powered NPC dialogue, expanded creature lore (Party > Summary > Z) and Mythic Forms, each with built-in fallback text.
- **Bestiary** (menu > BESTIARY): all 69 entries grouped by city, seen/tamed progress, silhouettes for unseen creatures, lore, evolutions and base stats for tamed creatures, and expanded AI lore with Z.
- Save / load (localStorage), options (text speed, music, sound effects, mute), chiptune music and sound effects.

**Not in this build yet**

- The other 7 cities, their creatures, trainers, lieutenants and gods (Stage 3). The road south of the Monsoon Trail is sealed and says so in game.
- Encounters with the 56 non-Indian creatures (they need their cities, Stage 3).
- World map / fast travel (Stage 3, needs more than one city).
- Characters 4-10 and the full audio / polish pass (Stage 4).
- Lieutenants Vayu and Varuna (only Agni is in Stage 1).

---

## Custom AI attacks

In battle choose **CUSTOM** and type an idea (max 120 characters), for example:

> Summon a wave that pushes the enemy back and shields my creature.

1. The game sends the idea plus context (creature name, types, level, known moves, a short battle summary) to `askAI("custom_attack", ...)`.
2. The AI (or the offline interpreter) returns JSON only:
   `{ name, type, category, effects: [{ kind, rating 1-5 }], description }`.
3. **The game validates and decides everything numeric.** It whitelists fields and ignores unknown ones, clamps ratings, and computes power, accuracy, energy cost, cooldown and duration from a fixed power budget based on the creature's level and base stats. The AI never sets final numbers.
4. Hard rules in code:
   - no instant wins and no one-hit KOs (a custom hit can never deal more than 50% of the target's max HP);
   - no healing above max HP, no revives, no effects outside the battle (money, items, levels, taming);
   - at most one primary and one secondary effect;
   - the type must be one of the creature's types or Neutral (otherwise it becomes Neutral);
   - implausible or absolute ideas are downgraded;
   - 3 custom attacks per battle, plus a cooldown between uses, and each costs energy (EN).
5. A **preview card** shows the name, type, effects, cost, cooldown, accuracy and duration, with any downgrade notes. Confirm to use it, or Cancel (no use is spent).
6. Outcomes can be direct damage, shields, healing, damage over time (burn/poison), buffs, debuffs (sleep, stun, bind, stat drops) and terrain.
7. **Offline fallback:** a keyword interpreter (wave, shield, burn, heal, storm, vine, curse, sleep, and many more) produces the same JSON shape, so custom attacks always work. If the server is unreachable mid-game, the game falls back automatically.

---

## Optional AI server

`server.js` serves the game with AI turned on and answers `POST /api/ai` with `{ task, payload }`. Tasks: `custom_attack`, `npc_dialogue`, `lore`, `mythic_form`.

### MOCK mode (no key, no install)

```bash
node server.js
```

With no `ANTHROPIC_API_KEY` set, the server runs in MOCK mode and returns canned JSON (including one deliberately out-of-range rating, so you can see the game clamp it). You can also force it with `MOCK=1`.

### Live mode (Claude)

Install the one dependency (the official Anthropic SDK), set your key in an environment variable, and start the server:

```bash
npm install
```

macOS / Linux:

```bash
ANTHROPIC_API_KEY=your-key-here node server.js
```

Windows PowerShell:

```powershell
$env:ANTHROPIC_API_KEY="your-key-here"; node server.js
```

Open <http://localhost:8787/>. The server injects `AI_ENDPOINT = "/api/ai"` into the page it serves, so the file on disk stays in offline mode.

### Settings (environment variables)

| Variable | Default | Meaning |
|---|---|---|
| `ANTHROPIC_API_KEY` | (none) | API key. Never stored in the HTML. Without it the server uses MOCK mode. |
| `MOCK` | `0` | `1` forces MOCK mode even with a key. |
| `AI_MODEL` | `claude-opus-5-5` | Model used in live mode. |
| `PORT` | `8787` | Port. |
| `RATE_LIMIT` | `30` | Requests per minute per client. |
| `ALLOW_FILE_ORIGIN` | `0` | `1` allows requests from a game opened as a local file (`Origin: null`). |

### Security

- Binds to `127.0.0.1` only, checks the `Host` header (blocks DNS rebinding) and allows only `localhost` / `127.0.0.1` / `[::1]` origins.
- Rate-limits requests, accepts JSON only, caps the body at 4 KB, clips every string in the payload and cuts the attack idea to 120 characters.
- The key is read from the environment and never sent to the browser.
- Every AI reply is still validated by the game, and the player's idea is passed to the model as game data, not instructions.

### Using the server with the file version

If you prefer opening `mythbound.html` directly, set the constant near the top of the file:

```js
const AI_ENDPOINT = "http://localhost:8787/api/ai";
```

and start the server with `ALLOW_FILE_ORIGIN=1`.

---

## Project layout

| Path | What it is |
|---|---|
| `mythbound.html` | The game. Built from `src/`; this is the file you play. |
| `src/shell.html` | HTML/CSS shell. |
| `src/01_core.js` ... `src/13_main.js` (plus `05_data_world.js`, `06_sprites_parts.js`) | Game source, concatenated in order (core, font, audio, input, data, sprites, AI, game state, UI, world, battle, scenes, main loop). |
| `build.js` | Inlines `src/` into `mythbound.html`: `node build.js`. |
| `server.js` | Optional AI server. |
| `package.json` | Scripts and the SDK dependency for live mode. |

Edit files in `src/`, then run `node build.js`.

---

## Roadmap

| Stage | Content | Status |
|---|---|---|
| 1 | Complete loop in India: city, route, 13 creatures, battles, taming, custom AI attacks, trainer, Agni, Indra, save/load, server | Done |
| 2 | All creatures (69), all orbs and items, Bestiary | **This build** |
| 3 | Remaining 7 cities with trainers, lieutenants and gods; world map | Planned |
| 4 | 10 characters, full audio, polish | Planned |
