
const input = require('./input');

const part2Input = input => input
    .replace(/^8: 42/m, '8: 42 | 42 8')
    .replace(/^11: 42 31/m, '11: 42 31 | 42 11 31');

const [inputRules, inputMessages] = part2Input(input).split('\n\n');

const rules = {};
inputRules.split('\n').forEach((ruleInput) => {
    const [ruleNumber, rule] = ruleInput.split(': ');
    rules[ruleNumber] = rule;
});

const messages = inputMessages.split('\n');

const MAX_DEPTH = 4;

const expandRule = (ruleNumber, level = 0, depth = 0) => {
    const options = rules[ruleNumber].split(' | ');
    const parsedOptions = options.map((option) => (
        option.split(' ').map((part) => {
            if (part.indexOf('"') === 0) return `(${part[1]})`;
            if (ruleNumber !== part) return expandRule(part, level + 1);
            if (depth < MAX_DEPTH) return expandRule(part, level + 1, depth + 1);
            return '';
        }).join('')
    ));
    const string = parsedOptions.length === 1
        ? parsedOptions[0]
        : `(${parsedOptions.join('|')})`;
    return level === 0
        ? new RegExp(`^${string}$`)
        : string;
};

const test = regexp => message => regexp.test(message);

console.log(messages.filter(test(expandRule(0))).length);
