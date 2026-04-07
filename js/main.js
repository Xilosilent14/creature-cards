/* ============================================
   CREATURE CARDS — Main Controller
   Screen management, UI wiring, battle flow
   ============================================ */
(() => {
    let currentZone = null;
    let currentTier = 1;
    let battleAction = null;
    let questionStartTime = 0;

    const ZONES = [
        { id: 'ember',  name: 'Ember Fields',  type: 'ember',  icon: '🔥', cssClass: 'zone-ember' },
        { id: 'tidal',  name: 'Tidal Shores',  type: 'tidal',  icon: '💧', cssClass: 'zone-tidal' },
        { id: 'terra',  name: 'Wild Grove',     type: 'terra',  icon: '🌿', cssClass: 'zone-terra' },
        { id: 'spark',  name: 'Bolt Canyon',    type: 'spark',  icon: '⚡', cssClass: 'zone-spark' },
        { id: 'shadow', name: 'Gloom Hollow',   type: 'shadow', icon: '🌙', cssClass: 'zone-shadow' }
    ];

    function init() {
        // Initialize audio system
        AudioSystem.init();
        // Unlock audio on first user interaction (required for mobile)
        document.addEventListener('click', () => AudioSystem.unlock(), { once: true });
        document.addEventListener('touchstart', () => AudioSystem.unlock(), { once: true });

        // First time: give starter pack
        if (!Collection.hasStarterPack()) {
            Collection.giveStarterPack();
            Progress.autoFillDeck();
        }

        // Wire buttons (all with click SFX)
        document.getElementById('btn-play').addEventListener('click', () => { AudioSystem.playClick(); showScreen('map'); });
        document.getElementById('btn-collection').addEventListener('click', () => { AudioSystem.playClick(); showScreen('collection'); });
        document.getElementById('btn-deck').addEventListener('click', () => { AudioSystem.playClick(); showScreen('deck'); });
        document.getElementById('btn-settings').addEventListener('click', () => { AudioSystem.playClick(); showScreen('settings'); });
        document.getElementById('btn-coll-back').addEventListener('click', () => { AudioSystem.playClick(); showScreen('title'); });
        document.getElementById('btn-deck-back').addEventListener('click', () => { AudioSystem.playClick(); showScreen('title'); });
        document.getElementById('btn-map-back').addEventListener('click', () => { AudioSystem.playClick(); showScreen('title'); });
        document.getElementById('btn-settings-back').addEventListener('click', () => { AudioSystem.playClick(); showScreen('title'); });
        document.getElementById('btn-to-map').addEventListener('click', () => { AudioSystem.playClick(); AudioSystem.stopMusic(); showScreen('map'); });
        document.getElementById('btn-to-home').addEventListener('click', () => { AudioSystem.playClick(); AudioSystem.stopMusic(); showScreen('title'); });
        document.getElementById('btn-next-battle').addEventListener('click', () => { AudioSystem.playClick(); _startBattle(currentZone, currentTier); });
        document.getElementById('btn-auto-fill').addEventListener('click', () => {
            AudioSystem.playClick();
            Progress.autoFillDeck();
            _buildDeckScreen();
        });
        document.getElementById('btn-pack-done').addEventListener('click', () => { AudioSystem.playClick(); showScreen('title'); });

        // Battle actions
        document.getElementById('btn-attack').addEventListener('click', () => { AudioSystem.playClick(); _onBattleAction('attack'); });
        document.getElementById('btn-ability').addEventListener('click', () => { AudioSystem.playClick(); _onBattleAction('ability'); });

        // Settings toggles
        document.querySelectorAll('.otb-settings-item').forEach(item => {
            item.addEventListener('click', () => {
                AudioSystem.playClick();
                const key = item.dataset.setting;
                const track = item.querySelector('.otb-toggle-track');
                const isOn = track.classList.contains('on');
                track.classList.toggle('on');
                item.classList.toggle('on');
                Progress.saveSetting(key, !isOn);
                // Wire settings to audio system
                if (key === 'sfx') AudioSystem.setSFX(!isOn);
                if (key === 'music') AudioSystem.setMusic(!isOn);
            });
        });

        // Daily pack check
        if (Progress.canClaimDailyPack()) {
            Progress.claimDailyPack();
            const cards = Collection.openPack('daily');
            // Show pack opening after splash
            setTimeout(() => {
                AudioSystem.playDailyPack();
                _showPackOpening(cards, 'Daily Pack!');
            }, 2500);
        }

        // Ecosystem daily streak
        if (typeof OTBEcosystem !== 'undefined') OTBEcosystem.checkDailyStreak();

        // Splash -> Title
        setTimeout(() => {
            const splash = document.getElementById('splash');
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
                if (!Progress.canClaimDailyPack()) showScreen('title');
                // If daily pack, pack screen will show instead
            }, 500);
        }, 2000);
    }

    function showScreen(name) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const screen = document.getElementById('screen-' + name);
        if (screen) screen.classList.add('active');

        if (name === 'collection') _buildCollectionScreen();
        if (name === 'deck') _buildDeckScreen();
        if (name === 'map') _buildMapScreen();
    }

    // === COLLECTION SCREEN ===
    function _buildCollectionScreen() {
        const tabs = document.getElementById('coll-tabs');
        const grid = document.getElementById('coll-grid');
        const count = document.getElementById('coll-count');

        const types = ['all', 'ember', 'tidal', 'terra', 'spark', 'shadow'];
        let activeType = 'all';

        count.textContent = `${Collection.getOwnedCount()} / ${CreatureData.getAllCreatures().length}`;

        tabs.innerHTML = types.map(t => {
            const typeData = CreatureData.TYPES[t];
            const label = t === 'all' ? '🌟 All' : `${typeData?.icon || ''} ${typeData?.name || t}`;
            return `<button class="type-tab ${t === activeType ? 'active' : ''}" data-type="${t}">${label}</button>`;
        }).join('');

        tabs.querySelectorAll('.type-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                AudioSystem.playClick();
                activeType = tab.dataset.type;
                tabs.querySelectorAll('.type-tab').forEach(t => t.classList.toggle('active', t.dataset.type === activeType));
                _renderCreatureGrid(grid, activeType);
            });
        });

        _renderCreatureGrid(grid, activeType);
    }

    function _renderCreatureGrid(grid, typeFilter) {
        let creatures = CreatureData.getAllCreatures();
        if (typeFilter !== 'all') creatures = creatures.filter(c => c.type === typeFilter);

        grid.innerHTML = creatures.map(c => {
            const owned = Collection.isOwned(c.id);
            const rarityColor = CreatureData.RARITIES[c.rarity]?.color || '#999';
            return `
                <div class="creature-slot ${owned ? 'owned' : 'unowned'}">
                    <div class="creature-emoji">${owned ? c.emoji : '❓'}</div>
                    <div class="creature-name">${owned ? c.name : '???'}</div>
                    <div class="creature-rarity" style="color:${rarityColor}">${owned ? c.rarity : ''}</div>
                </div>
            `;
        }).join('');
    }

    // === DECK BUILDER ===
    function _buildDeckScreen() {
        const slotsEl = document.getElementById('deck-slots');
        const gridEl = document.getElementById('deck-grid');
        const deck = Progress.getDeck();
        const deckIds = Progress.get().deck || [];

        // Render 5 deck slots
        slotsEl.innerHTML = Array.from({ length: 5 }, (_, i) => {
            const c = deck[i];
            if (c) {
                return `<div class="deck-slot filled" data-slot="${i}">
                    <div class="creature-emoji">${c.emoji}</div>
                    <div class="slot-name">${c.name}</div>
                </div>`;
            }
            return `<div class="deck-slot" data-slot="${i}">Empty</div>`;
        }).join('');

        // Render owned creatures grid
        const owned = Collection.getOwnedList();
        gridEl.innerHTML = owned.map(c => {
            const inDeck = deckIds.includes(c.id);
            const typeColor = CreatureData.TYPES[c.type]?.color || '#999';
            return `
                <div class="creature-slot owned ${inDeck ? 'in-deck' : ''}" data-id="${c.id}"
                     style="border-color: ${inDeck ? 'var(--game-accent)' : typeColor}">
                    <div class="creature-emoji">${c.emoji}</div>
                    <div class="creature-name">${c.name}</div>
                    <div class="creature-rarity" style="color:${CreatureData.RARITIES[c.rarity]?.color || '#999'}">${c.rarity}</div>
                </div>
            `;
        }).join('');

        // Wire tap to add/remove from deck
        gridEl.querySelectorAll('.creature-slot').forEach(slot => {
            slot.addEventListener('click', () => {
                AudioSystem.playClick();
                const id = slot.dataset.id;
                const d = Progress.get();
                if (d.deck.includes(id)) {
                    d.deck = d.deck.filter(did => did !== id);
                } else if (d.deck.length < 5) {
                    d.deck.push(id);
                }
                Progress.save(d);
                _buildDeckScreen();
            });
        });
    }

    // === MAP SCREEN ===
    function _buildMapScreen() {
        const el = document.getElementById('map-zones');
        el.innerHTML = ZONES.map(zone => {
            const prog = Progress.getZoneProgress(zone.id);
            return `
                <div class="zone-card ${zone.cssClass}" data-zone="${zone.id}">
                    <div class="zone-icon">${zone.icon}</div>
                    <div class="zone-name">${zone.name}</div>
                    <div class="zone-progress">Tier ${prog.tier} / 5 | Wins: ${prog.wins}</div>
                </div>
            `;
        }).join('');

        el.querySelectorAll('.zone-card').forEach(card => {
            card.addEventListener('click', () => {
                AudioSystem.playClick();
                const zoneId = card.dataset.zone;
                const zone = ZONES.find(z => z.id === zoneId);
                const prog = Progress.getZoneProgress(zoneId);
                _startBattle(zone, prog.tier);
            });
        });
    }

    // === BATTLE FLOW ===
    function _startBattle(zone, tier) {
        currentZone = zone;
        currentTier = tier;

        const deck = Progress.getDeck();
        if (deck.length === 0) {
            Progress.autoFillDeck();
            return _startBattle(zone, tier);
        }

        // Generate opponent team based on zone type and tier
        const oppPool = CreatureData.getCreaturesByType(zone.type);
        const oppCount = Math.min(tier >= 4 ? 3 : 2, oppPool.length);
        const shuffled = [...oppPool].sort(() => Math.random() - 0.5);
        const oppTeam = shuffled.slice(0, oppCount).map(c => ({
            ...c,
            // Scale stats by tier
            stats: {
                pwr: c.stats.pwr + Math.floor(tier * 0.5),
                grd: c.stats.grd + Math.floor(tier * 0.3),
                spd: c.stats.spd + Math.floor(tier * 0.3),
                mag: c.stats.mag + Math.floor(tier * 0.3)
            }
        }));

        BattleEngine.startBattle(deck.slice(0, 3), oppTeam, tier);
        QuestionBridge.reset();
        showScreen('battle');
        _updateBattleUI();
        AudioSystem.startBattleMusic();

        // Show actions
        document.getElementById('question-area').style.display = 'none';
        document.getElementById('battle-actions').style.display = 'flex';
    }

    function _onBattleAction(action) {
        battleAction = action;
        // Show question
        const state = BattleEngine.getState();
        const playerCreature = state.player[state.playerActive];
        const isAbility = action === 'ability';
        const q = QuestionBridge.generate(playerCreature.type, isAbility);

        document.getElementById('q-text').textContent = q.question;
        const grid = document.getElementById('answer-grid');
        grid.innerHTML = q.answers.map((a, i) => `
            <button class="answer-btn" data-idx="${i}">${a}</button>
        `).join('');

        grid.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                AudioSystem.playClick();
                _onAnswer(parseInt(btn.dataset.idx), q);
            });
        });

        document.getElementById('question-area').style.display = 'block';
        document.getElementById('battle-actions').style.display = 'none';
        questionStartTime = Date.now();
    }

    function _onAnswer(idx, question) {
        const correct = idx === question.correctIndex;
        const fast = (Date.now() - questionStartTime) < 5000;

        // Audio + visual feedback
        if (correct) {
            AudioSystem.playCorrect();
        } else {
            AudioSystem.playWrong();
        }

        const btns = document.querySelectorAll('#answer-grid .answer-btn');
        btns.forEach((btn, i) => {
            btn.disabled = true;
            if (i === question.correctIndex) btn.classList.add('correct');
            if (i === idx && !correct) btn.classList.add('wrong');
        });

        // Record answer in ecosystem
        QuestionBridge.recordAnswer(correct);
        if (typeof OTBEcosystem !== 'undefined') {
            OTBEcosystem.recordAnswer(question.topic, question.domain, correct, QuestionBridge.getLevel(), 'creature-cards');
        }

        // Execute battle turn after brief delay
        setTimeout(() => {
            const prevState = BattleEngine.getState();
            const prevOppHP = prevState.opponent[prevState.opponentActive].hp;
            const prevPlayerHP = prevState.player[prevState.playerActive].hp;

            const state = BattleEngine.playerTurn(battleAction, correct, fast);
            document.getElementById('question-area').style.display = 'none';

            // Play battle SFX based on what happened
            const currOpp = state.opponent[state.opponentActive];
            const currPlayer = state.player[state.playerActive];

            // Player attack sound
            if (correct) {
                if (battleAction === 'ability') {
                    AudioSystem.playAbility();
                } else {
                    AudioSystem.playAttack();
                }
            } else {
                AudioSystem.playWeakAttack();
            }

            // Check if opponent took damage
            if (currOpp.hp < prevOppHP) {
                setTimeout(() => AudioSystem.playDamage(), 150);
            }

            // Check if opponent fainted
            if (prevOppHP > 0 && currOpp.hp <= 0) {
                setTimeout(() => AudioSystem.playFainted(), 300);
            }

            // Check if player took damage from opponent counterattack
            if (currPlayer.hp < prevPlayerHP) {
                setTimeout(() => AudioSystem.playDamage(), 400);
            }

            // Check if player creature fainted
            if (prevPlayerHP > 0 && currPlayer.hp <= 0) {
                setTimeout(() => AudioSystem.playFainted(), 550);
            }

            _updateBattleUI();

            if (state.finished) {
                AudioSystem.stopMusic();
                setTimeout(() => {
                    if (state.winner === 'player') {
                        AudioSystem.playVictory();
                    } else {
                        AudioSystem.playDefeat();
                    }
                    _showResults(state);
                }, 1000);
            } else {
                document.getElementById('battle-actions').style.display = 'flex';
            }
        }, 800);
    }

    function _updateBattleUI() {
        const state = BattleEngine.getState();
        if (!state) return;

        const pc = state.player[state.playerActive];
        const oc = state.opponent[state.opponentActive];

        // Player creature
        document.getElementById('player-emoji').textContent = pc.emoji;
        document.getElementById('player-name').textContent = pc.name;
        const ptd = CreatureData.TYPES[pc.type];
        const ptBadge = document.getElementById('player-type');
        ptBadge.textContent = ptd.icon + ' ' + ptd.name;
        ptBadge.style.background = ptd.color + '33';
        ptBadge.style.color = ptd.color;

        const pHP = document.getElementById('player-hp');
        const pPct = (pc.hp / pc.maxHP) * 100;
        pHP.style.width = pPct + '%';
        pHP.className = 'battle-hp-fill' + (pPct < 30 ? ' low' : '');
        document.getElementById('player-hp-text').textContent = `${pc.hp} / ${pc.maxHP}`;

        // Opponent creature
        document.getElementById('opp-emoji').textContent = oc.emoji;
        document.getElementById('opp-name').textContent = oc.name;
        const otd = CreatureData.TYPES[oc.type];
        const otBadge = document.getElementById('opp-type');
        otBadge.textContent = otd.icon + ' ' + otd.name;
        otBadge.style.background = otd.color + '33';
        otBadge.style.color = otd.color;

        const oHP = document.getElementById('opp-hp');
        const oPct = (oc.hp / oc.maxHP) * 100;
        oHP.style.width = oPct + '%';
        oHP.className = 'battle-hp-fill' + (oPct < 30 ? ' low' : '');
        document.getElementById('opp-hp-text').textContent = `${oc.hp} / ${oc.maxHP}`;

        // Battle log
        const log = state.log;
        document.getElementById('battle-log').textContent = log.length > 0 ? log[log.length - 1] : '';

        // Update ability button text
        if (pc.ability) {
            document.getElementById('btn-ability').textContent = '✨ ' + pc.ability.name;
        }
    }

    function _showResults(state) {
        const won = state.winner === 'player';
        showScreen('results');

        document.getElementById('results-title').textContent = won ? 'Victory!' : 'Defeat...';
        document.getElementById('results-title').style.color = won ? 'var(--otb-coin)' : 'var(--otb-danger)';

        // XP calculation
        const baseXP = won ? 30 : 15;
        const xpEarned = baseXP;
        const coinsEarned = won ? Math.floor(5 * (1 + currentTier * 0.5)) : 2;

        // Record in ecosystem
        if (typeof OTBEcosystem !== 'undefined') {
            OTBEcosystem.addXP(xpEarned, 'creature-cards');
            OTBEcosystem.addCoins(coinsEarned, 'creature-cards');
        }

        Progress.recordBattleResult(currentZone.id, won, xpEarned);

        // Card reward on victory
        const rewardEl = document.getElementById('results-reward');
        if (won) {
            const rewardCards = Collection.openPack('victory');
            const rewardCreature = CreatureData.getCreature(rewardCards[0]);
            if (rewardCreature) {
                rewardEl.style.display = 'block';
                rewardEl.textContent = rewardCreature.emoji;
                rewardEl.title = rewardCreature.name;
            }
            // Record wins for player's creatures
            state.player.forEach(c => { if (c.hp > 0) Collection.recordWin(c.id); });
        } else {
            rewardEl.style.display = 'none';
        }

        document.getElementById('results-stats').innerHTML = `
            <div>${won ? 'Coins earned' : 'Consolation coins'}: <strong>${coinsEarned}</strong></div>
            <div>Turns: <strong>${state.turn}</strong></div>
            ${won ? '<div style="color:var(--otb-success);">New card earned!</div>' : '<div style="color:var(--otb-text-muted);">Try using type advantages!</div>'}
        `;
        document.getElementById('results-xp').textContent = `+${xpEarned} XP`;
    }

    // === PACK OPENING ===
    function _showPackOpening(cardIds, title) {
        showScreen('pack');
        AudioSystem.playPackOpen();
        document.getElementById('pack-title').textContent = title || 'Card Pack!';
        const container = document.getElementById('pack-cards');

        container.innerHTML = cardIds.map((id, i) => {
            const c = CreatureData.getCreature(id);
            const rarityColor = CreatureData.RARITIES[c?.rarity]?.color || '#999';
            return `<div class="pack-card" data-idx="${i}" style="border-color:${rarityColor};">
                <span style="display:none;">${c?.emoji || '❓'}</span>
                <span>🎴</span>
            </div>`;
        }).join('');

        // Tap to reveal
        container.querySelectorAll('.pack-card').forEach(card => {
            card.addEventListener('click', () => {
                if (card.classList.contains('revealed')) return;
                card.classList.add('revealed');
                AudioSystem.playCardReveal();
                const spans = card.querySelectorAll('span');
                spans[0].style.display = 'block';  // show emoji
                spans[1].style.display = 'none';    // hide back
                card.style.transform = 'scale(1.1)';
                setTimeout(() => { card.style.transform = 'scale(1)'; }, 200);
            });
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
