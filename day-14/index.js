const input = require('./input');
const getSum = require('../utils/getSum');

const instructions = input.split('\n');

// const encoderVersion = 'V1';
const encoderVersion = 'V2';

const valueEncoder = (value, mask) => {
    let binaryValue = parseInt(value, 10).toString(2);
    while (binaryValue.length < mask.length) binaryValue = `0${binaryValue}`;
    const maskedValue = mask.split('').map((maskBit, index) => {
        const valueBit = binaryValue[index];
        switch (maskBit) {
            case '0': return '0';
            case '1': return '1';
            default: return valueBit;
        }
    }).join('');
    return parseInt(maskedValue, 2);
};

const writeToAddresses = (bit, index, addresses, xCounter) => {
    if (bit !== 'X') {
        addresses.forEach((address) => {
            address[index] = bit;
        });
    } else {
        const xDivider = Math.pow(2, xCounter);
        const halfOfXDivider = xDivider / 2;
        addresses.forEach((address, addressIndex) => {
            address[index] = addressIndex % xDivider < halfOfXDivider ? '0' : '1';
        });
    }
};

const addressDecoder = (address, mask) => {
    const addresses = [];
    let binaryAddress = parseInt(address, 10).toString(2);
    while (binaryAddress.length < mask.length) binaryAddress = `0${binaryAddress}`;
    const addressesLength = Math.pow(2, mask.replace(/0|1/g, '').length);
    for (let i = 0; i < addressesLength; i++) addresses.push([]);
    let xCounter = 0;
    mask.split('').forEach((maskBit, index) => {
        switch (maskBit) {
            case '0':
                writeToAddresses(binaryAddress[index], index, addresses);
                break;
            case '1':
                writeToAddresses('1', index, addresses);
                break;
            case 'X':
                xCounter += 1;
                writeToAddresses('X', index, addresses, xCounter);
                break;
        }
    });
    return addresses.map((address) => address.join(''));
};

const memory = {
    mask: '',
    values: {},
    write: (address, value) => memory[`write${encoderVersion}`](address, value),
    writeV1: (address, value) => {
        memory.values[address] = valueEncoder(value, memory.mask);
    },
    writeV2: (address, value) => {
        addressDecoder(address, memory.mask).forEach((memAddress) => {
            memory.values[memAddress] = parseInt(value, 10);
        });
    },
};

const runInstruction = (instruction) => {
    const [assignee, value] = instruction.split(' = ');
    if (assignee === 'mask') {
        memory.mask = value;
    } else {
        const address = assignee.match(/mem\[(\d+)\]/)[1];
        memory.write(address, value);
    }
};

instructions.forEach(runInstruction);

console.log(getSum(Object.values(memory.values)));
