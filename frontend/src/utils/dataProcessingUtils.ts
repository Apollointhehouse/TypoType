import { LetterState } from "@/constants/enums";
import { LetterModel } from "@/models/LetterModel";
import { WordModel } from "@/models/WordModel";
import { WordListModel } from "@/models/WordListModel";

// Returns the value from an iterator result, or an empty string if done.
function getValueOrEmpty(result: IteratorResult<string>): string {
    return result.done ? "" : result.value;
}

export const identifyLineBreaks = (prompt: string): number[] => {
    const lineBreaks: number[] = [];
    let cumulativeWords = 0;
    let inWord = false;

    // Iterate over every character in the prompt.
    for (let char of prompt) {
        if (char === "\n") {
            // Record the current word count at each newline.
            lineBreaks.push(cumulativeWords);
            // Reset the in-word flag after a newline.
            inWord = false;
        } else if (char === " ") {
            // A space ends a word.
            inWord = false;
        } else {
            // When a non-space, non-newline character is encountered and we're not in a word,
            // it means we've started a new word.
            if (!inWord) {
                cumulativeWords++;
                inWord = true;
            }
        }
    }

    return lineBreaks;
};

export const processPrompt = (prompt: string): string[] => {
    return prompt.replace(/\n/g, ' ').split(/ +/);
};

// Processes the full data set by iterating over both input and prompt lists.
export const processData = (
    input: string,
    prompt: string
): WordListModel => {
    const inputList = input.split(" ");
    const promptList = processPrompt(prompt);
    const lineBreaks = identifyLineBreaks(prompt);

    const wordList = new WordListModel([], lineBreaks);

    processWordPair(
        inputList[Symbol.iterator](),
        promptList[Symbol.iterator](),
        wordList
    );

    wordList.checkWordsCorrect(inputList.length - 1);
    return wordList;
};

// Processes a pair of iterators to add word pairs to the WordListModel.
function processWordPair(
    inputIterator: Iterator<string>,
    promptIterator: Iterator<string>,
    wordList: WordListModel
): void {
    let inputResult = inputIterator.next();
    let promptResult = promptIterator.next();

    while (!inputResult.done || !promptResult.done) {
        const inputWord = getValueOrEmpty(inputResult);
        const promptWord = getValueOrEmpty(promptResult);

        wordList.addWord(processWord(inputWord, promptWord));

        if (!inputResult.done) inputResult = inputIterator.next();
        if (!promptResult.done) promptResult = promptIterator.next();
    }
}

// Processes a single word by comparing input and prompt characters.
export const processWord = (input: string, prompt: string): WordModel => {
    const data: LetterModel[] = [];
    const inputIterator = input[Symbol.iterator]();
    const promptIterator = prompt[Symbol.iterator]();
    const { inputResult, promptResult } = processMatching(
        inputIterator,
        promptIterator,
        data
    );

    processExtraLetters(inputResult, inputIterator, data);
    processMissingLetters(promptResult, promptIterator, data);

    return new WordModel(data);
};

// Processes matching characters from both input and prompt.
function processMatching(
    inputIterator: Iterator<string>,
    promptIterator: Iterator<string>,
    data: LetterModel[]
): { inputResult: IteratorResult<string>; promptResult: IteratorResult<string> } {
    let inputResult = inputIterator.next();
    let promptResult = promptIterator.next();

    while (!inputResult.done && !promptResult.done) {
        processSingleLetter(inputResult.value, promptResult.value, data);
        inputResult = inputIterator.next();
        promptResult = promptIterator.next();
    }

    return { inputResult, promptResult };
}

// Processes a single character pair and categorizes it.
function processSingleLetter(
    inputChar: string,
    promptChar: string,
    data: LetterModel[]
): void {
    const state =
        inputChar === promptChar ? LetterState.CORRECT : LetterState.INCORRECT;
    data.push(new LetterModel(inputChar, state));
}

// Processes any extra letters from the input.
function processExtraLetters(
    inputResult: IteratorResult<string>,
    inputIterator: Iterator<string>,
    data: LetterModel[]
): void {
    let result = inputResult;
    while (!result.done) {
        data.push(new LetterModel(result.value, LetterState.EXTRA));
        result = inputIterator.next();
    }
}

// Processes any missing letters from the prompt.
function processMissingLetters(
    promptResult: IteratorResult<string>,
    promptIterator: Iterator<string>,
    data: LetterModel[]
): void {
    let result = promptResult;
    while (!result.done) {
        data.push(new LetterModel(result.value, LetterState.MISSING));
        result = promptIterator.next();
    }
}
