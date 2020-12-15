const input = [1, 0, 16, 5, 17, 4];

// const END = 2020;
const END = 30000000;

let lastNumber;
const numbersSpoken = {};

const handleSpokenNumber = (number, index) => {
    if (typeof numbersSpoken[number] === 'undefined') {
        numbersSpoken[number] = { count: 1, lastTwoIndexes: [-1, index] };
    } else {
        const num = numbersSpoken[number];
        num.count += 1;
        num.lastTwoIndexes.shift();
        num.lastTwoIndexes.push(index);
    }
    lastNumber = number;
};

const speakNumber = (number = null, index) => {
    if (number !== null) {
        handleSpokenNumber(number, index);
    } else {
        const num = numbersSpoken[lastNumber];
        if (num.count === 1) {
            handleSpokenNumber(0, index);
        } else {
            const [a, b] = num.lastTwoIndexes;
            handleSpokenNumber(b - a, index);
        }
    }
};

input.forEach(speakNumber);

for (let i = input.length; i < END; i++) {
    speakNumber(null, i);
}

console.log(lastNumber);
