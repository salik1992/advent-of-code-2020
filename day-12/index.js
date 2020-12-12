const input = require('./input');

const movements = input.split('\n').map((line) => {
    const [movement, ...sValue] = line.split('');
    return {
        movement,
        value: parseInt(sValue.join(''), 10),
    };
});

// part 1

const position = {
    x: 0,
    y: 0,
    heading: 90,
};

const getManhattanDistance = ({ x, y }) => Math.abs(x) + Math.abs(y)

const headingToMovement = ({ heading }) => {
    switch (heading) {
        case 0: return 'N';
        case 90: return 'E';
        case 180: return 'S';
        case 270: return 'W';
    }
};

const move1 = ({ movement, value }) => {
    switch (movement) {
        case 'N': position.y -= value; break;
        case 'E': position.x += value; break;
        case 'S': position.y += value; break;
        case 'W': position.x -= value; break;
        case 'F': move1({ movement: headingToMovement(position), value }); break;
        case 'L': position.heading -= value; break;
        case 'R': position.heading += value; break;
    }
    while (position.heading < 0) position.heading += 360;
    while (position.heading >= 360) position.heading -= 360;
};

movements.forEach(move1);

console.log(getManhattanDistance(position));

// part 2

const shipPosition = {
    x: 0,
    y: 0,
};

const waypointPosition = {
    x: 10,
    y: -1,
};

const moveShip = (value) => {
    shipPosition.x += value * waypointPosition.x;
    shipPosition.y += value * waypointPosition.y;
};

const turnAround = () => {
    waypointPosition.x *= -1;
    waypointPosition.y *= -1;
}

const rotateLeft = (value) => {
    if (value === 90) {
        const temp = waypointPosition.x;
        waypointPosition.x = waypointPosition.y;
        waypointPosition.y = -temp;
    }
    else if (value === 180) turnAround();
    else if (value === 270) rotateRight(90);
};

const rotateRight = (value) => {
    if (value === 90) {
        const temp = waypointPosition.x;
        waypointPosition.x = -waypointPosition.y;
        waypointPosition.y = temp;
    }
    else if (value === 180) turnAround();
    else if (value === 270) rotateLeft(90);
};

const moveWaypoint = (movement, value) => {
    switch (movement) {
        case 'N': waypointPosition.y -= value; break;
        case 'E': waypointPosition.x += value; break;
        case 'S': waypointPosition.y += value; break;
        case 'W': waypointPosition.x -= value; break;
        case 'L': rotateLeft(value); break;
        case 'R': rotateRight(value); break;
    }
}

const move2 = ({ movement, value }) => {
    if (movement === 'F') moveShip(value);
    else moveWaypoint(movement, value);
};

movements.forEach(move2);

console.log(getManhattanDistance(shipPosition));
