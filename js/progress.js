/* ============================================
   CREATURE CARDS — Progress System
   Deck, zone progress, battle history
   ============================================ */
const Progress = (() => {
    const SAVE_KEY = 'creature_cards_save';

    function _default() {
        return {
            version: 1,
            deck: [],           // array of creatureIds (max 5)
            zoneProgress: {},   // zoneId -> { tier, wins }
            totalBattles: 0,
            totalWins: 0,
            totalXP: 0,
            settings: { sfx: true, music: true, voice: true },
            tutorialDone: false,
            lastDailyPack: null // date string
        };
    }

    function get() {
        try {
            const raw = localStorage.getItem(SAVE_KEY);
            if (!raw) return _default();
            return Object.assign(_default(), JSON.parse(raw));
        } catch (e) { return _default(); }
    }

    function save(data) {
        try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch (e) {}
    }

    function getDeck() {
        const d = get();
        // Return full creature objects for deck IDs, applying evolved stats if applicable
        return d.deck.map(id => {
            const evolved = Collection.isEvolved(id);
            const resolved = CreatureData.getCreatureResolved(id, evolved);
            const owned = Collection.get().owned[id];
            return resolved ? { ...resolved, ...(owned || {}), _evolved: evolved } : null;
        }).filter(Boolean);
    }

    function setDeck(deckIds) {
        const d = get();
        d.deck = deckIds.slice(0, 5);
        save(d);
    }

    function autoFillDeck() {
        const owned = Collection.getOwnedList();
        if (owned.length === 0) return;
        // Pick top 5 by total stats, with type diversity
        const sorted = owned.sort((a, b) => {
            const ta = (a.stats.pwr + a.stats.grd + a.stats.spd + a.stats.mag);
            const tb = (b.stats.pwr + b.stats.grd + b.stats.spd + b.stats.mag);
            return tb - ta;
        });
        const deck = [];
        const usedTypes = new Set();
        // First pass: one per type
        for (const c of sorted) {
            if (!usedTypes.has(c.type) && deck.length < 5) {
                deck.push(c.id);
                usedTypes.add(c.type);
            }
        }
        // Fill remaining slots with strongest
        for (const c of sorted) {
            if (!deck.includes(c.id) && deck.length < 5) {
                deck.push(c.id);
            }
        }
        setDeck(deck);
        return deck;
    }

    function getZoneProgress(zoneId) {
        const d = get();
        return d.zoneProgress[zoneId] || { tier: 1, wins: 0 };
    }

    function recordBattleResult(zoneId, won, xpEarned) {
        const d = get();
        d.totalBattles++;
        if (won) d.totalWins++;
        d.totalXP += xpEarned;

        if (!d.zoneProgress[zoneId]) {
            d.zoneProgress[zoneId] = { tier: 1, wins: 0 };
        }
        if (won) {
            d.zoneProgress[zoneId].wins++;
            // Advance tier if won current tier
            if (d.zoneProgress[zoneId].wins >= d.zoneProgress[zoneId].tier) {
                d.zoneProgress[zoneId].tier = Math.min(5, d.zoneProgress[zoneId].tier + 1);
            }
        }
        save(d);
    }

    function canClaimDailyPack() {
        const d = get();
        const today = new Date().toISOString().slice(0, 10);
        return d.lastDailyPack !== today;
    }

    function claimDailyPack() {
        const d = get();
        d.lastDailyPack = new Date().toISOString().slice(0, 10);
        save(d);
    }

    function getSettings() { return get().settings; }
    function saveSetting(key, value) {
        const d = get();
        d.settings[key] = value;
        save(d);
    }

    function markTutorialDone() {
        const d = get();
        d.tutorialDone = true;
        save(d);
    }

    function isTutorialDone() { return get().tutorialDone; }

    return {
        get, save, getDeck, setDeck, autoFillDeck,
        getZoneProgress, recordBattleResult,
        canClaimDailyPack, claimDailyPack,
        getSettings, saveSetting,
        markTutorialDone, isTutorialDone
    };
})();
