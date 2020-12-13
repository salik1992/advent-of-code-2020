const input = require('./input');
// const input = (
// `939
// 7,13,x,x,59,x,31,19`);

const { departureTimestamp, buses } = (() => {
    const [departureLine, busesLine] = input.split('\n');
    return {
        departureTimestamp: parseInt(departureLine, 10),
        buses: busesLine.split(',').map((id, index) => ({
            id: id === 'x' ? id : parseInt(id, 10),
            index,
        })),
    };
})();

const busesWithWaitingTimes = buses.filter((line) => line !== 'x').map(({ id }) => {
    const cycle = Math.ceil(departureTimestamp / id);
    const waitingTime = cycle * id - departureTimestamp;
    return { waitingTime, id };
});

const nextBusToTheAirport = busesWithWaitingTimes
    .sort((a, b) => a.waitingTime - b.waitingTime)[0];

// part 1
console.log(nextBusToTheAirport.waitingTime * nextBusToTheAirport.id);

// part 2
const maxId = Math.max(...buses);
const maxIdIndex = buses.findIndex((id) => id === maxId);

let timestamp = 0;
while (
    !buses.every(({ id, index }) => (timestamp - (maxIdIndex - index)) % id === 0)
) {
    timestamp += maxId;
}

console.log(timestamp - maxIdIndex);

