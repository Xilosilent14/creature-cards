/* ============================================
   CREATURE CARDS — Web Audio SFX System
   All sounds synthesized, no audio files needed
   ============================================ */
const AudioSystem = (() => {
    let ctx = null;
    let masterGain = null, sfxGain = null, musicGain = null;
    let sfxEnabled = true, musicEnabled = true;
    let musicOsc = null, musicInterval = null;
    let unlocked = false;

    function init() {
        const settings = typeof Progress !== 'undefined' ? Progress.getSettings() : {};
        sfxEnabled = settings.sfx !== false;
        musicEnabled = settings.music !== false;
    }

    function _ensureCtx() {
        if (ctx) return true;
        try {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = ctx.createGain();
            masterGain.gain.value = 0.7;
            masterGain.connect(ctx.destination);

            sfxGain = ctx.createGain();
            sfxGain.gain.value = 0.6;
            sfxGain.connect(masterGain);

            musicGain = ctx.createGain();
            musicGain.gain.value = 0.3;
            musicGain.connect(masterGain);
            return true;
        } catch (e) {
            return false;
        }
    }

    function unlock() {
        if (unlocked) return;
        if (!_ensureCtx()) return;
        if (ctx.state === 'suspended') ctx.resume();
        // Play silent buffer to unlock on iOS/Android
        const buf = ctx.createBuffer(1, 1, 22050);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(ctx.destination);
        src.start(0);
        unlocked = true;
    }

    // --- Utility helpers ---

    function _osc(type, freq, gainNode, startTime, duration, endFreq) {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = type;
        o.frequency.setValueAtTime(freq, startTime);
        if (endFreq !== undefined) {
            o.frequency.linearRampToValueAtTime(endFreq, startTime + duration);
        }
        g.gain.setValueAtTime(0.3, startTime);
        g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        o.connect(g);
        g.connect(gainNode);
        o.start(startTime);
        o.stop(startTime + duration);
    }

    function _noise(gainNode, startTime, duration, volume) {
        const bufSize = ctx.sampleRate * duration;
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (volume || 0.3);
        }
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const g = ctx.createGain();
        g.gain.setValueAtTime(volume || 0.3, startTime);
        g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        src.connect(g);
        g.connect(gainNode);
        src.start(startTime);
        src.stop(startTime + duration);
    }

    function _note(freq, startTime, duration, type) {
        _osc(type || 'sine', freq, sfxGain, startTime, duration);
    }

    // --- SFX Methods ---

    function playCorrect() {
        if (!sfxEnabled || !_ensureCtx()) return;
        const t = ctx.currentTime;
        // Bright ascending chime: C5, E5, G5
        _note(523.25, t, 0.15);          // C5
        _note(659.25, t + 0.1, 0.15);    // E5
        _note(783.99, t + 0.2, 0.2);     // G5
    }

    function playWrong() {
        if (!sfxEnabled || !_ensureCtx()) return;
        const t = ctx.currentTime;
        // Gentle descending boop
        _osc('triangle', 300, sfxGain, t, 0.3, 200);
    }

    function playAttack() {
        if (!sfxEnabled || !_ensureCtx()) return;
        const t = ctx.currentTime;
        // Swoosh (noise) + impact (low thud)
        _noise(sfxGain, t, 0.15, 0.25);
        _osc('sine', 150, sfxGain, t + 0.1, 0.2, 60);
    }

    function playWeakAttack() {
        if (!sfxEnabled || !_ensureCtx()) return;
        const t = ctx.currentTime;
        // Softer, shorter version
        _noise(sfxGain, t, 0.1, 0.15);
        _osc('sine', 120, sfxGain, t + 0.05, 0.15, 80);
    }

    function playDamage() {
        if (!sfxEnabled || !_ensureCtx()) return;
        const t = ctx.currentTime;
        // Low thump
        _osc('sine', 120, sfxGain, t, 0.15, 60);
        _noise(sfxGain, t, 0.08, 0.15);
    }

    function playFainted() {
        if (!sfxEnabled || !_ensureCtx()) return;
        const t = ctx.currentTime;
        // Descending sad tone
        _osc('sine', 400, sfxGain, t, 0.25, 200);
        _osc('sine', 300, sfxGain, t + 0.2, 0.3, 100);
    }

    function playVictory() {
        if (!sfxEnabled || !_ensureCtx()) return;
        const t = ctx.currentTime;
        // Triumphant fanfare: 4 ascending notes + chord
        _note(523.25, t, 0.15);          // C5
        _note(587.33, t + 0.15, 0.15);   // D5
        _note(659.25, t + 0.3, 0.15);    // E5
        _note(783.99, t + 0.45, 0.25);   // G5
        // Final chord
        _note(523.25, t + 0.7, 0.4);     // C5
        _note(659.25, t + 0.7, 0.4);     // E5
        _note(783.99, t + 0.7, 0.4);     // G5
    }

    function playDefeat() {
        if (!sfxEnabled || !_ensureCtx()) return;
        const t = ctx.currentTime;
        // Minor key descending
        _osc('triangle', 440, sfxGain, t, 0.25, 392);         // A4 -> G4
        _osc('triangle', 349.23, sfxGain, t + 0.25, 0.25, 293.66); // F4 -> D4
        _osc('triangle', 261.63, sfxGain, t + 0.5, 0.35, 220);     // C4 -> A3
    }

    function playCardReveal() {
        if (!sfxEnabled || !_ensureCtx()) return;
        const t = ctx.currentTime;
        // Quick sparkle arpeggio
        _note(880, t, 0.08);        // A5
        _note(1108.73, t + 0.06, 0.08); // C#6
        _note(1318.51, t + 0.12, 0.12); // E6
        _note(1760, t + 0.18, 0.15);    // A6
    }

    function playPackOpen() {
        if (!sfxEnabled || !_ensureCtx()) return;
        const t = ctx.currentTime;
        // Magical whoosh + shimmer
        _noise(sfxGain, t, 0.25, 0.2);
        _osc('sine', 400, sfxGain, t + 0.1, 0.15, 1200);
        _note(1318.51, t + 0.25, 0.15);  // E6
        _note(1567.98, t + 0.3, 0.2);    // G6
    }

    function playClick() {
        if (!sfxEnabled || !_ensureCtx()) return;
        const t = ctx.currentTime;
        // Soft pop
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(800, t);
        o.frequency.exponentialRampToValueAtTime(400, t + 0.05);
        g.gain.setValueAtTime(0.15, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        o.connect(g);
        g.connect(sfxGain);
        o.start(t);
        o.stop(t + 0.05);
    }

    function playAbility() {
        if (!sfxEnabled || !_ensureCtx()) return;
        const t = ctx.currentTime;
        // Power-up sweep
        _osc('sawtooth', 200, sfxGain, t, 0.2, 600);
        _osc('sine', 300, sfxGain, t + 0.1, 0.3, 900);
    }

    function playCombo(count) {
        if (!sfxEnabled || !_ensureCtx()) return;
        const t = ctx.currentTime;
        // Escalating ping based on combo count
        const baseFreq = 600 + Math.min((count || 1), 10) * 80;
        _note(baseFreq, t, 0.08);
        _note(baseFreq * 1.25, t + 0.06, 0.08);
        _note(baseFreq * 1.5, t + 0.12, 0.12);
    }

    function playDailyPack() {
        if (!sfxEnabled || !_ensureCtx()) return;
        const t = ctx.currentTime;
        // Special celebratory jingle
        _note(523.25, t, 0.1);          // C5
        _note(659.25, t + 0.1, 0.1);    // E5
        _note(783.99, t + 0.2, 0.1);    // G5
        _note(1046.5, t + 0.3, 0.15);   // C6
        // Shimmer
        _note(1318.51, t + 0.45, 0.15); // E6
        _note(1567.98, t + 0.55, 0.25); // G6
    }

    function playHeal() {
        if (!sfxEnabled || !_ensureCtx()) return;
        const t = ctx.currentTime;
        // Gentle ascending shimmer
        _osc('sine', 400, sfxGain, t, 0.15, 600);
        _osc('sine', 600, sfxGain, t + 0.1, 0.15, 900);
        _osc('sine', 900, sfxGain, t + 0.2, 0.2, 1200);
    }

    function playTypeAdvantage() {
        if (!sfxEnabled || !_ensureCtx()) return;
        const t = ctx.currentTime;
        // Powerful impact + reverb-like echo
        _noise(sfxGain, t, 0.12, 0.3);
        _osc('sine', 200, sfxGain, t, 0.2, 80);
        // Echo
        _osc('sine', 180, sfxGain, t + 0.15, 0.2, 70);
        _osc('sine', 160, sfxGain, t + 0.3, 0.2, 60);
    }

    // --- Background Music ---

    function startBattleMusic() {
        if (!musicEnabled || !_ensureCtx()) return;
        stopMusic();
        // Tense pentatonic loop at ~100 BPM
        const notes = [220, 261.63, 293.66, 349.23, 392, 349.23, 293.66, 261.63];
        let i = 0;
        const beatMs = 300; // ~100 BPM sixteenth feel

        function playBeat() {
            if (!ctx || !musicEnabled) return;
            const t = ctx.currentTime;
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'triangle';
            o.frequency.setValueAtTime(notes[i % notes.length], t);
            g.gain.setValueAtTime(0.12, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
            o.connect(g);
            g.connect(musicGain);
            o.start(t);
            o.stop(t + 0.28);

            // Subtle bass on beats 0 and 4
            if (i % 4 === 0) {
                const b = ctx.createOscillator();
                const bg = ctx.createGain();
                b.type = 'sine';
                b.frequency.setValueAtTime(notes[i % notes.length] / 2, t);
                bg.gain.setValueAtTime(0.08, t);
                bg.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
                b.connect(bg);
                bg.connect(musicGain);
                b.start(t);
                b.stop(t + 0.35);
            }
            i++;
        }

        playBeat();
        musicInterval = setInterval(playBeat, beatMs);
    }

    function stopMusic() {
        if (musicInterval) {
            clearInterval(musicInterval);
            musicInterval = null;
        }
        // Fade out music gain
        if (musicGain && ctx) {
            try {
                musicGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.5);
                setTimeout(() => {
                    if (musicGain) musicGain.gain.setValueAtTime(0.3, ctx.currentTime);
                }, 600);
            } catch (e) {}
        }
    }

    // --- Settings ---

    function setSFX(on) {
        sfxEnabled = on;
    }

    function setMusic(on) {
        musicEnabled = on;
        if (!on) stopMusic();
    }

    return {
        init, unlock,
        playCorrect, playWrong,
        playAttack, playWeakAttack,
        playDamage, playFainted,
        playVictory, playDefeat,
        playCardReveal, playPackOpen,
        playClick, playAbility,
        playCombo, playDailyPack,
        playHeal, playTypeAdvantage,
        startBattleMusic, stopMusic,
        setSFX, setMusic
    };
})();
