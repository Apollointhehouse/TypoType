import { WordModel } from "./Word";

export class WordList {
    words: WordModel[];

    constructor(words: WordModel[]) {
        this.words = words
    }

    // Method to change the state
    setWords(words: WordModel[]) {
        this.words = words;
    }
}
