const input = require('./input');
const getSum = require('../utils/getSum');

const expressions = input.split('\n');

const NUMBER = 0;
const ADDITION = 1;
const MULTIPLICATION = 2;
const START_BRACKET = 3;
const END_BRACKET = 4;

const handleNumber = (operator, a, b) => {
    switch (operator) {
        case ADDITION: return a + b;
        case MULTIPLICATION: return a * b;
        case null: return b;
    }
};

const symbolsToString = (symbols) => {
    return symbols.map(({ type, value }) => {
        switch (type) {
            case ADDITION: return ' + ';
            case MULTIPLICATION: return ' * ';
            case START_BRACKET: return '(';
            case END_BRACKET: return ')';
            default: return value.toString();
        }
    }).join('');
}

const evaluateSymbols = (symbols) => {
    let operator = null;
    let result = null;
    for (let i = 0; i < symbols.length; i++) {
        const { type, value } = symbols[i];
        if (type === NUMBER) {
            result = handleNumber(operator, result, value);
            operator = null;
        } else if (type === ADDITION || type === MULTIPLICATION) {
            operator = type;
        } else if (type === START_BRACKET) {
            let additionalBracketStarts = 0;
            const subSymbols = [];
            i++;
            while (i < symbols.length) {
                if (symbols[i].type === END_BRACKET) {
                    if (additionalBracketStarts === 0) break;
                    additionalBracketStarts--;
                }
                if (symbols[i].type === START_BRACKET) additionalBracketStarts++;
                subSymbols.push(symbols[i]);
                i++;
            }
            result = handleNumber(operator, result, evaluateSymbols(subSymbols));
            operator = null;
        } else {
            throw new Error('Syntax error', symbols);
        }
    }
    return result;
};

const advancedMath = (symbols) => {
    for (let i = 0; i < symbols.length; i++) {
        const { type } = symbols[i];
        if (type === ADDITION) {
            if (symbols[i - 1].type === NUMBER) {
                symbols.splice(i - 1, 0, { type: START_BRACKET });
            } else if (symbols[i - 1].type === END_BRACKET) {
                let j = -2;
                let additionalBracketStarts = 0;
                while (i + j >= 0) {
                    if (symbols[i + j].type === START_BRACKET) {
                        if (additionalBracketStarts === 0) {
                            symbols.splice(i + j, 0, { type: START_BRACKET });
                            if (j < -2) i++;
                            break;
                        }
                        additionalBracketStarts--;
                    } else if (symbols[i + j].type === END_BRACKET) {
                        additionalBracketStarts++;
                    }
                    j--;
                }
            }
            i += 1;
            if (symbols[i + 1] && symbols[i + 1].type === NUMBER) {
                symbols.splice(i + 2, 0, { type: END_BRACKET });
                i += 2;
            } else if (symbols[i + 1] && symbols[i + 1].type === START_BRACKET) {
                let j = -2;
                let additionalBracketStarts = 0;
                while (i + j < symbols.length) {
                    if (symbols[i + j].type === END_BRACKET) {
                        if (additionalBracketStarts === 0) {
                            break;
                        }
                        additionalBracketStarts--;
                    } else if (symbols[i + j].type === START_BRACKET) {
                        additionalBracketStarts++;
                    }
                    j++;
                }
                symbols.splice(i + j, 0, { type: END_BRACKET });
            }
        }
    }
    return symbols;
};

const evaluateExpression = (expression) => {
    const symbols = expression.replace(/\s/g, '').split('').map((symbol) => {
        switch (symbol) {
            case '+': return { type: ADDITION };
            case '*': return { type: MULTIPLICATION };
            case '(': return { type: START_BRACKET };
            case ')': return { type: END_BRACKET };
            default: return { type: NUMBER, value: parseInt(symbol, 10) };
        }
    });
    return evaluateSymbols(advancedMath(symbols));
};

const results = expressions.map(evaluateExpression);

console.log(getSum(results));
