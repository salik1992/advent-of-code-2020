const ticketNumbers = require('./input');

const isSmaller = (letter) => letter === 'F' || letter === 'L';

const numberFromCodeAndInterval = (code, min, max) => {
    const [firstLetter, ...rest] = code;
    if (rest.length === 0) {
        if (isSmaller(firstLetter)) return min;
        else return max;
    }
    if (isSmaller(firstLetter)) {
        return numberFromCodeAndInterval(rest, min, max - Math.round((max - min) / 2));
    }
    return numberFromCodeAndInterval(rest, min + Math.round((max - min) / 2), max);
};

const parseTicket = (ticketNumber) => {
    const rowCode = ticketNumber.substr(0, 7).split('');
    const columnCode = ticketNumber.substr(7, 3).split('');
    const row = numberFromCodeAndInterval(rowCode, 0, 127);
    const column = numberFromCodeAndInterval(columnCode, 0, 7);
    const id = row * 8 + column;
    return {
        row, column, id, ticketNumber,
    };
};

const tickets = ticketNumbers.map(parseTicket).sort(({ id: idA }, { id: idB }) => idA - idB);

// part 1
console.log(tickets[tickets.length - 1]);

// part 2
const findMissingIds = () => {
    let idCounter = 0;
    const missingIds = [];
    tickets.forEach(({ id }) => {
        while (idCounter < id) {
            missingIds.push(idCounter);
            idCounter++;
        }
        idCounter++;
    });
    return missingIds;
};

const findMyId = (missingIds) => missingIds[missingIds.length - 1];

console.log(findMyId(findMissingIds()));
