import { LetterState, WordState } from "../enums/enums";
import { LetterModel } from "../models/Letter";
import { WordModel } from "../models/Word";
import { WordListModel } from "../models/WordList";

function* createSimpleGenerator(values: any[] | string): Generator<any> {
    for (let value of values) {
        yield value;
    }
}

export const processData = (inputList: string[], promptList: string[]): WordListModel => {
    const data = new WordListModel([]);

    const inputIterable = createSimpleGenerator(inputList);
    const promptIterable = createSimpleGenerator(promptList);

    let promptPointer = promptIterable.next();

    for (const input of inputIterable) {
        if (promptPointer.done) {
            data.addWord(processWord(input, ""));
        } else {
            data.addWord(processWord(input, promptPointer.value));
            promptPointer = promptIterable.next();
        }
    }

    while (!promptPointer.done) {
        data.addWord(processWord("", promptPointer.value));
        promptPointer = promptIterable.next();
    }

    // check if past words are valid
    data.validateWords(inputList.length - 1);

    return data;
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