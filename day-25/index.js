const cardPK = 9717666;
const doorPK = 20089533;

const SUBJECT_NUMBER = 7;
const ENCRYPTIC_DIVIDER = 20201227;

const getLoopSizeFromPK = (publicKey) => {
    let currentPK = 1;
    let loopSize = 0;
    while (currentPK !== publicKey) {
        currentPK *= SUBJECT_NUMBER;
        currentPK %= ENCRYPTIC_DIVIDER;
        loopSize++;
    }
    return loopSize;
};

const getEncryptionKey = (loopSize, subjectNumber) => {
    let publicKey = 1;
    for (let i = loopSize; i--;) {
        publicKey *= subjectNumber;
        publicKey %= ENCRYPTIC_DIVIDER;
    }
    return publicKey;
};

const cardLS = getLoopSizeFromPK(cardPK);
const doorLS = getLoopSizeFromPK(doorPK);

const cardEK = getEncryptionKey(doorLS, cardPK);
const doorEK = getEncryptionKey(cardLS, doorPK);

console.log(cardEK);
console.log(doorEK);
