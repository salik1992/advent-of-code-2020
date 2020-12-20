const input = require('./input');
// const input = require('./testInput');
const getProduct = require('../utils/getProduct');

const borderToId = {};

const reverse = string => string.split('').reverse().join('');

const tiles = {};

input.split('\n\n').forEach((tileString) => {
    const [header, ...data] = tileString.split('\n');
    const id = parseInt(header.match(/Tile (\d+):/)[1], 10);
    const borders = [
        data[0], // top
        data[data.length - 1], // bottom
        data.map((line) => line[0]).join(''), // left
        data.map((line) => line[line.length - 1]).join(''), // right
    ];
    borders.forEach((border) => {
        if (borderToId[border]) {
            borderToId[border].push(id);
        } else if (borderToId[reverse(border)]) {
            borderToId[reverse(border)].push(id);
        } else {
            borderToId[border] = [id];
        }
    });
    tiles[id] = {
        id,
        data,
        borders,
    };
});

const findCorners = () => Object.values(tiles).filter(({ borders }) => (
    Object.values(borders).filter(
        (border) => borderToId[border] && borderToId[border].length === 1
    ).length === 2
));

// part 1

const corners = findCorners();

console.log(getProduct(corners.map(({ id }) => id)));

// part 2

const topLeftCorner = corners.find(({ borders }) => (
    borderToId[borders[0]].length === 1 && borderToId[borders[2]].length === 1
));

const size = Math.sqrt(Object.keys(tiles).length);
const tileSize = topLeftCorner.data.length;

const getRightBorder = ({ rotation, flipped }, { borders }) => {
    if (!flipped) {
        switch (rotation) {
            case 0: return borders[3];
            case 90: return borders[0];
            case 180: return reverse(borders[2]);
            case 270: return reverse(borders[1]);
        }
    }
    switch (rotation) {
        case 0: return borders[2];
        case 90: return reverse(borders[0]);
        case 180: return reverse(borders[3]);
        case 270: return borders[1];
    }
};

const getBottomBorder = ({ rotation, flipped }, { borders }) => {
    if (!flipped) {
        switch (rotation) {
            case 0: return borders[1];
            case 90: return reverse(borders[3]);
            case 180: return reverse(borders[0]);
            case 270: return borders[2];
        }
    }
    switch (rotation) {
        case 0: return reverse(borders[1]);
        case 90: return reverse(borders[2]);
        case 180: return borders[0];
        case 270: return borders[3];
    }
};

const getRotationAndFlipByLeftBorder = (border, { borders }) => {
    switch (border) {
        case reverse(borders[0]): return { rotation: 270, flipped: false };
        case borders[1]: return { rotation: 90, flipped: false };
        case borders[2]: return { rotation: 0, flipped: false };
        case reverse(borders[3]): return { rotation: 180, flipped: false };
        case borders[0]: return { rotation: 270, flipped: true };
        case reverse(borders[1]): return { rotation: 90, flipped: true };
        case reverse(borders[2]): return { rotation: 180, flipped: true };
        case borders[3]: return { rotation: 0, flipped: true };
    }
};

const getRotationAndFlipByTopBorder = (border, { borders }) => {
    switch (border) {
        case borders[0]: return { rotation: 0, flipped: false };
        case reverse(borders[1]): return { rotation: 180, flipped: false };
        case reverse(borders[2]): return { rotation: 90, flipped: false };
        case borders[3]: return { rotation: 270, flipped: false };
        case reverse(borders[0]): return { rotation: 0, flipped: true };
        case borders[1]: return { rotation: 180, flipped: true };
        case borders[2]: return { rotation: 270, flipped: true };
        case reverse(borders[3]): return { rotation: 90, flipped: true };
    }
};

const getTileMatrix = () => {
    const lines = [[{ id: topLeftCorner.id, rotation: 0, flipped: false }]];
    // first line
    for (let column = 1; column < size; column++) {
        const tileToLeft = lines[0][column - 1]
        const matchingBorder = getRightBorder(tileToLeft, tiles[tileToLeft.id]);
        const matchingTileId = (borderToId[matchingBorder] || borderToId[reverse(matchingBorder)])
            .find((id) => id !== tileToLeft.id);
        lines[0].push({
            id: matchingTileId,
            ...getRotationAndFlipByLeftBorder(matchingBorder, tiles[matchingTileId]),
        });
    }
    // other lines
    for (let line = 1; line < size; line++) {
        lines[line] = [];
        for (let column = 0; column < size; column++) {
            const tileOnTop = lines[line - 1][column];
            const matchingBorder = getBottomBorder(tileOnTop, tiles[tileOnTop.id]);
            const matchingTileId = (borderToId[matchingBorder] || borderToId[reverse(matchingBorder)])
                .find((id) => id !== tileOnTop.id);
            lines[line].push({
                id: matchingTileId,
                ...getRotationAndFlipByTopBorder(matchingBorder, tiles[matchingTileId]),
            });
        }
    }
    return lines;
};

const getFlippedAndRotatedTileDataLine = (line, { id, rotation, flipped }) => {
    const { data } = tiles[id];
    if (!flipped) {
        switch (rotation) {
            case 0: return data[line];
            case 90: return reverse(data.map((l) => l[line]).join(''));
            case 180: return reverse(data[data.length - 1 - line]);
            case 270: return data.map((l) => l[l.length - 1 - line]).join('');
        }
    }
    switch (rotation) {
        case 0: return reverse(data[line]);
        case 90: return reverse(data.map((l) => l[l.length - 1 - line]).join(''));
        case 180: return data[data.length - 1 - line];
        case 270: return data.map((l) => l[line]).join('');
    }
};

const generateImage = (tilesMatrix) => (
    tilesMatrix.map((tileLine) => {
        const pixelLines = [];
        for (let i = 1; i < tileSize - 1; i++) {
            pixelLines.push(tileLine.map(
                (tile) => getFlippedAndRotatedTileDataLine(i, tile).substr(1, tileSize - 2)
            ).join(''));
        }
        return pixelLines.join('\n');
    }).join('\n')
);

const originalImage = generateImage(getTileMatrix());

const rotateImageRight = (image) => {
    const lines = image.split('\n');
    const newImage = [];
    for (let newLineIndex = 0; newLineIndex < lines.length; newLineIndex++) {
        newImage.push(lines.map((l) => l[l.length - 1 - newLineIndex]).join(''));
    }
    return newImage.join('\n');
};

const flipImage = (image) => {
    return image.split('\n').map(reverse).join('\n');
};

const replaceTextAtIndex = (string, replacement, replaceAt) => (
    string.split('').map((c, i) => {
        if (i < replaceAt) return c;
        if (i >= replaceAt + replacement.length) return c;
        return replacement[i - replaceAt] === '.' ? c : replacement[i - replaceAt]
    }).join('')
);

const findAndMarkMonsters = (image) => {
    const MATCH_2 = /[#O]....[#O][#O]....[#O][#O]....[#O][#O][#O]/g;
    const MATCH_3 = /.[#O]..[#O]..[#O]..[#O]..[#O]..[#O].../g;
    const REPLACE_1 = '..................O.';
    const REPLACE_2 = 'O....OO....OO....OOO';
    const REPLACE_3 = '.O..O..O..O..O..O...';
    const lines = image.split('\n');
    lines.forEach((line, lineIndex) => {
        if (lineIndex < 2) return;
        const indexes2 = [...lines[lineIndex - 1].matchAll(MATCH_2)].map(({ index }) => index);
        if (indexes2.length) {
            const indexes3 = [...line.matchAll(MATCH_3)].map(({ index }) => index)
                .filter(i => indexes2.indexOf(i) !== -1);
            indexes3.forEach((replaceAt) => {
                if (lines[lineIndex - 2][replaceAt + 18] !== '#') return;
                lines[lineIndex - 2] = replaceTextAtIndex(lines[lineIndex - 2], REPLACE_1, replaceAt);
                lines[lineIndex - 1] = replaceTextAtIndex(lines[lineIndex - 1], REPLACE_2, replaceAt);
                lines[lineIndex] = replaceTextAtIndex(lines[lineIndex], REPLACE_3, replaceAt);
            });
        }
    });
    return lines.join('\n');
};

let currentImage = originalImage;
currentImage = findAndMarkMonsters(currentImage);
currentImage = rotateImageRight(currentImage);
currentImage = findAndMarkMonsters(currentImage);
currentImage = rotateImageRight(currentImage);
currentImage = findAndMarkMonsters(currentImage);
currentImage = rotateImageRight(currentImage);
currentImage = findAndMarkMonsters(currentImage);

currentImage = flipImage(currentImage);

currentImage = findAndMarkMonsters(currentImage);
currentImage = rotateImageRight(currentImage);
currentImage = findAndMarkMonsters(currentImage);
currentImage = rotateImageRight(currentImage);
currentImage = findAndMarkMonsters(currentImage);
currentImage = rotateImageRight(currentImage);
currentImage = findAndMarkMonsters(currentImage);

console.log(currentImage);

console.log(currentImage.replace(/\.|O|\n/gm, '').length);
