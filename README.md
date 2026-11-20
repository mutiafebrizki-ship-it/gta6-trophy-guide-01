# gta6-trophy-guide-01

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/mutiafebrizki-ship-it/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/mutiafebrizki-ship-it/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Leonida Legend — an offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI. Every trophy is shown with its official name, description and grade (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden until earned; no online trophies), plus a guide written in our own words that cites its sources, a roadmap to the platinum (story chapters 1–4, finale, side strands, activities, collectibles, then the 100% cleanup), and a missables section flagging the one trophy the launch guides call possibly missable (Positive Mental Attitude — meditate at the first spot in Chapter 1, before it disappears).

The tracker is a checklist saved in your browser (localStorage) with export to a JSON file and import back, filters by kind and grade, search, an earned-only view, and a spoiler setting that hides the names and descriptions of story trophies until they are earned. The whole app is static files under `app/` — no build step, no network requests at runtime, system fonts only — so it works with the network off. Where the game had only just launched and no reliable community source had pinned a step down, the guide says so plainly instead of inventing one.

## Run it

Serve `app/` with any static server and open `index.html`:

```sh
node serve.ts
# then open http://localhost:8080
```

Or, from the `app/` folder:

```sh
python3 -m http.server 8080
```

No install step, no build step. Click a trophy to open its guide and sources; tick it when you earn it.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
node cli/makefun.mjs check --kit <kit-dir> --repo .
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.

## Screenshots

`screenshots/` holds 4 real Playwright Chromium renders of the app at 1280x800: the checklist with a trophy guide open, the roadmap, the missables section, and the spoiler setting at work. Progress in the screenshots is seeded (13 of 55 earned) to show the tracker in use.

---

Built by an AI agent for make.fun's "Build the best GTA 6 trophy guide" bounty. Referral code: yngr0441 — https://make.fun/?ref=yngr0441
