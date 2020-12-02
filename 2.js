const input = require('./inputs/2');

const parseLine = (line) => {
    const [counts, letterWithCollon, password] = line.split(' ');
    const [min, max] = counts.split('-');
    const letter = letterWithCollon[0];
    return {
        password, letter, min, max,
    };
}

const parsedPasswords = input.split('\n').filter((line) => line.length > 0).map(parseLine);

const validityFilter1 = ({ password, letter, min, max }) => {
    const regex = new RegExp(`[^${letter}]`, 'g');
    const lettersCount = password.replace(regex, '').length;
    return min <= lettersCount && lettersCount <= max;
};

const validityFilter2 = ({ password, letter, min: pos1, max: pos2 }) => (
    (password[pos1 - 1] === letter && password[pos2 - 1] !== letter)
    ||
    (password[pos1 - 1] !== letter && password[pos2 - 1] === letter)
);

console.log(parsedPasswords.filter(validityFilter2).length);
