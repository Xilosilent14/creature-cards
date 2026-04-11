#!/usr/bin/env node
/**
 * Split sprite sheets (1024x1024, 3x2 grid) into individual creature PNGs.
 * Each cell is ~341x512, but we'll use sharp to extract and trim whitespace.
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const CREATURES_DIR = path.join(__dirname, '..', 'assets', 'creatures');

// Sprite sheet -> creature IDs in grid order (left-right, top-bottom)
const SHEETS = {
  'ember-type.png': ['blazepup', 'turbo-rex', 'lava-slug', 'rev-monkey', 'forge-beetle', 'dragster'],
  'tidal-type.png': ['splashkit', 'icehopper', 'puddle-pup', 'coral-knight', 'glacier-bear', 'leviathan-jr'],
  'terra-type.png': ['seedling', 'dirt-bunny', 'moss-turtle', 'slugger-vine', 'antler-elk', 'diamond-golem'],
  'spark-type.png': ['zapbit', 'gearcat', 'bulb-bug', 'circuit-pup', 'ratchet-hawk', 'volt-engine'],
  'shadow-type.png': ['duskkit', 'gloom-bat', 'mist-owl', 'shade-fox', 'hex-tortoise', 'void-dragon'],
};

const COLS = 3;
const ROWS = 2;

async function splitSheet(sheetFile, creatureIds) {
  const filePath = path.join(CREATURES_DIR, sheetFile);
  if (!fs.existsSync(filePath)) {
    console.log(`  SKIP ${sheetFile} (not found)`);
    return;
  }

  const img = sharp(filePath);
  const meta = await img.metadata();
  const cellW = Math.floor(meta.width / COLS);
  const cellH = Math.floor(meta.height / ROWS);

  console.log(`  ${sheetFile}: ${meta.width}x${meta.height} -> ${cellW}x${cellH} cells`);

  for (let i = 0; i < creatureIds.length; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const left = col * cellW;
    const top = row * cellH;

    const outFile = path.join(CREATURES_DIR, `${creatureIds[i]}.png`);

    await sharp(filePath)
      .extract({ left, top, width: cellW, height: cellH })
      .png()
      .toFile(outFile);

    const outMeta = await sharp(outFile).metadata();
    console.log(`    [${i}] ${creatureIds[i]}.png (${outMeta.width}x${outMeta.height})`);
  }
}

async function main() {
  console.log('Splitting sprite sheets into individual creature PNGs...\n');

  for (const [sheet, ids] of Object.entries(SHEETS)) {
    await splitSheet(sheet, ids);
  }

  console.log('\nDone! 30 individual creature PNGs created.');
  console.log('You can now update creature-data.js to use individual images.');
}

main().catch(console.error);
