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

## What is in the game (v1.0)

This is the **complete game (v1.0, Stages 1-4)**: 10 playable characters, all eight mythic cities from Indrapuri to Kitezh, 70 creatures, all orbs and items, the Bestiary, world-map travel, a full chiptune soundtrack and an ending.

**Playable now**

- Title screen (shows your save's name, seals, tamed count and play time) and **10 playable characters**, one or more from each culture, each with their own sprite, backstory and perk:

  | Character | From | Perk |
  |---|---|---|
  | Ira | Indrapuri | +10% taming chance |
  | Tarun | Indrapuri | +10% experience |
  | Saanvi | Indrapuri | 15% shop discount |
  | Eleni | Olympos | Healing items heal 20% more (revives restore 60%) |
  | Leif | Asgard | Starts with 5 extra Bana Orbs and 2 Agneyastra Orbs |
  | Amunet | Heliopolis | 4 custom attacks per battle instead of 3 |
  | Haruto | Takama | Your critical hits happen twice as often |
  | Orla | Tir na nOg | +25% coins from battles |
  | Iltani | Babylon | Uncommon and rare creatures appear more often |
  | Mirko | Kitezh | Companions get +4 max EN and regain EN faster |
- Choice of 3 starter creatures (Yalicub, Makarin, Vanarling).
- **Eight playable cities**, each with its own tiles, trees, buildings, music, battle backgrounds and weather:
  - **Indrapuri (India)** - details below.
  - **Olympos (Greece)** - white marble agora, Temple of Zeus, Arena of Ares, Gate of Hades, a harbour pier, olive leaves drifting. Trainers Hoplite Nikos and Oracle Kallisto (4 creatures each), lieutenants Ares (4), Poseidon (5, on the pier) and Hades (4), and Zeus's trial (6 creatures, signature move *Keraunos Bolt* on his eagle Aetonyx). Wild creatures Lv 16-27.
  - **Asgard (Norse)** - snowy log town with turf roofs, frozen lake, the rainbow bridge, aurora at night. Trainers Shieldmaiden Sigrun and Skald Bjorn (4 each), lieutenants Thor (5), Tyr (4) and Heimdall (4, on the rainbow bridge), and Odin's trial in Valgrind (6 creatures, signature move *Gungnir Cast*, which never misses). Wild creatures Lv 22-33.
  - **Heliopolis (Egypt)** - sandstone town with a pylon Temple of Ra, the Tomb of Anubis, the Hall of Sekhmet and the Nile, drifting sand. Trainers Scribe Nefer and Charioteer Khafra, lieutenants Anubis (5), Sekhmet (4) and Set (4, on the sun-barque pier), and Ra's trial (6, *Solar Barque*). Wild Lv 26-36.
  - **Takama (Japan)** - curved-roof town with the Sun Shrine, Moon Hall, Hall of Thunder, cherry trees and falling blossoms. Trainers Shrine Maiden Hana and Ronin Kenji, lieutenants Tsukuyomi (5), Raijin (4) and Susanoo (4, on the pier), and Amaterasu's trial (6, *Sacred Mirror Ray*, never misses). Wild Lv 30-38.
  - **Tir na nOg (Celtic)** - thatched halls, a loch and heather, drifting leaves. Trainers Bard Ciaran and Druid Aisling, lieutenants the Morrigan (4), Lugh (5) and Manannan (4, on the pier), and the Dagda's trial (6, *Harp of Seasons*, heals as it hits). Wild Lv 34-42.
  - **Babylon (Mesopotamia)** - mud-brick town with the blue Ishtar Gate, the Hall of Nergal and the ziggurat Esagila. Trainers Scribe Ludin and Archer Ishmi, lieutenants Ishtar (4, with the Bull of Heaven), Nergal (4) and Enlil (5, on the river pier), and Marduk's trial (6, *Seven Winds*). Wild Lv 36-44.
  - **Kitezh (Slavic)** - carved log houses, onion domes, a river and birch woods in autumn. Trainers Hunter Bogdan and Weaver Milena, lieutenants Svarog (4), Mokosh (5) and Veles (4, on the river pier), and Perun's final trial (6, *Thunder Axe*, all Lv 50). Wild Lv 38-46.
  - Order in each city: beat both trainers > the three lieutenants (any order) > the god. Beating a god unlocks the next city: India > Greece > Norse > Egypt > Japan > Celtic > Mesopotamia > Slavic. Beating Perun completes all eight trials.
- **World map (the Mist Road)**: open it with Menu > TRAVEL (outdoors) or by walking through a city's south gate (in India, the sealed rocks at the end of the Monsoon Trail). Unlocked cities can be visited any time.
- Each city has its own shop and healing shrine; if all your creatures faint you return to the last shrine you used.
- Overworld (India): the city of Indrapuri (palace, Fire Hall, shrine, shop, houses, lotus pond) and the Monsoon Trail route with two grass zones (Lv 3-7 and the Sacred Grove at Lv 10-16), river and bridge, pickup items. Tile-based movement, following camera, day/night tint with lamp glow, animated water/grass/fire, marigold petals by day and fireflies by night.
- **70 creatures** with procedural sprites, stats, 4+ learnable moves, rarity, lore and home city:
  - India (13): Yalicub, Makarin, Vanarling, Nagling, Garudin, Kinnarel, Vetalix, Gandharin, evolutions Yalidhar, Makaraja, Vanaveer, Nagaraja, and Airavat (Indra's team only).
  - 8 each for Greece, Norse, Egypt, Japan, Celtic, Mesopotamia and Slavic folklore (56), including evolutions such as Pegafoal > Pegasorn, Fenrisk > Fenrimaw, Bennuling > Bennurah, Kitsunko > Kyubirei, Selkin > Selkara, Lamassel > Lamassar and Zharling > Zharplume.
  - Every city's creatures can be met in its grass zones and battles. **Options > Bestiary preview** still reveals all entries if you want to look ahead.
  - 70 creatures in total now, including Aetonyx, Zeus's trial-only eagle.
- 59 moves across the 8 types plus Neutral, including draining, priority, stun, sleep and stat moves.
- Turn-based battles: speed order and priority, STAB, critical hits, 8-type chart (2x / 0.5x / 0x), burn, poison, sleep, stun, bind, stat stages, shields, terrain, PP and energy (EN), switching, items, running, XP and levelling (cap 50), learning moves, evolution.
- Battle presentation: swirl intro, platforms, animated sprites, type-coloured move effects, screen shake, damage numbers, HP/EN/XP bars, typewriter text box.
- Taming with all 7 orbs (Bana, Agneyastra, Varunastra (bonus vs Ember), Vayavyastra (bonus vs Sky), Nagastra (bonus vs sleeping or bound targets), Gandiva (high rate, sold after beating Agni), Brahmastra (never fails, only one per game - Indra gives it to you)) and a shaking-orb animation. Chance depends on remaining HP, status, rarity and orb. Each tamed creature awakens a **Mythic Form** (epithet + small stat tilt).
- All 7 items: Soma Drop, Amrita Vial, Sanjivani Herb, Tulsi Leaf (cures one status), Ganga Jal (cures every status in the party), Akshaya Patra Meal, Kavach Charm (sharp Defense boost). Shop (Bazaar), free healing shrine, Sanctum Stone storage for creatures beyond the party of 6, money rewards, blackout back to the shrine.
- **Custom AI attacks** in battle, with the offline interpreter and the optional server.
- India trainers: Pilgrim Rohan (regular trainer, 4 creatures, spots you on the road), lieutenants Agni (Fire Hall), Vayu and Varuna (inside Vaijayanta Palace, 4 creatures each), and Indra's trial (god, 5 creatures, unique intro, signature move *Vajra Thunderbolt*). Indra now requires Vayu and Varuna first.
- AI-powered NPC dialogue, expanded creature lore (Party > Summary > Z) and Mythic Forms, each with built-in fallback text.
- **Bestiary** (menu > BESTIARY): all 70 entries grouped by city, seen/tamed progress, silhouettes for unseen creatures, lore, evolutions and base stats for tamed creatures, and expanded AI lore with Z.
- **Audio**: a chiptune theme for every city, separate music for wild, trainer, lieutenant and god battles, shops, shrines, trial halls, a victory jingle, a seal fanfare and an ending theme. Several instrument voices (pulse, pluck, triangle, saw) with harmony lines and drones. Sound effects for menus, items, custom attacks, grass rustle, low-HP warning, seals and more. Music and sound-effect volume each have 5 levels, plus mute (N key or the music-note button).
- **Ending**: beating Perun plays scrolling credits listing your seals, companions and Bestiary progress. The world stays open afterwards.
- Companions that sit on the bench still earn a third of the XP from battles.
- Save / load (localStorage) and options (text speed, music volume, sound-effect volume, mute, Bestiary preview).

**Known limitations**

- Difficulty was tuned with simulated playthroughs and spot-checked battles, not a full human playthrough. Gods are meant to be the hardest fights: expect a few levels of grinding and some healing items, especially for Odin.
- The story always starts in Indrapuri with the same three starters, whichever character you pick.
- Old saves keep working, but a save made before Stage 3 will need Vayu and Varuna (inside Indra's palace) before Indra.

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
| `src/01_core.js` ... `src/13_main.js` (plus `05_data_world.js`, `05_data_z_cities.js`, `05_data_zz_cities2.js`, `05_data_zzz_stage4.js`, `06_sprites_parts.js`, `10_world_cities.js`, `10_world_cities2.js`) | Game source, concatenated in order (core, font, audio, input, data, sprites, AI, game state, UI, world, battle, scenes, main loop). |
| `build.js` | Inlines `src/` into `mythbound.html`: `node build.js`. |
| `server.js` | Optional AI server. |
| `package.json` | Scripts and the SDK dependency for live mode. |

Edit files in `src/`, then run `node build.js`.

---

## Roadmap

| Stage | Content | Status |
|---|---|---|
| 1 | Complete loop in India: city, route, 13 creatures, battles, taming, custom AI attacks, trainer, Agni, Indra, save/load, server | Done |
| 2 | All creatures, all orbs and items, Bestiary | Done |
| 3 | Remaining 7 cities with trainers, lieutenants and gods; world map | Done |
| 4 | 10 characters, full audio, polish | Done |
