# Changelog

All notable changes to Creature Cards will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to incrementing service-worker cache versions on each release.

## [SW v29] — 2026-05-23

### Added
- Type Chart screen so players can study matchups outside of battle
- Near-miss tease on pack opens to make the next pull feel earned
- Cross-game card-drop receiver: accepts packs sent from ThinkFast and Rhythm Blast
- Voice replay button on question prompts
- Type-advantage narration ("Fire beats Grass!") on attack resolution
- Rarity celebrations when opening a pack: common / rare / epic / legendary each get their own flourish
- Auto-build deck helper for younger players
- Structured analytics event hook and blueprint-conformance pass

### Changed
- SES / lockdown hardening: inline PWA bootstrap moved into `main.js`
- HP bar grown from 120px to 180px and color-coded by remaining health
- Attack-mechanic clarity pass: questions clearly power the attack instead of feeling overlaid
- Sub-100ms tap confirm feedback for Fire tablet input
