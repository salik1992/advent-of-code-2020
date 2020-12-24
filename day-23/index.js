const input = '739862541';
// const input = '389125467';

const cups = input.split('').map(Number);

const min = Math.min(...cups);

const preparePart2Cups = () => {
    let i = Math.max(...cups) + 1;
    while (cups.length < 1000000) {
        cups.push(i);
        i++;
    }
    return i - 1;
};

// const DO_PART_2 = false;
const DO_PART_2 = true;

const max = DO_PART_2 ? preparePart2Cups() : Math.max(...cups);

let currentCup = cups[0];

// const MOVES = 100;
const MOVES = 10000000;

const move = () => {
    const currentCupIndex = cups.indexOf(currentCup);
    const pickUp = cups.splice(currentCupIndex + 1, 3);
    if (pickUp.length < 3) {
        pickUp.push(...cups.splice(0, 3 - pickUp.length));
    }
    const destinationIndex = (() => {
        let candidate = currentCup - 1;
        if (candidate < min) candidate = max;
        let candidateIndex = cups.indexOf(candidate);
        while (candidateIndex === -1) {
            candidate--;
            if (candidate < min) candidate = max;
            candidateIndex = cups.indexOf(candidate);
        }
        return candidateIndex;
    })();
    cups.splice(destinationIndex + 1, 0, ...pickUp);
    const nextCurrentCupIndex = cups.indexOf(currentCup) + 1;
    currentCup = cups[nextCurrentCupIndex === cups.length ? 0 : nextCurrentCupIndex];
};

for (let i = MOVES; i--;) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Moves remaining: ${i}`);
    move();
}

// console.log(cups.join('').split('1').reverse().join(''));
console.log((() => {
    const index1 = cups.indexOf(1);
    const index2 = index1 === cups.length - 1 ? 0 : index1 + 1;
    const index3 = index2 === cups.length - 1 ? 0 : index2 + 1;
    return cups[index2] * cups[index3];
})());
