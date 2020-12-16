const parseTicket = (ticket) => ticket.split(',').map((n) => parseInt(n, 10));

const numberBetween = (from, to) => (number) => from <= number && number <= to;

const numberWithinTwoIntervals = ([aFrom, aTo], [bFrom, bTo]) => (number) => {
    const isInIntervalA = numberBetween(aFrom, aTo);
    const isInIntervalB = numberBetween(bFrom, bTo);
    return isInIntervalA(number) || isInIntervalB(number);
};

module.exports = {
    parseTicket, numberWithinTwoIntervals,
};
