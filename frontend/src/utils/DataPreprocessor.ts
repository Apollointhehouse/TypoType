import { LetterState, WordState } from "../enums/Enums";
import { LetterModel } from "../models/Letter";
import { WordModel } from "../models/Word";

function* createSimpleGenerator(values: any[] | string): Generator<any> {
    for (let value of values) {
        yield value;
    }
}

export const processData = (inputList: string[], promptList: string[]): WordModel[] => {
    const processedData: WordModel[] = [];

    const inputIterable = createSimpleGenerator(inputList);
    const promptIterable = createSimpleGenerator(promptList);

    let promptPointer = promptIterable.next();

    for (const input of inputIterable) {
        if (promptPointer.done) {
            processedData.push(processWord(input, ""));
        } else {
            processedData.push(processWord(input, promptPointer.value));
            promptPointer = promptIterable.next();
        }
    }

    while (!promptPointer.done) {
        processedData.push(processWord("", promptPointer.value));
        promptPointer = promptIterable.next();
    }

    return processedData;
}

export const processWord = (input: string, prompt: string): WordModel => {
    let categorizedLetters: LetterModel[] = [];
    const inputIterable = createSimpleGenerator(input);
    const promptIterable = createSimpleGenerator(prompt);

    let promptPointer = promptIterable.next();

    for (const inputChar of inputIterable) {
        let promptChar = promptPointer.value || "";

        if (inputChar === promptChar) {
            categorizedLetters.push(new LetterModel(inputChar, LetterState.CORRECT));
            promptPointer = promptIterable.next();
        } else if (promptPointer.done) {
            categorizedLetters.push(new LetterModel(inputChar, LetterState.EXTRA));
        } else {
            categorizedLetters.push(new LetterModel(inputChar, LetterState.INCORRECT));
            promptPointer = promptIterable.next();
        }

    }
        
    while (!promptPointer.done) {
        categorizedLetters.push(new LetterModel(promptPointer.value, LetterState.MISSING));
        promptPointer = promptIterable.next();
    }

    const word = new WordModel(categorizedLetters);
    
    return word;
}