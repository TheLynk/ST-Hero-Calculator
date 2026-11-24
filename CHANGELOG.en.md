# Changelog — ST Hero Calculator

## v1.3.1 — 2026-11-24

- Fix: an empty yellow bar was shown under the header when the tool was up to date.

## v1.3.0 — 2026-11-24

- Tool update from GitHub: the page compares its version with the TheLynk/ST-Hero-Calculator repository at start-up, then once a day.
- When a new version exists: banner with the list of changes, download button for the latest release zip and link to GitHub.
- "Check for tool updates" button in the changelog, and GitHub link in the header.

## v1.2.0 — 2026-11-24

- Starforge icon next to the "Starforged items" option.
- Animation during the calculation: spinning star, blinking numbers and progress bar, then an effect when the result appears. The animation is off if the system asks for reduced motion.
- Artifact icon on artifact items (Thinkin' Cap, Kiku-Ichimonji…).

## v1.1.2 — 2026-11-24

- Fix: an element built into an item counts as an affinity (+10 element value at tier 14, enchantment stats ×2). Checked on a real Spellknight: gap with the game from 12% to less than 1%.
- The 168 stored best builds are recomputed with this fix.

## v1.1.1 — 2026-11-24

- Manual mode: quality choice for each item (normal to legendary), with its icon.

## v1.1.0 — 2026-11-24

- Version number shown in the page header.
- Changelog (French and English) in the page and in the CHANGELOG files.
- Manual mode: free choice of items, elements, spirits and skills, compared with the best build.

## v1.0.0 — 2026-11-24

- Standalone tool in a zip: the page downloads the official Google Sheet itself in 1 click.
- Sheet version check at start-up, then once a day. "Update" button when a new version exists.
- make_release.bat script to create the zip of a GitHub release.

## v0.9.0 — 2026-11-24

- 168 precomputed best builds: result in less than one second.
- Computed builds stored in the browser.
- 5th skill slot added automatically at Paragon 50.

## v0.8.0 — 2026-11-24

- Game icons: power, HP, ATK, DEF, EVA, elements, skills, quality, seeds, XP, sources, Paragon.
- French skill names and effects.
- Collection card: choice of level 0 to 3.

## v0.7.0 — 2026-11-24

- English version (en.html) and French version (index.html).
- Item images and class icons.
- Class picker by family, with base / promoted class button.

## v0.6.0 — 2026-11-24

- Exact base stats of each class (game data, levels 1, 40, 50 and Paragon).
- Artifact skills (e.g. Thinkin' Cap: XP → ATK).
- Top 1 build reproduced within 0.05%.

## v0.5.0 — 2026-11-24

- Exact item stat formula: transcendence, starforge, affinities.
- Better optimizer (changes of 2 items at a time).

## v0.4.0 — 2026-11-23

- Seeds, collection card, hero base stats.
- HP / ATK / DEF / EVA / ELEMENT row like in the game.

## v0.3.0 — 2026-11-23

- Power objective (ST Central formula), in addition to threat.

## v0.1.0 — 2026-11-23

- First version: best gear for maximum threat.
