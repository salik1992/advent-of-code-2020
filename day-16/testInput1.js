const { parseTicket, numberWithinTwoIntervals } = require('./rules');
module.exports = {
    rules: [
        { name: 'class', rule: numberWithinTwoIntervals([1, 3], [5, 7]) },
        { name: 'row', rule: numberWithinTwoIntervals([6, 11], [33, 44]) },
        { name: 'seat', rule: numberWithinTwoIntervals([13, 40], [45, 50]) },
    ],
    myTicket: parseTicket(`7,1,14`),
    tickets: (
`7,3,47
40,4,50
55,2,20
38,6,12`
    ).split('\n').map(parseTicket),
};
