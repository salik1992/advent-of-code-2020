const input = require('./input');
const getSum = require('../utils/getSum');

const PREAMBLE_SIZE = 25;

// part 1

const getSumsOfPairs = (array) => array.map((a, from) => (
    array.slice(from + 1, array.length).map((b) => a + b)
)).flat();

const findFirstInvalidXMASNumber = (array, preambleSize) => {
    let firstInvalid = null;
    for (let i = preambleSize; i < array.length; i++) {
        const pairsSums = getSumsOfPairs(array.slice(i - preambleSize, i));
        if (pairsSums.indexOf(array[i]) === -1) {
            firstInvalid = array[i];
            break;
        }
    }
    return firstInvalid;
};

console.log(findFirstInvalidXMASNumber(input, PREAMBLE_SIZE));

// part 2

const findContigousSetOfSum = (array, sum) => {
    let lowerIndex = 0;
    let upperIndex = 2;
    let sumOfCurrentSet = 0;
    let contigousSet = [];
    while (upperIndex <= array.length && lowerIndex < upperIndex - 1) {
        contigousSet = array.slice(lowerIndex, upperIndex);
        sumOfCurrentSet = getSum(contigousSet);
        if (sumOfCurrentSet === sum) break;
        if (sumOfCurrentSet < sum) {
            if (upperIndex === array.length) return null;
            upperIndex++;
        } else if (sumOfCurrentSet > sum) {
            if (lowerIndex + 1 === upperIndex - 1) {
                if (upperIndex === array.length) return null;
                upperIndex++;
            }
            lowerIndex++;
        }
    }
    return contigousSet;
};

const getSumOfMinAndMaxInArray = (array) => (
    Math.min(...array) + Math.max(...array)
);

console.log(
    getSumOfMinAndMaxInArray(
        findContigousSetOfSum(input, findFirstInvalidXMASNumber(input, PREAMBLE_SIZE)),
    ),
);
