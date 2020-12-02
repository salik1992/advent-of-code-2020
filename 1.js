const input = require('./inputs/1');

for (let i = 0; i < input.length; i++) {
    const a = input[i];
    for (let j = i; j < input.length; j++) {
        const b = input[j];
        for (let k = j; k < input.length; k++) {
            const c = input[k];
            if (a + b + c === 2020) console.log(a * b * c);
        }
    }
}
