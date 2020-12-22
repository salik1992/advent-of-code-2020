const { player1, player2 } = require('./input');
// Test input
// const player1 = [9,2,6,3,1];
// const player2 = [5,8,4,7,10];
// Cycleable test input
// const player1 = [43,19];
// const player2 = [2, 29, 14];

const getScore = (player) => (
    player.reduce((acc, card, index) => acc + card * (player.length - index), 0)
);

const copy = (cards) => cards.map(i => i);

const normalGame = (cards1, cards2) => {
    const playRound = () => {
        const player1Card = cards1.shift();
        const player2Card = cards2.shift();
        if (player1Card > player2Card) {
            cards1.push(player1Card);
            cards1.push(player2Card);
        } else {
            cards2.push(player2Card);
            cards2.push(player1Card);
        }
    };

    const isFinished = () => cards1.length === 0 || cards2.length === 0;

    while (!isFinished()) playRound();

    console.log(getScore(cards1) + getScore(cards2));
};

// normalGame([...player1], [...player2]);

const recursiveCache = {}

const recursiveGame = (cards1, cards2, isMainGame = false) => {
    const cacheFingerprint1 = `${cards1.join(',')}|${cards2.join(',')}`;
    const cacheFingerprint2 = `${cards2.join(',')}|${cards1.join(',')}`;
    if (recursiveCache[cacheFingerprint1]) return recursiveCache[cacheFingerprint1];
    if (recursiveCache[cacheFingerprint2]) {
        return recursiveCache[cacheFingerprint2] === 1 ? 2 : 1;
    }

    stack1 = [];
    stack2 = [];
    let cycled = false;

    const logScore = (winner) => console.log(getScore(winner === 1 ? cards1 : cards2));

    const playRound = () => {
        // Prevention of repeat
        fingerprint1 = cards1.join(',');
        fingerprint2 = cards2.join(',');
        const index1 = stack1.indexOf(fingerprint1);
        if (index1 !== -1 && index1 === stack2.indexOf(fingerprint2)) {
            cycled = true;
            return 1;
        }
        stack1.push(fingerprint1);
        stack2.push(fingerprint2);

        const card1 = cards1.shift();
        const card2 = cards2.shift();

        let roundWinner;
        if (card1 <= cards1.length && card2 <= cards2.length) {
            roundWinner = recursiveGame(cards1.slice(0, card1), cards2.slice(0, card2));
        } else if (card1 > card2) {
            roundWinner = 1;
        } else {
            roundWinner = 2;
        }

        if (roundWinner === 1) {
            cards1.push(card1);
            cards1.push(card2);
        } else {
            cards2.push(card2);
            cards2.push(card1);
        }
        return roundWinner;
    };

    const isFinished = () => cycled || cards1.length === 0  || cards2.length === 0;

    let lastRoundWinner;
    while (!isFinished()) lastRoundWinner = playRound();

    if (isMainGame) logScore(lastRoundWinner);

    recursiveCache[cacheFingerprint1] = lastRoundWinner;

    return lastRoundWinner;
};

recursiveGame([...player1], [...player2], true);
