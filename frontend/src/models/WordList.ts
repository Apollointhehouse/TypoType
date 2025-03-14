import { Word } from "./Word";

export class WordList {
    words: Word[];

    constructor(words: Word[]) {
        this.words = words
    }

    // Method to change the state
    setWords(words: Word[]) {
        this.words = words;
    }
}
