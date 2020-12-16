const { parseTicket, numberWithinTwoIntervals } = require('./rules');
module.exports = {
    rules: [
        { name: 'class', rule: numberWithinTwoIntervals([0, 1], [4, 19]) },
        { name: 'row', rule: numberWithinTwoIntervals([0, 5], [8, 19]) },
        { name: 'seat', rule: numberWithinTwoIntervals([0, 13], [16, 19]) },
    ],
    myTicket: parseTicket('11,12,13'),
    tickets: (
`3,9,18
15,1,5
5,14,9`
    ).split('\n').map(parseTicket),
};