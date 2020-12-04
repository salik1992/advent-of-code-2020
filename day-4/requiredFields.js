const numberBetween = (min, max) => (value) => {
    const numericValue = parseInt(value, 10);
    return min <= numericValue && numericValue <= max;
};

const test = (regex) => (value) => regex.test(value);

const hairColor = /^#[0-9a-f]{6}$/;

const eyeColor = /^(amb|blu|brn|gry|grn|hzl|oth)$/;

const passportId = /^\d{9}$/;

module.exports = [
    { // (Birth Year)
        key: 'byr',
        validate: numberBetween(1920, 2002),
    },
    { // (Issue Year)
        key: 'iyr',
        validate: numberBetween(2010, 2020),
    },
    { // (Expiration Year)
        key: 'eyr',
        validate: numberBetween(2020, 2030),
    },
    { // (Height)
        key: 'hgt',
        validate: (value) => {
            if (value.indexOf('cm') !== -1) {
                return numberBetween(150, 193)(value.replace('cm', ''));
            } else if (value.indexOf('in') !== -1) {
                return numberBetween(59, 76)(value.replace('in', ''));
            }
        },
    },
    { // (Hair Color)
        key: 'hcl',
        validate: test(hairColor),
    },
    { // (Eye Color)
        key: 'ecl',
        validate: test(eyeColor),
    },
    { // (Passport ID)
        key: 'pid',
        validate: test(passportId),
    },
    // { // (Country ID) optional for our convenience
    //     key: 'cid',
    //     validate: true,
    // }, 
];
