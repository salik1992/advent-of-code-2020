const input = require('./input');

const firstSolution = () => {
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
};

const refactoredSolution = (numbersCount, sum) => {
    const getSum = (arr) => arr.reduce((acc, value) => acc + value, 0);
    const getProduct = (arr) => arr.reduce((acc, value) => acc * value, 1);

    const pointers = (() => {
        const arr = [];
        let i = 0;
        while (i < numbersCount) arr.push(i++);
        return arr;
    })();

    const increasePointer = (indexFromEnd) => {
        const index = pointers.length - 1 - indexFromEnd;
        if (pointers[index] < input.length - 1) {
            pointers[index] += 1;
            return true;
        }
        if (index === 0) return false;
        if (increasePointer(indexFromEnd + 1)) {
            pointers[index] = pointers[index - 1] + 1;
            return true;
        } else {
            return false;
        }
    };

    const getCandidates = () => pointers.map(index => input[index]);
    
    do {
        const candidates = getCandidates();
        if (getSum(candidates) === sum) {
            console.log(getProduct(candidates))
            break;
        }
    } while (increasePointer(0))
};

refactoredSolution(3, 2020);
