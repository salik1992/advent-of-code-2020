module.exports = (input) => {
    const passportStrings = [];
    input.split('\n').forEach((line) => {
        if (line === '') passportStrings.push('');
        else passportStrings[passportStrings.length - 1] += ` ${line}`;
    });
    return passportStrings.filter(line => line.length > 0).map((rawString) => {
        const passportString = rawString.trim();
        const keyValuePairs = passportString.split(' ');
        const passport = {
            passportString,
        };
        keyValuePairs.forEach((keyValue) => {
            const [key, value] = keyValue.split(':');
            passport[key] = value;
        });
        return passport;
    });
};