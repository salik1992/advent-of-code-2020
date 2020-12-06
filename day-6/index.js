const input = require('./input');
const getSum = require('../utils/getSum');

const getAZArray = () => {
    const array = [];
    let letterCode = 'a'.charCodeAt(0);
    while (letterCode <= 'z'.charCodeAt(0)) {
        array.push(String.fromCharCode(letterCode));
        letterCode++;
    }
    return array;
};

const parseInput = () => {
    const groupAnswers = input.split('\n\n');
    return groupAnswers.map((groupAnswer) => {
        const personAnswers = groupAnswer.split('\n');
        const anyoneYesAnswers = [];
        let everyoneYesAnswers = getAZArray();
        personAnswers.forEach((personAnswer) => {
            const answers = personAnswer.split('');
            answers.forEach((answer) => {
                if (anyoneYesAnswers.indexOf(answer) === -1) {
                    anyoneYesAnswers.push(answer);
                }
            });
            everyoneYesAnswers = everyoneYesAnswers.filter(
                (answer) => answers.indexOf(answer) !== -1
            );
        });
        return {
            personAnswers,
            anyoneYesAnswers,
            everyoneYesAnswers,
        };
    });
};

const groups = parseInput();

// part 1

console.log(getSum(groups.map(({ anyoneYesAnswers }) => anyoneYesAnswers.length)));

// part 2

console.log(getSum(groups.map(({ everyoneYesAnswers }) => everyoneYesAnswers.length)));
