const input = require('./input');
const requiredFields = require('./requiredFields');
const parse = require('./parser');

const passports = parse(input);

// part 1
const checkRequiredFields = (passport) => (
    requiredFields.every(({ key }) => typeof passport[key] === 'string')
);

console.log(passports.filter(checkRequiredFields).length);

// part 2
const checkValidity = (passport) => (
    requiredFields.every(({ key, validate }) => (
        typeof passport[key] === 'string'
        &&
        validate(passport[key])
    ))
);

console.log(passports.filter(checkValidity).length);
