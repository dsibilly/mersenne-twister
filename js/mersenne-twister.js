class MersenneTwister {
    static DEGREE_OF_RECURRENCE = 624;
    static LOWER_MASK = 0x7fffffff;
    static MIDDLE_WORD = 397;
    static RATIONAL_NORMAL_FORM_TWIST_MATRIX = 0x9908b0df;
    static UPPER_MASK = 0x80000000;

    constructor (seed) {
        this.state = new Array(MersenneTwister.DEGREE_OF_RECURRENCE);
        this.stateIndex = MersenneTwister.DEGREE_OF_RECURRENCE + 1;

        if (!seed) {
            seed = new Date().getTime();
        }

        if (seed instanceof Array) {
            this._initWithArray(seed);
        } else {
            this._initWithSeed(seed);
        }
    }

    _initWithArray (array) {
        const setAndResetBigI = i => {
            if (i >= MersenneTwister.DEGREE_OF_RECURRENCE) {
                this.state[0] = this.state[MersenneTwister.DEGREE_OF_RECURRENCE - 1];
                return 1;
            }

            return i;
        };

        let i = 1,
            j = 0,
            k = MersenneTwister.DEGREE_OF_RECURRENCE > array.length ?
                MersenneTwister.DEGREE_OF_RECURRENCE :
                array.length;

        this._initWithSeed(19650218);

        for (; k; k -= 1) {
            const s = this.state[i - 1] ^ (this.state[i - 1] >>> 30);

            this.state[i] = (this.state[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525))) + array[j] + j;
            this.state[i] >>>= 0;

            i += 1;
            j += 1;

            i = setAndResetBigI(i);

            if (j >= array.length) {
                j = 0;
            }
        }

        for (k = MersenneTwister.DEGREE_OF_RECURRENCE - 1; k; k -= 1) {
            const s = this.state[i - 1] ^ (this.state[i - 1] >>> 30);

            this.state[i] = (this.state[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941)) - i;
            this.state[i] >>>= 0;

            i += 1;

            i = setAndResetBigI(i);
        }

        this.state[0] = 0x80000000;
    }

    _initWithSeed (seed) {
        this.state[0] = seed >>> 0;

        for (this.stateIndex = 1; this.stateIndex < MersenneTwister.DEGREE_OF_RECURRENCE; this.stateIndex += 1) {
            const s = this.state[this.stateIndex - 1] ^ (this.state[this.stateIndex - 1] >>> 30);

            this.state[this.stateIndex] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + this.stateIndex;
            this.state[this.stateIndex] >>>= 0;
        }
    }

    random () {
        return this.randomInt() * (1.0 / 4294967296.0);
    }

    randomExclusive () {
        return (this.randomInt() + 0.5) * (1.0 / 4294967296.0);
    }

    randomInclusive () {
        return this.randomInt() * (1.0 / 4294967295.0);
    }

    randomInt () {
        const mag01 = [0x0, MersenneTwister.RATIONAL_NORMAL_FORM_TWIST_MATRIX],
            setY = index => (this.state[index] & MersenneTwister.UPPER_MASK) | (this.state[index + 1] & MersenneTwister.LOWER_MASK);

        let y;

        if (this.stateIndex >= MersenneTwister.DEGREE_OF_RECURRENCE) {
            let index;

            for (index = 0; index < MersenneTwister.DEGREE_OF_RECURRENCE - MersenneTwister.MIDDLE_WORD; index += 1) {
                y = setY(index);
                this.state[index] = this.state[index + MersenneTwister.MIDDLE_WORD] ^ (y >>> 1) ^ mag01[y & 0x1];
            }

            for (; index < MersenneTwister.DEGREE_OF_RECURRENCE - 1; index += 1) {
                y = setY(index);
                this.state[index] = this.state[index + (MersenneTwister.MIDDLE_WORD - MersenneTwister.DEGREE_OF_RECURRENCE)] ^ (y >>> 1) ^ mag01[y & 0x1];
            }

            y = (this.state[MersenneTwister.DEGREE_OF_RECURRENCE - 1] & MersenneTwister.UPPER_MASK) | (this.state[0] & MersenneTwister.LOWER_MASK);
            this.state[MersenneTwister.DEGREE_OF_RECURRENCE - 1] = this.state[MersenneTwister.MIDDLE_WORD - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

            this.stateIndex = 0;
        }

        y = this.state[this.stateIndex];
        this.stateIndex += 1;

        y ^= y >>> 11;
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= y >>> 18;

        return y >>> 0;
    }

    randomInt31 () {
        return this.randomInt() >>> 1;
    }

    randomLong () {
        const a = this.randomInt() >>> 5,
            b = this.randomInt() >>> 6;

        return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
    }
};

module.exports = MersenneTwister;
