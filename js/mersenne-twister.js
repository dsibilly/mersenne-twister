/* eslint no-bitwise: 0 */
import _make from 'isotropic-make';

const _MersenneTwister = _make({
    random () {
        return this.randomInt() * (1.0 / 4294967296.0);
    },

    randomExclusive () {
        return (this.randomInt() + 0.5) * (1.0 / 4294967296.0);
    },

    randomInclusive () {
        return this.randomInt() * (1.0 / 4294967295.0);
    },

    randomInt () {
        const mag01 = [0x0, _MersenneTwister.MATRIX_A];

        let y;

        if (this.mtIndex >= _MersenneTwister.N) {
            let kk;

            /*
            This code is unreachable in this revision, as there is no
            condition under which a _MersenneTwister object can be
            created wherein _initWithSeed() is not called...
            */
            /*
            if (this.mtIndex === _MersenneTwister.N + 1) {
                // If _initWithSeed has not been called, a default initial seed is used.
                this._initWithSeed(5489);
            }
            */

            for (kk = 0; kk < _MersenneTwister.N - _MersenneTwister.M; kk += 1) {
                y = (this.mt[kk] & _MersenneTwister.UPPER_MASK) | (this.mt[kk + 1] & _MersenneTwister.LOWER_MASK);
                this.mt[kk] = this.mt[kk + _MersenneTwister.M] ^ (y >>> 1) ^ mag01[y & 0x1];
            }

            for (; kk < _MersenneTwister.N - 1; kk += 1) {
                y = (this.mt[kk] & _MersenneTwister.UPPER_MASK) | (this.mt[kk + 1] & _MersenneTwister.LOWER_MASK);
                this.mt[kk] = this.mt[kk + (_MersenneTwister.M - _MersenneTwister.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
            }

            y = (this.mt[_MersenneTwister.N - 1] & _MersenneTwister.UPPER_MASK) | (this.mt[0] & _MersenneTwister.LOWER_MASK);
            this.mt[_MersenneTwister.N - 1] = this.mt[_MersenneTwister.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

            this.mtIndex = 0;
        }

        y = this.mt[this.mtIndex];
        this.mtIndex += 1;

        y ^= y >>> 11;
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= y >>> 18;

        return y >>> 0;
    },

    randomInt31 () {
        return this.randomInt() >>> 1;
    },

    randomLong () {
        const a = this.randomInt() >>> 5,
            b = this.randomInt() >>> 6;

        return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
    },

    _init (seed) {
        if (!seed) {
            seed = new Date().getTime();
        }

        this.mt = new Array(_MersenneTwister.N); // State vector Array
        this.mtIndex = _MersenneTwister.N + 1; // mt[N] is not initialized

        if (seed.constructor === Array) {
            this._initWithArray(seed);
        } else {
            this._initWithSeed(seed);
        }

        return this;
    },

    _initWithArray (array) {
        let i = 1,
            j = 0,
            k = _MersenneTwister.N > array.length ?
                _MersenneTwister.N :
                array.length;

        this._initWithSeed(19650218);

        for (; k; k -= 1) {
            const s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);

            this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525))) + array[j] + j;
            this.mt[i] >>>= 0;

            i += 1;
            j += 1;

            if (i >= _MersenneTwister.N) {
                this.mt[0] = this.mt[_MersenneTwister.N - 1];
                i = 1;
            }

            if (j >= array.length) {
                j = 0;
            }
        }

        for (k = _MersenneTwister.N - 1; k; k -= 1) {
            const s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);

            this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941)) - i;
            this.mt[i] >>>= 0;

            i += 1;

            if (i >= _MersenneTwister.N) {
                this.mt[0] = this.mt[_MersenneTwister.N - 1];
                i = 1;
            }
        }

        this.mt[0] = 0x80000000;
    },

    _initWithSeed (seed) {
        this.mt[0] = seed >>> 0;

        for (this.mtIndex = 1; this.mtIndex < _MersenneTwister.N; this.mtIndex += 1) {
            const s = this.mt[this.mtIndex - 1] ^ (this.mt[this.mtIndex - 1] >>> 30);

            this.mt[this.mtIndex] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + this.mtIndex;
            this.mt[this.mtIndex] >>>= 0;
        }
    }
}, {
    LOWER_MASK: 0x7fffffff, // Least significant R bits
    M: 397,
    MATRIX_A: 0x9908b0df, // Constant vector `a
    N: 624,
    UPPER_MASK: 0x80000000 // Most significant W-R bits
});

export default _MersenneTwister;
