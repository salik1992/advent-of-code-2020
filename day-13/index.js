const input = require('./input');

const { departureTimestamp, buses } = (() => {
    const [departureLine, busesLine] = input.split('\n');
    return {
        departureTimestamp: parseInt(departureLine, 10),
        buses: busesLine.split(',').map((id, index) => ({
            id: id === 'x' ? id : parseInt(id, 10),
            index,
        })).filter(({ id }) => id !== 'x'),
    };
})();

const busesWithWaitingTimes = buses.map(({ id }) => {
    const cycle = Math.ceil(departureTimestamp / id);
    const waitingTime = cycle * id - departureTimestamp;
    return { waitingTime, id };
});

const nextBusToTheAirport = busesWithWaitingTimes
    .sort((a, b) => a.waitingTime - b.waitingTime)[0];

// part 1
console.log(nextBusToTheAirport.waitingTime * nextBusToTheAirport.id);

// part 2

/**
 * This didn't finish before I:
 * - made a coffee
 * - read local news
 * - drank that coffee
 * - did dishes
 * - did laundry
 * - went out with waste
 * - thought of a refactor
 * - wrote the refactored code
 * - got the result
 * - wrote this comment
 * 
 * const maxId = Math.max(...buses.map(({ id }) => id));
 * const maxIdIndex = buses.find(({ id }) => id === maxId).index;
 *
 * let timestamp = 0;

 * while (
 *     !buses.every(({ id, index }) => (timestamp - (maxIdIndex - index)) % id === 0)
 * ) {
 *     timestamp += maxId;
 * }
 *
 * console.log(timestamp - maxIdIndex);
 */

console.log(
    buses.reduce(({ offset, frequency }, { id: busFrequency, index: busOffset }, arrayIndex) => {
        let timestamp = offset;
        let firstOccurence = null;
        let secondOccurence = null;
        while ((timestamp + busOffset) % busFrequency !== 0) {
            timestamp += frequency;
        }
        firstOccurence = timestamp;
        if (arrayIndex === buses.length - 1) return firstOccurence;
        timestamp += frequency;
        while ((timestamp + busOffset) % busFrequency !== 0) {
            timestamp += frequency;
        }
        secondOccurence = timestamp;
        return {
            offset: firstOccurence,
            frequency: secondOccurence - firstOccurence,
        };
    }, { offset: 1, frequency: 1 }),
);
