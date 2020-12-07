const input = require('./input');
const getSum = require('../utils/getSum');

const parseInput = () => {
    const lines = input.split('\n');
    return lines.map((line) => {
        const [container, contentRules] = line.split(' bags contain ');
        if (contentRules === 'no other bags.') return { container, contents: [] };
        const contents = contentRules.split(', ').map((contentRule) => {
            const quantity = parseInt(contentRule, 10);
            const [bagColor1, bagColor2] = contentRule.replace(`${quantity} `, '').split(' ');
            return {
                quantity, bagType: `${bagColor1} ${bagColor2}`,
            };
        });
        return {
            container,
            contents,
        };
    });
};

const rules = parseInput();

const isBagInRule = (bag, { contents }) => (
    contents.findIndex(({ bagType }) => bagType === bag) !== -1
);

const ruleByBag = (bag) => rules.find(({ container }) => container === bag);

const notInArray = (array) => (item) => array.indexOf(item) === -1

// part 1

const getDirectParents = (bag) => {
    const parents = [];
    rules.forEach((rule) => {
        if (isBagInRule(bag, rule)) {
            const { container } = rule;
            if (parents.indexOf(container) === -1) {
                parents.push(container);
            }
        }
    });
    return parents;
};

const getAllPossibleParents = (bag) => {
    let parents = getDirectParents(bag);
    let i = 0;
    while (i < parents.length) {
        const parentParents = getDirectParents(parents[i]);
        parents = [...parents, ...parentParents.filter(notInArray(parents))];
        i++;
    }
    return parents;
};

console.log(getAllPossibleParents('shiny gold').length);

// part 2

const getBagsInsideABag = (bag) => {
    const { contents } = ruleByBag(bag);
    return 1 + getSum(contents.map(
        ({ quantity, bagType }) => quantity * getBagsInsideABag(bagType)
    ));
};

// Extra point for a person who finds out why - 1 is needed :)
console.log(getBagsInsideABag('shiny gold') - 1);
