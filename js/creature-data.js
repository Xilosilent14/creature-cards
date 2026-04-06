/* ============================================
   CREATURE CARDS — Creature Data
   30 starter creatures across 5 elemental types
   ============================================ */
const CreatureData = (() => {
    // Type definitions
    const TYPES = {
        ember:  { name: 'Ember',  color: '#e8592a', icon: '🔥', domain: 'math',    topics: ['addition', 'subtraction', 'counting', 'numbers'] },
        tidal:  { name: 'Tidal',  color: '#2196F3', icon: '💧', domain: 'reading', topics: ['vocabulary', 'comprehension', 'sight-words'] },
        terra:  { name: 'Terra',  color: '#4CAF50', icon: '🌿', domain: 'reading', topics: ['phonics', 'letters', 'rhyming', 'sight-words'] },
        spark:  { name: 'Spark',  color: '#FFD600', icon: '⚡', domain: 'math',    topics: ['patterns', 'comparing', 'shapes', 'place-value'] },
        shadow: { name: 'Shadow', color: '#7E57C2', icon: '🌙', domain: 'mixed',   topics: ['addition', 'sight-words', 'counting', 'phonics'] }
    };

    // Type advantage chart: key beats value (1.5x damage)
    const ADVANTAGES = {
        ember: 'terra',   // fire burns plants
        terra: 'spark',   // ground absorbs electricity
        spark: 'tidal',   // electricity shocks water
        tidal: 'ember'    // water douses fire
        // shadow: neutral to all
    };

    function getTypeAdvantage(attackerType, defenderType) {
        if (ADVANTAGES[attackerType] === defenderType) return 1.5;
        // Check if defender has advantage over attacker (disadvantage)
        if (ADVANTAGES[defenderType] === attackerType) return 0.75;
        return 1.0;
    }

    // Rarity config
    const RARITIES = {
        common:    { name: 'Common',    color: '#9E9E9E', hpBonus: 0,  statBudget: [14, 18] },
        uncommon:  { name: 'Uncommon',  color: '#4CAF50', hpBonus: 2,  statBudget: [18, 22] },
        rare:      { name: 'Rare',      color: '#2196F3', hpBonus: 4,  statBudget: [22, 26] },
        epic:      { name: 'Epic',      color: '#9C27B0', hpBonus: 6,  statBudget: [26, 30] },
        legendary: { name: 'Legendary', color: '#FFD700', hpBonus: 10, statBudget: [30, 36] }
    };

    function getHP(creature) {
        return 10 + (creature.stats.grd * 2) + (RARITIES[creature.rarity]?.hpBonus || 0);
    }

    // All 30 creatures
    const CREATURES = [
        // === EMBER TYPE (6) ===
        { id: 'blazepup',     name: 'Blazepup',     type: 'ember', rarity: 'common',   stats: { pwr: 4, grd: 2, spd: 5, mag: 3 }, evolvedName: 'Blazehound',    emoji: '🐕‍🦺', ability: { name: 'Fireball', desc: '5 dmg, ignores guard', dmg: 5, ignoreGuard: true } },
        { id: 'turbo-rex',    name: 'Turbo Rex',    type: 'ember', rarity: 'common',   stats: { pwr: 5, grd: 3, spd: 4, mag: 2 }, evolvedName: 'Nitro Rex',     emoji: '🦖', ability: { name: 'Nitro Boost', desc: '+3 SPD for 2 turns', buff: 'spd', amount: 3, turns: 2 } },
        { id: 'lava-slug',    name: 'Lava Slug',    type: 'ember', rarity: 'common',   stats: { pwr: 3, grd: 5, spd: 2, mag: 4 }, evolvedName: 'Magma Shell',   emoji: '🐌', ability: { name: 'Molten Armor', desc: '+4 GRD for 2 turns', buff: 'grd', amount: 4, turns: 2 } },
        { id: 'rev-monkey',   name: 'Rev Monkey',   type: 'ember', rarity: 'uncommon', stats: { pwr: 5, grd: 3, spd: 6, mag: 4 }, evolvedName: 'Drift Chimp',   emoji: '🐒', ability: { name: 'Burnout', desc: 'Damage = SPD value', dmgFromStat: 'spd' } },
        { id: 'forge-beetle', name: 'Forge Beetle', type: 'ember', rarity: 'rare',     stats: { pwr: 6, grd: 5, spd: 4, mag: 7 }, evolvedName: 'Foundry Stag',  emoji: '🪲', ability: { name: 'Smelt', desc: 'Deal 5 dmg + heal 3 HP', dmg: 5, heal: 3 } },
        { id: 'dragster',     name: 'Dragster',     type: 'ember', rarity: 'epic',     stats: { pwr: 8, grd: 4, spd: 8, mag: 6 }, evolvedName: 'Hyper Dragster', emoji: '🐉', ability: { name: 'Quarter Mile', desc: '12 dmg, then rest 1 turn', dmg: 12, selfStun: 1 } },

        // === TIDAL TYPE (6) ===
        { id: 'splashkit',    name: 'Splashkit',    type: 'tidal', rarity: 'common',   stats: { pwr: 3, grd: 3, spd: 4, mag: 4 }, evolvedName: 'Tidalynx',      emoji: '🐱', ability: { name: 'Wave Wall', desc: 'Block next attack fully', shield: true } },
        { id: 'icehopper',    name: 'Icehopper',    type: 'tidal', rarity: 'common',   stats: { pwr: 4, grd: 4, spd: 3, mag: 3 }, evolvedName: 'Frostleaper',   emoji: '🐸', ability: { name: 'Brain Freeze', desc: 'Enemy -2 SPD for 2 turns', debuff: 'spd', amount: -2, turns: 2 } },
        { id: 'puddle-pup',   name: 'Puddle Pup',   type: 'tidal', rarity: 'common',   stats: { pwr: 3, grd: 2, spd: 5, mag: 4 }, evolvedName: 'Storm Hound',   emoji: '🐶', ability: { name: 'Rain Dance', desc: '+2 MAG for self', buff: 'mag', amount: 2, turns: 2 } },
        { id: 'coral-knight', name: 'Coral Knight', type: 'tidal', rarity: 'uncommon', stats: { pwr: 5, grd: 6, spd: 3, mag: 4 }, evolvedName: 'Reef Champion', emoji: '🦀', ability: { name: 'Shell Shield', desc: '+5 GRD for 1 turn', buff: 'grd', amount: 5, turns: 1 } },
        { id: 'glacier-bear', name: 'Glacier Bear', type: 'tidal', rarity: 'rare',     stats: { pwr: 7, grd: 6, spd: 3, mag: 6 }, evolvedName: 'Avalanche Bear', emoji: '🐻‍❄️', ability: { name: 'Blizzard', desc: '4 dmg to all enemies', dmg: 4, aoe: true } },
        { id: 'leviathan-jr', name: 'Leviathan Jr', type: 'tidal', rarity: 'epic',     stats: { pwr: 7, grd: 5, spd: 6, mag: 8 }, evolvedName: 'Sea Sovereign',  emoji: '🐋', ability: { name: 'Tidal Surge', desc: '8 dmg + heal 4 HP', dmg: 8, heal: 4 } },

        // === TERRA TYPE (6) ===
        { id: 'seedling',     name: 'Seedling',     type: 'terra', rarity: 'common',   stats: { pwr: 3, grd: 4, spd: 3, mag: 4 }, evolvedName: 'Thornbloom',    emoji: '🌱', ability: { name: 'Vine Whip', desc: '4 dmg, ignores guard', dmg: 4, ignoreGuard: true } },
        { id: 'dirt-bunny',   name: 'Dirt Bunny',   type: 'terra', rarity: 'common',   stats: { pwr: 4, grd: 3, spd: 5, mag: 2 }, evolvedName: 'Boulder Hare',  emoji: '🐰', ability: { name: 'Burrow', desc: 'Dodge next attack', dodge: true } },
        { id: 'moss-turtle',  name: 'Moss Turtle',  type: 'terra', rarity: 'common',   stats: { pwr: 2, grd: 6, spd: 2, mag: 4 }, evolvedName: 'Ironshell',     emoji: '🐢', ability: { name: 'Regenerate', desc: 'Heal 5 HP', heal: 5 } },
        { id: 'slugger-vine', name: 'Slugger Vine', type: 'terra', rarity: 'uncommon', stats: { pwr: 6, grd: 4, spd: 4, mag: 4 }, evolvedName: 'Grand Slam Oak', emoji: '⚾', ability: { name: 'Home Run', desc: 'PWR x1.5 dmg, then -2 PWR', dmgMultiplier: 1.5, selfDebuff: 'pwr', selfDebuffAmt: -2 } },
        { id: 'antler-elk',   name: 'Antler Elk',   type: 'terra', rarity: 'rare',     stats: { pwr: 6, grd: 6, spd: 5, mag: 5 }, evolvedName: 'Crown Stag',    emoji: '🦌', ability: { name: 'Forest Rally', desc: '+2 PWR for self', buff: 'pwr', amount: 2, turns: 2 } },
        { id: 'diamond-golem',name: 'Diamond Golem',type: 'terra', rarity: 'epic',     stats: { pwr: 8, grd: 8, spd: 3, mag: 7 }, evolvedName: 'Crystal Titan',  emoji: '💎', ability: { name: 'Earthshake', desc: '6 dmg + enemy -3 SPD', dmg: 6, debuff: 'spd', debuffAmt: -3 } },

        // === SPARK TYPE (6) ===
        { id: 'zapbit',       name: 'Zapbit',       type: 'spark', rarity: 'common',   stats: { pwr: 4, grd: 2, spd: 5, mag: 3 }, evolvedName: 'Voltbyte',      emoji: '🐇', ability: { name: 'Static Shock', desc: '3 dmg + enemy -3 SPD', dmg: 3, debuff: 'spd', debuffAmt: -3 } },
        { id: 'gearcat',      name: 'Gearcat',      type: 'spark', rarity: 'common',   stats: { pwr: 3, grd: 4, spd: 4, mag: 3 }, evolvedName: 'Mech Panther',  emoji: '🐱', ability: { name: 'Overclock', desc: '+3 SPD for 2 turns', buff: 'spd', amount: 3, turns: 2 } },
        { id: 'bulb-bug',     name: 'Bulb Bug',     type: 'spark', rarity: 'common',   stats: { pwr: 3, grd: 3, spd: 3, mag: 5 }, evolvedName: 'Beacon Moth',   emoji: '🪲', ability: { name: 'Bright Flash', desc: 'Enemy misses next attack', blind: true } },
        { id: 'circuit-pup',  name: 'Circuit Pup',  type: 'spark', rarity: 'uncommon', stats: { pwr: 5, grd: 3, spd: 6, mag: 4 }, evolvedName: 'Techno Wolf',   emoji: '🤖', ability: { name: 'Power Surge', desc: '6 dmg, take 2 self-dmg', dmg: 6, selfDmg: 2 } },
        { id: 'ratchet-hawk', name: 'Ratchet Hawk', type: 'spark', rarity: 'rare',     stats: { pwr: 6, grd: 4, spd: 7, mag: 5 }, evolvedName: 'Thunderbird',   emoji: '🦅', ability: { name: 'Divebomb', desc: 'Dmg = SPD, ignores GRD', dmgFromStat: 'spd', ignoreGuard: true } },
        { id: 'volt-engine',  name: 'Volt Engine',  type: 'spark', rarity: 'epic',     stats: { pwr: 7, grd: 5, spd: 7, mag: 7 }, evolvedName: 'Plasma Dynamo', emoji: '⚙️', ability: { name: 'Chain Lightning', desc: '5 dmg to all enemies', dmg: 5, aoe: true } },

        // === SHADOW TYPE (6) ===
        { id: 'duskkit',      name: 'Duskkit',      type: 'shadow', rarity: 'common',   stats: { pwr: 4, grd: 3, spd: 3, mag: 4 }, evolvedName: 'Nightprowl',   emoji: '🐈‍⬛', ability: { name: 'Vanish', desc: 'Dodge next attack', dodge: true } },
        { id: 'gloom-bat',    name: 'Gloom Bat',    type: 'shadow', rarity: 'common',   stats: { pwr: 3, grd: 3, spd: 5, mag: 3 }, evolvedName: 'Eclipse Wing',  emoji: '🦇', ability: { name: 'Echo Screech', desc: 'See enemy next move', reveal: true } },
        { id: 'mist-owl',     name: 'Mist Owl',     type: 'shadow', rarity: 'uncommon', stats: { pwr: 4, grd: 4, spd: 4, mag: 6 }, evolvedName: 'Phantom Owl',   emoji: '🦉', ability: { name: 'Wisdom Drain', desc: 'Steal 2 MAG for 2 turns', steal: 'mag', amount: 2, turns: 2 } },
        { id: 'shade-fox',    name: 'Shade Fox',    type: 'shadow', rarity: 'rare',     stats: { pwr: 6, grd: 4, spd: 6, mag: 6 }, evolvedName: 'Phantom Fox',   emoji: '🦊', ability: { name: 'Shadow Copy', desc: 'Copy enemy last ability', copyAbility: true } },
        { id: 'hex-tortoise', name: 'Hex Tortoise', type: 'shadow', rarity: 'rare',     stats: { pwr: 5, grd: 7, spd: 3, mag: 7 }, evolvedName: 'Rune Guardian', emoji: '🐢', ability: { name: 'Mystic Ward', desc: 'Block + reflect 3 dmg', shield: true, reflect: 3 } },
        { id: 'void-dragon',  name: 'Void Dragon',  type: 'shadow', rarity: 'legendary',stats: { pwr: 8, grd: 7, spd: 7, mag: 8 }, evolvedName: 'Abyssal Wyrm',  emoji: '🐲', ability: { name: 'Dark Nova', desc: '10 dmg to all + heal 5', dmg: 10, aoe: true, heal: 5 } }
    ];

    function getCreature(id) {
        return CREATURES.find(c => c.id === id);
    }

    function getCreaturesByType(type) {
        return CREATURES.filter(c => c.type === type);
    }

    function getAllCreatures() {
        return CREATURES;
    }

    return {
        TYPES, ADVANTAGES, RARITIES, CREATURES,
        getCreature, getCreaturesByType, getAllCreatures,
        getTypeAdvantage, getHP
    };
})();
