const getSum = require('../utils/getSum');
const input = require('./input');

const FLOOR = '.';
const EMPTY = 'L';
const OCCUPIED = '#';

const initializeSeats = () => (
    input.split('\n').map((line) => line.split('').map((currentState) => ({
        previousState: currentState === FLOOR ? FLOOR : null,
        currentState,
        nextState: null,
    })))
);

const map = initializeSeats();

map.forEachSeat = (callback) => {
    map.forEach((line, y) => line.forEach((seat, x) => callback(seat, x, y)));
};

const isInMap = (x, y) => map[y] && map[y][x];

const getNumberOfOccupied = () => {
    let occupied = 0;
    map.forEachSeat((seat) => {
        if (seat.currentState === OCCUPIED) occupied++;
    });
    return occupied;
}

const getOccupiedSurroundings = (x, y) => {
    let occupied = 0;
    for (let dY = -1; dY <= 1; dY++) {
        const line = map[y + dY];
        if (!line) continue;
        for (let dX = -1; dX <= 1; dX++) {
            if (dY === 0 && dX === 0) continue;
            const seat = line[x + dX];
            if (seat && seat.currentState === OCCUPIED) occupied++;
        }
    }
    return occupied;
};

const getOccupiedVisibleInAllDirections = (seatX, seatY) => {
    let occupied = 0;
    const directions = [
        { dY: -1, dX: -1 }, { dY: -1, dX: 0 }, { dY: -1, dX: 1 },
        { dY: 0, dX: -1 }, { dY: 0, dX: 1 },
        { dY: 1, dX: -1 }, { dY: 1, dX: 0 }, { dY: 1, dX: 1 },
    ];
    directions.forEach(({ dX, dY }) => {
        let seatFound = false;
        let x = seatX + dX;
        let y = seatY + dY;
        while (!seatFound && isInMap(x, y)) {
            const state = map[y][x].currentState;
            if (state === EMPTY || state === OCCUPIED) {
                seatFound = true;
                if (state === OCCUPIED) occupied++;
            }
            x += dX;
            y += dY;
        }
    });
    return occupied;
}

const gameOfSeatsTick = (occupiedRule, occupiedToBecomeEmpty) => {
    map.forEachSeat((seat, x, y) => {
        const occupiedSurrounding = occupiedRule(x, y);
        if (seat.currentState === EMPTY && occupiedSurrounding === 0) seat.nextState = OCCUPIED;
        if (seat.currentState === OCCUPIED && occupiedSurrounding >= occupiedToBecomeEmpty) {
            seat.nextState = EMPTY;
        }
    });
    map.forEachSeat((seat) => {
        seat.previousState = seat.currentState;
        if (seat.nextState) {
            seat.currentState = seat.nextState;
            seat.nextState = null;
        }
    });
};

const isStable = () => map.every(
    (line) => line.every((seat) => seat.previousState === seat.currentState)
);

const runTillStable = (...rules) => {
    while (!isStable()) gameOfSeatsTick(...rules);
};

// part 1
// runTillStable(getOccupiedSurroundings, 4);

// part 2
runTillStable(getOccupiedVisibleInAllDirections, 5)

console.log(getNumberOfOccupied());
