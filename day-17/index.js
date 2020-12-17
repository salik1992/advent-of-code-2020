const input = require('./input');

const ACTIVE = true;
const INACTIVE = false;

const cells = {};

const optimizations = {
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
    minZ: 0,
    maxZ: 0,
    minW: 0,
    maxW: 0,
};

const setOptimizations = (x, y, z, w) => {
    if (x < optimizations.minX) optimizations.minX = x;
    if (x > optimizations.maxX) optimizations.maxX = x;
    if (y < optimizations.minX) optimizations.minY = y;
    if (y > optimizations.maxY) optimizations.maxY = y;
    if (z < optimizations.minZ) optimizations.minZ = z;
    if (z > optimizations.maxZ) optimizations.maxZ = z;
    if (w < optimizations.minW) optimizations.minW = w;
    if (w > optimizations.maxW) optimizations.maxW = w;
};

const createCell = (state, x, y, z, w) => {
    cells[`x${x}y${y}z${z}w${w}`] = { currentState: INACTIVE, nextState: state };
    setOptimizations(x, y, z, w);
};

const parseInput = () => {
    input.split('\n').forEach((line, y) => {
        line.split('').forEach((cell, x) => {
            setCellState(cell === '#', x, y, 0, 0);
        });
    });
};

const advanceToNextState = () => {
    Object.values(cells).forEach((cell) => {
        if (cell.nextState === null) return;
        cell.currentState = cell.nextState;
        cell.nextState = null;
    });
};

const getCellState = (x, y, z, w) => {
    const cell = cells[`x${x}y${y}z${z}w${w}`];
    if (!cell) return INACTIVE;
    return cell.currentState;
};

const setCellState = (state, x, y, z, w) => {
    const cell = cells[`x${x}y${y}z${z}w${w}`];
    if (!cell && state === ACTIVE) {
        createCell(ACTIVE, x, y, z, w);
    } else if (cell) {
        cell.nextState = state;
    }
};

const getActiveNeighbours = (x, y, z, w) => {
    let active = 0;
    for (let iX = x - 1; iX <= x + 1; iX++) {
        for (let iY = y - 1; iY <= y + 1; iY++) {
            for (let iZ = z - 1; iZ <= z + 1; iZ++) {
                for (let iW = w - 1; iW <= w + 1; iW++) {
                    if (iX === x && iY === y && iZ === z && iW === w) continue;
                    if (getCellState(iX, iY, iZ, iW) === ACTIVE) {
                        active++;
                    }
                }
            }
        }
    }
    return active;
}

const runCycle = () => {
    for (let x = optimizations.minX - 1; x <= optimizations.maxX + 1; x++) {
        for (let y = optimizations.minY - 1; y <= optimizations.maxY + 1; y++) {
            for (let z = optimizations.minZ - 1; z <= optimizations.maxZ + 1; z++) {
                for (let w = optimizations.minW - 1; w <= optimizations.maxW + 1; w++) {
                    const cellState = getCellState(x, y, z, w);
                    const activeNeighbours = getActiveNeighbours(x, y, z, w);
                    if (cellState === ACTIVE) {
                        if (activeNeighbours < 2 || activeNeighbours > 3) {
                            setCellState(INACTIVE, x, y, z, w);
                        }
                    } else {
                        if (activeNeighbours === 3) {
                            setCellState(ACTIVE, x, y, z, w);
                        }
                    }
                }
            }
        }
    }
    advanceToNextState();
};

parseInput();
advanceToNextState();

const boot = () => {
    for (let i = 6; i--;) {
        runCycle();
    }
};

boot();

console.log(Object.values(cells).filter(({ currentState }) => currentState === ACTIVE).length);
