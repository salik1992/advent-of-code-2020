const input = require('./inputs/3');

const TREE = '#';

const map = input.split('\n').filter(line => line.length > 0).map(line => line.split(''));

const position = {
    x: 0,
    y: 0,
};

const resetPosition = () => {
    position.x = 0;
    position.y = 0;
};

const moveInMap = (byX, byY) => {
    position.x += byX;
    position.y += byY;
    if (position.y < map.length) {
        if (position.x < 0) position.x = map[position.y].length + position.x;
        if (position.x >= map[position.y].length) position.x = position.x - map[position.y].length;
    }
};

const getCurrentLocation = () => map[position.y][position.x];

const isInFinish = () => position.y >= map.length;

const treeCountOnAPath = (move) => {
    resetPosition();
    let treeCounter = 0;
    while (true) {
        move();
        if (isInFinish()) break;
        if (getCurrentLocation() === TREE) treeCounter++;
    }
    return treeCounter;
};

// task 1:
console.log(treeCountOnAPath(() => moveInMap(3, 1)));

// task 2:
console.log([
    treeCountOnAPath(() => moveInMap(1, 1)),
    treeCountOnAPath(() => moveInMap(3, 1)),
    treeCountOnAPath(() => moveInMap(5, 1)),
    treeCountOnAPath(() => moveInMap(7, 1)),
    treeCountOnAPath(() => moveInMap(1, 2)),
].reduce((acc, value) => acc * value, 1));