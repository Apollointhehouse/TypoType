<<<<<<< HEAD
import { Word } from "./Word";

export class WordList {
    words: Word[];

    constructor(words: Word[]) {
=======
import { WordModel } from "./Word";

export class WordList {
    words: WordModel[];

    constructor(words: WordModel[]) {
>>>>>>> jxav22-frontend
        this.words = words
    }

    // Method to change the state
<<<<<<< HEAD
    setWords(words: Word[]) {
=======
    setWords(words: WordModel[]) {
>>>>>>> jxav22-frontend
        this.words = words;
    }
}
