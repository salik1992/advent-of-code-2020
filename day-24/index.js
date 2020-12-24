const input = require('./input');
// const input = require('./testInput');

const instructions = input.split('\n');

const tiles = {};

const instructionToId = (instruction) => {
    let x = 0;
    let y = 0;
    instruction.match(/(ne|nw|se|sw|e|w)/g).forEach((move) => {
        switch (move) {
            case 'ne': y -=1; x += 1; break;
            case 'nw': y -=1; x -= 1; break;
            case 'se': y +=1; x += 1; break;
            case 'sw': y +=1; x -= 1; break;
            case 'e': x += 2; break;
            case 'w': x -= 2; break;
        }
    });
    return `x${x}y${y}`;
};

instructions.forEach((instruction) => {
    const id = instructionToId(instruction);
    if (tiles[id]) tiles[id].isBlack = !tiles[id].isBlack;
    else tiles[id] = { isBlack: true, willBeBlack: null };
});

// part 1
console.log(Object.values(tiles).filter(({ isBlack }) => isBlack).length);

// part 2
const isTileBlack = (x, y) => {
    const tile = tiles[`x${x}y${y}`];
    if (!tile) {
        tiles[`x${x}y${y}`] = { isBlack: false, willBeBlack: null };
        return false;
    }
    return tile.isBlack;
};

const getAdjacentColors = (oX, oY) => {
    let white = 0;
    let black = 0;
    [
        { x: 1, y: 1 },
        { x: -1, y: 1 },
        { x: 1, y: -1 },
        { x: -1, y: -1 },
        { x: 2, y: 0 },
        { x: -2, y: 0 },
    ].forEach(({ x, y }) => {
        if (isTileBlack(oX + x, oY + y)) black++;
        else white++;
    });
    return { black, white };
};

const dayFlip = () => {
    Object.keys(tiles).forEach((tileId) => { // add adjacent white
        const [_, x, y] = tileId.split(/x|y/).map(Number);
        getAdjacentColors(x, y);
    });
    Object.keys(tiles).forEach((tileId) => {
        const tile = tiles[tileId];
        const [_, x, y] = tileId.split(/x|y/).map(Number);
        const { black } = getAdjacentColors(x, y);
        if (tile.isBlack && (black === 0 || black > 2)) {
            tile.willBeBlack = false;
        } else if (!tile.isBlack && black === 2) {
            tile.willBeBlack = true;
        }
    });
    Object.values(tiles).forEach((tile) => {
        if (tile.willBeBlack !== null) {
            tile.isBlack = tile.willBeBlack;
            tile.willBeBlack = null;
        }
    });
};

for (let days = 100; days--;) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Remaining days: ${days}`);
    dayFlip();
}
console.log('\n');

console.log(Object.values(tiles).filter(({ isBlack }) => isBlack).length);
