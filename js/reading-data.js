// ===== READING QUESTION DATA V37 =====
const ReadingData = {
    topics: [
        { id: 'letters', name: 'Letters', icon: '🔤' },
        { id: 'phonics', name: 'Phonics', icon: '🗣️' },
        { id: 'sight-words', name: 'Sight Words', icon: '👀' },
        { id: 'rhyming', name: 'Rhyming', icon: '🎵' },
        { id: 'sentences', name: 'Sentences', icon: '📝' },
        { id: 'vocabulary', name: 'Vocabulary', icon: '📗' },
        { id: 'syllables', name: 'Syllables', icon: '👏' },
        // V20: 2nd grade topics
        { id: 'compound-words', name: 'Compound Words', icon: '🔗' },
        { id: 'prefix-suffix', name: 'Prefix & Suffix', icon: '🏗️' },
        { id: 'grammar', name: 'Grammar', icon: '📝' },
        { id: 'contractions', name: 'Contractions', icon: '✂️' },
        { id: 'comprehension', name: 'Reading Comp', icon: '📖' },
        // V34: 8 new reading topics
        { id: 'spelling', name: 'Spelling', icon: '✏️' },
        { id: 'antonyms', name: 'Antonyms', icon: '↔️' },
        { id: 'synonyms', name: 'Synonyms', icon: '🔄' },
        { id: 'alphabetical', name: 'ABC Order', icon: '🔤' },
        { id: 'word-families', name: 'Word Families', icon: '👨‍👩‍👧' },
        { id: 'sequencing', name: 'Story Order', icon: '📋' },
        { id: 'homophones', name: 'Homophones', icon: '👂' },
        { id: 'capitalization', name: 'Capitals', icon: '🅰️' }
    ],

    generate(topic, level) {
        const generators = {
            letters: this._letters,
            phonics: this._phonics,
            'sight-words': this._sightWords,
            rhyming: this._rhyming,
            sentences: this._sentences,
            vocabulary: this._vocabulary,
            syllables: this._syllables,
            // V20: 2nd grade
            'compound-words': this._compoundWords,
            'prefix-suffix': this._prefixSuffix,
            grammar: this._grammar,
            contractions: this._contractions,
            comprehension: this._comprehension,
            // V34: 8 new topics
            spelling: this._spelling,
            antonyms: this._antonyms,
            synonyms: this._synonyms,
            alphabetical: this._alphabetical,
            'word-families': this._wordFamilies,
            sequencing: this._sequencing,
            homophones: this._homophones,
            capitalization: this._capitalization
        };
        const gen = generators[topic];
        if (!gen) return this._letters(level);
        return gen.call(this, level);
    },

    _rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    _shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    },

    // Safety-limited wrong answer generator to prevent infinite loops
    _fillWrongs(wrongs, pool, target, count = 3) {
        let attempts = 0;
        while (wrongs.length < count && attempts < 50) {
            const w = pool[this._rand(0, pool.length - 1)];
            if (w !== target && !wrongs.includes(w)) wrongs.push(w);
            attempts++;
        }
        return wrongs;
    },

    // ---- LETTERS ----
    _letters(level) {
        // V20: 2nd grade dispatch
        if (level >= 6) return this._letters2nd(level);

        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const idx = this._rand(0, 25);

        if (level < 2) {
            // Pre-K: Simple uppercase letter recognition
            const target = upper[idx];
            const wrongs = [];
            let _sa1 = 0;
            while (wrongs.length < 3 && _sa1++ < 50) {
                const w = upper[this._rand(0, 25)];
                if (w !== target && !wrongs.includes(w)) wrongs.push(w);
            }
            const answers = this._shuffle([target, ...wrongs]);
            return {
                question: `Which letter is this?\n${target}`,
                questionSpeak: `Which letter is this?`,
                answers,
                correctIndex: answers.indexOf(target),
                topic: 'letters',
                subtype: 'letter-name',
                explanation: `That letter is ${target}! ${target} is for ${this._letterWord(target)}!`,
                explanationSpeak: `That letter is ${target}! ${target} is for ${this._letterWord(target)}!`
            };
        } else if (level <= 3) {
            if (Math.random() < 0.5) {
                const target = upper[idx];
                const correct = lower[idx];
                const wrongs = [];
                let _sa2 = 0;
                while (wrongs.length < 3 && _sa2++ < 50) {
                    const w = lower[this._rand(0, 25)];
                    if (w !== correct && !wrongs.includes(w)) wrongs.push(w);
                }
                const answers = this._shuffle([correct, ...wrongs]);
                return {
                    question: `Which lowercase letter matches "${target}"?`,
                    questionSpeak: `Which lowercase letter matches ${target}?`,
                    answers,
                    correctIndex: answers.indexOf(correct),
                    topic: 'letters',
                    subtype: 'uppercase-match',
                    explanation: `Big ${target} and little ${correct} are the same letter!`,
                    explanationSpeak: `Big ${target} and little ${correct} are the same letter!`
                };
            } else {
                const target = Math.random() < 0.5 ? upper[idx] : lower[idx];
                const correct = upper[idx];
                const wrongs = [];
                let _sa3 = 0;
                while (wrongs.length < 3 && _sa3++ < 50) {
                    const w = upper[this._rand(0, 25)];
                    if (w !== correct && !wrongs.includes(w)) wrongs.push(w);
                }
                const answers = this._shuffle([correct, ...wrongs]);
                return {
                    question: `What letter is this?\n${target}`,
                    questionSpeak: `What letter is this?`,
                    answers,
                    correctIndex: answers.indexOf(correct),
                    topic: 'letters',
                    subtype: 'letter-identify',
                    explanation: `That letter is ${correct}! ${correct} is for ${this._letterWord(correct)}!`,
                    explanationSpeak: `That letter is ${correct}! ${correct} is for ${this._letterWord(correct)}!`
                };
            }
        } else {
            // 1st grade (level >= 4): confusing letters
            const confusing = {
                'b': ['d', 'p', 'q'], 'd': ['b', 'p', 'q'], 'p': ['b', 'd', 'q'], 'q': ['b', 'd', 'p'],
                'm': ['n', 'w', 'u'], 'n': ['m', 'u', 'h'], 'u': ['n', 'v', 'w'],
                'M': ['N', 'W', 'V'], 'N': ['M', 'H', 'Z'], 'W': ['M', 'V', 'N']
            };

            const target = lower[idx];
            const correct = target;
            let wrongs;
            if (confusing[target]) {
                wrongs = confusing[target];
            } else {
                wrongs = [];
                let _sa4 = 0;
                while (wrongs.length < 3 && _sa4++ < 50) {
                    const w = lower[this._rand(0, 25)];
                    if (w !== correct && !wrongs.includes(w)) wrongs.push(w);
                }
            }
            const answers = this._shuffle([correct, ...wrongs.slice(0, 3)]);
            return {
                question: `Find the letter "${target.toUpperCase()}"`,
                questionSpeak: `Find the letter ${target.toUpperCase()}`,
                answers,
                correctIndex: answers.indexOf(correct),
                topic: 'letters',
                subtype: 'confusing-letters',
                explanation: `The letter ${target.toUpperCase()} looks like "${correct}". ${correct} is for ${this._letterWord(target.toUpperCase())}!`,
                explanationSpeak: `The letter ${target.toUpperCase()} looks like ${correct}. ${correct} is for ${this._letterWord(target.toUpperCase())}!`
            };
        }
    },

    _letterWord(letter) {
        const words = {
            A:'apple',B:'ball',C:'cat',D:'dog',E:'egg',F:'fish',G:'goat',H:'hat',
            I:'ice cream',J:'jump',K:'kite',L:'lion',M:'moon',N:'nest',O:'octopus',
            P:'pig',Q:'queen',R:'rain',S:'sun',T:'tree',U:'umbrella',V:'van',
            W:'water',X:'x-ray',Y:'yellow',Z:'zebra'
        };
        return words[letter.toUpperCase()] || letter;
    },

    // ---- PHONICS ----
    _phonicsData: {
        beginning: [
            { letter: 'B', words: ['ball', 'bear', 'bus', 'book'], wrong: ['cat', 'dog', 'fish'] },
            { letter: 'C', words: ['cat', 'car', 'cup', 'cow'], wrong: ['dog', 'bat', 'sun'] },
            { letter: 'D', words: ['dog', 'duck', 'door', 'doll'], wrong: ['cat', 'fan', 'pig'] },
            { letter: 'F', words: ['fish', 'fan', 'frog', 'foot'], wrong: ['hat', 'sun', 'car'] },
            { letter: 'G', words: ['goat', 'girl', 'game', 'gift'], wrong: ['bat', 'cup', 'dog'] },
            { letter: 'H', words: ['hat', 'house', 'horse', 'hand'], wrong: ['cat', 'tree', 'bus'] },
            { letter: 'J', words: ['jump', 'jam', 'jet', 'jar'], wrong: ['bat', 'cup', 'sun'] },
            { letter: 'K', words: ['kite', 'king', 'key', 'kid'], wrong: ['dog', 'hat', 'cup'] },
            { letter: 'L', words: ['lion', 'lamp', 'leaf', 'log'], wrong: ['cat', 'bus', 'fan'] },
            { letter: 'M', words: ['moon', 'map', 'mouse', 'milk'], wrong: ['sun', 'hat', 'dog'] },
            { letter: 'N', words: ['nest', 'nose', 'net', 'nut'], wrong: ['cat', 'bus', 'pig'] },
            { letter: 'P', words: ['pig', 'pen', 'pan', 'pie'], wrong: ['dog', 'sun', 'hat'] },
            { letter: 'R', words: ['rain', 'red', 'run', 'ring'], wrong: ['bat', 'cup', 'fan'] },
            { letter: 'S', words: ['sun', 'star', 'sock', 'sit'], wrong: ['hat', 'dog', 'cup'] },
            { letter: 'T', words: ['tree', 'top', 'ten', 'toy'], wrong: ['bus', 'pig', 'fan'] },
            { letter: 'V', words: ['van', 'vest', 'vine', 'vet'], wrong: ['bat', 'cat', 'sun'] },
            { letter: 'W', words: ['water', 'wolf', 'web', 'win'], wrong: ['cat', 'sun', 'hat'] },
            { letter: 'Y', words: ['yellow', 'yak', 'yam', 'yarn'], wrong: ['cat', 'dog', 'bat'] },
            { letter: 'Z', words: ['zebra', 'zoo', 'zip', 'zero'], wrong: ['cat', 'dog', 'hat'] }
        ],
        blends: [
            { blend: 'SH', words: ['ship', 'shoe', 'shell', 'sheep'], wrong: ['chip', 'this', 'tree'] },
            { blend: 'CH', words: ['chip', 'chair', 'cheese', 'chin'], wrong: ['ship', 'that', 'fish'] },
            { blend: 'TH', words: ['this', 'that', 'them', 'thin'], wrong: ['ship', 'chip', 'fish'] },
            { blend: 'BL', words: ['blue', 'black', 'block', 'blend'], wrong: ['ship', 'red', 'cat'] },
            { blend: 'CR', words: ['crab', 'cry', 'crown', 'cross'], wrong: ['ship', 'dog', 'hat'] },
            { blend: 'ST', words: ['star', 'stop', 'step', 'stick'], wrong: ['chip', 'ship', 'pig'] },
            { blend: 'BR', words: ['brown', 'bread', 'brush', 'bring'], wrong: ['clap', 'flag', 'tree'] },
            { blend: 'CL', words: ['clap', 'clock', 'cloud', 'clean'], wrong: ['flag', 'drum', 'ship'] },
            { blend: 'DR', words: ['drum', 'drop', 'dream', 'draw'], wrong: ['clap', 'flag', 'star'] },
            { blend: 'FL', words: ['flag', 'fly', 'flower', 'float'], wrong: ['clap', 'drum', 'ship'] },
            { blend: 'FR', words: ['frog', 'friend', 'fruit', 'fry'], wrong: ['clap', 'drum', 'ship'] },
            { blend: 'GL', words: ['glass', 'globe', 'glue', 'glad'], wrong: ['clap', 'flag', 'drum'] },
            { blend: 'GR', words: ['green', 'grow', 'grass', 'grape'], wrong: ['blue', 'flag', 'drum'] },
            { blend: 'PL', words: ['play', 'plant', 'plate', 'plane'], wrong: ['clap', 'drum', 'ship'] },
            { blend: 'PR', words: ['print', 'prize', 'proud', 'press'], wrong: ['clap', 'flag', 'drum'] },
            { blend: 'SL', words: ['slide', 'sleep', 'slow', 'slip'], wrong: ['swim', 'snap', 'star'] },
            { blend: 'SM', words: ['small', 'smile', 'smell', 'smart'], wrong: ['slide', 'snap', 'swim'] },
            { blend: 'SN', words: ['snow', 'snail', 'snap', 'snake'], wrong: ['slide', 'swim', 'star'] },
            { blend: 'SP', words: ['spin', 'spot', 'space', 'spell'], wrong: ['swim', 'slide', 'snap'] },
            { blend: 'SW', words: ['swim', 'sweet', 'swing', 'swan'], wrong: ['spin', 'slide', 'snap'] },
            { blend: 'TR', words: ['truck', 'tree', 'train', 'trip'], wrong: ['drum', 'flag', 'clap'] },
            { blend: 'SK', words: ['skip', 'sky', 'skate', 'skin'], wrong: ['spin', 'slide', 'snap'] }
        ],
        // CVC words for decoding practice
        cvc: [
            { word: 'cat', meaning: 'a furry pet that says meow', wrongs: ['a big dog', 'a red car', 'a tall tree'] },
            { word: 'dog', meaning: 'a pet that barks', wrongs: ['a pet that meows', 'a fish in water', 'a bird that flies'] },
            { word: 'hat', meaning: 'something you wear on your head', wrongs: ['something you eat', 'something you ride', 'something you read'] },
            { word: 'bed', meaning: 'where you sleep at night', wrongs: ['where you cook food', 'where you play ball', 'where you swim'] },
            { word: 'sun', meaning: 'the bright light in the sky', wrongs: ['a dark cloud', 'a cold wind', 'a tall tree'] },
            { word: 'cup', meaning: 'something you drink from', wrongs: ['something you sit on', 'something you wear', 'something you read'] },
            { word: 'pig', meaning: 'a pink farm animal', wrongs: ['a brown horse', 'a white rabbit', 'a black bird'] },
            { word: 'bus', meaning: 'a big car that carries many people', wrongs: ['a small bike', 'a toy boat', 'a paper plane'] },
            { word: 'map', meaning: 'shows you where to go', wrongs: ['helps you sleep', 'makes you food', 'cleans your room'] },
            { word: 'rug', meaning: 'a soft thing on the floor', wrongs: ['a hard thing on a wall', 'a wet thing in a pool', 'a cold thing in a fridge'] },
            { word: 'pen', meaning: 'something you write with', wrongs: ['something you eat with', 'something you play with', 'something you sleep in'] },
            { word: 'box', meaning: 'you put things inside it', wrongs: ['you sit on top of it', 'you eat it for lunch', 'you wear it on your feet'] },
            { word: 'top', meaning: 'the highest part', wrongs: ['the lowest part', 'the middle part', 'the side part'] },
            { word: 'hen', meaning: 'a farm bird that lays eggs', wrongs: ['a fish that swims', 'a bug that flies', 'a frog that hops'] },
            { word: 'fox', meaning: 'a wild animal with a bushy tail', wrongs: ['a pet with long ears', 'a bird with big wings', 'a fish with bright scales'] },
            { word: 'jam', meaning: 'a sweet spread for bread', wrongs: ['a cold drink', 'a hard candy', 'a salty chip'] },
            // V37: 20 more CVC words for variety
            { word: 'van', meaning: 'a big car for carrying things', wrongs: ['a small bike', 'a fast boat', 'a tall tower'] },
            { word: 'net', meaning: 'catches fish or balls', wrongs: ['holds water', 'makes noise', 'gives light'] },
            { word: 'mop', meaning: 'cleans the floor', wrongs: ['cleans the sky', 'cleans the car', 'cleans your teeth'] },
            { word: 'jug', meaning: 'holds water or juice', wrongs: ['holds books', 'holds toys', 'holds shoes'] },
            { word: 'web', meaning: 'a spider makes this', wrongs: ['a bird makes this', 'a dog makes this', 'a fish makes this'] },
            { word: 'bib', meaning: 'a baby wears this when eating', wrongs: ['a baby wears on feet', 'a baby wears on head', 'a baby sleeps on this'] },
            { word: 'fin', meaning: 'helps a fish swim', wrongs: ['helps a bird fly', 'helps a dog run', 'helps a cat jump'] },
            { word: 'tub', meaning: 'where you take a bath', wrongs: ['where you eat food', 'where you play ball', 'where you read books'] },
            { word: 'log', meaning: 'a piece of a tree', wrongs: ['a piece of a rock', 'a piece of a cloud', 'a piece of water'] },
            { word: 'hut', meaning: 'a small house', wrongs: ['a big castle', 'a tall tower', 'a deep cave'] },
            { word: 'cob', meaning: 'corn grows on this', wrongs: ['apples grow on this', 'grapes grow on this', 'rice grows on this'] },
            { word: 'kit', meaning: 'a set of tools or supplies', wrongs: ['a type of food', 'a kind of animal', 'a color of paint'] },
            { word: 'yam', meaning: 'a vegetable like a sweet potato', wrongs: ['a fruit like an apple', 'a drink like milk', 'a meat like chicken'] },
            { word: 'rod', meaning: 'a thin stick or pole', wrongs: ['a round ball', 'a flat plate', 'a soft pillow'] },
            { word: 'cub', meaning: 'a baby bear', wrongs: ['a baby fish', 'a baby bird', 'a baby bug'] },
            { word: 'fig', meaning: 'a small sweet fruit', wrongs: ['a tall tree', 'a long vine', 'a sharp thorn'] },
            { word: 'dip', meaning: 'put something in and take it out', wrongs: ['throw it far away', 'break it into pieces', 'stack them up high'] },
            { word: 'dim', meaning: 'not very bright', wrongs: ['very loud', 'very fast', 'very tall'] },
            { word: 'nap', meaning: 'a short sleep', wrongs: ['a long walk', 'a fast run', 'a big meal'] },
            { word: 'pod', meaning: 'where peas grow', wrongs: ['where birds live', 'where fish swim', 'where dogs sleep'] }
        ],
        // V5.7: Phoneme segmenting data — break words into sounds
        segmenting: [
            { word: 'cat', sounds: ['c', 'a', 't'], count: 3 },
            { word: 'dog', sounds: ['d', 'o', 'g'], count: 3 },
            { word: 'sun', sounds: ['s', 'u', 'n'], count: 3 },
            { word: 'hat', sounds: ['h', 'a', 't'], count: 3 },
            { word: 'pig', sounds: ['p', 'i', 'g'], count: 3 },
            { word: 'bed', sounds: ['b', 'e', 'd'], count: 3 },
            { word: 'cup', sounds: ['c', 'u', 'p'], count: 3 },
            { word: 'net', sounds: ['n', 'e', 't'], count: 3 },
            { word: 'fox', sounds: ['f', 'o', 'x'], count: 3 },
            { word: 'map', sounds: ['m', 'a', 'p'], count: 3 },
            { word: 'ship', sounds: ['sh', 'i', 'p'], count: 3 },
            { word: 'chin', sounds: ['ch', 'i', 'n'], count: 3 },
            { word: 'fish', sounds: ['f', 'i', 'sh'], count: 3 },
            { word: 'thin', sounds: ['th', 'i', 'n'], count: 3 },
            { word: 'flag', sounds: ['f', 'l', 'a', 'g'], count: 4 },
            { word: 'stop', sounds: ['s', 't', 'o', 'p'], count: 4 },
            { word: 'drum', sounds: ['d', 'r', 'u', 'm'], count: 4 },
            { word: 'swim', sounds: ['s', 'w', 'i', 'm'], count: 4 }
        ],
        // V5.7: Phoneme blending data — combine sounds into words
        blending: [
            { sounds: '/k/ /a/ /t/', word: 'cat', wrongs: ['bat', 'cut', 'kit'] },
            { sounds: '/d/ /o/ /g/', word: 'dog', wrongs: ['dig', 'dug', 'log'] },
            { sounds: '/s/ /u/ /n/', word: 'sun', wrongs: ['sin', 'son', 'sat'] },
            { sounds: '/h/ /a/ /t/', word: 'hat', wrongs: ['hot', 'hit', 'hut'] },
            { sounds: '/p/ /i/ /g/', word: 'pig', wrongs: ['peg', 'pug', 'big'] },
            { sounds: '/b/ /e/ /d/', word: 'bed', wrongs: ['bad', 'bid', 'bud'] },
            { sounds: '/r/ /u/ /n/', word: 'run', wrongs: ['ran', 'fun', 'bun'] },
            { sounds: '/m/ /a/ /p/', word: 'map', wrongs: ['mop', 'cap', 'mat'] },
            { sounds: '/f/ /i/ /sh/', word: 'fish', wrongs: ['dish', 'fist', 'fin'] },
            { sounds: '/sh/ /i/ /p/', word: 'ship', wrongs: ['shop', 'chip', 'shin'] },
            { sounds: '/ch/ /i/ /n/', word: 'chin', wrongs: ['chain', 'shin', 'pin'] },
            { sounds: '/b/ /u/ /g/', word: 'bug', wrongs: ['bag', 'big', 'dug'] },
            { sounds: '/n/ /e/ /t/', word: 'net', wrongs: ['nut', 'not', 'pet'] },
            { sounds: '/t/ /o/ /p/', word: 'top', wrongs: ['tap', 'tip', 'pop'] },
            { sounds: '/j/ /a/ /m/', word: 'jam', wrongs: ['ham', 'gym', 'jet'] },
            { sounds: '/w/ /i/ /n/', word: 'win', wrongs: ['bin', 'wig', 'wet'] }
        ],
        // V5.8: Expanded nonsense/pseudo-word decoding (50+ CVC/VC words — FastBridge format)
        nonsense: [
            { word: 'bim', rhymesWith: 'dim', wrongs: ['bam', 'bum', 'bem'] },
            { word: 'tup', rhymesWith: 'cup', wrongs: ['tap', 'tip', 'top'] },
            { word: 'rav', rhymesWith: 'have', wrongs: ['riv', 'ruv', 'rev'] },
            { word: 'nef', rhymesWith: 'chef', wrongs: ['naf', 'nof', 'nuf'] },
            { word: 'pid', rhymesWith: 'kid', wrongs: ['pad', 'pod', 'pud'] },
            { word: 'gop', rhymesWith: 'hop', wrongs: ['gap', 'gip', 'gup'] },
            { word: 'zat', rhymesWith: 'cat', wrongs: ['zit', 'zot', 'zut'] },
            { word: 'hig', rhymesWith: 'big', wrongs: ['hag', 'hog', 'hug'] },
            { word: 'wem', rhymesWith: 'hem', wrongs: ['wam', 'wim', 'wum'] },
            { word: 'fob', rhymesWith: 'job', wrongs: ['fab', 'fib', 'fub'] },
            { word: 'dun', rhymesWith: 'fun', wrongs: ['dan', 'din', 'den'] },
            { word: 'kep', rhymesWith: 'step', wrongs: ['kap', 'kip', 'kop'] },
            { word: 'vat', rhymesWith: 'bat', wrongs: ['vit', 'vot', 'vut'] },
            { word: 'jum', rhymesWith: 'gum', wrongs: ['jam', 'jim', 'jem'] },
            { word: 'sib', rhymesWith: 'rib', wrongs: ['sab', 'sob', 'sub'] },
            { word: 'mog', rhymesWith: 'dog', wrongs: ['mag', 'mig', 'mug'] },
            { word: 'fen', rhymesWith: 'hen', wrongs: ['fan', 'fin', 'fun'] },
            { word: 'lup', rhymesWith: 'pup', wrongs: ['lap', 'lip', 'lop'] },
            { word: 'dit', rhymesWith: 'sit', wrongs: ['dat', 'dot', 'dut'] },
            { word: 'pag', rhymesWith: 'bag', wrongs: ['pig', 'pog', 'pug'] },
            { word: 'nob', rhymesWith: 'rob', wrongs: ['nab', 'nib', 'nub'] },
            { word: 'wot', rhymesWith: 'hot', wrongs: ['wat', 'wit', 'wut'] },
            { word: 'gim', rhymesWith: 'him', wrongs: ['gam', 'gom', 'gum'] },
            { word: 'hep', rhymesWith: 'pep', wrongs: ['hap', 'hip', 'hop'] },
            { word: 'zug', rhymesWith: 'bug', wrongs: ['zag', 'zig', 'zog'] },
            { word: 'ket', rhymesWith: 'pet', wrongs: ['kat', 'kit', 'kot'] },
            { word: 'bof', rhymesWith: 'off', wrongs: ['baf', 'bif', 'buf'] },
            { word: 'rud', rhymesWith: 'mud', wrongs: ['rad', 'rid', 'rod'] },
            { word: 'tas', rhymesWith: 'has', wrongs: ['tis', 'tos', 'tus'] },
            { word: 'mip', rhymesWith: 'tip', wrongs: ['map', 'mop', 'mup'] },
            { word: 'dop', rhymesWith: 'pop', wrongs: ['dap', 'dip', 'dup'] },
            { word: 'fid', rhymesWith: 'lid', wrongs: ['fad', 'fod', 'fud'] },
            { word: 'nup', rhymesWith: 'cup', wrongs: ['nap', 'nip', 'nop'] },
            { word: 'gub', rhymesWith: 'tub', wrongs: ['gab', 'gib', 'gob'] },
            { word: 'hin', rhymesWith: 'pin', wrongs: ['han', 'hon', 'hun'] },
            { word: 'vog', rhymesWith: 'fog', wrongs: ['vag', 'vig', 'vug'] },
            { word: 'jep', rhymesWith: 'rep', wrongs: ['jap', 'jip', 'jop'] },
            { word: 'wab', rhymesWith: 'cab', wrongs: ['wib', 'wob', 'wub'] },
            { word: 'zin', rhymesWith: 'fin', wrongs: ['zan', 'zon', 'zun'] },
            { word: 'kut', rhymesWith: 'but', wrongs: ['kat', 'kit', 'kot'] },
            { word: 'sog', rhymesWith: 'log', wrongs: ['sag', 'sig', 'sug'] },
            { word: 'lam', rhymesWith: 'jam', wrongs: ['lim', 'lom', 'lum'] },
            { word: 'pem', rhymesWith: 'gem', wrongs: ['pam', 'pim', 'pom'] },
            { word: 'tib', rhymesWith: 'bib', wrongs: ['tab', 'tob', 'tub'] },
            { word: 'rof', rhymesWith: 'off', wrongs: ['raf', 'rif', 'ruf'] },
            { word: 'bun', rhymesWith: 'sun', wrongs: ['ban', 'bin', 'bon'] },
            { word: 'dak', rhymesWith: 'back', wrongs: ['dik', 'dok', 'duk'] },
            { word: 'feb', rhymesWith: 'web', wrongs: ['fab', 'fib', 'fub'] },
            { word: 'gat', rhymesWith: 'mat', wrongs: ['git', 'got', 'gut'] },
            { word: 'hod', rhymesWith: 'rod', wrongs: ['had', 'hid', 'hud'] },
            // VC words (vowel-consonant)
            { word: 'om', rhymesWith: 'mom', wrongs: ['am', 'im', 'um'] },
            { word: 'ab', rhymesWith: 'cab', wrongs: ['ib', 'ob', 'ub'] },
            { word: 'ig', rhymesWith: 'big', wrongs: ['ag', 'og', 'ug'] },
            { word: 'ut', rhymesWith: 'but', wrongs: ['at', 'it', 'ot'] },
            { word: 'en', rhymesWith: 'pen', wrongs: ['an', 'in', 'on'] }
        ],
        // V5.7: Letter sounds (distinct from letter names)
        letterSounds: [
            { letter: 'A', sound: '/a/', example: 'apple', wrong: ['/e/', '/i/', '/o/'] },
            { letter: 'B', sound: '/b/', example: 'ball', wrong: ['/d/', '/p/', '/g/'] },
            { letter: 'C', sound: '/k/', example: 'cat', wrong: ['/s/', '/t/', '/g/'] },
            { letter: 'D', sound: '/d/', example: 'dog', wrong: ['/b/', '/t/', '/g/'] },
            { letter: 'E', sound: '/e/', example: 'egg', wrong: ['/a/', '/i/', '/u/'] },
            { letter: 'F', sound: '/f/', example: 'fish', wrong: ['/v/', '/th/', '/s/'] },
            { letter: 'G', sound: '/g/', example: 'goat', wrong: ['/k/', '/j/', '/d/'] },
            { letter: 'H', sound: '/h/', example: 'hat', wrong: ['/f/', '/w/', '/k/'] },
            { letter: 'I', sound: '/i/', example: 'igloo', wrong: ['/e/', '/a/', '/u/'] },
            { letter: 'J', sound: '/j/', example: 'jump', wrong: ['/g/', '/ch/', '/y/'] },
            { letter: 'K', sound: '/k/', example: 'kite', wrong: ['/g/', '/t/', '/p/'] },
            { letter: 'L', sound: '/l/', example: 'lion', wrong: ['/r/', '/w/', '/n/'] },
            { letter: 'M', sound: '/m/', example: 'moon', wrong: ['/n/', '/b/', '/w/'] },
            { letter: 'N', sound: '/n/', example: 'nest', wrong: ['/m/', '/l/', '/d/'] },
            { letter: 'O', sound: '/o/', example: 'octopus', wrong: ['/u/', '/a/', '/e/'] },
            { letter: 'P', sound: '/p/', example: 'pig', wrong: ['/b/', '/t/', '/d/'] },
            { letter: 'R', sound: '/r/', example: 'rain', wrong: ['/l/', '/w/', '/n/'] },
            { letter: 'S', sound: '/s/', example: 'sun', wrong: ['/z/', '/sh/', '/f/'] },
            { letter: 'T', sound: '/t/', example: 'tree', wrong: ['/d/', '/k/', '/p/'] },
            { letter: 'U', sound: '/u/', example: 'umbrella', wrong: ['/o/', '/a/', '/i/'] },
            { letter: 'V', sound: '/v/', example: 'van', wrong: ['/f/', '/b/', '/w/'] },
            { letter: 'W', sound: '/w/', example: 'water', wrong: ['/v/', '/r/', '/y/'] },
            { letter: 'Y', sound: '/y/', example: 'yellow', wrong: ['/j/', '/w/', '/l/'] },
            { letter: 'Z', sound: '/z/', example: 'zebra', wrong: ['/s/', '/j/', '/v/'] },
            // V5.8: Digraphs (FastBridge tested)
            { letter: 'CH', sound: '/ch/', example: 'chair', wrong: ['/sh/', '/th/', '/k/'] },
            { letter: 'SH', sound: '/sh/', example: 'ship', wrong: ['/ch/', '/s/', '/th/'] },
            { letter: 'TH', sound: '/th/', example: 'think', wrong: ['/t/', '/f/', '/sh/'] },
            { letter: 'WH', sound: '/wh/', example: 'whale', wrong: ['/w/', '/h/', '/ch/'] }
        ],
        // V5.5: Word families — ending sound patterns
        wordFamilies: [
            { ending: '-at', words: ['cat', 'bat', 'hat', 'mat', 'rat', 'sat', 'fat', 'pat'] },
            { ending: '-an', words: ['can', 'fan', 'man', 'pan', 'ran', 'van', 'tan', 'ban'] },
            { ending: '-ig', words: ['big', 'dig', 'fig', 'pig', 'wig', 'jig'] },
            { ending: '-in', words: ['bin', 'fin', 'pin', 'tin', 'win', 'din'] },
            { ending: '-op', words: ['hop', 'mop', 'pop', 'top', 'cop', 'stop'] },
            { ending: '-ot', words: ['dot', 'got', 'hot', 'lot', 'not', 'pot'] },
            { ending: '-ug', words: ['bug', 'dug', 'hug', 'jug', 'mug', 'rug', 'tug'] },
            { ending: '-un', words: ['bun', 'fun', 'gun', 'run', 'sun'] },
            { ending: '-ed', words: ['bed', 'fed', 'led', 'red', 'wed'] },
            { ending: '-et', words: ['bet', 'get', 'jet', 'met', 'net', 'pet', 'set', 'wet'] }
        ]
    },

    _phonics(level) {
        // V20: 2nd grade dispatch
        if (level >= 6) return this._phonics2nd(level);

        if (level < 2) {
            // Pre-K: Beginning sounds only with simple words
            const preKWords = [
                { word: 'Cat', letter: 'C', wrongs: ['D', 'B', 'M'] },
                { word: 'Dog', letter: 'D', wrongs: ['C', 'B', 'F'] },
                { word: 'Ball', letter: 'B', wrongs: ['D', 'M', 'S'] },
                { word: 'Fish', letter: 'F', wrongs: ['S', 'H', 'M'] },
                { word: 'Sun', letter: 'S', wrongs: ['M', 'F', 'H'] },
                { word: 'Milk', letter: 'M', wrongs: ['S', 'B', 'D'] },
                { word: 'Hat', letter: 'H', wrongs: ['M', 'B', 'F'] },
                { word: 'Pig', letter: 'P', wrongs: ['B', 'D', 'M'] },
                { word: 'Top', letter: 'T', wrongs: ['P', 'D', 'B'] },
                { word: 'Red', letter: 'R', wrongs: ['B', 'D', 'M'] },
                { word: 'Nest', letter: 'N', wrongs: ['M', 'B', 'D'] },
                { word: 'Goat', letter: 'G', wrongs: ['D', 'B', 'P'] },
                { word: 'Kite', letter: 'K', wrongs: ['T', 'P', 'B'] },
                { word: 'Lion', letter: 'L', wrongs: ['M', 'N', 'R'] },
                { word: 'Van', letter: 'V', wrongs: ['B', 'F', 'M'] },
                { word: 'Web', letter: 'W', wrongs: ['V', 'M', 'B'] },
                { word: 'Jam', letter: 'J', wrongs: ['G', 'D', 'B'] },
                { word: 'Yak', letter: 'Y', wrongs: ['W', 'V', 'J'] },
                { word: 'Zip', letter: 'Z', wrongs: ['S', 'V', 'J'] }
            ];
            const item = preKWords[this._rand(0, preKWords.length - 1)];
            const answers = this._shuffle([item.letter, ...item.wrongs]);

            return {
                question: `What sound does "${item.word}" start with?`,
                questionSpeak: `What sound does ${item.word} start with?`,
                answers,
                correctIndex: answers.indexOf(item.letter),
                topic: 'phonics',
                subtype: 'beginning-sound-prek',
                explanation: `"${item.word}" starts with ${item.letter}! ${item.letter}, ${item.letter}, ${item.word}!`,
                explanationSpeak: `${item.word} starts with ${item.letter}! ${item.letter}, ${item.letter}, ${item.word}!`
            };
        } else if (level <= 3) {
            // K level: distributed across sub-types
            const roll = Math.random();
            if (roll < 0.15) {
                return this._cvcDecoding();
            } else if (roll < 0.30) {
                return this._wordFamilyQuestion();
            } else if (roll < 0.45) {
                return this._phonemeSegmenting();
            } else if (roll < 0.60) {
                return this._phonemeBlending();
            } else if (roll < 0.70) {
                return this._nonsenseWordDecoding();
            } else if (roll < 0.80) {
                return this._letterSoundQuestion();
            }
            // 20% beginning sounds
            const item = this._phonicsData.beginning[this._rand(0, this._phonicsData.beginning.length - 1)];
            const correctWord = item.words[this._rand(0, item.words.length - 1)];
            const wrongs = this._shuffle(item.wrong).slice(0, 3);
            const answers = this._shuffle([correctWord, ...wrongs]);

            return {
                question: `Which word starts with the "${item.letter}" sound?`,
                questionSpeak: `Which word starts with the ${item.letter} sound?`,
                answers,
                correctIndex: answers.indexOf(correctWord),
                topic: 'phonics',
                subtype: 'beginning-sound',
                explanation: `"${correctWord}" starts with the ${item.letter} sound! ${item.letter}, ${item.letter}, ${correctWord}!`,
                explanationSpeak: `${correctWord} starts with the ${item.letter} sound! ${item.letter}, ${item.letter}, ${correctWord}!`
            };
        } else {
            // 1st grade (level >= 4): blends + advanced phonics
            const roll = Math.random();
            if (roll < 0.15) {
                return this._phonemeSegmenting();
            } else if (roll < 0.30) {
                return this._phonemeBlending();
            } else if (roll < 0.45) {
                return this._nonsenseWordDecoding();
            }
            // 55% blends
            const item = this._phonicsData.blends[this._rand(0, this._phonicsData.blends.length - 1)];
            const correctWord = item.words[this._rand(0, item.words.length - 1)];
            const wrongs = this._shuffle(item.wrong).slice(0, 3);
            const answers = this._shuffle([correctWord, ...wrongs]);

            return {
                question: `Which word starts with "${item.blend}"?`,
                questionSpeak: `Which word starts with ${item.blend}?`,
                answers,
                correctIndex: answers.indexOf(correctWord),
                topic: 'phonics',
                subtype: 'blend-match',
                explanation: `"${correctWord}" starts with the ${item.blend} sound! Listen: ${item.blend}... ${correctWord}!`,
                explanationSpeak: `${correctWord} starts with the ${item.blend} sound! Listen: ${item.blend}, ${correctWord}!`
            };
        }
    },

    // V5.5: Word family question — "Which word rhymes with / ends with -at?"
    _wordFamilyQuestion() {
        const families = this._phonicsData.wordFamilies;
        const family = families[this._rand(0, families.length - 1)];
        const correctWord = family.words[this._rand(0, family.words.length - 1)];

        // Get wrong answers from OTHER families
        const otherFamilies = families.filter(f => f.ending !== family.ending);
        const wrongs = [];
        let _sa5 = 0;
        while (wrongs.length < 3 && _sa5++ < 50) {
            const otherFam = otherFamilies[this._rand(0, otherFamilies.length - 1)];
            const w = otherFam.words[this._rand(0, otherFam.words.length - 1)];
            if (!wrongs.includes(w) && w !== correctWord) wrongs.push(w);
        }
        const answers = this._shuffle([correctWord, ...wrongs]);

        return {
            question: `Which word ends with "${family.ending}"?`,
            questionSpeak: `Which word ends with ${family.ending.replace('-', '')}?`,
            answers,
            correctIndex: answers.indexOf(correctWord),
            topic: 'phonics',
            subtype: 'word-family',
            explanation: `"${correctWord}" ends with ${family.ending}! ${family.words.slice(0, 4).join(', ')} — they all rhyme!`,
            explanationSpeak: `${correctWord} ends with ${family.ending.replace('-', '')}! ${family.words.slice(0, 4).join(', ')} — they all rhyme!`
        };
    },

    // CVC word decoding — "Sound it out!"
    _cvcDecoding() {
        const cvc = this._phonicsData.cvc;
        const item = cvc[this._rand(0, cvc.length - 1)];
        const answers = this._shuffle([item.meaning, ...item.wrongs]);
        const letters = item.word.split('').join(' - ');

        return {
            question: `Sound it out!\n${item.word.toUpperCase()}\nWhat does this word mean?`,
            questionSpeak: `Sound it out! ${letters}. ${item.word}. What does this word mean?`,
            answers,
            correctIndex: answers.indexOf(item.meaning),
            topic: 'phonics',
            subtype: 'cvc-decoding',
            explanation: `"${item.word}" means ${item.meaning}! Sound it out: ${letters}, ${item.word}!`,
            explanationSpeak: `${item.word} means ${item.meaning}! Sound it out: ${letters}, ${item.word}!`
        };
    },

    // ---- SIGHT WORDS ----
    // V5.8: Complete Dolch sight word lists
    _sightWordLists: {
        preprimer: ['a', 'and', 'away', 'big', 'blue', 'can', 'come', 'down', 'find', 'for',
            'funny', 'go', 'help', 'here', 'I', 'in', 'is', 'it', 'jump', 'little',
            'look', 'make', 'me', 'my', 'not', 'one', 'play', 'red', 'run', 'said',
            'see', 'the', 'three', 'to', 'two', 'up', 'we', 'where', 'yellow', 'you'],
        // V37: Expanded primer from 52 to 65 words
        primer: ['all', 'am', 'are', 'at', 'ate', 'be', 'black', 'brown', 'but', 'came',
            'did', 'do', 'eat', 'four', 'get', 'good', 'have', 'he', 'into', 'like',
            'must', 'new', 'no', 'now', 'on', 'our', 'out', 'please', 'pretty', 'ran',
            'ride', 'saw', 'say', 'she', 'so', 'soon', 'that', 'there', 'they', 'this',
            'too', 'under', 'want', 'was', 'well', 'went', 'what', 'white', 'who', 'will',
            'with', 'yes', 'also', 'very', 'only', 'much', 'each', 'then', 'best', 'back',
            'done', 'fast', 'full', 'last', 'give'],
        // V37: Expanded first from 41 to 60 words
        first: ['after', 'again', 'an', 'any', 'as', 'ask', 'by', 'could', 'every', 'fly',
            'from', 'give', 'going', 'had', 'has', 'her', 'him', 'his', 'how', 'just',
            'know', 'let', 'live', 'may', 'of', 'old', 'once', 'open', 'over', 'put',
            'round', 'some', 'stop', 'take', 'thank', 'them', 'then', 'think', 'walk', 'were',
            'when', 'would', 'right', 'about', 'never', 'made', 'before', 'read', 'always',
            'does', 'upon', 'been', 'both', 'which', 'many', 'long', 'first', 'write', 'their']
    },

    _sightWords(level) {
        // V20: 2nd grade dispatch
        if (level >= 6) return this._sightWords2nd(level);

        // Pre-K: Expanded 20-word pool, 2 template types
        if (level < 2) {
            // V37: Expanded from 20 to 40 Pre-K sight words
            const preKPool = ['I', 'a', 'the', 'is', 'my', 'go', 'no', 'yes', 'me', 'it',
                'to', 'up', 'we', 'he', 'in', 'on', 'am', 'at', 'an', 'do',
                'so', 'or', 'if', 'by', 'be', 'of', 'as', 'us', 'hi', 'oh',
                'see', 'run', 'big', 'can', 'you', 'and', 'not', 'but', 'all', 'red'];
            const target = preKPool[this._rand(0, preKPool.length - 1)];
            const wrongs = [];
            let _sa6 = 0;
            while (wrongs.length < 3 && _sa6++ < 50) {
                const w = preKPool[this._rand(0, preKPool.length - 1)];
                if (w !== target && !wrongs.includes(w)) wrongs.push(w);
            }
            const answers = this._shuffle([target, ...wrongs]);

            if (Math.random() < 0.5) {
                return {
                    question: `Which word says "${target}"?`,
                    questionSpeak: `Which word says ${target}?`,
                    answers,
                    correctIndex: answers.indexOf(target),
                    topic: 'sight-words',
                    subtype: 'read-word-prek',
                    explanation: `That word says "${target}"! Let's say it: ${target}!`,
                    explanationSpeak: `That word says ${target}! Let's say it: ${target}!`
                };
            } else {
                return {
                    question: `Point to the word:\n"${target}"`,
                    questionSpeak: `Point to the word ${target}!`,
                    answers,
                    correctIndex: answers.indexOf(target),
                    topic: 'sight-words',
                    subtype: 'point-to-word-prek',
                    explanation: `You found "${target}"! Great reading!`,
                    explanationSpeak: `You found ${target}! Great reading!`
                };
            }
        }

        const pool = level <= 3
            ? this._sightWordLists.preprimer
            : [...this._sightWordLists.primer, ...this._sightWordLists.first];

        const target = pool[this._rand(0, pool.length - 1)];

        // V3: Fill-the-sentence format
        if (level >= 4 && Math.random() < 0.3) {
            return this._sightWordSentence(target, pool);
        }

        if (Math.random() < 0.5) {
            const wrongs = [];
            let _sa7 = 0;
            while (wrongs.length < 3 && _sa7++ < 50) {
                const w = pool[this._rand(0, pool.length - 1)];
                if (w !== target && !wrongs.includes(w)) wrongs.push(w);
            }
            const answers = this._shuffle([target, ...wrongs]);
            return {
                question: `Find the word:\n"${target}"`,
                questionSpeak: `Find the word: ${target}`,
                answers,
                correctIndex: answers.indexOf(target),
                topic: 'sight-words',
                subtype: 'find-word',
                explanation: `The word is "${target}"! Let's spell it: ${target.split('').join(', ')}. ${target}!`,
                explanationSpeak: `The word is ${target}! Let's spell it: ${target.split('').join(', ')}. ${target}!`
            };
        } else {
            const wrongs = [];
            let _sa8 = 0;
            while (wrongs.length < 3 && _sa8++ < 50) {
                const w = pool[this._rand(0, pool.length - 1)];
                if (w !== target && !wrongs.includes(w)) wrongs.push(w);
            }
            const answers = this._shuffle([target, ...wrongs]);
            return {
                // V5.7: Show the word visually as fallback when TTS is unavailable
                question: `Find the word:\n"${target}"`,
                questionSpeak: `Tap the word: ${target}`,
                answers,
                correctIndex: answers.indexOf(target),
                topic: 'sight-words',
                subtype: 'read-word',
                explanation: `The word was "${target}"! Remember what it looks like: ${target}!`,
                explanationSpeak: `The word was ${target}! Remember what it looks like: ${target}!`
            };
        }
    },

    // V5.8: Expanded fill-in-the-sentence sight words (100+ templates)
    _sightWordSentence(target, pool) {
        const templates = {
            // Pre-Primer
            'a': 'I see ___ cat.', 'and': 'Mom ___ Dad.', 'away': 'Run ___!',
            'big': 'The dog is ___.', 'blue': 'The sky is ___.', 'can': 'I ___ run!',
            'come': '___ here please!', 'down': 'Sit ___ now.', 'find': 'Can you ___ it?',
            'for': 'This is ___ you.', 'funny': 'That is ___!', 'go': 'Time to ___.',
            'help': 'Please ___ me.', 'here': 'Come ___ now.', 'I': '___ like cats.',
            'in': 'Fish ___ water.', 'is': 'He ___ fast.', 'it': 'I see ___.',
            'jump': 'I can ___!', 'little': 'A ___ bird.', 'look': '___ at me!',
            'make': 'I ___ a cake.', 'me': 'Help ___!', 'my': '___ dog is big.',
            'not': 'I am ___ sad.', 'one': 'I have ___ hat.', 'play': 'Let us ___!',
            'red': 'The ball is ___.', 'run': 'I can ___!', 'said': '"Hi!" she ___.',
            'see': 'I ___ a bird.', 'the': '___ cat is big.', 'three': 'I have ___ toys.',
            'to': 'Go ___ bed.', 'two': 'I see ___ cats.', 'up': 'Look ___!',
            'we': '___ like to play.', 'where': '___ is my hat?', 'yellow': 'The sun is ___.',
            'you': 'Are ___ happy?',
            // Primer
            'all': 'We ___ play.', 'am': 'I ___ happy.', 'are': 'They ___ fun.',
            'at': 'Look ___ this!', 'ate': 'I ___ lunch.', 'be': 'I want to ___ good.',
            'black': 'The cat is ___.', 'brown': 'The dog is ___.', 'but': 'I like cats ___ not dogs.',
            'came': 'She ___ to school.', 'did': '___ you see it?', 'do': 'What ___ you want?',
            'eat': 'I ___ apples.', 'four': 'I have ___ pets.', 'get': 'I ___ a treat!',
            'good': 'That is ___!', 'have': 'I ___ a dog.', 'he': '___ is my friend.',
            'into': 'Jump ___ the pool!', 'like': 'I ___ cats.', 'must': 'You ___ be kind.',
            'new': 'I got a ___ toy.', 'no': 'She said ___.', 'now': 'Do it ___!',
            'on': 'Sit ___ the chair.', 'our': '___ dog is fun.', 'out': 'Go ___ and play.',
            'please': 'Can I go ___?', 'pretty': 'The flower is ___.', 'ran': 'He ___ fast.',
            'ride': 'I ___ my bike.', 'saw': 'I ___ a bird.', 'say': 'What did you ___?',
            'she': '___ is my sister.', 'so': 'I am ___ happy!', 'soon': 'We go home ___.',
            'that': 'I want ___ one.', 'there': 'Look over ___.', 'they': '___ play outside.',
            'this': 'I like ___ book.', 'too': 'Me ___!', 'under': 'The cat is ___ the bed.',
            'want': 'I ___ a snack.', 'was': 'He ___ happy.', 'well': 'She reads ___.',
            'went': 'We ___ to the park.', 'what': '___ is that?', 'white': 'The snow is ___.',
            'who': '___ is it?', 'will': 'I ___ help you.', 'with': 'Play ___ me.',
            'yes': 'She said ___!',
            // First Grade
            'after': '___ school we play.', 'again': 'Do it ___!', 'an': 'I ate ___ apple.',
            'any': 'Do you have ___?', 'as': 'Fast ___ a cheetah!', 'ask': 'I will ___ Mom.',
            'by': 'He ran ___ me.', 'could': 'I ___ do it!', 'every': 'I go ___ day.',
            'fly': 'Birds can ___.', 'from': 'A gift ___ Mom.', 'give': 'I ___ you a hug.',
            'going': 'I am ___ home.', 'had': 'She ___ fun.', 'has': 'He ___ a toy.',
            'her': 'I like ___ hat.', 'him': 'I see ___.', 'his': 'That is ___ dog.',
            'how': '___ are you?', 'just': 'I ___ got here!', 'know': 'I ___ the answer.',
            'let': '___ me try!', 'live': 'I ___ here.', 'may': '___ I go now?',
            'of': 'A cup ___ water.', 'old': 'My cat is ___.', 'once': '___ upon a time...',
            'open': '___ the door.', 'over': 'Jump ___ it!', 'put': '___ it away.',
            'round': 'The ball is ___.', 'some': 'I want ___ cake.', 'stop': '___ the car!',
            'take': '___ one please.', 'thank': '___ you so much!', 'them': 'I see ___.',
            'then': 'Eat, ___ play.', 'think': 'I ___ so too!', 'walk': 'I ___ to school.',
            'were': 'We ___ happy.', 'when': '___ is lunch?'
        };

        // V31: Alternate sentence variants for variety
        const alts = {
            'a': 'I have ___ pet.', 'big': 'What ___ teeth you have!', 'can': '___ you see me?',
            'go': 'We ___ to school.', 'I': '___ am happy.', 'is': 'She ___ nice.',
            'see': 'Can you ___ it?', 'the': 'I pet ___ dog.', 'run': '___ to the door!',
            'like': 'Do you ___ it?', 'have': 'Do you ___ a pet?', 'come': 'Can you ___?',
            'look': '___ over there!', 'play': 'We ___ games.', 'said': '"Wow!" he ___.',
            'was': 'She ___ running.', 'they': '___ are friends.', 'with': 'Come ___ us.',
            'went': 'She ___ to sleep.', 'what': '___ time is it?', 'are': 'You ___ so kind.',
            'eat': 'We ___ lunch now.', 'good': 'You are ___!', 'he': '___ runs fast.',
            'she': '___ likes books.', 'do': '___ your best!', 'my': 'This is ___ book.',
        };

        let sentence = templates[target];
        if (sentence && alts[target] && Math.random() < 0.4) {
            sentence = alts[target];
        }
        if (!sentence) {
            // Fallback
            const wrongs = [];
            let _sa9 = 0;
            while (wrongs.length < 3 && _sa9++ < 50) {
                const w = pool[this._rand(0, pool.length - 1)];
                if (w !== target && !wrongs.includes(w)) wrongs.push(w);
            }
            const answers = this._shuffle([target, ...wrongs]);
            return {
                question: `Find the word:\n"${target}"`,
                questionSpeak: `Find the word: ${target}`,
                answers,
                correctIndex: answers.indexOf(target),
                topic: 'sight-words',
                subtype: 'find-word-fallback',
                explanation: `The word is "${target}"!`,
                explanationSpeak: `The word is ${target}!`
            };
        }

        const wrongs = [];
        let _sa10 = 0;
        while (wrongs.length < 3 && _sa10++ < 50) {
            const w = pool[this._rand(0, pool.length - 1)];
            if (w !== target && !wrongs.includes(w)) wrongs.push(w);
        }
        const answers = this._shuffle([target, ...wrongs]);
        const full = sentence.replace('___', target);

        return {
            question: `Fill in the blank:\n"${sentence}"`,
            questionSpeak: `Fill in the blank: ${sentence.replace('___', 'blank')}`,
            answers,
            correctIndex: answers.indexOf(target),
            topic: 'sight-words',
            subtype: 'sentence-fill',
            explanation: `"${full}" — "${target}" fits in the blank!`,
            explanationSpeak: `${full}. The word ${target} fits in the blank!`
        };
    },

    // ---- RHYMING ----
    _rhymeSets: [
        ['cat', 'hat', 'bat', 'mat', 'sat', 'rat'],
        ['dog', 'log', 'fog', 'hog', 'jog'],
        ['sun', 'run', 'fun', 'bun', 'gun'],
        ['bed', 'red', 'fed', 'led', 'wed'],
        ['car', 'star', 'far', 'jar', 'bar'],
        ['top', 'hop', 'pop', 'mop', 'stop'],
        ['cake', 'make', 'lake', 'bake', 'take'],
        ['day', 'play', 'say', 'way', 'may'],
        ['ball', 'tall', 'wall', 'call', 'fall'],
        ['ring', 'sing', 'king', 'wing', 'thing'],
        ['book', 'look', 'cook', 'hook', 'took'],
        ['tree', 'free', 'see', 'bee', 'three'],
        ['night', 'light', 'right', 'fight', 'might'],
        ['rain', 'train', 'brain', 'main', 'pain'],
        ['boat', 'coat', 'goat', 'float', 'moat'],
        // V31: 10 new rhyme sets
        ['bug', 'hug', 'mug', 'rug', 'tug', 'jug'],
        ['lip', 'dip', 'hip', 'rip', 'sip', 'tip'],
        ['hop', 'cop', 'drop', 'shop', 'chop'],
        ['cap', 'map', 'nap', 'tap', 'clap', 'snap'],
        ['pig', 'big', 'dig', 'fig', 'wig', 'jig'],
        ['nest', 'best', 'rest', 'test', 'west', 'vest'],
        ['rock', 'sock', 'clock', 'block', 'knock'],
        ['sand', 'hand', 'band', 'land', 'stand'],
        ['jump', 'bump', 'dump', 'pump', 'lump'],
        ['luck', 'duck', 'truck', 'stuck', 'buck']
    ],

    _rhyming(level) {
        // V20: 2nd grade dispatch
        if (level >= 6) return this._rhyming2nd(level);

        // Pre-K: 6 word families + "do these rhyme?" template
        if (level < 2) {
            const preKFamilies = [
                { family: '-at', words: ['cat', 'hat', 'bat', 'mat', 'sat', 'rat'] },
                { family: '-an', words: ['can', 'fan', 'man', 'pan', 'ran', 'van'] },
                { family: '-ig', words: ['big', 'dig', 'fig', 'pig', 'wig', 'jig'] },
                { family: '-ot', words: ['hot', 'pot', 'dot', 'got', 'lot', 'not'] },
                { family: '-un', words: ['fun', 'run', 'sun', 'bun', 'pun', 'gun'] },
                { family: '-ed', words: ['bed', 'red', 'fed', 'led', 'wed', 'ted'] },
                // V31: 4 new Pre-K families
                { family: '-op', words: ['hop', 'top', 'pop', 'mop', 'cop', 'stop'] },
                { family: '-ug', words: ['bug', 'hug', 'mug', 'rug', 'tug', 'jug'] },
                { family: '-ip', words: ['lip', 'dip', 'hip', 'rip', 'sip', 'tip'] },
                { family: '-ap', words: ['cap', 'map', 'nap', 'tap', 'lap', 'clap'] }
            ];

            if (Math.random() < 0.3) {
                // "Do these words rhyme?" yes/no format
                const fam1 = preKFamilies[this._rand(0, preKFamilies.length - 1)];
                const word1 = fam1.words[this._rand(0, fam1.words.length - 1)];
                let word2, doRhyme;
                if (Math.random() < 0.5) {
                    // Pick a rhyming word
                    do { word2 = fam1.words[this._rand(0, fam1.words.length - 1)]; } while (word2 === word1);
                    doRhyme = true;
                } else {
                    // Pick a non-rhyming word
                    const otherFam = preKFamilies.filter(f => f.family !== fam1.family);
                    const picked = otherFam[this._rand(0, otherFam.length - 1)];
                    word2 = picked.words[this._rand(0, picked.words.length - 1)];
                    doRhyme = false;
                }
                const correct = doRhyme ? 'Yes!' : 'No!';
                const answers = this._shuffle(['Yes!', 'No!', 'Maybe', 'I don\'t know']);
                return {
                    question: `Do "${word1}" and "${word2}" rhyme?`,
                    questionSpeak: `Do ${word1} and ${word2} rhyme?`,
                    answers,
                    correctIndex: answers.indexOf(correct),
                    topic: 'rhyming',
                    subtype: 'identify-rhyme',
                    explanation: doRhyme
                        ? `Yes! "${word1}" and "${word2}" rhyme! They both end the same way!`
                        : `No! "${word1}" and "${word2}" don't rhyme. They sound different at the end!`,
                    explanationSpeak: doRhyme
                        ? `Yes! ${word1} and ${word2} rhyme!`
                        : `No, ${word1} and ${word2} don't rhyme!`
                };
            }

            const fam = preKFamilies[this._rand(0, preKFamilies.length - 1)];
            const target = fam.words[this._rand(0, fam.words.length - 1)];
            let correct;
            do {
                correct = fam.words[this._rand(0, fam.words.length - 1)];
            } while (correct === target);

            const otherFams = preKFamilies.filter(f => f.family !== fam.family);
            const wrongs = [];
            let _sa11 = 0;
            while (wrongs.length < 3 && _sa11++ < 50) {
                const otherFam = otherFams[this._rand(0, otherFams.length - 1)];
                const w = otherFam.words[this._rand(0, otherFam.words.length - 1)];
                if (!wrongs.includes(w)) wrongs.push(w);
            }

            const answers = this._shuffle([correct, ...wrongs]);
            return {
                question: `What rhymes with "${target}"?`,
                questionSpeak: `What rhymes with ${target}?`,
                answers,
                correctIndex: answers.indexOf(correct),
                topic: 'rhyming',
                subtype: 'match-rhyme-prek',
                explanation: `"${correct}" rhymes with "${target}"! ${target}, ${correct} — they sound the same at the end!`,
                explanationSpeak: `${correct} rhymes with ${target}! ${target}, ${correct}, they sound the same at the end!`
            };
        }

        // V37: "Complete the rhyme" format (25% at K+)
        if (level >= 2 && Math.random() < 0.25) {
            const rhymingSentences = [
                { line: 'The cat sat on a ___', answer: 'mat', family: '-at', wrongs: ['dog', 'cup', 'bed'] },
                { line: 'I saw a man with a ___', answer: 'pan', family: '-an', wrongs: ['hat', 'dog', 'cup'] },
                { line: 'The big pig wore a ___', answer: 'wig', family: '-ig', wrongs: ['hat', 'coat', 'sock'] },
                { line: 'A bug gave me a ___', answer: 'hug', family: '-ug', wrongs: ['kiss', 'wave', 'bite'] },
                { line: 'The sun is so much ___', answer: 'fun', family: '-un', wrongs: ['big', 'hot', 'nice'] },
                { line: 'I found a fox in a ___', answer: 'box', family: '-ox', wrongs: ['cave', 'tree', 'den'] },
                { line: 'A funny bunny eats ___', answer: 'honey', family: '-unny', wrongs: ['bread', 'grass', 'cake'] },
                { line: 'A little fish made a ___', answer: 'wish', family: '-ish', wrongs: ['swim', 'jump', 'splash'] },
                { line: 'The night was full of ___', answer: 'light', family: '-ight', wrongs: ['dark', 'rain', 'cold'] },
                { line: 'I saw a snake by the ___', answer: 'lake', family: '-ake', wrongs: ['tree', 'road', 'hill'] },
                { line: 'A king began to ___', answer: 'sing', family: '-ing', wrongs: ['dance', 'run', 'eat'] },
                { line: 'A goat put on a ___', answer: 'coat', family: '-oat', wrongs: ['hat', 'shoe', 'belt'] },
                { line: 'I found a snail on the ___', answer: 'trail', family: '-ail', wrongs: ['rock', 'tree', 'grass'] },
                { line: 'The train came in the ___', answer: 'rain', family: '-ain', wrongs: ['snow', 'wind', 'dark'] }
            ];
            const rItem = rhymingSentences[this._rand(0, rhymingSentences.length - 1)];
            const answers = this._shuffle([rItem.answer, ...rItem.wrongs]);
            return {
                question: `🎵 Complete the rhyme:\n"${rItem.line}"`,
                questionSpeak: `Complete the rhyme: ${rItem.line.replace('___', 'blank')}`,
                answers,
                correctIndex: answers.indexOf(rItem.answer),
                topic: 'rhyming',
                subtype: 'complete-rhyme',
                explanation: `"${rItem.answer}" completes the rhyme! It rhymes because they share the ${rItem.family} sound!`,
                explanationSpeak: `${rItem.answer} completes the rhyme! They have the same ending sound!`
            };
        }

        // V3: Odd-one-out format
        if (level >= 4 && Math.random() < 0.3) {
            return this._rhymingOddOneOut();
        }

        const setIdx = this._rand(0, this._rhymeSets.length - 1);
        const set = this._rhymeSets[setIdx];
        const target = set[this._rand(0, set.length - 1)];

        let correct;
        do {
            correct = set[this._rand(0, set.length - 1)];
        } while (correct === target);

        const wrongs = [];
        let _sa12 = 0;
        while (wrongs.length < 3 && _sa12++ < 50) {
            const otherSet = this._rhymeSets[this._rand(0, this._rhymeSets.length - 1)];
            if (otherSet === set) continue;
            const w = otherSet[this._rand(0, otherSet.length - 1)];
            if (!wrongs.includes(w)) wrongs.push(w);
        }

        const answers = this._shuffle([correct, ...wrongs]);
        const ending = target.length >= 2 ? target.slice(-2) : target.slice(-1);

        return {
            question: `Which word rhymes with "${target}"?`,
            questionSpeak: `Which word rhymes with ${target}?`,
            answers,
            correctIndex: answers.indexOf(correct),
            topic: 'rhyming',
            subtype: 'match-rhyme',
            explanation: `"${correct}" rhymes with "${target}"! They both have the "${ending}" sound: ${target}, ${correct}!`,
            explanationSpeak: `${correct} rhymes with ${target}! They both end with the same sound: ${target}, ${correct}!`
        };
    },

    // V3: Odd-one-out rhyming
    _rhymingOddOneOut() {
        const setIdx = this._rand(0, this._rhymeSets.length - 1);
        const set = this._rhymeSets[setIdx];
        const rhymers = this._shuffle([...set]).slice(0, 3);
        let oddSet;
        do {
            oddSet = this._rhymeSets[this._rand(0, this._rhymeSets.length - 1)];
        } while (oddSet === set);
        const oddWord = oddSet[this._rand(0, oddSet.length - 1)];
        const answers = this._shuffle([...rhymers, oddWord]);

        return {
            question: `Which word does NOT rhyme?\n${answers.join(', ')}`,
            questionSpeak: `Which word does not rhyme? ${answers.join(', ')}`,
            answers,
            correctIndex: answers.indexOf(oddWord),
            topic: 'rhyming',
            subtype: 'odd-one-out',
            explanation: `"${oddWord}" does not rhyme! ${rhymers.join(', ')} all rhyme with each other!`,
            explanationSpeak: `${oddWord} does not rhyme! ${rhymers.join(', ')} all rhyme with each other!`
        };
    },

    // ---- SENTENCES ----
    _sentenceData: {
        k: [
            { sentence: 'The cat is ___', answer: 'big', wrongs: ['run', 'go', 'up'] },
            { sentence: 'I can ___', answer: 'run', wrongs: ['big', 'red', 'the'] },
            { sentence: 'We go ___', answer: 'up', wrongs: ['big', 'cat', 'red'] },
            { sentence: 'I see a ___', answer: 'dog', wrongs: ['run', 'is', 'go'] },
            { sentence: 'The sun is ___', answer: 'hot', wrongs: ['run', 'go', 'see'] },
            { sentence: 'She is my ___', answer: 'mom', wrongs: ['run', 'big', 'go'] },
            { sentence: 'I like to ___', answer: 'play', wrongs: ['big', 'red', 'the'] },
            { sentence: 'Look at the ___', answer: 'bird', wrongs: ['run', 'go', 'is'] },
            { sentence: 'The frog can ___', answer: 'hop', wrongs: ['red', 'big', 'the'] },
            { sentence: 'My pet is a ___', answer: 'fish', wrongs: ['run', 'up', 'go'] },
            { sentence: 'We eat ___', answer: 'food', wrongs: ['run', 'big', 'see'] },
            { sentence: 'The ball is ___', answer: 'red', wrongs: ['run', 'go', 'sit'] },
            { sentence: 'I love my ___', answer: 'dad', wrongs: ['run', 'big', 'go'] },
            { sentence: 'The ___ is tall', answer: 'tree', wrongs: ['run', 'sit', 'go'] },
            { sentence: 'I sit on a ___', answer: 'chair', wrongs: ['run', 'big', 'go'] },
            { sentence: 'The baby can ___', answer: 'cry', wrongs: ['big', 'red', 'the'] },
            { sentence: 'The cow says ___', answer: 'moo', wrongs: ['run', 'big', 'go'] },
            { sentence: 'I ride my ___', answer: 'bike', wrongs: ['big', 'red', 'run'] },
            { sentence: 'The sky is ___', answer: 'blue', wrongs: ['run', 'dog', 'go'] },
            { sentence: 'We sleep in a ___', answer: 'bed', wrongs: ['run', 'go', 'big'] },
            { sentence: 'The snow is ___', answer: 'cold', wrongs: ['run', 'big', 'go'] },
            { sentence: 'I wash my ___', answer: 'hands', wrongs: ['run', 'big', 'go'] },
            { sentence: 'The duck can ___', answer: 'swim', wrongs: ['red', 'big', 'the'] },
            { sentence: 'I brush my ___', answer: 'teeth', wrongs: ['run', 'big', 'go'] },
            { sentence: 'The pig is ___', answer: 'pink', wrongs: ['run', 'go', 'see'] },
            { sentence: 'We read a ___', answer: 'book', wrongs: ['run', 'big', 'go'] },
            { sentence: 'The hat is on my ___', answer: 'head', wrongs: ['run', 'big', 'go'] },
            { sentence: 'I drink my ___', answer: 'milk', wrongs: ['run', 'big', 'go'] },
            { sentence: 'The bee can ___', answer: 'buzz', wrongs: ['red', 'big', 'the'] },
            { sentence: 'I hug my ___', answer: 'mom', wrongs: ['run', 'big', 'go'] }
        ],
        first: [
            { sentence: 'The dog ran to the ___', answer: 'park', wrongs: ['blue', 'fast', 'under'] },
            { sentence: 'She likes to read ___', answer: 'books', wrongs: ['green', 'fast', 'under'] },
            { sentence: 'We can play in the ___', answer: 'yard', wrongs: ['read', 'jump', 'blue'] },
            { sentence: 'He went to ___ today', answer: 'school', wrongs: ['green', 'fast', 'jump'] },
            { sentence: 'The fish swims in the ___', answer: 'water', wrongs: ['green', 'fast', 'blue'] },
            { sentence: 'I want to eat a ___', answer: 'snack', wrongs: ['jump', 'read', 'blue'] },
            { sentence: 'They will come ___ school', answer: 'after', wrongs: ['green', 'fast', 'happy'] },
            { sentence: 'My friend is very ___', answer: 'kind', wrongs: ['jump', 'book', 'fast'] },
            { sentence: 'The bird can ___ high', answer: 'fly', wrongs: ['eat', 'sit', 'read'] },
            { sentence: 'We ___ to the store', answer: 'went', wrongs: ['blue', 'tall', 'happy'] },
            { sentence: 'She ___ her homework', answer: 'did', wrongs: ['green', 'tall', 'happy'] },
            { sentence: 'The cat sleeps on the ___', answer: 'bed', wrongs: ['fast', 'jump', 'read'] },
            { sentence: 'He ___ a new toy', answer: 'got', wrongs: ['big', 'tall', 'fast'] },
            { sentence: 'We play ___ the rain', answer: 'in', wrongs: ['tall', 'fast', 'blue'] },
            { sentence: 'The flower is very ___', answer: 'pretty', wrongs: ['jump', 'read', 'fast'] },
            { sentence: 'Mom said to ___ quiet', answer: 'be', wrongs: ['tall', 'fast', 'green'] }
        ]
    },

    _sentences(level) {
        // V20: 2nd grade dispatch
        if (level >= 6) return this._sentences2nd(level);

        // Pre-K: Redirect to sight words (sentences too advanced for Pre-K)
        if (level < 2) {
            return this._sightWords(level);
        }

        // V37: "Which is a REAL sentence?" (20% at K+)
        if (Math.random() < 0.2) {
            const realSentences = [
                'The dog is big.', 'I like to play.', 'She can run fast.',
                'We eat lunch.', 'The cat sat down.', 'He reads a book.',
                'My mom is nice.', 'They went home.', 'The bird can fly.',
                'I see a fish.', 'We play at the park.', 'She likes to sing.'
            ];
            const fragments = [
                'The big red.', 'Running fast to.', 'Very cold and.',
                'Under the big.', 'Because she was.', 'The tall green.',
                'After the game on.', 'My favorite really.', 'Going to the very.',
                'And then the big.', 'With all the.', 'So happy and very.'
            ];
            const correct = realSentences[this._rand(0, realSentences.length - 1)];
            const wrongs = this._shuffle(fragments).slice(0, 3);
            const answers = this._shuffle([correct, ...wrongs]);
            return {
                question: `📝 Which is a REAL sentence?`,
                questionSpeak: `Which of these is a real complete sentence?`,
                answers,
                correctIndex: answers.indexOf(correct),
                topic: 'sentences',
                subtype: 'real-sentence',
                explanation: `"${correct}" is a real sentence! It has a subject and verb and makes sense!`,
                explanationSpeak: `${correct} is a real sentence! It has a subject and a verb!`
            };
        }

        // V37: "What's the missing punctuation?" (15% at K+)
        if (Math.random() < 0.18) {
            const punctItems = [
                { sentence: 'I like dogs', correct: '.', type: 'statement' },
                { sentence: 'Where is my hat', correct: '?', type: 'question' },
                { sentence: 'Wow that is amazing', correct: '!', type: 'exclamation' },
                { sentence: 'Can you help me', correct: '?', type: 'question' },
                { sentence: 'The sun is out', correct: '.', type: 'statement' },
                { sentence: 'Watch out', correct: '!', type: 'exclamation' },
                { sentence: 'What time is it', correct: '?', type: 'question' },
                { sentence: 'I am six years old', correct: '.', type: 'statement' },
                { sentence: 'That is so cool', correct: '!', type: 'exclamation' },
                { sentence: 'How old are you', correct: '?', type: 'question' },
                { sentence: 'She runs very fast', correct: '.', type: 'statement' },
                { sentence: 'Look at that', correct: '!', type: 'exclamation' }
            ];
            const pItem = punctItems[this._rand(0, punctItems.length - 1)];
            const answers = this._shuffle(['.', '?', '!', ',']);
            return {
                question: `📝 What goes at the end?\n"${pItem.sentence}___"`,
                questionSpeak: `What punctuation goes at the end? ${pItem.sentence}`,
                answers,
                correctIndex: answers.indexOf(pItem.correct),
                topic: 'sentences',
                subtype: 'punctuation',
                explanation: `It ends with "${pItem.correct}" because it's a ${pItem.type}!`,
                explanationSpeak: `It ends with a ${pItem.type === 'question' ? 'question mark' : pItem.type === 'exclamation' ? 'exclamation point' : 'period'} because it is a ${pItem.type}!`
            };
        }

        // V5.8: 30% sentence reading fluency (comprehension) at 1st grade
        if (level >= 4 && Math.random() < 0.3) {
            return this._sentenceFluency(level);
        }

        const pool = level <= 3 ? this._sentenceData.k : this._sentenceData.first;
        const item = pool[this._rand(0, pool.length - 1)];
        const answers = this._shuffle([item.answer, ...item.wrongs]);
        const full = item.sentence.replace('___', item.answer);

        return {
            question: `Fill in the blank:\n"${item.sentence}"`,
            questionSpeak: `Fill in the blank: ${item.sentence.replace('___', 'blank')}`,
            answers,
            correctIndex: answers.indexOf(item.answer),
            topic: 'sentences',
            subtype: 'sentence-fill',
            explanation: `"${full}" — The word "${item.answer}" makes the sentence make sense!`,
            explanationSpeak: `${full}. The word ${item.answer} makes the sentence make sense!`
        };
    },

    // V5.8: Sentence reading fluency — read a sentence, answer a comprehension question
    _fluencyData: [
        { sentence: 'The cat sat on the mat.', q: 'Where did the cat sit?', correct: 'on the mat', wrongs: ['in the tree', 'by the door', 'under the bed'] },
        { sentence: 'Sam has a big red ball.', q: 'What color is the ball?', correct: 'red', wrongs: ['blue', 'green', 'yellow'] },
        { sentence: 'The dog ran to the park.', q: 'Where did the dog go?', correct: 'the park', wrongs: ['the store', 'the school', 'the lake'] },
        { sentence: 'Mom made a cake for Dad.', q: 'Who is the cake for?', correct: 'Dad', wrongs: ['Mom', 'the dog', 'the baby'] },
        { sentence: 'The bird flew up to the tree.', q: 'Where did the bird fly?', correct: 'the tree', wrongs: ['the house', 'the car', 'the pond'] },
        { sentence: 'Ben ate three apples.', q: 'How many apples did Ben eat?', correct: 'three', wrongs: ['two', 'four', 'one'] },
        { sentence: 'The fish swam in the pond.', q: 'Where did the fish swim?', correct: 'the pond', wrongs: ['the sky', 'the park', 'the road'] },
        { sentence: 'Lily got a new puppy.', q: 'What did Lily get?', correct: 'a puppy', wrongs: ['a kitten', 'a fish', 'a bird'] },
        { sentence: 'It is cold and snowy today.', q: 'What is the weather?', correct: 'cold and snowy', wrongs: ['hot and sunny', 'warm and rainy', 'windy and dry'] },
        { sentence: 'The boy rode his bike to school.', q: 'How did the boy get to school?', correct: 'rode his bike', wrongs: ['took a bus', 'walked', 'drove a car'] },
        { sentence: 'She put on her hat and coat.', q: 'What did she put on?', correct: 'hat and coat', wrongs: ['shoes and socks', 'dress and belt', 'scarf and gloves'] },
        { sentence: 'The frog jumped into the water.', q: 'What did the frog do?', correct: 'jumped', wrongs: ['ran', 'flew', 'slept'] },
        { sentence: 'Dad read a book to the kids.', q: 'What did Dad read?', correct: 'a book', wrongs: ['a letter', 'a sign', 'a map'] },
        { sentence: 'The sun went down at night.', q: 'When did the sun go down?', correct: 'at night', wrongs: ['in the morning', 'at noon', 'after lunch'] },
        { sentence: 'We planted flowers in the garden.', q: 'What did we plant?', correct: 'flowers', wrongs: ['trees', 'grass', 'rocks'] },
        { sentence: 'The baby clapped her hands.', q: 'What did the baby do?', correct: 'clapped', wrongs: ['cried', 'slept', 'ran'] },
        { sentence: 'Tom and Mia played in the rain.', q: 'Where did they play?', correct: 'in the rain', wrongs: ['in the house', 'at school', 'in the car'] },
        { sentence: 'The bus stops at the corner.', q: 'Where does the bus stop?', correct: 'at the corner', wrongs: ['at the park', 'at the store', 'at the house'] },
        { sentence: 'She drew a picture of her family.', q: 'What did she draw?', correct: 'her family', wrongs: ['a house', 'a dog', 'a flower'] },
        { sentence: 'The wind blew the leaves away.', q: 'What did the wind blow?', correct: 'the leaves', wrongs: ['the rocks', 'the water', 'the dirt'] }
    ],

    _sentenceFluency(level) {
        const item = this._fluencyData[this._rand(0, this._fluencyData.length - 1)];
        const answers = this._shuffle([item.correct, ...item.wrongs]);

        return {
            question: `Read the sentence:\n"${item.sentence}"\n\n${item.q}`,
            questionSpeak: `${item.sentence} ${item.q}`,
            answers,
            correctIndex: answers.indexOf(item.correct),
            topic: 'sentences',
            subtype: 'reading-fluency',
            explanation: `"${item.sentence}" — ${item.correct}!`,
            explanationSpeak: `${item.sentence}. The answer is ${item.correct}!`
        };
    },

    // ---- VOCABULARY (V3) ----
    _vocabData: {
        kEasy: [
            { question: 'Which word means a place where you sleep?', correct: 'bed', wrongs: ['run', 'cup', 'hat'] },
            { question: 'Which word means something you drink from?', correct: 'cup', wrongs: ['bed', 'hat', 'run'] },
            { question: 'Which word means something you wear on your head?', correct: 'hat', wrongs: ['cup', 'bed', 'cat'] },
            { question: 'Which word means a baby dog?', correct: 'puppy', wrongs: ['kitten', 'bird', 'fish'] },
            { question: 'Which word means something that shines in the sky at night?', correct: 'star', wrongs: ['car', 'hat', 'bed'] },
            { question: 'Which word means the color of grass?', correct: 'green', wrongs: ['red', 'blue', 'white'] },
            { question: 'Which word means something you eat for breakfast?', correct: 'cereal', wrongs: ['chair', 'book', 'shoe'] },
            { question: 'Which word means a baby cat?', correct: 'kitten', wrongs: ['puppy', 'chick', 'cub'] },
            { question: 'Which word means something with four legs you sit on?', correct: 'chair', wrongs: ['hat', 'book', 'cup'] },
            { question: 'Which word means a place with lots of books?', correct: 'library', wrongs: ['kitchen', 'garage', 'garden'] },
            { question: 'Which word means the color of the sky?', correct: 'blue', wrongs: ['red', 'green', 'brown'] },
            { question: 'Which word means a round toy you bounce?', correct: 'ball', wrongs: ['doll', 'kite', 'block'] },
            { question: 'Which word means something you read?', correct: 'book', wrongs: ['sock', 'spoon', 'rock'] },
            { question: 'Which word means someone who teaches you?', correct: 'teacher', wrongs: ['doctor', 'farmer', 'driver'] },
            { question: 'Which word means a meal you eat at noon?', correct: 'lunch', wrongs: ['nap', 'bath', 'walk'] },
            { question: 'Which word means you move through water?', correct: 'swim', wrongs: ['fly', 'dig', 'climb'] }
        ],
        kHard: [
            { question: 'What does "huge" mean?', correct: 'very big', wrongs: ['very small', 'very fast', 'very old'], explain: 'so big it fills up the room' },
            { question: 'What does "tiny" mean?', correct: 'very small', wrongs: ['very big', 'very loud', 'very happy'], explain: 'so small you can barely see it' },
            { question: 'What does "fast" mean?', correct: 'very quick', wrongs: ['very slow', 'very tall', 'very quiet'], explain: 'moving in a hurry, like a race car' },
            { question: 'What does "happy" mean?', correct: 'feeling good', wrongs: ['feeling sad', 'feeling sick', 'feeling sleepy'], explain: 'when you smile and feel great inside' },
            { question: 'What does "loud" mean?', correct: 'not quiet', wrongs: ['not big', 'not fast', 'not cold'], explain: 'making a big sound, like a drum' },
            { question: 'What does "wet" mean?', correct: 'has water', wrongs: ['has fire', 'has air', 'has dirt'], explain: 'covered in water, like after rain' },
            { question: 'What does "scared" mean?', correct: 'afraid', wrongs: ['happy', 'angry', 'sleepy'], explain: 'feeling worried something bad might happen' },
            { question: 'What does "strong" mean?', correct: 'has power', wrongs: ['is tired', 'is small', 'is quiet'], explain: 'able to lift and carry heavy things' },
            { question: 'What does "quiet" mean?', correct: 'not loud', wrongs: ['not big', 'not fast', 'not hot'], explain: 'very soft sound, like a whisper' },
            { question: 'What does "brave" mean?', correct: 'not afraid', wrongs: ['not happy', 'not fast', 'not big'], explain: 'doing something even when it feels scary' },
            { question: 'What does "empty" mean?', correct: 'has nothing', wrongs: ['has a lot', 'is broken', 'is heavy'], explain: 'nothing inside, like a box with no toys' },
            { question: 'What does "full" mean?', correct: 'no room left', wrongs: ['all gone', 'very small', 'very light'], explain: 'packed all the way, no space for more' },
            { question: 'What does "gentle" mean?', correct: 'soft and kind', wrongs: ['hard and mean', 'loud and fast', 'big and tall'], explain: 'touching softly, like petting a kitten' },
            { question: 'What does "shiny" mean?', correct: 'bright light', wrongs: ['very dark', 'very old', 'very soft'], explain: 'glowing and sparkling, like a star' },
            { question: 'What does "yummy" mean?', correct: 'tastes good', wrongs: ['smells bad', 'looks old', 'feels hard'], explain: 'food that makes you want more' },
            { question: 'What does "cold" mean?', correct: 'not warm', wrongs: ['not big', 'not soft', 'not fast'], explain: 'feels chilly, like ice or snow' }
        ],
        firstEasy: [
            { question: 'Which word means the opposite of "hot"?', correct: 'cold', wrongs: ['fast', 'big', 'red'] },
            { question: 'Which word means the opposite of "up"?', correct: 'down', wrongs: ['in', 'out', 'over'] },
            { question: 'Which word means the opposite of "happy"?', correct: 'sad', wrongs: ['fast', 'big', 'tall'] },
            { question: 'Which word means the opposite of "big"?', correct: 'small', wrongs: ['tall', 'fast', 'loud'] },
            { question: 'Which word means the opposite of "day"?', correct: 'night', wrongs: ['sun', 'moon', 'light'] },
            { question: 'Which word means the opposite of "fast"?', correct: 'slow', wrongs: ['big', 'loud', 'far'] },
            { question: 'Which word means the opposite of "old"?', correct: 'new', wrongs: ['big', 'far', 'cold'] },
            { question: 'Which word means the opposite of "open"?', correct: 'close', wrongs: ['break', 'push', 'pull'] },
            { question: 'Which word means the opposite of "light"?', correct: 'heavy', wrongs: ['fast', 'long', 'cold'] },
            { question: 'Which word means the opposite of "soft"?', correct: 'hard', wrongs: ['wet', 'tall', 'loud'] },
            { question: 'Which word means the opposite of "clean"?', correct: 'dirty', wrongs: ['wet', 'cold', 'short'] },
            { question: 'Which word means the opposite of "full"?', correct: 'empty', wrongs: ['big', 'tall', 'wide'] },
            { question: 'Which word means the opposite of "loud"?', correct: 'quiet', wrongs: ['small', 'slow', 'short'] },
            { question: 'Which word means the opposite of "wet"?', correct: 'dry', wrongs: ['cold', 'soft', 'slow'] },
            { question: 'Which word means the opposite of "tall"?', correct: 'short', wrongs: ['thin', 'slow', 'cold'] },
            { question: 'Which word means the opposite of "dark"?', correct: 'light', wrongs: ['big', 'fast', 'cold'] }
        ],
        firstHard: [
            { question: '"The puppy was tiny."\nWhat does "tiny" mean?', correct: 'very small', wrongs: ['very loud', 'very happy', 'very hungry'], explain: 'so little you could hold it in one hand' },
            { question: '"She was furious!"\nWhat does "furious" mean?', correct: 'very angry', wrongs: ['very happy', 'very tired', 'very cold'], explain: 'so mad you might yell or stomp' },
            { question: '"The snack was delicious."\nWhat does "delicious" mean?', correct: 'tastes great', wrongs: ['very big', 'very old', 'very cold'], explain: 'food so good you want seconds' },
            { question: '"He was exhausted."\nWhat does "exhausted" mean?', correct: 'very tired', wrongs: ['very happy', 'very hungry', 'very scared'], explain: 'so sleepy you can barely keep your eyes open' },
            { question: '"The room was enormous."\nWhat does "enormous" mean?', correct: 'very big', wrongs: ['very dark', 'very cold', 'very quiet'], explain: 'so huge it takes forever to walk across' },
            { question: '"She was courageous."\nWhat does "courageous" mean?', correct: 'very brave', wrongs: ['very smart', 'very fast', 'very quiet'], explain: 'doing the right thing even when afraid' },
            { question: '"The joke was hilarious."\nWhat does "hilarious" mean?', correct: 'very funny', wrongs: ['very sad', 'very scary', 'very loud'], explain: 'so funny it makes everyone laugh' },
            { question: '"The water was frigid."\nWhat does "frigid" mean?', correct: 'very cold', wrongs: ['very deep', 'very dirty', 'very calm'], explain: 'icy cold, so cold you shiver' },
            { question: '"The puppy was adorable."\nWhat does "adorable" mean?', correct: 'very cute', wrongs: ['very big', 'very fast', 'very old'], explain: 'so sweet and lovable you want to hug it' },
            { question: '"The test was difficult."\nWhat does "difficult" mean?', correct: 'very hard', wrongs: ['very easy', 'very long', 'very fun'], explain: 'not easy, takes a lot of thinking' },
            { question: '"She felt miserable."\nWhat does "miserable" mean?', correct: 'very sad', wrongs: ['very angry', 'very cold', 'very tired'], explain: 'feeling awful, like nothing is going right' },
            { question: '"The cheetah was swift."\nWhat does "swift" mean?', correct: 'very fast', wrongs: ['very strong', 'very big', 'very loud'], explain: 'moving super quick, like lightning' },
            { question: '"The tower was ancient."\nWhat does "ancient" mean?', correct: 'very old', wrongs: ['very tall', 'very dark', 'very big'], explain: 'been around for hundreds of years' },
            { question: '"He was famished."\nWhat does "famished" mean?', correct: 'very hungry', wrongs: ['very sleepy', 'very cold', 'very lost'], explain: 'so hungry your tummy growls' },
            { question: '"The garden was magnificent."\nWhat does "magnificent" mean?', correct: 'wonderful', wrongs: ['terrible', 'ordinary', 'boring'], explain: 'so beautiful it takes your breath away' },
            { question: '"The night was tranquil."\nWhat does "tranquil" mean?', correct: 'very calm', wrongs: ['very dark', 'very cold', 'very long'], explain: 'peaceful and still, with no noise' }
        ]
    },

    _vocabulary(level) {
        // V20: 2nd grade dispatch
        if (level >= 6) return this._vocabulary2nd(level);

        // Pre-K: Expanded pool (25 items) + "which does NOT belong?" template
        if (level < 2) {
            const preKVocab = [
                { question: 'Which is a fruit?', correct: '🍎 Apple', wrongs: ['🚗 Car', '🐶 Dog', '📚 Book'] },
                { question: 'Which is an animal?', correct: '🐶 Dog', wrongs: ['🍎 Apple', '🚗 Car', '📚 Book'] },
                { question: 'Which is a color?', correct: '🔵 Blue', wrongs: ['🐱 Cat', '🍌 Banana', '🏠 House'] },
                { question: 'Which is food?', correct: '🍔 Hamburger', wrongs: ['🚗 Car', '🐶 Dog', '🏠 House'] },
                { question: 'Which is a toy?', correct: '🧸 Teddy Bear', wrongs: ['🍎 Apple', '🚗 Car', '🌳 Tree'] },
                { question: 'Which can fly?', correct: '🐦 Bird', wrongs: ['🐟 Fish', '🐶 Dog', '🐱 Cat'] },
                { question: 'Which do you wear?', correct: '🎩 Hat', wrongs: ['🍎 Apple', '🐶 Dog', '🌳 Tree'] },
                { question: 'Which lives in water?', correct: '🐟 Fish', wrongs: ['🐶 Dog', '🐱 Cat', '🐦 Bird'] },
                { question: 'Which is a vehicle?', correct: '🚗 Car', wrongs: ['🍎 Apple', '🐶 Dog', '🌳 Tree'] },
                { question: 'Which is a flower?', correct: '🌻 Sunflower', wrongs: ['🐶 Dog', '🚗 Car', '🍎 Apple'] },
                { question: 'Which is a drink?', correct: '🧃 Juice', wrongs: ['🎩 Hat', '🐶 Dog', '🌳 Tree'] },
                { question: 'Which is round?', correct: '⚽ Ball', wrongs: ['📚 Book', '🎩 Hat', '🌳 Tree'] },
                { question: 'Which is hot?', correct: '☀️ Sun', wrongs: ['🧊 Ice', '❄️ Snow', '🌙 Moon'] },
                { question: 'Which is cold?', correct: '❄️ Snow', wrongs: ['☀️ Sun', '🔥 Fire', '🍔 Hamburger'] },
                { question: 'Which is big?', correct: '🐘 Elephant', wrongs: ['🐜 Ant', '🐛 Bug', '🐝 Bee'] },
                { question: 'Which is tiny?', correct: '🐜 Ant', wrongs: ['🐘 Elephant', '🦁 Lion', '🐻 Bear'] },
                { question: 'Which has legs?', correct: '🐶 Dog', wrongs: ['🐟 Fish', '🐍 Snake', '🪱 Worm'] },
                { question: 'Which is sweet?', correct: '🍰 Cake', wrongs: ['🧅 Onion', '🥬 Lettuce', '🧂 Salt'] },
                { question: 'Which makes music?', correct: '🎸 Guitar', wrongs: ['📚 Book', '🚗 Car', '🌳 Tree'] },
                { question: 'Which is in the sky?', correct: '☁️ Cloud', wrongs: ['🐟 Fish', '🪨 Rock', '🌳 Tree'] },
                { question: 'Which grows in dirt?', correct: '🌳 Tree', wrongs: ['🐦 Bird', '☁️ Cloud', '⭐ Star'] },
                { question: 'Which do you read?', correct: '📚 Book', wrongs: ['🍎 Apple', '⚽ Ball', '🎩 Hat'] },
                { question: 'Which do you sleep on?', correct: '🛏️ Bed', wrongs: ['🍎 Apple', '🚗 Car', '🌳 Tree'] },
                { question: 'Which has wheels?', correct: '🚲 Bicycle', wrongs: ['🐶 Dog', '🍎 Apple', '📚 Book'] },
                { question: 'Which is a shape?', correct: '⭐ Star', wrongs: ['🍎 Apple', '🐶 Dog', '📚 Book'] }
            ];

            if (Math.random() < 0.25) {
                // "Which does NOT belong?" template
                const categories = [
                    { name: 'animals', items: ['🐶 Dog', '🐱 Cat', '🐦 Bird', '🐟 Fish'], odd: '🍎 Apple' },
                    { name: 'food', items: ['🍎 Apple', '🍌 Banana', '🍔 Hamburger', '🍰 Cake'], odd: '🚗 Car' },
                    { name: 'vehicles', items: ['🚗 Car', '🚌 Bus', '🚲 Bicycle', '✈️ Airplane'], odd: '🐶 Dog' },
                    { name: 'things in sky', items: ['☀️ Sun', '☁️ Cloud', '⭐ Star', '🌙 Moon'], odd: '🐟 Fish' },
                    { name: 'fruits', items: ['🍎 Apple', '🍌 Banana', '🍊 Orange', '🍓 Strawberry'], odd: '🐶 Dog' }
                ];
                const cat = categories[this._rand(0, categories.length - 1)];
                const keepItems = this._shuffle(cat.items).slice(0, 3);
                const answers = this._shuffle([...keepItems, cat.odd]);
                return {
                    question: `Which does NOT belong?`,
                    questionSpeak: `Which one does not belong with the others?`,
                    answers,
                    correctIndex: answers.indexOf(cat.odd),
                    topic: 'vocabulary',
                    subtype: 'category-odd-out',
                    explanation: `${cat.odd.split(' ').slice(1).join(' ')} doesn't belong! The others are all ${cat.name}!`,
                    explanationSpeak: `${cat.odd.split(' ').slice(1).join(' ')} doesn't belong! The others are all ${cat.name}!`
                };
            }

            const item = preKVocab[this._rand(0, preKVocab.length - 1)];
            const answers = this._shuffle([item.correct, ...item.wrongs]);
            return {
                question: item.question,
                questionSpeak: item.question,
                answers,
                correctIndex: answers.indexOf(item.correct),
                topic: 'vocabulary',
                subtype: 'category-match',
                explanation: `${item.correct} is the right answer! Great job!`,
                explanationSpeak: `${item.correct.split(' ').slice(1).join(' ')} is the right answer! Great job!`
            };
        }

        let pool;
        if (level <= 2) pool = this._vocabData.kEasy;
        else if (level === 3) pool = this._vocabData.kHard;
        else if (level === 4) pool = this._vocabData.firstEasy;
        else pool = this._vocabData.firstHard;

        const item = pool[this._rand(0, pool.length - 1)];
        const answers = this._shuffle([item.correct, ...item.wrongs]);

        // V5.8: Build meaningful explanation from the question context
        const meaning = item.explain || item.correct;
        const questionClean = item.question.replace(/\n/g, ' ').replace(/"/g, '');

        return {
            question: item.question,
            questionSpeak: questionClean,
            answers,
            correctIndex: answers.indexOf(item.correct),
            topic: 'vocabulary',
            subtype: 'word-meaning',
            explanation: item.explain
                ? `"${item.correct}" — ${item.explain}!`
                : `The answer is "${item.correct}"! ${questionClean}`,
            explanationSpeak: item.explain
                ? `${item.correct} means ${item.explain}!`
                : `The answer is ${item.correct}!`
        };
    },

    // ---- V5.7: PHONEME SEGMENTING (FastBridge composite) ----
    _phonemeSegmenting() {
        const data = this._phonicsData.segmenting;
        const item = data[this._rand(0, data.length - 1)];
        const correct = item.count;
        const wrongs = this._shuffle([2, 3, 4, 5].filter(n => n !== correct)).slice(0, 3);
        const answers = this._shuffle([correct, ...wrongs]);
        const soundDisplay = item.sounds.join(' - ');

        return {
            question: `How many sounds in "${item.word}"?\n${soundDisplay}`,
            questionSpeak: `How many sounds do you hear in the word ${item.word}?`,
            answers: answers.map(String),
            correctIndex: answers.indexOf(correct),
            topic: 'phonics',
            subtype: 'phoneme-segmenting',
            explanation: `"${item.word}" has ${correct} sounds: ${soundDisplay}!`,
            explanationSpeak: `${item.word} has ${correct} sounds: ${item.sounds.join(', ')}!`
        };
    },

    // ---- V5.7: PHONEME BLENDING (FastBridge composite) ----
    _phonemeBlending() {
        const data = this._phonicsData.blending;
        const item = data[this._rand(0, data.length - 1)];
        const answers = this._shuffle([item.word, ...item.wrongs]);

        return {
            question: `Put the sounds together:\n${item.sounds}`,
            questionSpeak: `Put the sounds together: ${item.sounds}. What word do they make?`,
            answers,
            correctIndex: answers.indexOf(item.word),
            topic: 'phonics',
            subtype: 'phoneme-blending',
            explanation: `${item.sounds} makes "${item.word}"! Sound it out: ${item.word}!`,
            explanationSpeak: `The sounds make ${item.word}! ${item.word}!`
        };
    },

    // ---- V5.7: NONSENSE WORD DECODING (FastBridge composite) ----
    _nonsenseWordDecoding() {
        const data = this._phonicsData.nonsense;
        const item = data[this._rand(0, data.length - 1)];
        const correct = item.word;
        const answers = this._shuffle([correct, ...item.wrongs]);

        return {
            question: `Read this made-up word:\n${item.word.toUpperCase()}\nWhich sounds right?`,
            questionSpeak: `Read this made-up word. Which answer sounds right?`,
            answers,
            correctIndex: answers.indexOf(correct),
            topic: 'phonics',
            subtype: 'nonsense-word',
            explanation: `"${item.word}" — it rhymes with "${item.rhymesWith}"! Good decoding!`,
            explanationSpeak: `${item.word} rhymes with ${item.rhymesWith}! Good job sounding it out!`
        };
    },

    // ---- V5.7: LETTER SOUNDS (distinct from letter names) ----
    _letterSoundQuestion() {
        const data = this._phonicsData.letterSounds;
        const item = data[this._rand(0, data.length - 1)];

        if (Math.random() < 0.5) {
            // "What sound does B make?"
            const answers = this._shuffle([item.sound, ...item.wrong]);
            return {
                question: `What sound does "${item.letter}" make?`,
                questionSpeak: `What sound does the letter ${item.letter} make?`,
                answers,
                correctIndex: answers.indexOf(item.sound),
                topic: 'phonics',
                subtype: 'letter-sound',
                explanation: `${item.letter} makes the ${item.sound} sound! Like in "${item.example}"!`,
                explanationSpeak: `${item.letter} makes the ${item.sound} sound, like in ${item.example}!`
            };
        } else {
            // "Which letter makes the /b/ sound?"
            const otherLetters = data.filter(d => d.letter !== item.letter).map(d => d.letter);
            const wrongs = this._shuffle(otherLetters).slice(0, 3);
            const answers = this._shuffle([item.letter, ...wrongs]);
            return {
                question: `Which letter makes the\n${item.sound} sound?`,
                questionSpeak: `Which letter makes the ${item.sound} sound?`,
                answers,
                correctIndex: answers.indexOf(item.letter),
                topic: 'phonics',
                subtype: 'sound-to-letter',
                explanation: `${item.letter} makes the ${item.sound} sound! Like in "${item.example}"!`,
                explanationSpeak: `${item.letter} makes the ${item.sound} sound, like in ${item.example}!`
            };
        }
    },

    // ---- SYLLABLES ----
    _syllables(level) {
        // V20: 2nd grade dispatch
        if (level >= 6) return this._syllables2nd(level);

        // Words organized by syllable count
        const words1 = [
            { word: 'cat', emoji: '🐱' }, { word: 'dog', emoji: '🐶' },
            { word: 'fish', emoji: '🐟' }, { word: 'ball', emoji: '⚽' },
            { word: 'sun', emoji: '☀️' }, { word: 'moon', emoji: '🌙' },
            { word: 'star', emoji: '⭐' }, { word: 'tree', emoji: '🌳' },
            { word: 'car', emoji: '🚗' }, { word: 'hat', emoji: '🎩' },
            { word: 'cup', emoji: '☕' }, { word: 'bed', emoji: '🛏️' },
            { word: 'book', emoji: '📖' }, { word: 'frog', emoji: '🐸' },
            { word: 'cake', emoji: '🎂' }, { word: 'bird', emoji: '🐦' }
        ];

        const words2 = [
            { word: 'apple', emoji: '🍎', split: 'ap-ple' },
            { word: 'tiger', emoji: '🐯', split: 'ti-ger' },
            { word: 'puppy', emoji: '🐶', split: 'pup-py' },
            { word: 'kitten', emoji: '🐱', split: 'kit-ten' },
            { word: 'flower', emoji: '🌸', split: 'flow-er' },
            { word: 'monkey', emoji: '🐒', split: 'mon-key' },
            { word: 'pizza', emoji: '🍕', split: 'piz-za' },
            { word: 'cookie', emoji: '🍪', split: 'cook-ie' },
            { word: 'table', emoji: '🪑', split: 'ta-ble' },
            { word: 'bunny', emoji: '🐰', split: 'bun-ny' },
            { word: 'happy', emoji: '😊', split: 'hap-py' },
            { word: 'water', emoji: '💧', split: 'wa-ter' },
            { word: 'pencil', emoji: '✏️', split: 'pen-cil' },
            { word: 'sister', emoji: '👧', split: 'sis-ter' },
            { word: 'butter', emoji: '🧈', split: 'but-ter' }
        ];

        const words3 = [
            { word: 'butterfly', emoji: '🦋', split: 'but-ter-fly' },
            { word: 'elephant', emoji: '🐘', split: 'el-e-phant' },
            { word: 'dinosaur', emoji: '🦕', split: 'di-no-saur' },
            { word: 'banana', emoji: '🍌', split: 'ba-na-na' },
            { word: 'umbrella', emoji: '☂️', split: 'um-brel-la' },
            { word: 'tomato', emoji: '🍅', split: 'to-ma-to' },
            { word: 'computer', emoji: '💻', split: 'com-pu-ter' },
            { word: 'kangaroo', emoji: '🦘', split: 'kan-ga-roo' },
            { word: 'chocolate', emoji: '🍫', split: 'choc-o-late' },
            { word: 'broccoli', emoji: '🥦', split: 'broc-co-li' },
            { word: 'pineapple', emoji: '🍍', split: 'pine-ap-ple' },
            { word: 'strawberry', emoji: '🍓', split: 'straw-ber-ry' }
        ];

        const words4 = [
            { word: 'watermelon', emoji: '🍉', split: 'wa-ter-mel-on' },
            { word: 'caterpillar', emoji: '🐛', split: 'cat-er-pil-lar' },
            { word: 'helicopter', emoji: '🚁', split: 'hel-i-cop-ter' },
            { word: 'alligator', emoji: '🐊', split: 'al-li-ga-tor' },
            { word: 'macaroni', emoji: '🍝', split: 'mac-a-ro-ni' }
        ];

        if (level < 2) {
            // Pre-K: 1 vs 2 syllable words, "How many claps?"
            const templateType = this._rand(0, 2);

            if (templateType === 0) {
                // "How many claps in [word]?"
                const use1 = Math.random() < 0.5;
                const word = use1 ?
                    words1[this._rand(0, words1.length - 1)] :
                    words2[this._rand(0, words2.length - 1)];
                const count = use1 ? 1 : 2;
                const answers = this._shuffle(['1', '2', '3']);
                return {
                    question: `How many claps in\n${word.emoji} "${word.word}"?\n👏`,
                    questionSpeak: `How many claps in the word ${word.word}?`,
                    answers,
                    correctIndex: answers.indexOf(String(count)),
                    topic: 'syllables',
                    subtype: 'clap-count-prek',
                    explanation: `${word.word} has ${count} ${count === 1 ? 'clap' : 'claps'}! ${use1 ? word.word : word.split}! 👏`,
                    explanationSpeak: `${word.word} has ${count} ${count === 1 ? 'clap' : 'claps'}!`
                };
            } else if (templateType === 1) {
                // "Which word has 1 clap?"
                const target = words1[this._rand(0, words1.length - 1)];
                const wrong1 = words2[this._rand(0, words2.length - 1)];
                const wrong2 = words2[this._rand(0, words2.length - 1)];
                const answers = this._shuffle([
                    `${target.emoji} ${target.word}`,
                    `${wrong1.emoji} ${wrong1.word}`,
                    `${wrong2.emoji} ${wrong2.word}`
                ]);
                const correct = `${target.emoji} ${target.word}`;
                return {
                    question: `Which word has only 1 clap? 👏`,
                    questionSpeak: `Which word has only one clap?`,
                    answers,
                    correctIndex: answers.indexOf(correct),
                    topic: 'syllables',
                    subtype: 'find-one-clap',
                    explanation: `${target.word} has just 1 clap! ${target.word}! 👏`,
                    explanationSpeak: `${target.word} has just one clap!`
                };
            } else {
                // "Which word is longer (more claps)?"
                const short = words1[this._rand(0, words1.length - 1)];
                const long = words2[this._rand(0, words2.length - 1)];
                const answers = this._shuffle([
                    `${long.emoji} ${long.word}`,
                    `${short.emoji} ${short.word}`
                ]);
                const correct = `${long.emoji} ${long.word}`;
                return {
                    question: `Which word has MORE claps? 👏👏`,
                    questionSpeak: `Which word has more claps?`,
                    answers,
                    correctIndex: answers.indexOf(correct),
                    topic: 'syllables',
                    subtype: 'compare-claps',
                    explanation: `${long.word} (${long.split}) has 2 claps! ${short.word} has only 1! 👏👏`,
                    explanationSpeak: `${long.word} has two claps! ${short.word} has only one!`
                };
            }
        }

        if (level < 4) {
            // K levels: 1-3 syllable words, splitting into parts
            const templateType = this._rand(0, 3);

            if (templateType === 0) {
                // "How many syllables?" with 1-3 syllable words
                const pool = [
                    ...words1.map(w => ({ ...w, count: 1, split: w.word })),
                    ...words2.map(w => ({ ...w, count: 2 })),
                    ...words3.map(w => ({ ...w, count: 3 }))
                ];
                const word = pool[this._rand(0, pool.length - 1)];
                const answers = this._shuffle(['1', '2', '3', '4']);
                return {
                    question: `How many syllables in\n${word.emoji} "${word.word}"?`,
                    questionSpeak: `How many syllables in ${word.word}?`,
                    answers,
                    correctIndex: answers.indexOf(String(word.count)),
                    topic: 'syllables',
                    subtype: 'syllable-count-k',
                    explanation: `${word.word} → ${word.split} = ${word.count} ${word.count === 1 ? 'syllable' : 'syllables'}!`,
                    explanationSpeak: `${word.word} has ${word.count} ${word.count === 1 ? 'syllable' : 'syllables'}!`
                };
            } else if (templateType === 1) {
                // "Which word has 2 syllables?"
                const target = words2[this._rand(0, words2.length - 1)];
                const wrong1 = words1[this._rand(0, words1.length - 1)];
                const wrong3 = words3[this._rand(0, words3.length - 1)];
                const answers = this._shuffle([
                    `${target.emoji} ${target.word}`,
                    `${wrong1.emoji} ${wrong1.word}`,
                    `${wrong3.emoji} ${wrong3.word}`
                ]);
                const correct = `${target.emoji} ${target.word}`;
                return {
                    question: `Which word has exactly\n2 syllables?`,
                    questionSpeak: `Which word has exactly two syllables?`,
                    answers,
                    correctIndex: answers.indexOf(correct),
                    topic: 'syllables',
                    subtype: 'find-syllable-count',
                    explanation: `${target.word} → ${target.split} = 2 syllables!`,
                    explanationSpeak: `${target.word} has two syllables! ${target.split}!`
                };
            } else if (templateType === 2) {
                // "How do we break up this word?"
                const word = words2[this._rand(0, words2.length - 1)];
                const parts = word.split.split('-');
                const wrongSplit1 = parts[0][0] + '-' + word.word.slice(1);
                const wrongSplit2 = word.word.slice(0, -1) + '-' + word.word.slice(-1);
                const answers = this._shuffle([word.split, wrongSplit1, wrongSplit2]);
                return {
                    question: `How do we break up\n${word.emoji} "${word.word}"?`,
                    questionSpeak: `How do we break up the word ${word.word}?`,
                    answers,
                    correctIndex: answers.indexOf(word.split),
                    topic: 'syllables',
                    subtype: 'syllable-split-k',
                    explanation: `${word.word} breaks into ${word.split}!`,
                    explanationSpeak: `${word.word} breaks into ${word.split}!`
                };
            } else {
                // "Which word has the MOST syllables?"
                const w1 = words1[this._rand(0, words1.length - 1)];
                const w2 = words2[this._rand(0, words2.length - 1)];
                const w3 = words3[this._rand(0, words3.length - 1)];
                const answers = this._shuffle([
                    `${w1.emoji} ${w1.word}`,
                    `${w2.emoji} ${w2.word}`,
                    `${w3.emoji} ${w3.word}`
                ]);
                const correct = `${w3.emoji} ${w3.word}`;
                return {
                    question: `Which word has the\nMOST syllables?`,
                    questionSpeak: `Which word has the most syllables?`,
                    answers,
                    correctIndex: answers.indexOf(correct),
                    topic: 'syllables',
                    subtype: 'most-syllables',
                    explanation: `${w3.word} → ${w3.split} = 3 syllables! That's the most!`,
                    explanationSpeak: `${w3.word} has three syllables! That's the most!`
                };
            }
        }

        // 1st grade: 1-4 syllable words, breaking apart, compound words
        const templateType = this._rand(0, 3);

        if (templateType === 0) {
            // "How many syllables?" — full range 1-4
            const pool = [
                ...words1.map(w => ({ ...w, count: 1, split: w.word })),
                ...words2.map(w => ({ ...w, count: 2 })),
                ...words3.map(w => ({ ...w, count: 3 })),
                ...words4.map(w => ({ ...w, count: 4 }))
            ];
            const word = pool[this._rand(0, pool.length - 1)];
            const answers = this._shuffle(['1', '2', '3', '4']);
            return {
                question: `How many syllables?\n${word.emoji} "${word.word}"`,
                questionSpeak: `How many syllables in ${word.word}?`,
                answers,
                correctIndex: answers.indexOf(String(word.count)),
                topic: 'syllables',
                subtype: 'syllable-count',
                explanation: `${word.word} → ${word.split} = ${word.count} ${word.count === 1 ? 'syllable' : 'syllables'}!`,
                explanationSpeak: `${word.word} has ${word.count} ${word.count === 1 ? 'syllable' : 'syllables'}!`
            };
        } else if (templateType === 1) {
            // "Sort: 1, 2, or 3 syllables?"
            const word = [...words1.map(w => ({ ...w, count: 1 })),
                ...words2.map(w => ({ ...w, count: 2 })),
                ...words3.map(w => ({ ...w, count: 3 }))
            ][this._rand(0, words1.length + words2.length + words3.length - 1)];
            const answers = this._shuffle(['1 syllable', '2 syllables', '3 syllables', '4 syllables']);
            const correct = `${word.count} ${word.count === 1 ? 'syllable' : 'syllables'}`;
            return {
                question: `${word.emoji} "${word.word}" has how many syllables?`,
                questionSpeak: `How many syllables does ${word.word} have?`,
                answers,
                correctIndex: answers.indexOf(correct),
                topic: 'syllables',
                subtype: 'syllable-sort',
                explanation: `${word.word} = ${word.count} ${word.count === 1 ? 'syllable' : 'syllables'}!`,
                explanationSpeak: `${word.word} has ${word.count} ${word.count === 1 ? 'syllable' : 'syllables'}!`
            };
        } else if (templateType === 2) {
            // "Break this word into syllables"
            const pool = [...words3, ...words4];
            const word = pool[this._rand(0, pool.length - 1)];
            const parts = word.split.split('-');
            // Generate wrong splits
            const wrongSplit1 = parts[0] + '-' + parts.slice(1).join('');
            const wrongSplit2 = parts.slice(0, -1).join('') + '-' + parts[parts.length - 1];
            const answers = this._shuffle([word.split, wrongSplit1, wrongSplit2]);
            return {
                question: `Break it apart:\n${word.emoji} "${word.word}"`,
                questionSpeak: `Break the word ${word.word} into syllables`,
                answers,
                correctIndex: answers.indexOf(word.split),
                topic: 'syllables',
                subtype: 'syllable-split',
                explanation: `${word.word} → ${word.split}!`,
                explanationSpeak: `${word.word} breaks into ${word.split}!`
            };
        } else {
            // Compound word syllables: "How many syllables in 'sunflower'?"
            const compounds = [
                { word: 'sunflower', emoji: '🌻', split: 'sun-flow-er', count: 3 },
                { word: 'rainbow', emoji: '🌈', split: 'rain-bow', count: 2 },
                { word: 'cupcake', emoji: '🧁', split: 'cup-cake', count: 2 },
                { word: 'starfish', emoji: '⭐', split: 'star-fish', count: 2 },
                { word: 'snowman', emoji: '⛄', split: 'snow-man', count: 2 },
                { word: 'playground', emoji: '🛝', split: 'play-ground', count: 2 },
                { word: 'waterfall', emoji: '💦', split: 'wa-ter-fall', count: 3 },
                { word: 'butterfly', emoji: '🦋', split: 'but-ter-fly', count: 3 }
            ];
            const word = compounds[this._rand(0, compounds.length - 1)];
            const answers = this._shuffle(['1', '2', '3', '4']);
            return {
                question: `How many syllables?\n${word.emoji} "${word.word}"`,
                questionSpeak: `How many syllables in ${word.word}?`,
                answers,
                correctIndex: answers.indexOf(String(word.count)),
                topic: 'syllables',
                subtype: 'compound-syllable-count',
                explanation: `${word.word} → ${word.split} = ${word.count} syllables!`,
                explanationSpeak: `${word.word} has ${word.count} syllables! ${word.split}!`
            };
        }
    },

    // ============================================================
    // V20: 2nd GRADE EXTENSIONS FOR EXISTING TOPICS
    // ============================================================

    // ---- LETTERS 2nd Grade: alphabetical order, missing letter in sequence ----
    _letters2nd(level) {
        if (level <= 6 || Math.random() < 0.5) {
            // Alphabetical order: which word comes first?
            const wordSets = [
                ['apple', 'banana', 'cherry', 'dog'],
                ['cat', 'door', 'egg', 'fish'],
                ['game', 'hat', 'ice', 'jump'],
                ['king', 'lamp', 'moon', 'nest'],
                ['open', 'park', 'queen', 'rain'],
                ['star', 'tree', 'under', 'van'],
                ['water', 'box', 'yarn', 'zebra'],
                ['ant', 'bear', 'cow', 'duck'],
                ['frog', 'goat', 'horse', 'igloo'],
                ['jacket', 'kite', 'lion', 'mouse'],
                ['bell', 'card', 'desk', 'elbow'],
                ['grape', 'honey', 'island', 'juice']
            ];
            const set = wordSets[this._rand(0, wordSets.length - 1)];
            const sorted = [...set].sort();
            const correct = sorted[0];
            const shuffled = this._shuffle(set);
            return {
                question: `Which word comes FIRST\nin ABC order?`,
                questionSpeak: `Which word comes first in alphabetical order?`,
                answers: shuffled,
                correctIndex: shuffled.indexOf(correct),
                topic: 'letters',
                subtype: 'abc-order',
                explanation: `"${correct}" comes first! ${sorted.join(', ')} — that's ABC order!`,
                explanationSpeak: `${correct} comes first in ABC order!`
            };
        } else {
            // Missing letter in sequence
            const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const start = this._rand(0, 22);
            const seq = [upper[start], upper[start + 1], upper[start + 2], upper[start + 3]];
            const hideIdx = this._rand(1, 2);
            const correct = seq[hideIdx];
            seq[hideIdx] = '?';
            const wrongs = [];
            let att = 0;
            while (wrongs.length < 3 && att++ < 50) {
                const w = upper[this._rand(0, 25)];
                if (w !== correct && !wrongs.includes(w)) wrongs.push(w);
            }
            const answers = this._shuffle([correct, ...wrongs]);
            return {
                question: `What letter is missing?\n${seq.join('  ')}`,
                questionSpeak: `What letter is missing in the sequence?`,
                answers,
                correctIndex: answers.indexOf(correct),
                topic: 'letters',
                subtype: 'missing-letter',
                explanation: `The missing letter is ${correct}! The sequence is ${upper[start]}, ${upper[start+1]}, ${upper[start+2]}, ${upper[start+3]}!`,
                explanationSpeak: `The missing letter is ${correct}!`
            };
        }
    },

    // ---- PHONICS 2nd Grade: vowel teams, r-controlled vowels ----
    _phonics2nd(level) {
        if (level <= 6 || Math.random() < 0.5) {
            // Vowel teams: ea, oa, ai, ee, oo, ou, ow
            const vowelTeams = [
                { team: 'ea', words: ['read', 'bead', 'leaf', 'team', 'bean', 'meat', 'seat', 'heat'], wrong: ['road', 'rain', 'boot'] },
                { team: 'oa', words: ['boat', 'coat', 'road', 'toad', 'soap', 'goat', 'load', 'foam'], wrong: ['beat', 'rain', 'moon'] },
                { team: 'ai', words: ['rain', 'mail', 'tail', 'pain', 'sail', 'wait', 'bait', 'jail'], wrong: ['boat', 'leaf', 'moon'] },
                { team: 'ee', words: ['tree', 'feet', 'seed', 'need', 'deer', 'week', 'heel', 'beef'], wrong: ['boat', 'rain', 'moon'] },
                { team: 'oo', words: ['moon', 'food', 'pool', 'boot', 'roof', 'cool', 'room', 'tool'], wrong: ['boat', 'rain', 'leaf'] },
                { team: 'ou', words: ['loud', 'cloud', 'house', 'mouse', 'round', 'found', 'sound', 'ground'], wrong: ['boat', 'rain', 'moon'] },
                { team: 'ow', words: ['cow', 'town', 'brown', 'down', 'crown', 'frown', 'gown', 'how'], wrong: ['boat', 'rain', 'leaf'] }
            ];
            const vt = vowelTeams[this._rand(0, vowelTeams.length - 1)];
            const correct = vt.words[this._rand(0, vt.words.length - 1)];
            const answers = this._shuffle([correct, ...vt.wrong]);
            return {
                question: `Which word has the\n"${vt.team}" vowel team?`,
                questionSpeak: `Which word has the ${vt.team} vowel team?`,
                answers,
                correctIndex: answers.indexOf(correct),
                topic: 'phonics',
                subtype: 'vowel-team',
                explanation: `"${correct}" has the "${vt.team}" vowel team! The letters ${vt.team} work together!`,
                explanationSpeak: `${correct} has the ${vt.team} vowel team!`
            };
        } else {
            // R-controlled vowels: ar, er, ir, or, ur
            const rControlled = [
                { pattern: 'ar', words: ['car', 'star', 'farm', 'park', 'barn', 'card', 'dark', 'yard'], wrong: ['bird', 'fern', 'corn'] },
                { pattern: 'er', words: ['fern', 'her', 'tiger', 'water', 'flower', 'letter', 'sister', 'winter'], wrong: ['car', 'bird', 'corn'] },
                { pattern: 'ir', words: ['bird', 'girl', 'first', 'shirt', 'dirt', 'stir', 'third', 'circle'], wrong: ['car', 'fern', 'corn'] },
                { pattern: 'or', words: ['corn', 'fork', 'horse', 'storm', 'short', 'sport', 'north', 'morning'], wrong: ['car', 'bird', 'fern'] },
                { pattern: 'ur', words: ['burn', 'turn', 'nurse', 'purple', 'turtle', 'church', 'hurt', 'fur'], wrong: ['car', 'bird', 'corn'] }
            ];
            const rc = rControlled[this._rand(0, rControlled.length - 1)];
            const correct = rc.words[this._rand(0, rc.words.length - 1)];
            const answers = this._shuffle([correct, ...rc.wrong]);
            return {
                question: `Which word has the\n"${rc.pattern}" sound?`,
                questionSpeak: `Which word has the ${rc.pattern} sound?`,
                answers,
                correctIndex: answers.indexOf(correct),
                topic: 'phonics',
                subtype: 'r-controlled-vowel',
                explanation: `"${correct}" has the "${rc.pattern}" sound! The R changes the vowel sound!`,
                explanationSpeak: `${correct} has the ${rc.pattern} sound!`
            };
        }
    },

    // ---- SIGHT WORDS 2nd Grade: Dolch 2nd grade list ----
    _sightWords2nd(level) {
        const secondGradeWords = [
            'always', 'around', 'because', 'been', 'before', 'best', 'both', 'buy',
            'call', 'cold', 'does', 'done', 'draw', 'drink', 'eight', 'fall',
            'far', 'fast', 'first', 'five', 'found', 'gave', 'goes', 'green',
            'its', 'keep', 'kind', 'laugh', 'light', 'long', 'many', 'much',
            'myself', 'never', 'next', 'only', 'own', 'pick', 'pull', 'read',
            'right', 'room', 'run', 'say', 'seven', 'shall', 'show', 'sing',
            'sit', 'sleep', 'small', 'start', 'such', 'tell', 'ten', 'thank',
            'their', 'these', 'those', 'today', 'together', 'try', 'upon', 'very',
            'warm', 'wash', 'which', 'why', 'wish', 'work', 'world', 'write'
        ];

        const target = secondGradeWords[this._rand(0, secondGradeWords.length - 1)];

        // Sentence templates for 2nd grade sight words
        const templates = {
            'always': 'I ___ brush my teeth.', 'around': 'We walked ___ the block.',
            'because': 'I smiled ___ I was happy.', 'been': 'I have ___ to the park.',
            'before': 'Wash hands ___ dinner.', 'best': 'She is my ___ friend.',
            'both': 'We ___ like pizza.', 'buy': 'Dad will ___ some milk.',
            'call': 'Please ___ me later.', 'cold': 'The ice is very ___.',
            'does': 'What ___ this word mean?', 'done': 'Are you ___ yet?',
            'draw': 'I like to ___ pictures.', 'drink': 'Please ___ your water.',
            'fast': 'The car went very ___.', 'first': 'I was ___ in line.',
            'five': 'I have ___ fingers.', 'found': 'I ___ a penny!',
            'gave': 'She ___ me a gift.', 'goes': 'He ___ to school.',
            'green': 'The grass is ___.', 'keep': 'You can ___ this toy.',
            'kind': 'She is very ___.', 'laugh': 'That joke made me ___.',
            'long': 'The snake is very ___.', 'many': 'How ___ do you have?',
            'much': 'Thank you so ___!', 'never': 'I ___ eat bugs!',
            'only': 'I have ___ one left.', 'read': 'I love to ___ books.',
            'right': 'That answer is ___!', 'show': 'Please ___ me how.',
            'sing': 'I like to ___ songs.', 'sleep': 'Time to go to ___.',
            'small': 'The ant is very ___.', 'start': 'Let us ___ the game!',
            'tell': 'Can you ___ me a story?', 'together': 'We play ___.',
            'try': 'Please ___ again!', 'very': 'I am ___ happy today.',
            'warm': 'The soup is nice and ___.', 'wash': 'Please ___ your hands.',
            'which': '___ one do you want?', 'why': '___ is the sky blue?',
            'wish': 'I ___ for a puppy.', 'work': 'Let us ___ together.',
            'write': 'I can ___ my name.'
        };

        if (templates[target] && (level >= 7 || Math.random() < 0.4)) {
            const sentence = templates[target];
            const wrongs = [];
            let att = 0;
            while (wrongs.length < 3 && att++ < 50) {
                const w = secondGradeWords[this._rand(0, secondGradeWords.length - 1)];
                if (w !== target && !wrongs.includes(w)) wrongs.push(w);
            }
            const answers = this._shuffle([target, ...wrongs]);
            const full = sentence.replace('___', target);
            return {
                question: `Fill in the blank:\n"${sentence}"`,
                questionSpeak: `Fill in the blank: ${sentence.replace('___', 'blank')}`,
                answers,
                correctIndex: answers.indexOf(target),
                topic: 'sight-words',
                subtype: 'sentence-fill-2nd',
                explanation: `"${full}" — "${target}" completes the sentence!`,
                explanationSpeak: `${full}. The word ${target} completes the sentence!`
            };
        }

        const wrongs = [];
        let att = 0;
        while (wrongs.length < 3 && att++ < 50) {
            const w = secondGradeWords[this._rand(0, secondGradeWords.length - 1)];
            if (w !== target && !wrongs.includes(w)) wrongs.push(w);
        }
        const answers = this._shuffle([target, ...wrongs]);
        return {
            question: `Find the word:\n"${target}"`,
            questionSpeak: `Find the word: ${target}`,
            answers,
            correctIndex: answers.indexOf(target),
            topic: 'sight-words',
            subtype: 'find-word-2nd',
            explanation: `The word is "${target}"! Let's spell it: ${target.split('').join(', ')}. ${target}!`,
            explanationSpeak: `The word is ${target}! Let's spell it: ${target.split('').join(', ')}. ${target}!`
        };
    },

    // ---- RHYMING 2nd Grade: multi-syllable rhymes, word families ----
    _rhyming2nd(level) {
        const advancedSets = [
            ['night', 'light', 'right', 'fight', 'might', 'sight', 'tight', 'bright'],
            ['station', 'nation', 'vacation', 'location'],
            ['funny', 'bunny', 'sunny', 'honey', 'money'],
            ['sleeping', 'keeping', 'creeping', 'sweeping'],
            ['walking', 'talking', 'stalking', 'chalking'],
            ['story', 'glory', 'morning', 'boring'],
            ['table', 'cable', 'fable', 'stable', 'label'],
            ['flower', 'power', 'tower', 'shower', 'hour'],
            ['flying', 'crying', 'trying', 'drying'],
            ['thinking', 'drinking', 'sinking', 'blinking'],
            ['thunder', 'under', 'wonder', 'blunder'],
            ['middle', 'riddle', 'fiddle', 'little']
        ];

        if (level <= 6 || Math.random() < 0.5) {
            // Find a rhyme from multi-syllable sets
            const set = advancedSets[this._rand(0, advancedSets.length - 1)];
            const target = set[this._rand(0, set.length - 1)];
            let correct;
            do { correct = set[this._rand(0, set.length - 1)]; } while (correct === target);

            const wrongs = [];
            let att = 0;
            while (wrongs.length < 3 && att++ < 50) {
                const otherSet = advancedSets[this._rand(0, advancedSets.length - 1)];
                if (otherSet === set) continue;
                const w = otherSet[this._rand(0, otherSet.length - 1)];
                if (!wrongs.includes(w) && w !== correct) wrongs.push(w);
            }
            const answers = this._shuffle([correct, ...wrongs]);
            return {
                question: `Which word rhymes with\n"${target}"?`,
                questionSpeak: `Which word rhymes with ${target}?`,
                answers,
                correctIndex: answers.indexOf(correct),
                topic: 'rhyming',
                subtype: 'match-rhyme-2nd',
                explanation: `"${correct}" rhymes with "${target}"! They end the same way!`,
                explanationSpeak: `${correct} rhymes with ${target}!`
            };
        } else {
            // Odd one out with harder words
            const set = advancedSets[this._rand(0, advancedSets.length - 1)];
            const rhymers = this._shuffle([...set]).slice(0, 3);
            let oddSet;
            do { oddSet = advancedSets[this._rand(0, advancedSets.length - 1)]; } while (oddSet === set);
            const oddWord = oddSet[this._rand(0, oddSet.length - 1)];
            const answers = this._shuffle([...rhymers, oddWord]);
            return {
                question: `Which word does NOT rhyme?`,
                questionSpeak: `Which word does not rhyme with the others?`,
                answers,
                correctIndex: answers.indexOf(oddWord),
                topic: 'rhyming',
                subtype: 'odd-one-out-2nd',
                explanation: `"${oddWord}" does not rhyme! ${rhymers.join(', ')} all rhyme!`,
                explanationSpeak: `${oddWord} does not rhyme! ${rhymers.join(', ')} all rhyme!`
            };
        }
    },

    // ---- SENTENCES 2nd Grade: fix errors, sentence vs fragment ----
    _sentences2nd(level) {
        if (level <= 6 || Math.random() < 0.5) {
            // Fix the sentence — find the correctly written version
            const fixItems = [
                { wrong: 'the dog runned fast', correct: 'The dog ran fast.', rule: 'past tense' },
                { wrong: 'him went to school', correct: 'He went to school.', rule: 'pronoun' },
                { wrong: 'i like ice cream', correct: 'I like ice cream.', rule: 'capitalize I' },
                { wrong: 'she dont like rain', correct: 'She doesn\'t like rain.', rule: 'doesn\'t' },
                { wrong: 'we was playing outside', correct: 'We were playing outside.', rule: 'were vs was' },
                { wrong: 'the childs played', correct: 'The children played.', rule: 'plural' },
                { wrong: 'them are my friends', correct: 'They are my friends.', rule: 'pronoun' },
                { wrong: 'her goed home', correct: 'She went home.', rule: 'past tense' },
                { wrong: 'me and him played', correct: 'He and I played.', rule: 'pronoun order' },
                { wrong: 'the mouses ran away', correct: 'The mice ran away.', rule: 'irregular plural' },
                { wrong: 'we bringed our lunch', correct: 'We brought our lunch.', rule: 'past tense' },
                { wrong: 'the babys cried', correct: 'The babies cried.', rule: 'plural' },
                { wrong: 'she readed a book', correct: 'She read a book.', rule: 'past tense' },
                { wrong: 'him and me went', correct: 'He and I went.', rule: 'pronoun' },
                { wrong: 'the mans worked', correct: 'The men worked.', rule: 'irregular plural' },
                { wrong: 'they was happy', correct: 'They were happy.', rule: 'were vs was' }
            ];
            const item = fixItems[this._rand(0, fixItems.length - 1)];
            const wrongOptions = [
                item.wrong.charAt(0).toUpperCase() + item.wrong.slice(1),
                item.wrong,
                item.wrong + '.'
            ];
            const wrongs = this._shuffle(wrongOptions).slice(0, 3);
            const answers = this._shuffle([item.correct, ...wrongs]);
            return {
                question: `Which sentence is correct?`,
                questionSpeak: `Which sentence is written correctly?`,
                answers,
                correctIndex: answers.indexOf(item.correct),
                topic: 'sentences',
                subtype: 'fix-sentence',
                explanation: `"${item.correct}" is correct! We fixed the ${item.rule}!`,
                explanationSpeak: `${item.correct} is the correct way to write it!`
            };
        } else {
            // Sentence vs fragment
            const items = [
                { text: 'The cat sat on the mat.', type: 'sentence' },
                { text: 'Running very fast.', type: 'fragment' },
                { text: 'She likes to read books.', type: 'sentence' },
                { text: 'Under the big tree.', type: 'fragment' },
                { text: 'We went to the park.', type: 'sentence' },
                { text: 'Because it was raining.', type: 'fragment' },
                { text: 'The happy little puppy.', type: 'fragment' },
                { text: 'He ate all his lunch.', type: 'sentence' },
                { text: 'Playing in the yard.', type: 'fragment' },
                { text: 'My mom baked a cake.', type: 'sentence' },
                { text: 'The very tall building.', type: 'fragment' },
                { text: 'Birds fly south in winter.', type: 'sentence' },
                { text: 'After school today.', type: 'fragment' },
                { text: 'The dog chased its tail.', type: 'sentence' },
                { text: 'Jumping over puddles.', type: 'fragment' },
                { text: 'She drew a pretty picture.', type: 'sentence' }
            ];
            const item = items[this._rand(0, items.length - 1)];
            const correct = item.type === 'sentence' ? 'Sentence' : 'Fragment';
            const answers = this._shuffle(['Sentence', 'Fragment', 'Question', 'Not sure']);
            return {
                question: `Sentence or fragment?\n"${item.text}"`,
                questionSpeak: `Is this a sentence or a fragment? ${item.text}`,
                answers,
                correctIndex: answers.indexOf(correct),
                topic: 'sentences',
                subtype: 'sentence-or-fragment',
                explanation: item.type === 'sentence'
                    ? `"${item.text}" is a complete sentence! It has a subject and a verb!`
                    : `"${item.text}" is a fragment! It's missing a subject or verb!`,
                explanationSpeak: item.type === 'sentence'
                    ? `That's a complete sentence! It has a subject and a verb!`
                    : `That's a fragment! It's missing something to be a complete sentence!`
            };
        }
    },

    // ---- VOCABULARY 2nd Grade: context clues, multiple meanings, synonyms/antonyms ----
    _vocabulary2nd(level) {
        const roll = Math.random();
        if (roll < 0.35) {
            // Context clues — figure out word meaning from sentence
            const contextItems = [
                { sentence: 'The enormous elephant was bigger than the bus.', word: 'enormous', correct: 'very big', wrongs: ['very small', 'very fast', 'very quiet'] },
                { sentence: 'She was so famished that she ate two sandwiches.', word: 'famished', correct: 'very hungry', wrongs: ['very tired', 'very happy', 'very cold'] },
                { sentence: 'The timid kitten hid under the bed.', word: 'timid', correct: 'shy or scared', wrongs: ['brave', 'angry', 'hungry'] },
                { sentence: 'He was elated when he won the prize.', word: 'elated', correct: 'very happy', wrongs: ['very sad', 'very tired', 'very sick'] },
                { sentence: 'The sweltering day made everyone want to swim.', word: 'sweltering', correct: 'very hot', wrongs: ['very cold', 'very windy', 'very dark'] },
                { sentence: 'She sprinted to the finish line as fast as she could.', word: 'sprinted', correct: 'ran fast', wrongs: ['walked slow', 'sat down', 'fell over'] },
                { sentence: 'The peculiar noise made the dog tilt its head.', word: 'peculiar', correct: 'strange', wrongs: ['loud', 'quiet', 'pretty'] },
                { sentence: 'The weary traveler needed to rest.', word: 'weary', correct: 'very tired', wrongs: ['very happy', 'very young', 'very fast'] },
                { sentence: 'She was furious when someone broke her toy.', word: 'furious', correct: 'very angry', wrongs: ['very happy', 'very quiet', 'very sad'] },
                { sentence: 'The fragile vase broke when it fell.', word: 'fragile', correct: 'easy to break', wrongs: ['very heavy', 'very old', 'very pretty'] },
                { sentence: 'The barren desert had no plants or water.', word: 'barren', correct: 'empty, bare', wrongs: ['full of life', 'very cold', 'very wet'] },
                { sentence: 'The graceful dancer moved like a swan.', word: 'graceful', correct: 'smooth, elegant', wrongs: ['clumsy', 'fast', 'loud'] }
            ];
            const item = contextItems[this._rand(0, contextItems.length - 1)];
            const answers = this._shuffle([item.correct, ...item.wrongs]);
            return {
                question: `"${item.sentence}"\n\nWhat does "${item.word}" mean?`,
                questionSpeak: `${item.sentence} What does ${item.word} mean?`,
                answers,
                correctIndex: answers.indexOf(item.correct),
                topic: 'vocabulary',
                subtype: 'context-clues',
                explanation: `"${item.word}" means ${item.correct}! The sentence gives us clues!`,
                explanationSpeak: `${item.word} means ${item.correct}! The sentence helped us figure it out!`
            };
        } else if (roll < 0.65) {
            // Synonyms and antonyms
            const isSynonym = Math.random() < 0.5;
            const pairs = isSynonym ? [
                { word: 'happy', match: 'glad', wrongs: ['sad', 'angry', 'tired'] },
                { word: 'big', match: 'large', wrongs: ['tiny', 'short', 'thin'] },
                { word: 'fast', match: 'quick', wrongs: ['slow', 'quiet', 'heavy'] },
                { word: 'cold', match: 'chilly', wrongs: ['warm', 'soft', 'loud'] },
                { word: 'scared', match: 'afraid', wrongs: ['brave', 'calm', 'happy'] },
                { word: 'smart', match: 'clever', wrongs: ['silly', 'slow', 'weak'] },
                { word: 'begin', match: 'start', wrongs: ['finish', 'stop', 'wait'] },
                { word: 'tiny', match: 'small', wrongs: ['huge', 'tall', 'wide'] },
                { word: 'shut', match: 'close', wrongs: ['open', 'push', 'lift'] },
                { word: 'error', match: 'mistake', wrongs: ['answer', 'success', 'truth'] }
            ] : [
                { word: 'happy', match: 'sad', wrongs: ['glad', 'jolly', 'cheerful'] },
                { word: 'big', match: 'small', wrongs: ['huge', 'large', 'giant'] },
                { word: 'fast', match: 'slow', wrongs: ['quick', 'rapid', 'speedy'] },
                { word: 'hot', match: 'cold', wrongs: ['warm', 'burning', 'boiling'] },
                { word: 'brave', match: 'scared', wrongs: ['bold', 'strong', 'tough'] },
                { word: 'loud', match: 'quiet', wrongs: ['noisy', 'booming', 'roaring'] },
                { word: 'open', match: 'closed', wrongs: ['wide', 'clear', 'free'] },
                { word: 'full', match: 'empty', wrongs: ['packed', 'loaded', 'stuffed'] },
                { word: 'dark', match: 'light', wrongs: ['dim', 'shady', 'gloomy'] },
                { word: 'wet', match: 'dry', wrongs: ['damp', 'soaked', 'moist'] }
            ];
            const item = pairs[this._rand(0, pairs.length - 1)];
            const answers = this._shuffle([item.match, ...item.wrongs]);
            const label = isSynonym ? 'synonym' : 'antonym';
            const meaning = isSynonym ? 'means the SAME as' : 'means the OPPOSITE of';
            return {
                question: `Which word ${meaning}\n"${item.word}"?`,
                questionSpeak: `Which word ${meaning} ${item.word}?`,
                answers,
                correctIndex: answers.indexOf(item.match),
                topic: 'vocabulary',
                subtype: isSynonym ? 'synonym' : 'antonym',
                explanation: `"${item.match}" ${meaning} "${item.word}"! They are ${label}s!`,
                explanationSpeak: `${item.match} ${meaning} ${item.word}! They are ${label}s!`
            };
        } else {
            // Multiple-meaning words
            const multiMeaning = [
                { word: 'bat', meanings: ['a flying animal', 'something you hit a ball with'], q: 'Which is a meaning of "bat"?', wrongs: ['a type of hat', 'a loud sound', 'a kind of boat'] },
                { word: 'ring', meanings: ['jewelry for your finger', 'the sound a bell makes'], q: 'Which is a meaning of "ring"?', wrongs: ['a type of shoe', 'a big rock', 'a kind of food'] },
                { word: 'bark', meanings: ['the sound a dog makes', 'the outside of a tree'], q: 'Which is a meaning of "bark"?', wrongs: ['a type of bird', 'a piece of candy', 'a kind of cloud'] },
                { word: 'light', meanings: ['not heavy', 'what helps you see'], q: 'Which is a meaning of "light"?', wrongs: ['very tall', 'a loud noise', 'a kind of food'] },
                { word: 'fly', meanings: ['to move through the air', 'a small buzzing insect'], q: 'Which is a meaning of "fly"?', wrongs: ['a big fish', 'a type of shoe', 'a kind of hat'] },
                { word: 'run', meanings: ['to move fast on foot', 'a tear in your stocking'], q: 'Which is a meaning of "run"?', wrongs: ['a type of tree', 'a loud crash', 'a kind of bird'] },
                { word: 'spring', meanings: ['a season of the year', 'to jump up quickly'], q: 'Which is a meaning of "spring"?', wrongs: ['a type of car', 'a loud bell', 'a kind of hat'] },
                { word: 'fall', meanings: ['to drop down', 'a season of the year'], q: 'Which is a meaning of "fall"?', wrongs: ['to build up', 'a kind of fish', 'a type of shoe'] },
                { word: 'watch', meanings: ['to look at something', 'a clock on your wrist'], q: 'Which is a meaning of "watch"?', wrongs: ['a type of bird', 'a loud sound', 'a kind of plant'] },
                { word: 'nail', meanings: ['on the end of your finger', 'a metal piece you hammer'], q: 'Which is a meaning of "nail"?', wrongs: ['a type of hat', 'a loud noise', 'a kind of fish'] }
            ];
            const item = multiMeaning[this._rand(0, multiMeaning.length - 1)];
            const correct = item.meanings[this._rand(0, item.meanings.length - 1)];
            const wrongs = this._shuffle(item.wrongs).slice(0, 3);
            const answers = this._shuffle([correct, ...wrongs]);
            return {
                question: `${item.q}`,
                questionSpeak: item.q,
                answers,
                correctIndex: answers.indexOf(correct),
                topic: 'vocabulary',
                subtype: 'multiple-meaning',
                explanation: `"${item.word}" can mean "${item.meanings[0]}" or "${item.meanings[1]}"! Some words have more than one meaning!`,
                explanationSpeak: `${item.word} can mean ${item.meanings[0]} or ${item.meanings[1]}! Some words have more than one meaning!`
            };
        }
    },

    // ---- SYLLABLES 2nd Grade: 3-syllable words, syllable division ----
    _syllables2nd(level) {
        const words3 = [
            { word: 'elephant', emoji: '🐘', split: 'el-e-phant', count: 3 },
            { word: 'beautiful', emoji: '🌸', split: 'beau-ti-ful', count: 3 },
            { word: 'dinosaur', emoji: '🦕', split: 'di-no-saur', count: 3 },
            { word: 'banana', emoji: '🍌', split: 'ba-na-na', count: 3 },
            { word: 'umbrella', emoji: '☂️', split: 'um-brel-la', count: 3 },
            { word: 'computer', emoji: '💻', split: 'com-pu-ter', count: 3 },
            { word: 'tomorrow', emoji: '📅', split: 'to-mor-row', count: 3 },
            { word: 'chocolate', emoji: '🍫', split: 'choc-o-late', count: 3 },
            { word: 'important', emoji: '⭐', split: 'im-por-tant', count: 3 },
            { word: 'alphabet', emoji: '🔤', split: 'al-pha-bet', count: 3 },
            { word: 'family', emoji: '👨‍👩‍👧', split: 'fam-i-ly', count: 3 },
            { word: 'adventure', emoji: '🗺️', split: 'ad-ven-ture', count: 3 }
        ];
        const words4 = [
            { word: 'caterpillar', emoji: '🐛', split: 'cat-er-pil-lar', count: 4 },
            { word: 'watermelon', emoji: '🍉', split: 'wa-ter-mel-on', count: 4 },
            { word: 'alligator', emoji: '🐊', split: 'al-li-ga-tor', count: 4 },
            { word: 'helicopter', emoji: '🚁', split: 'hel-i-cop-ter', count: 4 },
            { word: 'dictionary', emoji: '📖', split: 'dic-tion-ar-y', count: 4 },
            { word: 'television', emoji: '📺', split: 'tel-e-vi-sion', count: 4 }
        ];

        const allWords = [...words3, ...words4];
        const word = allWords[this._rand(0, allWords.length - 1)];

        if (level <= 6 || Math.random() < 0.5) {
            // How many syllables?
            const answers = this._shuffle(['2', '3', '4', '5']);
            return {
                question: `How many syllables?\n${word.emoji} "${word.word}"`,
                questionSpeak: `How many syllables in ${word.word}?`,
                answers,
                correctIndex: answers.indexOf(String(word.count)),
                topic: 'syllables',
                subtype: 'syllable-count-2nd',
                explanation: `${word.word} → ${word.split} = ${word.count} syllables!`,
                explanationSpeak: `${word.word} has ${word.count} syllables! ${word.split}!`
            };
        } else {
            // Divide the word into syllables
            const parts = word.split.split('-');
            // Generate plausible wrong splits
            const wrongSplits = [];
            if (parts.length === 3) {
                wrongSplits.push(parts[0] + parts[1] + '-' + parts[2]);
                wrongSplits.push(parts[0] + '-' + parts[1] + parts[2]);
                wrongSplits.push(parts[0].slice(0, -1) + '-' + parts[0].slice(-1) + parts[1] + '-' + parts[2]);
            } else {
                wrongSplits.push(parts[0] + parts[1] + '-' + parts[2] + '-' + parts[3]);
                wrongSplits.push(parts[0] + '-' + parts[1] + parts[2] + '-' + parts[3]);
                wrongSplits.push(parts[0] + '-' + parts[1] + '-' + parts[2] + parts[3]);
            }
            const answers = this._shuffle([word.split, ...wrongSplits.slice(0, 3)]);
            return {
                question: `Break it apart:\n${word.emoji} "${word.word}"`,
                questionSpeak: `Break the word ${word.word} into syllables`,
                answers,
                correctIndex: answers.indexOf(word.split),
                topic: 'syllables',
                subtype: 'syllable-split-2nd',
                explanation: `${word.word} → ${word.split}! Clap it out: ${word.split}!`,
                explanationSpeak: `${word.word} breaks into ${word.split}!`
            };
        }
    },

    // ============================================================
    // V20: 5 NEW 2nd GRADE TOPICS
    // ============================================================

    // ---- COMPOUND WORDS ----
    _compoundWords(level) {
        const compounds = [
            { word: 'sunflower', parts: ['sun', 'flower'], emoji: '🌻' },
            { word: 'rainbow', parts: ['rain', 'bow'], emoji: '🌈' },
            { word: 'cupcake', parts: ['cup', 'cake'], emoji: '🧁' },
            { word: 'starfish', parts: ['star', 'fish'], emoji: '⭐' },
            { word: 'snowman', parts: ['snow', 'man'], emoji: '⛄' },
            { word: 'football', parts: ['foot', 'ball'], emoji: '🏈' },
            { word: 'bedroom', parts: ['bed', 'room'], emoji: '🛏️' },
            { word: 'toothbrush', parts: ['tooth', 'brush'], emoji: '🪥' },
            { word: 'playground', parts: ['play', 'ground'], emoji: '🛝' },
            { word: 'butterfly', parts: ['butter', 'fly'], emoji: '🦋' },
            { word: 'popcorn', parts: ['pop', 'corn'], emoji: '🍿' },
            { word: 'pancake', parts: ['pan', 'cake'], emoji: '🥞' },
            { word: 'goldfish', parts: ['gold', 'fish'], emoji: '🐠' },
            { word: 'airplane', parts: ['air', 'plane'], emoji: '✈️' },
            { word: 'mailbox', parts: ['mail', 'box'], emoji: '📬' },
            { word: 'doorbell', parts: ['door', 'bell'], emoji: '🔔' },
            { word: 'backpack', parts: ['back', 'pack'], emoji: '🎒' },
            { word: 'eyelash', parts: ['eye', 'lash'], emoji: '👁️' },
            { word: 'seashell', parts: ['sea', 'shell'], emoji: '🐚' },
            { word: 'notebook', parts: ['note', 'book'], emoji: '📓' },
            { word: 'firework', parts: ['fire', 'work'], emoji: '🎆' },
            { word: 'bookworm', parts: ['book', 'worm'], emoji: '📚' },
            { word: 'ladybug', parts: ['lady', 'bug'], emoji: '🐞' },
            { word: 'bathtub', parts: ['bath', 'tub'], emoji: '🛁' }
        ];

        const item = compounds[this._rand(0, compounds.length - 1)];
        const roll = Math.random();

        // V37: "Which IS a compound word?" (25%)
        if (roll < 0.25) {
            const notCompound = ['running', 'playing', 'happy', 'garden', 'kitten', 'purple', 'window', 'basket',
                'summer', 'winter', 'Monday', 'kitchen', 'banana', 'dragon', 'turtle', 'ocean'];
            const wrongs = this._shuffle(notCompound).slice(0, 3);
            const answers = this._shuffle([item.word, ...wrongs]);
            return {
                question: `🔗 Which is a COMPOUND word?\n(two words put together)`,
                questionSpeak: `Which of these is a compound word? A compound word is two words put together.`,
                answers,
                correctIndex: answers.indexOf(item.word),
                topic: 'compound-words',
                subtype: 'identify-compound',
                explanation: `"${item.word}" = ${item.parts[0]} + ${item.parts[1]}! ${item.emoji}`,
                explanationSpeak: `${item.word} is a compound word! It is made of ${item.parts[0]} and ${item.parts[1]}!`
            };
        }

        // V37: "What does this compound word probably mean?" (20%)
        if (roll < 0.45) {
            const meanings = {
                'sunflower': { correct: 'a flower that faces the sun', wrongs: ['a sun made of flowers', 'a hot flower', 'a yellow sun'] },
                'rainbow': { correct: 'a colorful arc after rain', wrongs: ['a bow made of rain', 'a rainy day', 'a wet bow'] },
                'cupcake': { correct: 'a small cake in a cup shape', wrongs: ['a cup full of cake', 'a cake-shaped cup', 'a big cake'] },
                'starfish': { correct: 'a sea animal shaped like a star', wrongs: ['a fish that glows', 'a star in the sea', 'a flying fish'] },
                'snowman': { correct: 'a figure made of snow', wrongs: ['a man who likes snow', 'a cold person', 'a winter worker'] },
                'football': { correct: 'a ball kicked or thrown in a game', wrongs: ['a foot-shaped ball', 'a ball for your feet', 'shoes for sports'] },
                'bedroom': { correct: 'a room with a bed for sleeping', wrongs: ['a bed-shaped room', 'a bed in a box', 'a room with no bed'] },
                'butterfly': { correct: 'an insect with colorful wings', wrongs: ['butter that flies', 'a flying butter pat', 'a yellow bug'] },
                'popcorn': { correct: 'corn kernels that pop open', wrongs: ['corn that pops up', 'a popping plant', 'music corn'] },
                'backpack': { correct: 'a pack you carry on your back', wrongs: ['a pack behind you', 'going back to pack', 'a backwards bag'] },
                'airplane': { correct: 'a machine that flies through the air', wrongs: ['air that is flat', 'a flat surface', 'a windy plane'] },
                'ladybug': { correct: 'a small red bug with spots', wrongs: ['a bug that is a lady', 'a lady-shaped bug', 'a fancy insect'] }
            };
            if (meanings[item.word]) {
                const m = meanings[item.word];
                const answers = this._shuffle([m.correct, ...m.wrongs.slice(0, 3)]);
                return {
                    question: `🔗 ${item.emoji} What does "${item.word}" probably mean?`,
                    questionSpeak: `What does the word ${item.word} probably mean?`,
                    answers,
                    correctIndex: answers.indexOf(m.correct),
                    topic: 'compound-words',
                    subtype: 'compound-meaning',
                    explanation: `"${item.word}" = ${item.parts[0]} + ${item.parts[1]} = ${m.correct}!`,
                    explanationSpeak: `${item.word} means ${m.correct}!`
                };
            }
        }

        if (level <= 6 || Math.random() < 0.5) {
            // Which two words make this compound word?
            const correct = item.parts[0] + ' + ' + item.parts[1];
            const wrongPairs = [];
            let att = 0;
            while (wrongPairs.length < 3 && att++ < 50) {
                const other = compounds[this._rand(0, compounds.length - 1)];
                if (other.word === item.word) continue;
                // Mix parts to create wrong answers
                const wrong = this._rand(0, 1) === 0
                    ? item.parts[0] + ' + ' + other.parts[1]
                    : other.parts[0] + ' + ' + item.parts[1];
                if (wrong !== correct && !wrongPairs.includes(wrong)) wrongPairs.push(wrong);
            }
            // Fill remaining if needed
            while (wrongPairs.length < 3) {
                const other = compounds[this._rand(0, compounds.length - 1)];
                const wrong = other.parts[0] + ' + ' + other.parts[1];
                if (wrong !== correct && !wrongPairs.includes(wrong)) wrongPairs.push(wrong);
            }
            const answers = this._shuffle([correct, ...wrongPairs]);
            return {
                question: `${item.emoji} "${item.word}"\nWhich two words make it?`,
                questionSpeak: `Which two words make the word ${item.word}?`,
                answers,
                correctIndex: answers.indexOf(correct),
                topic: 'compound-words',
                subtype: 'split-compound',
                explanation: `${item.parts[0]} + ${item.parts[1]} = ${item.word}! ${item.emoji}`,
                explanationSpeak: `${item.parts[0]} plus ${item.parts[1]} makes ${item.word}!`
            };
        } else {
            // What compound word do these make?
            const correct = item.word;
            const wrongs = [];
            let att = 0;
            while (wrongs.length < 3 && att++ < 50) {
                const other = compounds[this._rand(0, compounds.length - 1)];
                if (other.word !== correct && !wrongs.includes(other.word)) wrongs.push(other.word);
            }
            const answers = this._shuffle([correct, ...wrongs]);
            return {
                question: `${item.parts[0]} + ${item.parts[1]} = ?`,
                questionSpeak: `What word do ${item.parts[0]} and ${item.parts[1]} make together?`,
                answers,
                correctIndex: answers.indexOf(correct),
                topic: 'compound-words',
                subtype: 'combine-compound',
                explanation: `${item.parts[0]} + ${item.parts[1]} = ${item.word}! ${item.emoji}`,
                explanationSpeak: `${item.parts[0]} plus ${item.parts[1]} makes ${item.word}!`
            };
        }
    },

    // ---- PREFIX & SUFFIX ----
    _prefixSuffix(level) {
        // V37: "Which word has a prefix?" (25%)
        if (Math.random() < 0.25) {
            const prefixWords = ['unhappy', 'unkind', 'redo', 'replay', 'rewrite', 'unfair', 'unlock', 'untie', 'rebuild', 'restart', 'refill', 'unsafe', 'preheat', 'preview', 'prepay', 'unsure'];
            const noPrefixWords = ['under', 'uncle', 'really', 'receive', 'pretty', 'price', 'umbrella', 'until', 'ready', 'return'];
            const correct = prefixWords[this._rand(0, prefixWords.length - 1)];
            const wrongs = this._shuffle(noPrefixWords).slice(0, 3);
            const answers = this._shuffle([correct, ...wrongs]);
            return {
                question: `🏗️ Which word has a PREFIX?\n(un-, re-, or pre-)`,
                questionSpeak: `Which word has a prefix like un, re, or pre?`,
                answers,
                correctIndex: answers.indexOf(correct),
                topic: 'prefix-suffix',
                subtype: 'find-prefix',
                explanation: `"${correct}" has a prefix! Can you see it at the beginning?`,
                explanationSpeak: `${correct} has a prefix at the beginning!`
            };
        }

        if (level <= 6 || Math.random() < 0.5) {
            // Prefixes: un-, re-, pre-
            const prefixes = [
                { prefix: 'un-', meaning: 'not', words: [
                    { base: 'happy', result: 'unhappy', meaning: 'not happy' },
                    { base: 'kind', result: 'unkind', meaning: 'not kind' },
                    { base: 'fair', result: 'unfair', meaning: 'not fair' },
                    { base: 'safe', result: 'unsafe', meaning: 'not safe' },
                    { base: 'lock', result: 'unlock', meaning: 'not locked' },
                    { base: 'do', result: 'undo', meaning: 'reverse doing' },
                    { base: 'tie', result: 'untie', meaning: 'not tied' },
                    { base: 'sure', result: 'unsure', meaning: 'not sure' }
                ]},
                { prefix: 're-', meaning: 'again', words: [
                    { base: 'read', result: 'reread', meaning: 'read again' },
                    { base: 'do', result: 'redo', meaning: 'do again' },
                    { base: 'play', result: 'replay', meaning: 'play again' },
                    { base: 'build', result: 'rebuild', meaning: 'build again' },
                    { base: 'write', result: 'rewrite', meaning: 'write again' },
                    { base: 'start', result: 'restart', meaning: 'start again' },
                    { base: 'fill', result: 'refill', meaning: 'fill again' },
                    { base: 'tell', result: 'retell', meaning: 'tell again' }
                ]},
                { prefix: 'pre-', meaning: 'before', words: [
                    { base: 'heat', result: 'preheat', meaning: 'heat before' },
                    { base: 'view', result: 'preview', meaning: 'view before' },
                    { base: 'pay', result: 'prepay', meaning: 'pay before' },
                    { base: 'school', result: 'preschool', meaning: 'before school' },
                    { base: 'game', result: 'pregame', meaning: 'before the game' },
                    { base: 'test', result: 'pretest', meaning: 'test before' }
                ]}
            ];
            const group = prefixes[this._rand(0, prefixes.length - 1)];
            const item = group.words[this._rand(0, group.words.length - 1)];
            const answers = this._shuffle([item.meaning, `${item.base} a lot`, `after ${item.base}`, `very ${item.base}`]);
            return {
                question: `What does "${item.result}" mean?\n(${group.prefix} means "${group.meaning}")`,
                questionSpeak: `What does ${item.result} mean? The prefix ${group.prefix.replace('-','')} means ${group.meaning}.`,
                answers,
                correctIndex: answers.indexOf(item.meaning),
                topic: 'prefix-suffix',
                subtype: 'prefix-meaning',
                explanation: `"${item.result}" = ${group.prefix} + ${item.base} = ${item.meaning}!`,
                explanationSpeak: `${item.result} means ${item.meaning}! The prefix ${group.prefix.replace('-','')} means ${group.meaning}!`
            };
        } else {
            // Suffixes: -ful, -less, -ly, -er, -est
            const suffixes = [
                { suffix: '-ful', meaning: 'full of', words: [
                    { base: 'hope', result: 'hopeful', meaning: 'full of hope' },
                    { base: 'care', result: 'careful', meaning: 'full of care' },
                    { base: 'joy', result: 'joyful', meaning: 'full of joy' },
                    { base: 'play', result: 'playful', meaning: 'full of play' },
                    { base: 'help', result: 'helpful', meaning: 'full of help' },
                    { base: 'thank', result: 'thankful', meaning: 'full of thanks' },
                    { base: 'color', result: 'colorful', meaning: 'full of color' },
                    { base: 'cheer', result: 'cheerful', meaning: 'full of cheer' }
                ]},
                { suffix: '-less', meaning: 'without', words: [
                    { base: 'hope', result: 'hopeless', meaning: 'without hope' },
                    { base: 'care', result: 'careless', meaning: 'without care' },
                    { base: 'help', result: 'helpless', meaning: 'without help' },
                    { base: 'sleep', result: 'sleepless', meaning: 'without sleep' },
                    { base: 'fear', result: 'fearless', meaning: 'without fear' },
                    { base: 'end', result: 'endless', meaning: 'without end' }
                ]},
                { suffix: '-ly', meaning: 'in a way that is', words: [
                    { base: 'quick', result: 'quickly', meaning: 'in a quick way' },
                    { base: 'slow', result: 'slowly', meaning: 'in a slow way' },
                    { base: 'kind', result: 'kindly', meaning: 'in a kind way' },
                    { base: 'brave', result: 'bravely', meaning: 'in a brave way' },
                    { base: 'loud', result: 'loudly', meaning: 'in a loud way' },
                    { base: 'soft', result: 'softly', meaning: 'in a soft way' },
                    { base: 'safe', result: 'safely', meaning: 'in a safe way' },
                    { base: 'quiet', result: 'quietly', meaning: 'in a quiet way' }
                ]},
                { suffix: '-er', meaning: 'more / one who', words: [
                    { base: 'tall', result: 'taller', meaning: 'more tall' },
                    { base: 'fast', result: 'faster', meaning: 'more fast' },
                    { base: 'teach', result: 'teacher', meaning: 'one who teaches' },
                    { base: 'read', result: 'reader', meaning: 'one who reads' },
                    { base: 'sing', result: 'singer', meaning: 'one who sings' },
                    { base: 'play', result: 'player', meaning: 'one who plays' }
                ]},
                { suffix: '-est', meaning: 'the most', words: [
                    { base: 'tall', result: 'tallest', meaning: 'the most tall' },
                    { base: 'fast', result: 'fastest', meaning: 'the most fast' },
                    { base: 'big', result: 'biggest', meaning: 'the most big' },
                    { base: 'small', result: 'smallest', meaning: 'the most small' },
                    { base: 'long', result: 'longest', meaning: 'the most long' },
                    { base: 'short', result: 'shortest', meaning: 'the most short' }
                ]}
            ];
            const group = suffixes[this._rand(0, suffixes.length - 1)];
            const item = group.words[this._rand(0, group.words.length - 1)];
            const answers = this._shuffle([item.meaning, `${item.base} a lot`, `before ${item.base}`, `not ${item.base}`]);
            return {
                question: `What does "${item.result}" mean?\n(${group.suffix} means "${group.meaning}")`,
                questionSpeak: `What does ${item.result} mean? The suffix ${group.suffix.replace('-','')} means ${group.meaning}.`,
                answers,
                correctIndex: answers.indexOf(item.meaning),
                topic: 'prefix-suffix',
                subtype: 'suffix-meaning',
                explanation: `"${item.result}" = ${item.base} + ${group.suffix} = ${item.meaning}!`,
                explanationSpeak: `${item.result} means ${item.meaning}! The suffix ${group.suffix.replace('-','')} means ${group.meaning}!`
            };
        }
    },

    // ---- GRAMMAR: nouns, verbs, adjectives ----
    _grammar(level) {
        const roll = Math.random();

        // V37: Past or present tense? (20%)
        if (roll < 0.2) {
            const tenseItems = [
                { sentence: 'The dog runs fast.', correct: 'Present', verb: 'runs' },
                { sentence: 'She walked to school.', correct: 'Past', verb: 'walked' },
                { sentence: 'He eats his lunch.', correct: 'Present', verb: 'eats' },
                { sentence: 'They played outside.', correct: 'Past', verb: 'played' },
                { sentence: 'The bird sings a song.', correct: 'Present', verb: 'sings' },
                { sentence: 'Mom cooked dinner.', correct: 'Past', verb: 'cooked' },
                { sentence: 'I read my book.', correct: 'Present', verb: 'read' },
                { sentence: 'The cat jumped high.', correct: 'Past', verb: 'jumped' },
                { sentence: 'We swim in the pool.', correct: 'Present', verb: 'swim' },
                { sentence: 'She painted a picture.', correct: 'Past', verb: 'painted' },
                { sentence: 'He rides his bike.', correct: 'Present', verb: 'rides' },
                { sentence: 'They danced at the party.', correct: 'Past', verb: 'danced' },
                { sentence: 'The baby cries a lot.', correct: 'Present', verb: 'cries' },
                { sentence: 'We climbed the hill.', correct: 'Past', verb: 'climbed' }
            ];
            const tItem = tenseItems[this._rand(0, tenseItems.length - 1)];
            const answers = this._shuffle(['Past', 'Present', 'Future', 'Not sure']);
            return {
                question: `📝 Is this PAST or PRESENT?\n"${tItem.sentence}"`,
                questionSpeak: `Is this sentence past or present tense? ${tItem.sentence}`,
                answers,
                correctIndex: answers.indexOf(tItem.correct),
                topic: 'grammar',
                subtype: 'verb-tense',
                explanation: `"${tItem.verb}" is ${tItem.correct.toLowerCase()} tense! ${tItem.correct === 'Past' ? 'It already happened!' : 'It is happening now!'}`,
                explanationSpeak: `${tItem.verb} is ${tItem.correct.toLowerCase()} tense. ${tItem.correct === 'Past' ? 'It already happened!' : 'It is happening now!'}`
            };
        }

        // V37: "Sentence or fragment?" (15%)
        if (roll < 0.35) {
            const items = [
                { text: 'The cat sat on the mat.', isSentence: true },
                { text: 'Running very fast.', isSentence: false },
                { text: 'She ate her lunch.', isSentence: true },
                { text: 'The big red.', isSentence: false },
                { text: 'We went to the park.', isSentence: true },
                { text: 'Under the table.', isSentence: false },
                { text: 'He rides his bike.', isSentence: true },
                { text: 'Very cold and windy.', isSentence: false },
                { text: 'The fish swam in the pond.', isSentence: true },
                { text: 'Because she was tired.', isSentence: false },
                { text: 'My dog is funny.', isSentence: true },
                { text: 'The tall green tree.', isSentence: false },
                { text: 'Birds fly south in winter.', isSentence: true },
                { text: 'After the game.', isSentence: false }
            ];
            const sItem = items[this._rand(0, items.length - 1)];
            const correct = sItem.isSentence ? 'Sentence ✓' : 'Fragment ✗';
            const answers = this._shuffle(['Sentence ✓', 'Fragment ✗', 'Question ?', 'Not sure']);
            return {
                question: `📝 Sentence or fragment?\n"${sItem.text}"`,
                questionSpeak: `Is this a complete sentence or a fragment? ${sItem.text}`,
                answers,
                correctIndex: answers.indexOf(correct),
                topic: 'grammar',
                subtype: 'sentence-or-fragment',
                explanation: sItem.isSentence
                    ? `It's a sentence! It has a subject and a verb and makes sense on its own!`
                    : `It's a fragment! It's missing a subject or verb and doesn't make complete sense!`,
                explanationSpeak: sItem.isSentence
                    ? `It is a complete sentence! It has a subject and a verb!`
                    : `It is a fragment! It is missing something and does not make complete sense!`
            };
        }

        if (roll < 0.55) {
            // Identify nouns
            const nouns = [
                { word: 'dog', sentence: 'The dog ran fast.' },
                { word: 'school', sentence: 'I love school.' },
                { word: 'cake', sentence: 'She baked a cake.' },
                { word: 'park', sentence: 'We played at the park.' },
                { word: 'teacher', sentence: 'The teacher was kind.' },
                { word: 'book', sentence: 'He read a book.' },
                { word: 'ocean', sentence: 'The ocean is big.' },
                { word: 'friend', sentence: 'My friend is funny.' },
                { word: 'kitchen', sentence: 'Mom cooked in the kitchen.' },
                { word: 'garden', sentence: 'Flowers grow in the garden.' }
            ];
            const item = nouns[this._rand(0, nouns.length - 1)];
            const notNouns = ['ran', 'happy', 'quickly', 'big', 'jumped', 'pretty', 'slowly', 'fast'];
            const wrongs = this._shuffle(notNouns).slice(0, 3);
            const answers = this._shuffle([item.word, ...wrongs]);
            return {
                question: `Find the NOUN:\n"${item.sentence}"`,
                questionSpeak: `Find the noun in this sentence. ${item.sentence}`,
                answers,
                correctIndex: answers.indexOf(item.word),
                topic: 'grammar',
                subtype: 'find-noun',
                explanation: `"${item.word}" is a noun! A noun is a person, place, or thing!`,
                explanationSpeak: `${item.word} is a noun! A noun is a person, place, or thing!`
            };
        } else if (roll < 0.7) {
            // Identify verbs
            const verbs = [
                { word: 'ran', sentence: 'The boy ran home.' },
                { word: 'jumped', sentence: 'The frog jumped high.' },
                { word: 'reads', sentence: 'She reads every day.' },
                { word: 'sings', sentence: 'He sings a song.' },
                { word: 'cooked', sentence: 'Mom cooked dinner.' },
                { word: 'swam', sentence: 'The fish swam fast.' },
                { word: 'painted', sentence: 'She painted a picture.' },
                { word: 'climbed', sentence: 'The cat climbed the tree.' },
                { word: 'danced', sentence: 'They danced at the party.' },
                { word: 'writes', sentence: 'He writes a letter.' }
            ];
            const item = verbs[this._rand(0, verbs.length - 1)];
            const notVerbs = ['dog', 'happy', 'school', 'big', 'pretty', 'park', 'green', 'tall'];
            const wrongs = this._shuffle(notVerbs).slice(0, 3);
            const answers = this._shuffle([item.word, ...wrongs]);
            return {
                question: `Find the VERB:\n"${item.sentence}"`,
                questionSpeak: `Find the verb in this sentence. ${item.sentence}`,
                answers,
                correctIndex: answers.indexOf(item.word),
                topic: 'grammar',
                subtype: 'find-verb',
                explanation: `"${item.word}" is a verb! A verb is an action word — something you DO!`,
                explanationSpeak: `${item.word} is a verb! A verb is an action word!`
            };
        } else {
            // Identify adjectives
            const adjectives = [
                { word: 'big', sentence: 'The big dog barked.' },
                { word: 'red', sentence: 'She wore a red hat.' },
                { word: 'funny', sentence: 'The funny clown laughed.' },
                { word: 'cold', sentence: 'The cold wind blew.' },
                { word: 'happy', sentence: 'The happy girl smiled.' },
                { word: 'tall', sentence: 'The tall tree swayed.' },
                { word: 'soft', sentence: 'The soft blanket felt nice.' },
                { word: 'brave', sentence: 'The brave knight fought.' },
                { word: 'shiny', sentence: 'The shiny star twinkled.' },
                { word: 'tiny', sentence: 'The tiny ant crawled.' }
            ];
            const item = adjectives[this._rand(0, adjectives.length - 1)];
            const notAdj = ['dog', 'ran', 'school', 'jumped', 'swam', 'book', 'teacher', 'cooked'];
            const wrongs = this._shuffle(notAdj).slice(0, 3);
            const answers = this._shuffle([item.word, ...wrongs]);
            return {
                question: `Find the ADJECTIVE:\n"${item.sentence}"`,
                questionSpeak: `Find the adjective in this sentence. ${item.sentence}`,
                answers,
                correctIndex: answers.indexOf(item.word),
                topic: 'grammar',
                subtype: 'find-adjective',
                explanation: `"${item.word}" is an adjective! It describes the noun!`,
                explanationSpeak: `${item.word} is an adjective! It's a describing word!`
            };
        }
    },

    // ---- CONTRACTIONS ----
    _contractions(level) {
        const contractionList = [
            { contraction: "can't", full: 'can not', words: ['can', 'not'] },
            { contraction: "don't", full: 'do not', words: ['do', 'not'] },
            { contraction: "it's", full: 'it is', words: ['it', 'is'] },
            { contraction: "I'm", full: 'I am', words: ['I', 'am'] },
            { contraction: "he's", full: 'he is', words: ['he', 'is'] },
            { contraction: "she's", full: 'she is', words: ['she', 'is'] },
            { contraction: "we're", full: 'we are', words: ['we', 'are'] },
            { contraction: "they're", full: 'they are', words: ['they', 'are'] },
            { contraction: "isn't", full: 'is not', words: ['is', 'not'] },
            { contraction: "wasn't", full: 'was not', words: ['was', 'not'] },
            { contraction: "didn't", full: 'did not', words: ['did', 'not'] },
            { contraction: "won't", full: 'will not', words: ['will', 'not'] },
            { contraction: "I'll", full: 'I will', words: ['I', 'will'] },
            { contraction: "you're", full: 'you are', words: ['you', 'are'] },
            { contraction: "that's", full: 'that is', words: ['that', 'is'] },
            { contraction: "let's", full: 'let us', words: ['let', 'us'] },
            { contraction: "haven't", full: 'have not', words: ['have', 'not'] },
            { contraction: "couldn't", full: 'could not', words: ['could', 'not'] },
            { contraction: "wouldn't", full: 'would not', words: ['would', 'not'] },
            { contraction: "shouldn't", full: 'should not', words: ['should', 'not'] }
        ];

        const item = contractionList[this._rand(0, contractionList.length - 1)];

        // V37: "Fill in the blank with the contraction" (30%)
        if (Math.random() < 0.3) {
            const sentenceTemplates = [
                { full: 'can not', contraction: "can't", sentence: 'I ___ go outside.' },
                { full: 'do not', contraction: "don't", sentence: 'I ___ like spinach.' },
                { full: 'it is', contraction: "it's", sentence: '___ raining today.' },
                { full: 'I am', contraction: "I'm", sentence: '___ going to the park.' },
                { full: 'he is', contraction: "he's", sentence: '___ my best friend.' },
                { full: 'she is', contraction: "she's", sentence: '___ a great singer.' },
                { full: 'we are', contraction: "we're", sentence: '___ going to win!' },
                { full: 'they are', contraction: "they're", sentence: '___ playing outside.' },
                { full: 'is not', contraction: "isn't", sentence: 'It ___ fair!' },
                { full: 'did not', contraction: "didn't", sentence: 'I ___ see it.' },
                { full: 'I will', contraction: "I'll", sentence: '___ help you.' },
                { full: 'you are', contraction: "you're", sentence: '___ doing great!' },
                { full: 'let us', contraction: "let's", sentence: '___ play a game!' },
                { full: 'will not', contraction: "won't", sentence: 'It ___ take long.' }
            ];
            const tItem = sentenceTemplates[this._rand(0, sentenceTemplates.length - 1)];
            const wrongs = [];
            let att = 0;
            while (wrongs.length < 3 && att++ < 50) {
                const other = contractionList[this._rand(0, contractionList.length - 1)];
                if (other.contraction !== tItem.contraction && !wrongs.includes(other.contraction)) wrongs.push(other.contraction);
            }
            const answers = this._shuffle([tItem.contraction, ...wrongs]);
            return {
                question: `✂️ Fill in the blank:\n"${tItem.sentence}"`,
                questionSpeak: `Fill in the blank: ${tItem.sentence.replace('___', 'blank')}`,
                answers,
                correctIndex: answers.indexOf(tItem.contraction),
                topic: 'contractions',
                subtype: 'contraction-fill-blank',
                explanation: `"${tItem.contraction}" fits! It's short for "${tItem.full}"!`,
                explanationSpeak: `${tItem.contraction} is correct! It is short for ${tItem.full}!`
            };
        }

        if (level <= 6 || Math.random() < 0.5) {
            // Match contraction to full form
            const wrongs = [];
            let att = 0;
            while (wrongs.length < 3 && att++ < 50) {
                const other = contractionList[this._rand(0, contractionList.length - 1)];
                if (other.full !== item.full && !wrongs.includes(other.full)) wrongs.push(other.full);
            }
            const answers = this._shuffle([item.full, ...wrongs]);
            return {
                question: `What does "${item.contraction}"\nstand for?`,
                questionSpeak: `What does ${item.contraction} stand for?`,
                answers,
                correctIndex: answers.indexOf(item.full),
                topic: 'contractions',
                subtype: 'expand-contraction',
                explanation: `"${item.contraction}" = "${item.full}"! The apostrophe replaces missing letters!`,
                explanationSpeak: `${item.contraction} stands for ${item.full}!`
            };
        } else {
            // Full form to contraction
            const wrongs = [];
            let att = 0;
            while (wrongs.length < 3 && att++ < 50) {
                const other = contractionList[this._rand(0, contractionList.length - 1)];
                if (other.contraction !== item.contraction && !wrongs.includes(other.contraction)) wrongs.push(other.contraction);
            }
            const answers = this._shuffle([item.contraction, ...wrongs]);
            return {
                question: `Which contraction means\n"${item.full}"?`,
                questionSpeak: `Which contraction means ${item.full}?`,
                answers,
                correctIndex: answers.indexOf(item.contraction),
                topic: 'contractions',
                subtype: 'match-contraction',
                explanation: `"${item.full}" → "${item.contraction}"! We squish the words together!`,
                explanationSpeak: `${item.full} becomes ${item.contraction}!`
            };
        }
    },

    // ---- READING COMPREHENSION ----
    _comprehension(level) {
        const passages = [
            {
                text: 'Sam had a red ball. He threw it to his dog. The dog caught it and ran away!',
                q: 'What did the dog do?',
                correct: 'caught the ball and ran',
                wrongs: ['threw the ball', 'sat and watched', 'went to sleep']
            },
            {
                text: 'Mia went to the store with Mom. They bought milk, bread, and eggs. Then they drove home.',
                q: 'Where did Mia go?',
                correct: 'the store',
                wrongs: ['the park', 'school', 'the library']
            },
            {
                text: 'The frog sat on a lily pad. It was waiting for a fly. When a fly buzzed by, the frog caught it with its tongue!',
                q: 'What was the frog waiting for?',
                correct: 'a fly',
                wrongs: ['a fish', 'another frog', 'rain']
            },
            {
                text: 'Today was the first day of school. Emma felt nervous but excited. She met her new teacher, Mrs. Chen.',
                q: 'How did Emma feel?',
                correct: 'nervous but excited',
                wrongs: ['angry and sad', 'tired and bored', 'silly and goofy']
            },
            {
                text: 'Ben made a snowman in the yard. He used a carrot for the nose and rocks for the eyes. His sister helped him.',
                q: 'What did Ben use for the nose?',
                correct: 'a carrot',
                wrongs: ['a rock', 'a stick', 'a button']
            },
            {
                text: 'The cat climbed up the tall tree. It could not get down! Dad got a ladder and helped the cat down safely.',
                q: 'Who helped the cat?',
                correct: 'Dad',
                wrongs: ['Mom', 'a firefighter', 'the dog']
            },
            {
                text: 'It rained all morning. After lunch the sun came out. The kids ran outside to play in the puddles.',
                q: 'When did the sun come out?',
                correct: 'after lunch',
                wrongs: ['before breakfast', 'at night', 'during school']
            },
            {
                text: 'Lily planted a seed in a pot. She watered it every day. After two weeks, a tiny green sprout appeared!',
                q: 'How long until the sprout appeared?',
                correct: 'two weeks',
                wrongs: ['one day', 'three months', 'one hour']
            },
            {
                text: 'Max lost his favorite toy at the park. He looked everywhere. Finally he found it under the slide!',
                q: 'Where did Max find his toy?',
                correct: 'under the slide',
                wrongs: ['on the swings', 'in the sandbox', 'at home']
            },
            {
                text: 'The bird built a nest in the tree. It used sticks and grass. Soon there were three small blue eggs in it.',
                q: 'What did the bird use to build the nest?',
                correct: 'sticks and grass',
                wrongs: ['rocks and mud', 'paper and tape', 'leaves and flowers']
            },
            {
                text: 'Anna and Jake baked cookies together. They used chocolate chips. The cookies smelled so good that Dad ate five!',
                q: 'How many cookies did Dad eat?',
                correct: 'five',
                wrongs: ['two', 'three', 'ten']
            },
            {
                text: 'The turtle was slow but steady. The rabbit was fast but took a nap. The turtle won the race!',
                q: 'Who won the race?',
                correct: 'the turtle',
                wrongs: ['the rabbit', 'they tied', 'nobody']
            },
            {
                text: 'Pedro brought his pet fish to show and tell. The fish was orange with white stripes. Everyone wanted to see it.',
                q: 'What color was the fish?',
                correct: 'orange with white stripes',
                wrongs: ['blue with red dots', 'all black', 'green and yellow']
            },
            {
                text: 'It was bedtime but Zoe was not sleepy. Mom read her two stories. By the end of the second story, Zoe was asleep.',
                q: 'How many stories did Mom read?',
                correct: 'two',
                wrongs: ['one', 'three', 'four']
            },
            {
                text: 'The farmer had ten chickens. Every morning they laid eggs. The farmer sold the eggs at the market on Saturdays.',
                q: 'When did the farmer sell eggs?',
                correct: 'on Saturdays',
                wrongs: ['every day', 'on Mondays', 'at night']
            },
            {
                text: 'Sofia loves to draw animals. Her favorite animal to draw is a horse. She practices drawing horses every day after school.',
                q: 'What is Sofia\'s favorite animal to draw?',
                correct: 'a horse',
                wrongs: ['a cat', 'a dog', 'a bird']
            }
        ];

        const roll = Math.random();

        // V37: "What is the story mainly about?" — main idea (25%)
        if (roll < 0.25) {
            const mainIdeaPassages = [
                { text: 'Dogs make great pets. They play fetch and love to cuddle. Dogs can learn tricks too!',
                  correct: 'Dogs are great pets', wrongs: ['Cats are better', 'Tricks are hard', 'Fetch is fun'] },
                { text: 'Fall is a beautiful time. The leaves turn red and orange. The air is cool and crisp.',
                  correct: 'Fall is beautiful', wrongs: ['Leaves are green', 'Winter is cold', 'Summer is hot'] },
                { text: 'Bees are very busy. They fly from flower to flower. They help plants grow and make honey.',
                  correct: 'Bees are busy and helpful', wrongs: ['Honey tastes good', 'Flowers are pretty', 'Bees are scary'] },
                { text: 'Brushing your teeth is important. It keeps your teeth clean and healthy. You should brush twice a day.',
                  correct: 'Brushing teeth is important', wrongs: ['Teeth are white', 'Dentists are nice', 'Toothpaste is yummy'] },
                { text: 'The library is a quiet place. You can read books and use computers. The librarian helps you find what you need.',
                  correct: 'What you can do at the library', wrongs: ['Computers are fun', 'Books are heavy', 'Libraries are old'] },
                { text: 'Baby birds need their mom. She builds a nest and feeds them worms. Soon the baby birds learn to fly.',
                  correct: 'Baby birds need their mom to grow up', wrongs: ['Worms are yucky', 'Nests are made of sticks', 'Flying is hard'] },
                { text: 'Water is important for our body. We should drink water every day. It helps us stay healthy and strong.',
                  correct: 'Water is important for health', wrongs: ['Juice is better', 'Milk is white', 'Soda is fizzy'] },
                { text: 'Recycling helps the Earth. We can recycle paper, plastic, and cans. When we recycle, we make less trash.',
                  correct: 'Recycling helps the Earth', wrongs: ['Trash is smelly', 'Cans are metal', 'Paper comes from trees'] }
            ];
            const mItem = mainIdeaPassages[this._rand(0, mainIdeaPassages.length - 1)];
            const answers = this._shuffle([mItem.correct, ...mItem.wrongs]);
            return {
                question: `Read this:\n"${mItem.text}"\n\nWhat is it MAINLY about?`,
                questionSpeak: `${mItem.text} What is this mainly about?`,
                answers,
                correctIndex: answers.indexOf(mItem.correct),
                topic: 'comprehension',
                subtype: 'main-idea',
                explanation: `The main idea is "${mItem.correct}"! That's what the whole passage is about!`,
                explanationSpeak: `The main idea is ${mItem.correct}! That is what the whole story is about!`
            };
        }

        // V37: "What will probably happen next?" — prediction (20%)
        if (roll < 0.45) {
            const predictionPassages = [
                { text: 'Mia put on her swimsuit. She grabbed a towel and sunscreen. Mom said the pool was ready.',
                  correct: 'go swimming', wrongs: ['go to bed', 'eat dinner', 'read a book'] },
                { text: 'Dark clouds filled the sky. The wind started to blow. Mom said to come inside.',
                  correct: 'it will rain', wrongs: ['it will snow', 'the sun will come out', 'they will go for a walk'] },
                { text: 'The cake was in the oven. Timer went off! Dad put on oven mitts.',
                  correct: 'take the cake out', wrongs: ['go to the store', 'make more batter', 'turn off the lights'] },
                { text: 'Ben yawned and rubbed his eyes. He put on pajamas and brushed his teeth.',
                  correct: 'go to bed', wrongs: ['go outside to play', 'eat breakfast', 'go to school'] },
                { text: 'The dog grabbed its leash. It wagged its tail and ran to the door.',
                  correct: 'go for a walk', wrongs: ['take a nap', 'eat dinner', 'take a bath'] },
                { text: 'Emma opened her backpack. She took out a pencil and a notebook. The teacher said good morning.',
                  correct: 'start doing schoolwork', wrongs: ['go home', 'eat lunch', 'play at recess'] },
                { text: 'The baby bird stood on the edge of the nest. It spread its wings. Mama bird watched closely.',
                  correct: 'try to fly', wrongs: ['go back to sleep', 'eat a worm', 'sing a song'] },
                { text: 'Jake put candles on the cake. His friends were coming over. The balloons were all set up.',
                  correct: 'have a birthday party', wrongs: ['go to the store', 'clean his room', 'go to school'] }
            ];
            const pItem = predictionPassages[this._rand(0, predictionPassages.length - 1)];
            const answers = this._shuffle([pItem.correct, ...pItem.wrongs]);
            return {
                question: `Read this:\n"${pItem.text}"\n\nWhat will PROBABLY happen next?`,
                questionSpeak: `${pItem.text} What will probably happen next?`,
                answers,
                correctIndex: answers.indexOf(pItem.correct),
                topic: 'comprehension',
                subtype: 'prediction',
                explanation: `"${pItem.correct}" makes the most sense based on the clues in the story!`,
                explanationSpeak: `${pItem.correct} is most likely! The clues in the story tell us what will happen!`
            };
        }

        // Original: detail questions from passage
        const passage = passages[this._rand(0, passages.length - 1)];
        const answers = this._shuffle([passage.correct, ...passage.wrongs]);
        return {
            question: `Read this:\n"${passage.text}"\n\n${passage.q}`,
            questionSpeak: `${passage.text} ${passage.q}`,
            answers,
            correctIndex: answers.indexOf(passage.correct),
            topic: 'comprehension',
            subtype: 'passage-question',
            explanation: `The answer is "${passage.correct}"! Good reading!`,
            explanationSpeak: `The answer is ${passage.correct}! Great job reading and understanding the story!`
        };
    },

    // ===== V34 NEW TOPICS =====

    // ---- SPELLING ----
    _spelling(level) {
        const easyWords = [
            { word: 'cat', wrongs: ['kat', 'cta', 'kat'] },
            { word: 'dog', wrongs: ['dag', 'dgo', 'bog'] },
            { word: 'hat', wrongs: ['het', 'hta', 'hut'] },
            { word: 'bed', wrongs: ['bad', 'bde', 'ded'] },
            { word: 'sun', wrongs: ['san', 'snu', 'son'] },
            { word: 'cup', wrongs: ['kup', 'cep', 'cub'] },
            { word: 'run', wrongs: ['ran', 'rnu', 'ren'] },
            { word: 'pig', wrongs: ['peg', 'pgi', 'big'] },
            { word: 'map', wrongs: ['mep', 'mpa', 'nap'] },
            { word: 'ten', wrongs: ['tin', 'tne', 'tan'] },
            { word: 'box', wrongs: ['bax', 'bex', 'bok'] },
            { word: 'hop', wrongs: ['hap', 'hpo', 'hip'] },
            { word: 'net', wrongs: ['nat', 'nte', 'nit'] },
            { word: 'red', wrongs: ['rad', 'rde', 'rid'] },
            { word: 'sit', wrongs: ['sat', 'set', 'sut'] }
        ];
        const hardWords = [
            { word: 'house', wrongs: ['hous', 'howse', 'hoose'] },
            { word: 'school', wrongs: ['skool', 'scool', 'shcool'] },
            { word: 'friend', wrongs: ['frend', 'freind', 'frind'] },
            { word: 'water', wrongs: ['woter', 'watter', 'watar'] },
            { word: 'plant', wrongs: ['plent', 'plantt', 'plont'] },
            { word: 'happy', wrongs: ['hapy', 'happie', 'heppy'] },
            { word: 'night', wrongs: ['nite', 'nigt', 'niht'] },
            { word: 'write', wrongs: ['rite', 'writ', 'wriet'] },
            { word: 'about', wrongs: ['abowt', 'abut', 'aboat'] },
            { word: 'light', wrongs: ['lite', 'liht', 'lihgt'] },
            { word: 'would', wrongs: ['woud', 'wood', 'wuld'] },
            { word: 'people', wrongs: ['peple', 'peeple', 'peopel'] },
            { word: 'could', wrongs: ['coud', 'culd', 'cood'] },
            { word: 'little', wrongs: ['litle', 'littel', 'litl'] },
            { word: 'because', wrongs: ['becuz', 'becaus', 'becose'] }
        ];

        const pool = level < 4 ? easyWords : hardWords;
        const item = pool[this._rand(0, pool.length - 1)];
        const roll = Math.random();

        // V37: "Which is misspelled?" format (30%)
        if (roll < 0.3) {
            const misspelled = item.wrongs[this._rand(0, item.wrongs.length - 1)];
            const others = [];
            const usedWords = new Set([item.word]);
            let att = 0;
            while (others.length < 3 && att++ < 50) {
                const other = pool[this._rand(0, pool.length - 1)];
                if (!usedWords.has(other.word)) { others.push(other.word); usedWords.add(other.word); }
            }
            const answers = this._shuffle([misspelled, ...others]);
            return {
                question: `✏️ Which word is spelled WRONG?`,
                questionSpeak: `Which word is spelled wrong?`,
                answers,
                correctIndex: answers.indexOf(misspelled),
                topic: 'spelling',
                subtype: 'find-misspelled',
                explanation: `"${misspelled}" is wrong! It should be "${item.word}"!`,
                explanationSpeak: `${misspelled} is wrong! It should be spelled ${item.word}!`
            };
        }

        // V37: "What letter is missing?" format (25%)
        if (roll < 0.55) {
            const word = item.word;
            const pos = this._rand(1, word.length - 2); // don't remove first or last
            const missing = word[pos];
            const blanked = word.slice(0, pos) + '_' + word.slice(pos + 1);
            const wrongLetters = [];
            const vowels = 'aeiou';
            const consonants = 'bcdfghjklmnpqrstvwxyz';
            const isVowel = vowels.includes(missing);
            const letterPool = isVowel ? vowels : consonants;
            let att = 0;
            while (wrongLetters.length < 3 && att++ < 50) {
                const l = letterPool[this._rand(0, letterPool.length - 1)];
                if (l !== missing && !wrongLetters.includes(l)) wrongLetters.push(l);
            }
            const answers = this._shuffle([missing, ...wrongLetters]);
            return {
                question: `✏️ What letter is missing?\n"${blanked}"`,
                questionSpeak: `What letter is missing in the word ${blanked.replace('_', 'blank')}?`,
                answers,
                correctIndex: answers.indexOf(missing),
                topic: 'spelling',
                subtype: 'missing-letter',
                explanation: `The missing letter is "${missing}"! The word is "${word}"!`,
                explanationSpeak: `The missing letter is ${missing}! The word is ${word}!`
            };
        }

        // Original: "Which is spelled correctly?"
        const wrongs = this._shuffle(item.wrongs).slice(0, 3);
        const answers = this._shuffle([item.word, ...wrongs]);

        return {
            question: `✏️ Which is spelled correctly?`,
            questionSpeak: `Which word is spelled correctly?`,
            answers,
            correctIndex: answers.indexOf(item.word),
            topic: 'spelling',
            subtype: level < 4 ? 'easy-spelling' : 'hard-spelling',
            explanation: `"${item.word}" is the correct spelling!`,
            explanationSpeak: `${item.word} is the correct spelling! Good job!`
        };
    },

    // ---- ANTONYMS ----
    _antonyms(level) {
        const easyPairs = [
            { word: 'big', opposite: 'small', wrongs: ['tall', 'round', 'blue'] },
            { word: 'hot', opposite: 'cold', wrongs: ['warm', 'nice', 'red'] },
            { word: 'up', opposite: 'down', wrongs: ['over', 'out', 'in'] },
            { word: 'fast', opposite: 'slow', wrongs: ['quick', 'loud', 'long'] },
            { word: 'happy', opposite: 'sad', wrongs: ['glad', 'mad', 'shy'] },
            { word: 'day', opposite: 'night', wrongs: ['sun', 'time', 'dark'] },
            { word: 'old', opposite: 'new', wrongs: ['young', 'nice', 'big'] },
            { word: 'stop', opposite: 'go', wrongs: ['wait', 'run', 'sit'] },
            { word: 'wet', opposite: 'dry', wrongs: ['cold', 'warm', 'soft'] },
            { word: 'on', opposite: 'off', wrongs: ['up', 'out', 'in'] },
            { word: 'open', opposite: 'close', wrongs: ['shut', 'push', 'pull'] },
            { word: 'hard', opposite: 'soft', wrongs: ['easy', 'rough', 'flat'] },
            { word: 'tall', opposite: 'short', wrongs: ['big', 'wide', 'thin'] },
            { word: 'full', opposite: 'empty', wrongs: ['big', 'round', 'flat'] },
            { word: 'clean', opposite: 'dirty', wrongs: ['neat', 'nice', 'tidy'] }
        ];
        const hardPairs = [
            { word: 'brave', opposite: 'scared', wrongs: ['strong', 'fast', 'kind'] },
            { word: 'quiet', opposite: 'loud', wrongs: ['soft', 'calm', 'still'] },
            { word: 'early', opposite: 'late', wrongs: ['quick', 'soon', 'first'] },
            { word: 'push', opposite: 'pull', wrongs: ['shove', 'press', 'grab'] },
            { word: 'light', opposite: 'heavy', wrongs: ['bright', 'white', 'thin'] },
            { word: 'smooth', opposite: 'rough', wrongs: ['flat', 'soft', 'hard'] },
            { word: 'sweet', opposite: 'sour', wrongs: ['yummy', 'nice', 'good'] },
            { word: 'begin', opposite: 'end', wrongs: ['start', 'first', 'try'] },
            { word: 'always', opposite: 'never', wrongs: ['often', 'maybe', 'once'] },
            { word: 'laugh', opposite: 'cry', wrongs: ['smile', 'grin', 'joke'] },
            { word: 'above', opposite: 'below', wrongs: ['over', 'under', 'near'] },
            { word: 'strong', opposite: 'weak', wrongs: ['tough', 'hard', 'big'] },
            { word: 'asleep', opposite: 'awake', wrongs: ['tired', 'sleepy', 'calm'] },
            { word: 'remember', opposite: 'forget', wrongs: ['think', 'know', 'learn'] },
            { word: 'truth', opposite: 'lie', wrongs: ['fact', 'real', 'true'] }
        ];

        const pool = level < 4 ? easyPairs : hardPairs;
        const item = pool[this._rand(0, pool.length - 1)];
        const roll = Math.random();

        // V37: "Fill in the blank with the opposite" (30%)
        if (roll < 0.3) {
            const sentencePairs = [
                { context: 'The ice cream is cold. The soup is ___', word: 'hot', opp: 'cold' },
                { context: 'The elephant is big. The ant is ___', word: 'small', opp: 'big' },
                { context: 'She was happy. Then she felt ___', word: 'sad', opp: 'happy' },
                { context: 'The cheetah is fast. The turtle is ___', word: 'slow', opp: 'fast' },
                { context: 'The lamp is on. Now it is ___', word: 'off', opp: 'on' },
                { context: 'The room was loud. Now it is ___', word: 'quiet', opp: 'loud' },
                { context: 'The box was full. Now it is ___', word: 'empty', opp: 'full' },
                { context: 'The road goes up. Then it goes ___', word: 'down', opp: 'up' },
                { context: 'The pillow is soft. The rock is ___', word: 'hard', opp: 'soft' },
                { context: 'The window is open. Please ___ it', word: 'close', opp: 'open' },
                { context: 'The giraffe is tall. The mouse is ___', word: 'short', opp: 'tall' },
                { context: 'It was day. Now it is ___', word: 'night', opp: 'day' },
                { context: 'The clothes are wet. Put them out to get ___', word: 'dry', opp: 'wet' },
                { context: 'My shoes are old. I want ___ ones', word: 'new', opp: 'old' },
                { context: 'The shirt is clean. The pants are ___', word: 'dirty', opp: 'clean' }
            ];
            const sItem = sentencePairs[this._rand(0, sentencePairs.length - 1)];
            const sWrongs = pool.filter(p => p.opposite !== sItem.word).map(p => p.opposite);
            const picks = this._shuffle(sWrongs).slice(0, 3);
            const answers = this._shuffle([sItem.word, ...picks]);
            return {
                question: `↔️ ${sItem.context}`,
                questionSpeak: `${sItem.context.replace('___', 'blank')}`,
                answers,
                correctIndex: answers.indexOf(sItem.word),
                topic: 'antonyms',
                subtype: 'antonym-fill-blank',
                explanation: `"${sItem.word}" is the opposite of "${sItem.opp}"!`,
                explanationSpeak: `${sItem.word} is the opposite of ${sItem.opp}!`
            };
        }

        // V37: "Which pair are opposites?" (25%)
        if (roll < 0.55) {
            const correctPair = `${item.word} / ${item.opposite}`;
            const wrongPairs = [];
            let att = 0;
            while (wrongPairs.length < 3 && att++ < 50) {
                const p1 = pool[this._rand(0, pool.length - 1)];
                const p2 = pool[this._rand(0, pool.length - 1)];
                if (p1.word !== p2.word) {
                    const fake = `${p1.word} / ${p2.opposite}`;
                    if (fake !== correctPair && !wrongPairs.includes(fake)) wrongPairs.push(fake);
                }
            }
            const answers = this._shuffle([correctPair, ...wrongPairs]);
            return {
                question: `↔️ Which pair are OPPOSITES?`,
                questionSpeak: `Which pair of words are opposites?`,
                answers,
                correctIndex: answers.indexOf(correctPair),
                topic: 'antonyms',
                subtype: 'antonym-pair',
                explanation: `"${item.word}" and "${item.opposite}" are opposites!`,
                explanationSpeak: `${item.word} and ${item.opposite} are opposites!`
            };
        }

        // Original: "What is the opposite?"
        const answers = this._shuffle([item.opposite, ...item.wrongs.slice(0, 3)]);
        return {
            question: `↔️ What is the OPPOSITE of "${item.word}"?`,
            questionSpeak: `What is the opposite of ${item.word}?`,
            answers,
            correctIndex: answers.indexOf(item.opposite),
            topic: 'antonyms',
            subtype: level < 4 ? 'easy-antonym' : 'hard-antonym',
            explanation: `The opposite of "${item.word}" is "${item.opposite}"!`,
            explanationSpeak: `The opposite of ${item.word} is ${item.opposite}!`
        };
    },

    // ---- SYNONYMS ----
    _synonyms(level) {
        const easyPairs = [
            { word: 'happy', synonym: 'glad', wrongs: ['sad', 'mad', 'slow'] },
            { word: 'big', synonym: 'large', wrongs: ['tiny', 'fast', 'old'] },
            { word: 'fast', synonym: 'quick', wrongs: ['slow', 'tall', 'soft'] },
            { word: 'small', synonym: 'tiny', wrongs: ['big', 'tall', 'wide'] },
            { word: 'mad', synonym: 'angry', wrongs: ['happy', 'sad', 'shy'] },
            { word: 'sad', synonym: 'unhappy', wrongs: ['glad', 'funny', 'nice'] },
            { word: 'cold', synonym: 'chilly', wrongs: ['hot', 'warm', 'soft'] },
            { word: 'pretty', synonym: 'beautiful', wrongs: ['ugly', 'plain', 'dark'] },
            { word: 'smart', synonym: 'clever', wrongs: ['silly', 'slow', 'loud'] },
            { word: 'loud', synonym: 'noisy', wrongs: ['quiet', 'soft', 'calm'] },
            { word: 'nice', synonym: 'kind', wrongs: ['mean', 'rude', 'cold'] },
            { word: 'scared', synonym: 'afraid', wrongs: ['brave', 'bold', 'calm'] },
            { word: 'funny', synonym: 'silly', wrongs: ['sad', 'boring', 'mean'] },
            { word: 'start', synonym: 'begin', wrongs: ['stop', 'end', 'wait'] },
            { word: 'shut', synonym: 'close', wrongs: ['open', 'push', 'lock'] }
        ];
        const hardPairs = [
            { word: 'difficult', synonym: 'hard', wrongs: ['easy', 'soft', 'fun'] },
            { word: 'repair', synonym: 'fix', wrongs: ['break', 'build', 'cut'] },
            { word: 'enormous', synonym: 'huge', wrongs: ['tiny', 'thin', 'flat'] },
            { word: 'silent', synonym: 'quiet', wrongs: ['loud', 'noisy', 'wild'] },
            { word: 'leap', synonym: 'jump', wrongs: ['sit', 'walk', 'crawl'] },
            { word: 'wealthy', synonym: 'rich', wrongs: ['poor', 'cheap', 'free'] },
            { word: 'discover', synonym: 'find', wrongs: ['lose', 'hide', 'drop'] },
            { word: 'chuckle', synonym: 'laugh', wrongs: ['cry', 'yell', 'sigh'] },
            { word: 'gloomy', synonym: 'dark', wrongs: ['bright', 'sunny', 'warm'] },
            { word: 'reply', synonym: 'answer', wrongs: ['ask', 'listen', 'wait'] },
            { word: 'terrified', synonym: 'scared', wrongs: ['brave', 'calm', 'bold'] },
            { word: 'simple', synonym: 'easy', wrongs: ['hard', 'tricky', 'long'] },
            { word: 'rush', synonym: 'hurry', wrongs: ['wait', 'rest', 'stop'] },
            { word: 'speak', synonym: 'talk', wrongs: ['listen', 'read', 'write'] },
            { word: 'destroy', synonym: 'wreck', wrongs: ['build', 'make', 'save'] }
        ];

        const pool = level < 5 ? easyPairs : hardPairs;
        const item = pool[this._rand(0, pool.length - 1)];
        const roll = Math.random();

        // V37: "Replace the word" in sentence context (30%)
        if (roll < 0.3) {
            const sentences = [
                { s: 'She was very happy today.', word: 'happy', syn: 'glad' },
                { s: 'The dog is really big.', word: 'big', syn: 'large' },
                { s: 'He ran very fast.', word: 'fast', syn: 'quick' },
                { s: 'Look at that small bug.', word: 'small', syn: 'tiny' },
                { s: 'Mom was mad about the mess.', word: 'mad', syn: 'angry' },
                { s: 'The kitten was so scared.', word: 'scared', syn: 'afraid' },
                { s: 'That movie was really funny.', word: 'funny', syn: 'silly' },
                { s: 'She is a nice person.', word: 'nice', syn: 'kind' },
                { s: 'It is cold outside.', word: 'cold', syn: 'chilly' },
                { s: 'The music was too loud.', word: 'loud', syn: 'noisy' },
                { s: 'He was very smart.', word: 'smart', syn: 'clever' },
                { s: 'The flowers are so pretty.', word: 'pretty', syn: 'beautiful' },
                { s: 'She felt very sad.', word: 'sad', syn: 'unhappy' },
                { s: 'Let\'s start the game!', word: 'start', syn: 'begin' },
                { s: 'Please shut the door.', word: 'shut', syn: 'close' }
            ];
            const sItem = sentences[this._rand(0, sentences.length - 1)];
            const sWrongs = pool.filter(p => p.synonym !== sItem.syn).map(p => p.synonym);
            const picks = this._shuffle(sWrongs).slice(0, 3);
            const answers = this._shuffle([sItem.syn, ...picks]);
            return {
                question: `🔄 "${sItem.s}"\nReplace "${sItem.word}" with:`,
                questionSpeak: `${sItem.s} Replace the word ${sItem.word} with another word that means the same.`,
                answers,
                correctIndex: answers.indexOf(sItem.syn),
                topic: 'synonyms',
                subtype: 'synonym-replace',
                explanation: `"${sItem.syn}" means the same as "${sItem.word}"!`,
                explanationSpeak: `${sItem.syn} means the same as ${sItem.word}!`
            };
        }

        // V37: "Which pair means the same?" (25%)
        if (roll < 0.55) {
            const correctPair = `${item.word} / ${item.synonym}`;
            const wrongPairs = [];
            let att = 0;
            while (wrongPairs.length < 3 && att++ < 50) {
                const p1 = pool[this._rand(0, pool.length - 1)];
                const p2 = pool[this._rand(0, pool.length - 1)];
                if (p1.word !== p2.word) {
                    const fake = `${p1.word} / ${p2.synonym}`;
                    if (fake !== correctPair && !wrongPairs.includes(fake)) wrongPairs.push(fake);
                }
            }
            const answers = this._shuffle([correctPair, ...wrongPairs]);
            return {
                question: `🔄 Which pair means the SAME?`,
                questionSpeak: `Which pair of words mean the same thing?`,
                answers,
                correctIndex: answers.indexOf(correctPair),
                topic: 'synonyms',
                subtype: 'synonym-pair',
                explanation: `"${item.word}" and "${item.synonym}" mean the same thing!`,
                explanationSpeak: `${item.word} and ${item.synonym} mean the same!`
            };
        }

        // Original: "Which word means the same?"
        const answers = this._shuffle([item.synonym, ...item.wrongs.slice(0, 3)]);
        return {
            question: `🔄 Which word means the SAME as "${item.word}"?`,
            questionSpeak: `Which word means the same as ${item.word}?`,
            answers,
            correctIndex: answers.indexOf(item.synonym),
            topic: 'synonyms',
            subtype: level < 5 ? 'easy-synonym' : 'hard-synonym',
            explanation: `"${item.synonym}" means the same as "${item.word}"!`,
            explanationSpeak: `${item.synonym} means the same as ${item.word}!`
        };
    },

    // ---- ALPHABETICAL ORDER ----
    _alphabetical(level) {
        const easyWords = ['ant', 'ball', 'cat', 'dog', 'egg', 'fish', 'goat', 'hat', 'ice', 'jam', 'kite', 'lion', 'milk', 'nest', 'owl', 'pig', 'queen', 'rain', 'star', 'tree', 'umbrella', 'van', 'water', 'xray', 'yarn', 'zoo'];
        const hardWords = ['apple', 'animal', 'about', 'after', 'baby', 'black', 'brown', 'blue', 'boat', 'cake', 'candy', 'chair', 'cheese', 'color', 'dance', 'door', 'dream', 'drink'];

        if (level < 4) {
            // Easy: pick 4 words starting with different letters far apart
            const picks = [];
            const used = new Set();
            let att = 0;
            while (picks.length < 4 && att++ < 50) {
                const w = easyWords[this._rand(0, easyWords.length - 1)];
                if (!used.has(w[0])) { picks.push(w); used.add(w[0]); }
            }
            if (picks.length < 4) picks.push(...easyWords.slice(0, 4 - picks.length));
            const sorted = [...picks].sort();
            const correct = sorted[0];
            const answers = this._shuffle(picks);

            return {
                question: `🔤 Which word comes FIRST in ABC order?`,
                questionSpeak: `Which word comes first in A B C order?`,
                answers,
                correctIndex: answers.indexOf(correct),
                topic: 'alphabetical',
                subtype: 'abc-first-easy',
                explanation: `"${correct}" comes first because it starts with "${correct[0].toUpperCase()}"!`,
                explanationSpeak: `${correct} comes first because it starts with ${correct[0].toUpperCase()}!`
            };
        } else {
            // Hard: words starting with same letter (compare second letter)
            const letter = 'abcdrs'[this._rand(0, 5)];
            const pool = hardWords.filter(w => w[0] === letter);
            if (pool.length < 4) {
                // Fallback to easy mode
                return this._alphabetical(2);
            }
            const picks = this._shuffle(pool).slice(0, 4);
            const sorted = [...picks].sort();
            const askLast = Math.random() < 0.5;
            const correct = askLast ? sorted[sorted.length - 1] : sorted[0];
            const qWord = askLast ? 'LAST' : 'FIRST';
            const answers = this._shuffle(picks);

            return {
                question: `🔤 Which word comes ${qWord} in ABC order?`,
                questionSpeak: `Which word comes ${qWord.toLowerCase()} in A B C order?`,
                answers,
                correctIndex: answers.indexOf(correct),
                topic: 'alphabetical',
                subtype: 'abc-same-letter',
                explanation: `"${correct}" comes ${qWord.toLowerCase()} — look at the second letter!`,
                explanationSpeak: `${correct} comes ${qWord.toLowerCase()}! Look at the second letter to figure it out!`
            };
        }
    },

    // ---- WORD FAMILIES ----
    _wordFamilies(level) {
        const families = [
            { family: '-at', words: ['cat', 'bat', 'hat', 'mat', 'rat', 'sat', 'fat', 'pat'], outsiders: ['cup', 'dog', 'run', 'bed'] },
            { family: '-an', words: ['can', 'fan', 'man', 'pan', 'ran', 'van', 'tan', 'ban'], outsiders: ['cup', 'pig', 'hot', 'bed'] },
            { family: '-ig', words: ['big', 'dig', 'fig', 'pig', 'wig', 'jig'], outsiders: ['cat', 'sun', 'red', 'cup'] },
            { family: '-op', words: ['hop', 'mop', 'pop', 'top', 'cop', 'stop'], outsiders: ['hat', 'sun', 'bed', 'run'] },
            { family: '-ug', words: ['bug', 'hug', 'mug', 'rug', 'tug', 'dug', 'jug'], outsiders: ['cat', 'pig', 'hot', 'fan'] },
            { family: '-in', words: ['bin', 'fin', 'pin', 'win', 'tin', 'grin', 'spin'], outsiders: ['cat', 'dog', 'bus', 'top'] },
            { family: '-et', words: ['bet', 'get', 'jet', 'met', 'net', 'pet', 'set', 'wet'], outsiders: ['cat', 'dog', 'cup', 'run'] },
            { family: '-ot', words: ['cot', 'dot', 'got', 'hot', 'lot', 'not', 'pot'], outsiders: ['cat', 'big', 'sun', 'run'] },
            { family: '-it', words: ['bit', 'fit', 'hit', 'kit', 'lit', 'pit', 'sit'], outsiders: ['cat', 'dog', 'cup', 'sun'] },
            { family: '-un', words: ['bun', 'fun', 'gun', 'run', 'sun', 'pun'], outsiders: ['cat', 'dog', 'pig', 'hat'] },
            { family: '-ake', words: ['bake', 'cake', 'lake', 'make', 'rake', 'wake'], outsiders: ['bike', 'dog', 'rain', 'tree'] },
            { family: '-ine', words: ['fine', 'line', 'mine', 'nine', 'pine', 'vine'], outsiders: ['bone', 'rain', 'tree', 'cake'] }
        ];

        const fam = families[this._rand(0, families.length - 1)];

        // V37: "Which family does this word belong to?" (30%)
        if (Math.random() < 0.3) {
            const word = fam.words[this._rand(0, fam.words.length - 1)];
            const otherFams = families.filter(f => f.family !== fam.family);
            const wrongFamilies = this._shuffle(otherFams).slice(0, 3).map(f => f.family);
            const answers = this._shuffle([fam.family, ...wrongFamilies]);
            return {
                question: `👨‍👩‍👧 Which word family does "${word}" belong to?`,
                questionSpeak: `Which word family does ${word} belong to?`,
                answers,
                correctIndex: answers.indexOf(fam.family),
                topic: 'word-families',
                subtype: 'identify-family',
                explanation: `"${word}" is in the ${fam.family} family! Other ${fam.family} words: ${fam.words.filter(w => w !== word).slice(0, 3).join(', ')}!`,
                explanationSpeak: `${word} is in the ${fam.family.replace('-', '')} family!`
            };
        }

        if (level < 4 || Math.random() < 0.5) {
            // Which word belongs in this family?
            const correct = fam.words[this._rand(0, fam.words.length - 1)];
            const wrongs = this._shuffle(fam.outsiders).slice(0, 3);
            const answers = this._shuffle([correct, ...wrongs]);

            return {
                question: `👨‍👩‍👧 Which word belongs in the "${fam.family}" family?`,
                questionSpeak: `Which word belongs in the ${fam.family.replace('-', '')} family?`,
                answers,
                correctIndex: answers.indexOf(correct),
                topic: 'word-families',
                subtype: 'belongs-in-family',
                explanation: `"${correct}" is in the ${fam.family} family! They all end with ${fam.family}!`,
                explanationSpeak: `${correct} is in the ${fam.family.replace('-', '')} family! They all end the same way!`
            };
        } else {
            // Which word does NOT belong?
            const outsider = fam.outsiders[this._rand(0, fam.outsiders.length - 1)];
            const members = this._shuffle(fam.words).slice(0, 3);
            const answers = this._shuffle([outsider, ...members]);

            return {
                question: `👨‍👩‍👧 Which word does NOT belong in the "${fam.family}" family?`,
                questionSpeak: `Which word does not belong in the ${fam.family.replace('-', '')} family?`,
                answers,
                correctIndex: answers.indexOf(outsider),
                topic: 'word-families',
                subtype: 'not-in-family',
                explanation: `"${outsider}" doesn't end with ${fam.family}! The others do!`,
                explanationSpeak: `${outsider} does not end with ${fam.family.replace('-', '')}! The others all rhyme!`
            };
        }
    },

    // ---- STORY SEQUENCING ----
    _sequencing(level) {
        // V37: "What comes BETWEEN?" format (25%)
        if (Math.random() < 0.25) {
            const betweenStories = [
                { first: 'Wake up', middle: 'Eat breakfast', last: 'Go to school', wrongs: ['Go to bed', 'Watch TV', 'Take a bath'] },
                { first: 'Get eggs', middle: 'Crack them', last: 'Cook them', wrongs: ['Buy milk', 'Wash dishes', 'Set the table'] },
                { first: 'Get the ball', middle: 'Throw it', last: 'Dog catches it', wrongs: ['Pet the dog', 'Go inside', 'Eat a snack'] },
                { first: 'Turn on water', middle: 'Wash hands', last: 'Dry with towel', wrongs: ['Eat lunch', 'Get dressed', 'Brush teeth'] },
                { first: 'Open book', middle: 'Read the story', last: 'Close the book', wrongs: ['Draw a picture', 'Write a letter', 'Sing a song'] },
                { first: 'Get in line', middle: 'Order food', last: 'Eat lunch', wrongs: ['Go home', 'Play outside', 'Read a book'] },
                { first: 'Put on shoes', middle: 'Tie the laces', last: 'Walk outside', wrongs: ['Take off socks', 'Eat breakfast', 'Brush hair'] },
                { first: 'Pick up crayon', middle: 'Draw a picture', last: 'Show to mom', wrongs: ['Clean up', 'Go to bed', 'Watch TV'] }
            ];
            const story = betweenStories[this._rand(0, betweenStories.length - 1)];
            const answers = this._shuffle([story.middle, ...story.wrongs]);
            return {
                question: `📋 What comes BETWEEN?\n"${story.first}" → ??? → "${story.last}"`,
                questionSpeak: `What comes between ${story.first} and ${story.last}?`,
                answers,
                correctIndex: answers.indexOf(story.middle),
                topic: 'sequencing',
                subtype: 'story-order-between',
                explanation: `"${story.middle}" goes in the middle! ${story.first} → ${story.middle} → ${story.last}`,
                explanationSpeak: `${story.middle} goes in the middle!`
            };
        }

        const easyStories = [
            { steps: ['Wake up', 'Eat breakfast', 'Go to school'], q: 'What happens FIRST?', correct: 'Wake up', qType: 'first' },
            { steps: ['Put on shoes', 'Walk to the bus', 'Ride the bus'], q: 'What happens LAST?', correct: 'Ride the bus', qType: 'last' },
            { steps: ['Get a book', 'Open the book', 'Read the story'], q: 'What happens FIRST?', correct: 'Get a book', qType: 'first' },
            { steps: ['Plant a seed', 'Water it', 'Watch it grow'], q: 'What do you do FIRST?', correct: 'Plant a seed', qType: 'first' },
            { steps: ['Wash hands', 'Eat lunch', 'Clean up'], q: 'What do you do LAST?', correct: 'Clean up', qType: 'last' },
            { steps: ['Get in bed', 'Close eyes', 'Fall asleep'], q: 'What happens FIRST?', correct: 'Get in bed', qType: 'first' },
            { steps: ['Open the door', 'Walk inside', 'Close the door'], q: 'What happens NEXT after opening the door?', correct: 'Walk inside', qType: 'next' },
            { steps: ['Build a snowman', 'Put on a hat', 'Add a carrot nose'], q: 'What happens FIRST?', correct: 'Build a snowman', qType: 'first' },
            { steps: ['Find a crayon', 'Draw a picture', 'Show Mom'], q: 'What happens LAST?', correct: 'Show Mom', qType: 'last' },
            { steps: ['Mix the batter', 'Pour into pan', 'Bake the cake'], q: 'What do you do FIRST?', correct: 'Mix the batter', qType: 'first' },
            { steps: ['Get dressed', 'Brush teeth', 'Eat breakfast'], q: 'What happens after getting dressed?', correct: 'Brush teeth', qType: 'next' },
            { steps: ['Throw the ball', 'Dog runs', 'Dog brings it back'], q: 'What happens LAST?', correct: 'Dog brings it back', qType: 'last' }
        ];
        const hardStories = [
            { steps: ['Pack your bag', 'Drive to the airport', 'Board the plane', 'Fly away'], q: 'What do you do SECOND?', correct: 'Drive to the airport', qType: 'second' },
            { steps: ['Write a letter', 'Put it in an envelope', 'Add a stamp', 'Mail it'], q: 'What do you do LAST?', correct: 'Mail it', qType: 'last' },
            { steps: ['Pick apples', 'Wash them', 'Peel them', 'Make a pie'], q: 'What do you do FIRST?', correct: 'Pick apples', qType: 'first' },
            { steps: ['Find a recipe', 'Buy ingredients', 'Cook the food', 'Eat dinner'], q: 'What happens THIRD?', correct: 'Cook the food', qType: 'third' },
            { steps: ['Get wood', 'Stack the logs', 'Light the fire', 'Roast marshmallows'], q: 'What do you do SECOND?', correct: 'Stack the logs', qType: 'second' },
            { steps: ['Dig a hole', 'Plant a tree', 'Fill with dirt', 'Water the tree'], q: 'What happens LAST?', correct: 'Water the tree', qType: 'last' }
        ];

        const pool = level < 5 ? easyStories : hardStories;
        const story = pool[this._rand(0, pool.length - 1)];
        const decoy = level < 5 ? ['Fly a kite', 'Pet a dog', 'Sing a song', 'Jump rope'][this._rand(0, 3)] : ['Go swimming', 'Read a book', 'Watch TV', 'Call a friend'][this._rand(0, 3)];
        const wrongs = story.steps.filter(s => s !== story.correct).slice(0, 2);
        wrongs.push(decoy);
        const answers = this._shuffle([story.correct, ...wrongs.slice(0, 3)]);

        return {
            question: `📋 ${story.steps.join(' → ')}\n\n${story.q}`,
            questionSpeak: `${story.steps.join(', then ')}. ${story.q}`,
            answers,
            correctIndex: answers.indexOf(story.correct),
            topic: 'sequencing',
            subtype: 'story-order-' + story.qType,
            explanation: `"${story.correct}" is correct! ${story.steps.join(' → ')}`,
            explanationSpeak: `${story.correct} is right! First ${story.steps[0]}, then the rest follow in order!`
        };
    },

    // ---- HOMOPHONES ----
    _homophones(level) {
        const pairs = [
            { pair: ['their', 'there'], sentence: 'Put your toys over ___', correct: 'there', wrongPick: 'their', wrongs: ['they', 'here'] },
            { pair: ['to', 'two', 'too'], sentence: 'I have ___ cats', correct: 'two', wrongPick: 'to', wrongs: ['too', 'tow'] },
            { pair: ['see', 'sea'], sentence: 'I can ___ the bird', correct: 'see', wrongPick: 'sea', wrongs: ['she', 'say'] },
            { pair: ['no', 'know'], sentence: 'I ___ the answer', correct: 'know', wrongPick: 'no', wrongs: ['now', 'new'] },
            { pair: ['right', 'write'], sentence: 'I can ___ my name', correct: 'write', wrongPick: 'right', wrongs: ['ride', 'rite'] },
            { pair: ['hear', 'here'], sentence: 'Come ___ please', correct: 'here', wrongPick: 'hear', wrongs: ['her', 'hare'] },
            { pair: ['sun', 'son'], sentence: 'The ___ is bright today', correct: 'sun', wrongPick: 'son', wrongs: ['sin', 'some'] },
            { pair: ['one', 'won'], sentence: 'She ___ the race', correct: 'won', wrongPick: 'one', wrongs: ['win', 'run'] },
            { pair: ['ate', 'eight'], sentence: 'I ___ my lunch', correct: 'ate', wrongPick: 'eight', wrongs: ['eat', 'at'] },
            { pair: ['blue', 'blew'], sentence: 'The wind ___ hard', correct: 'blew', wrongPick: 'blue', wrongs: ['blow', 'flew'] },
            { pair: ['flower', 'flour'], sentence: 'Use ___ to bake a cake', correct: 'flour', wrongPick: 'flower', wrongs: ['floor', 'flat'] },
            { pair: ['night', 'knight'], sentence: 'The brave ___ rode a horse', correct: 'knight', wrongPick: 'night', wrongs: ['king', 'kite'] },
            { pair: ['dear', 'deer'], sentence: 'A ___ ran through the forest', correct: 'deer', wrongPick: 'dear', wrongs: ['dog', 'bear'] },
            { pair: ['tale', 'tail'], sentence: 'The dog wagged its ___', correct: 'tail', wrongPick: 'tale', wrongs: ['tall', 'tell'] },
            { pair: ['wear', 'where'], sentence: '___ is my backpack?', correct: 'Where', wrongPick: 'Wear', wrongs: ['Were', 'We'] }
        ];

        const item = pairs[this._rand(0, pairs.length - 1)];
        const roll = Math.random();

        // V37: "Which pair are homophones?" (30%)
        if (roll < 0.3) {
            const correctPairStr = item.pair.join(' & ');
            const fakePairs = [];
            const nonHomophones = [
                'cat & bat', 'run & fun', 'big & dig', 'hot & pot', 'red & bed',
                'hat & mat', 'sit & hit', 'top & mop', 'sun & bun', 'let & set'
            ];
            const picks = this._shuffle(nonHomophones).slice(0, 3);
            const answers = this._shuffle([correctPairStr, ...picks]);
            return {
                question: `👂 Which pair are HOMOPHONES?\n(sound the same, different meaning)`,
                questionSpeak: `Which pair of words are homophones? Homophones sound the same but have different meanings.`,
                answers,
                correctIndex: answers.indexOf(correctPairStr),
                topic: 'homophones',
                subtype: 'identify-homophones',
                explanation: `"${item.pair.join('" and "')}" are homophones! Same sound, different meaning!`,
                explanationSpeak: `${item.pair.join(' and ')} are homophones! They sound the same but mean different things!`
            };
        }

        // V37: "Which word means ___?" (meaning-based, 25%)
        if (roll < 0.55) {
            const meaningPairs = [
                { word: 'there', meaning: 'a place (over ___)', wrongs: ['their', 'they'] },
                { word: 'their', meaning: 'belongs to them', wrongs: ['there', 'they'] },
                { word: 'two', meaning: 'the number 2', wrongs: ['to', 'too'] },
                { word: 'too', meaning: 'also / more than enough', wrongs: ['to', 'two'] },
                { word: 'write', meaning: 'put words on paper', wrongs: ['right', 'rite'] },
                { word: 'right', meaning: 'correct / not left', wrongs: ['write', 'rite'] },
                { word: 'see', meaning: 'look with your eyes', wrongs: ['sea', 'she'] },
                { word: 'sea', meaning: 'a big body of water', wrongs: ['see', 'she'] },
                { word: 'know', meaning: 'understand something', wrongs: ['no', 'now'] },
                { word: 'no', meaning: 'not yes', wrongs: ['know', 'now'] },
                { word: 'hear', meaning: 'listen with your ears', wrongs: ['here', 'her'] },
                { word: 'here', meaning: 'in this place', wrongs: ['hear', 'her'] },
                { word: 'flour', meaning: 'used to bake', wrongs: ['flower', 'floor'] },
                { word: 'flower', meaning: 'a plant that blooms', wrongs: ['flour', 'floor'] },
                { word: 'tail', meaning: 'what a dog wags', wrongs: ['tale', 'tall'] },
                { word: 'tale', meaning: 'a story', wrongs: ['tail', 'tall'] }
            ];
            const mItem = meaningPairs[this._rand(0, meaningPairs.length - 1)];
            const answers = this._shuffle([mItem.word, ...mItem.wrongs.slice(0, 3)]);
            return {
                question: `👂 Which word means:\n"${mItem.meaning}"?`,
                questionSpeak: `Which word means ${mItem.meaning}?`,
                answers,
                correctIndex: answers.indexOf(mItem.word),
                topic: 'homophones',
                subtype: 'homophone-meaning',
                explanation: `"${mItem.word}" means "${mItem.meaning}"!`,
                explanationSpeak: `${mItem.word} means ${mItem.meaning}!`
            };
        }

        // Original: fill in the blank
        const answers = this._shuffle([item.correct, item.wrongPick, ...item.wrongs.slice(0, 2)]);
        return {
            question: `👂 Fill in the blank:\n"${item.sentence}"`,
            questionSpeak: `Fill in the blank: ${item.sentence.replace('___', 'blank')}`,
            answers,
            correctIndex: answers.indexOf(item.correct),
            topic: 'homophones',
            subtype: 'fill-blank-homophone',
            explanation: `"${item.correct}" is correct! "${item.pair.join('" and "')}" sound the same but mean different things!`,
            explanationSpeak: `${item.correct} is correct! ${item.pair.join(' and ')} sound the same but have different meanings!`
        };
    },

    // ---- CAPITALIZATION ----
    _capitalization(level) {
        const easyItems = [
            { sentence: 'my name is ___.', answer: 'Sam', wrongs: ['the', 'and', 'run'] },
            { sentence: '___ is my friend.', answer: 'Lily', wrongs: ['run', 'jump', 'fast'] },
            { sentence: 'i live in ___.', answer: 'Texas', wrongs: ['house', 'street', 'town'] },
            { sentence: 'we went to see ___.', answer: 'Grandma', wrongs: ['house', 'store', 'park'] },
            { sentence: 'my dog ___ is fluffy.', answer: 'Buddy', wrongs: ['small', 'brown', 'cute'] },
            { sentence: '___ is the best day!', answer: 'Monday', wrongs: ['happy', 'fun', 'great'] },
            { sentence: 'we celebrate in ___.', answer: 'December', wrongs: ['winter', 'cold', 'snow'] },
            { sentence: 'i love ___ park.', answer: 'Central', wrongs: ['green', 'big', 'nice'] },
            { sentence: '___ went to school.', answer: 'Jake', wrongs: ['happy', 'fast', 'big'] },
            { sentence: 'we visited ___.', answer: 'Disney World', wrongs: ['fun place', 'big park', 'theme park'] },
            { sentence: 'my teacher is ___.', answer: 'Mrs. Smith', wrongs: ['the best', 'so nice', 'very fun'] },
            { sentence: 'we read ___ in class.', answer: 'Charlotte\'s Web', wrongs: ['a story', 'the book', 'a tale'] }
        ];
        const hardItems = [
            { sentence: 'the ___ river is very long.', answer: 'Mississippi', wrongs: ['biggest', 'longest', 'deepest'] },
            { sentence: 'we drove across the ___ bridge.', answer: 'Golden Gate', wrongs: ['very big', 'longest', 'red'] },
            { sentence: '___ brought presents last year.', answer: 'Santa Claus', wrongs: ['Someone', 'Everyone', 'Nobody'] },
            { sentence: 'they live on ___ street.', answer: 'Oak', wrongs: ['that', 'this', 'one'] },
            { sentence: 'we speak ___ at school.', answer: 'English', wrongs: ['words', 'lots', 'well'] },
            { sentence: 'the president lives in ___.', answer: 'Washington', wrongs: ['a house', 'the city', 'a place'] }
        ];

        const pool = level < 5 ? easyItems : hardItems;
        const item = pool[this._rand(0, pool.length - 1)];
        const roll = Math.random();

        // V37: "Which sentence uses capitals correctly?" (30%)
        if (roll < 0.3) {
            const correctSentences = [
                { correct: 'My name is Sam.', wrongs: ['my name is Sam.', 'My name is sam.', 'my Name is sam.'] },
                { correct: 'I love Monday.', wrongs: ['I love monday.', 'i love Monday.', 'i love monday.'] },
                { correct: 'We live in Texas.', wrongs: ['We live in texas.', 'we live in Texas.', 'we live in texas.'] },
                { correct: 'She went to Disney World.', wrongs: ['She went to disney world.', 'she went to Disney World.', 'She went to disney World.'] },
                { correct: 'My dog Buddy is cute.', wrongs: ['My dog buddy is cute.', 'my dog Buddy is cute.', 'my dog buddy is cute.'] },
                { correct: 'It is December now.', wrongs: ['It is december now.', 'it is December now.', 'it is december Now.'] },
                { correct: 'Jake and I played.', wrongs: ['jake and I played.', 'Jake and i played.', 'jake and i played.'] },
                { correct: 'Mrs. Smith is nice.', wrongs: ['mrs. Smith is nice.', 'Mrs. smith is nice.', 'mrs. smith is nice.'] }
            ];
            const sItem = correctSentences[this._rand(0, correctSentences.length - 1)];
            const answers = this._shuffle([sItem.correct, ...sItem.wrongs.slice(0, 3)]);
            return {
                question: `🅰️ Which sentence uses CAPITALS correctly?`,
                questionSpeak: `Which sentence uses capital letters correctly?`,
                answers,
                correctIndex: answers.indexOf(sItem.correct),
                topic: 'capitalization',
                subtype: 'correct-capitals',
                explanation: `"${sItem.correct}" is right! Names, places, and "I" always get capital letters!`,
                explanationSpeak: `That's right! Names, places, and the word I always start with a capital letter!`
            };
        }

        // V37: "What TYPE of word needs a capital?" (25%)
        if (roll < 0.55) {
            const rules = [
                { rule: 'first word in a sentence', example: '"The cat sat."', correct: 'The', wrongs: ['cat', 'sat', 'a'] },
                { rule: 'a person\'s name', example: '"I saw Emma today."', correct: 'Emma', wrongs: ['saw', 'today', 'the'] },
                { rule: 'a day of the week', example: '"We play on Friday."', correct: 'Friday', wrongs: ['play', 'on', 'we'] },
                { rule: 'a month', example: '"My birthday is in June."', correct: 'June', wrongs: ['birthday', 'is', 'in'] },
                { rule: 'the word I', example: '"He and I went."', correct: 'I', wrongs: ['and', 'went', 'he'] },
                { rule: 'a place name', example: '"We drove to Florida."', correct: 'Florida', wrongs: ['drove', 'to', 'we'] }
            ];
            const rItem = rules[this._rand(0, rules.length - 1)];
            const answers = this._shuffle([rItem.correct, ...rItem.wrongs]);
            return {
                question: `🅰️ ${rItem.example}\nWhich word needs a capital because it's ${rItem.rule}?`,
                questionSpeak: `Which word needs a capital letter because it is ${rItem.rule}?`,
                answers,
                correctIndex: answers.indexOf(rItem.correct),
                topic: 'capitalization',
                subtype: 'capital-rule',
                explanation: `"${rItem.correct}" needs a capital because it's ${rItem.rule}!`,
                explanationSpeak: `${rItem.correct} needs a capital letter because it is ${rItem.rule}!`
            };
        }

        // Original: "Which word needs a capital?"
        const answers = this._shuffle([item.answer, ...item.wrongs.slice(0, 3)]);
        return {
            question: `🅰️ Which word needs a CAPITAL letter?\n"${item.sentence}"`,
            questionSpeak: `Which word needs a capital letter in the sentence: ${item.sentence.replace('___', 'blank')}`,
            answers,
            correctIndex: answers.indexOf(item.answer),
            topic: 'capitalization',
            subtype: level < 5 ? 'easy-capital' : 'hard-capital',
            explanation: `"${item.answer}" needs a capital letter because it's a proper name!`,
            explanationSpeak: `${item.answer} needs a capital letter because it is a name or special place!`
        };
    }
};
