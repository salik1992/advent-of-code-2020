const input = require('./input');

const program = input.split('\n');

const ACC = 'acc';
const JMP = 'jmp';
const NOP = 'nop';

const getCpu = (cpuToFork = {}) => {
    const cpu = {
        pcStack: cpuToFork.pcStack ? [...cpuToFork.pcStack] : [],
        pc: cpuToFork.pc || 0,
        acc: cpuToFork.acc || 0,
        looped: false,
        finished: false,
        execute: (instruction, value) => {
            cpu.pcStack.push(cpu.pc);
            switch (instruction) {
                case ACC: cpu.xAcc(value); break;
                case JMP: cpu.xJmp(value); break;
                case NOP: cpu.xNop(); break;
            }
            if (cpu.pcStack.indexOf(cpu.pc) !== -1) cpu.looped = true;
            if (cpu.pc === program.length) cpu.finished = true;
        },
        xAcc: (value) => {
            cpu.acc += value;
            cpu.pc += 1;
        },
        xJmp: (value) => {
            cpu.pc += value;
        },
        xNop: () => {
            cpu.pc += 1;
        },
        reset: () => {
            cpu.pc = 0;
            cpu.acc = 0;
            cpu.finished = false;
            cpu.looped = false;
            cpu.pcStack = [];
        },
        isRunning: () => (
            !cpu.finished && !cpu.looped
        ),
    };
    return cpu;
};

const getInstructionAndValueForProgram = (programToRun) => (pc) => {
    const [instruction, stringValue] = programToRun[pc].split(' ');
    const value = parseInt(stringValue, 10);
    return [instruction, value];
};

const runProgram = (cpu, programToRun) => {
    const getInstructionAndValue = getInstructionAndValueForProgram(programToRun);
    while (cpu.isRunning()) {
        const [instruction, value] = getInstructionAndValue(cpu.pc);
        cpu.execute(instruction, value);
    }
};

// part 1

const runProgramTillLoop = () => {
    const cpu = getCpu();
    runProgram(cpu, program);
    console.log(`Before loop: { pc: ${cpu.pc}, acc: ${cpu.acc} }`);
};

runProgramTillLoop();

// part 2

/**
 * Nope, this gets to milions of forks quickly and they fall into loop too slowly
 */
const forkAtJmpAndNop = () => {
    const forks = [getCpu()];
    const getInstructionAndValue = getInstructionAndValueForProgram(program);
    let runningForks = forks;
    while (runningForks.length > 0) {
        runningForks.forEach((cpu) => {
            const [instruction, value] = getInstructionAndValue(cpu.pc);
            if (instruction === JMP || instruction === NOP) {
                const fork = getCpu(cpu);
                forks.push(fork);
                fork.execute(instruction === JMP ? NOP : JMP, value);
            }
            cpu.execute(instruction, value);
        });
        runningForks = forks.filter((cpu) => cpu.isRunning());
    }
    const cpu = forks.find(({ finished }) => finished);
    console.log(`At the end: { pc: ${cpu.pc}, acc: ${cpu.acc} }`);
};

const getModifiedProgram = (instructionToModify) => {
    const modifiedProgram = [...program];
    const instruction = modifiedProgram[instructionToModify];
    if (instruction) {
        if (instruction.indexOf(JMP) === 0) {
            modifiedProgram[instructionToModify] = (
                modifiedProgram[instructionToModify].replace(JMP, NOP)
            );
        } else if (instruction.indexOf(NOP) === 0) {
            modifiedProgram[instructionToModify] = (
                modifiedProgram[instructionToModify].replace(NOP, JMP)
            );
        }
    }
    return modifiedProgram;
};

const modifyProgramAndReRunUntilEnd = () => {
    let modifiedInstruction = -1;
    const cpu = getCpu();
    while (!cpu.finished && modifiedInstruction < program.length) {
        cpu.reset();
        const programToRun = getModifiedProgram(modifiedInstruction++);
        runProgram(cpu, programToRun);
    }
    console.log(
        `At the end: { pc: ${cpu.pc}, acc: ${cpu.acc} }`,
        `modified instruction: ${modifiedInstruction}`,
    );
};

modifyProgramAndReRunUntilEnd();
