const { rules, myTicket, tickets } = require('./input');
// const { rules, myTicket, tickets } = require('./testInput1');
// const { rules, myTicket, tickets } = require('./testInput2');
const getSum = require('../utils/getSum');
const getProduct = require('../utils/getProduct');

// part 1

const ticketScanningErrorRate = (ticket) => {
    return getSum(ticket.filter((number) => !rules.some(({ rule }) => rule(number))));
};

console.log(getSum(tickets.map(ticketScanningErrorRate)));

// part 2

const isValidTicket = (ticket) => ticket.every((number) => rules.some(({ rule }) => rule(number)));

const validTickets = tickets.filter(isValidTicket);

rules.forEach((rule) => {
    rule.possiblePositions = myTicket.map((_, index) => index);
});

// Removes invalid rules positions based on numbers in tickets
let inspectedTicket = 0;
while (
    getSum(rules.map(({ possiblePositions }) => possiblePositions.length)) > rules.length
    &&
    inspectedTicket < validTickets.length
) {
    validTickets[inspectedTicket].forEach((number, index) => {
        rules.filter(({ possiblePositions }) => possiblePositions.indexOf(index) !== -1).forEach(
            (rule) => {
                if (!rule.rule(number)) {
                    rule.possiblePositions.splice(rule.possiblePositions.indexOf(index), 1);
                }
            }
        );
    });
    inspectedTicket++;
}

// Removes invalid rules positions based on availability across other rules
// e.g.
// [0, 1, 2], [0, 2], [2]
// [1], [0], [2]
while (
    getSum(rules.map(({ possiblePositions }) => possiblePositions.length)) > rules.length
) {
    rules.filter(({ possiblePositions }) => possiblePositions.length === 1).forEach((rule) => {
        const [positionToRemove] = rule.possiblePositions;
        rules.filter((r) => r !== rule).forEach((r) => {
            const index = r.possiblePositions.indexOf(positionToRemove);
            if (index !== -1) r.possiblePositions.splice(index, 1);
        });
    });
}

console.log(
    getProduct(
        rules.filter(({ name }) => name.indexOf('departure') === 0).map(({ possiblePositions }) => (
            myTicket[possiblePositions[0]]
        )),
    ),
);
