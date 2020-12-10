const input = require('./input');
const getSum = require("../utils/getSum");

const maxJoltageAdapter = Math.max(...input);

// part 1

const chainAdaptersAndGetDifferences = () => {
    let currentJoltage = 0;
    const differencesCounter = {
        [1]: 0, [2]: 0, [3]: 0,
    }
    let difference = 1;
    while (currentJoltage < maxJoltageAdapter) {
        if (input.indexOf(currentJoltage + difference) === -1) {
            difference++;
        } else {
            currentJoltage += difference;
            differencesCounter[difference]++;
            difference = 1;
        }
    }
    differencesCounter[3]++;
    return differencesCounter;
};

const differences = chainAdaptersAndGetDifferences();

console.log(differences[1] * differences[3]);

// part 2

const getAllArrangementsCount = () => {
    const joltageIncrements = [1, 2, 3];
    const continueableJoltages = {};
    [0, ...input.sort((a, b) => a - b)].forEach((joltage) => {
        continueableJoltages[joltage] = (() => {
            const continueable = [];
            joltageIncrements.forEach((increment) => {
                const newJoltage = joltage + increment;
                if (input.indexOf(newJoltage) !== -1) continueable.push(newJoltage);
            });
            reachedByBranches = joltage === 0 ? 1 : getSum(
                Object.values(continueableJoltages).filter(
                    ({ continueable }) => continueable.indexOf(joltage) !== -1,
                ).map(({ reachedByBranches }) => reachedByBranches),
            );
            return { continueable, joltage, reachedByBranches };
        })();
    });
    return continueableJoltages[maxJoltageAdapter].reachedByBranches;
};

console.log(getAllArrangementsCount());
