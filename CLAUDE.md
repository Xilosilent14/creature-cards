# Creature Cards - OTB Games

## What It Does
Collectible card battle game for ages 5-8. Collect creature cards by answering questions, build 5-card decks, battle AI opponents in turn-based combat. Questions power attacks (not overlaid).

## Tech Stack
- Vanilla HTML/CSS/JS (no frameworks, no build step)
- PWA with service worker for offline play
- Part of OTB Games product line

## Dev Server
- Port: 8084
- Command: `node node_modules/serve/build/main.js -l 8084 -s .`

## Key Files
- `js/creature-data.js` - 30 creatures, 5 types, stats, abilities, evolution
- `js/battle-engine.js` - Turn-based combat, damage calc, AI behavior
- `js/question-bridge.js` - Maps creature types to math/reading topics
- `js/collection.js` - Card packs, rarity rolls, stardust, ownership
- `js/progress.js` - Deck, zone progress, saves
- `js/main.js` - Screen management, battle flow, UI wiring

## Game Accent Color
- Amber/Gold: `--game-accent: #f59e0b`

## 5 Elemental Types
- Ember (orange-red, math), Tidal (blue, reading), Terra (green, reading), Spark (yellow, math), Shadow (purple, mixed)

## DO NOT Change
- Port 8084
- Game accent amber/gold
- 5-card deck limit
- Type advantage chart (Ember>Terra>Spark>Tidal>Ember, Shadow neutral)
