// src/models/Word.ts
<<<<<<< HEAD
import { WordState } from "../enums/enums";

// Define the Word class
export class Word {
    letter: string;
    state: WordState;

    constructor(letter: string, state: WordState = WordState.IN_PROGRESS) {
        this.letter = letter;
        this.state = state;
    }

    // Method to change the state
    setState(newState: WordState) {
        this.state = newState;
    }
=======
import { WordState, LetterState } from "../enums/enums";
import { LetterModel } from "./Letter";

// Define the Word class
export class WordModel {
    letters: LetterModel[];
    state: WordState;

    constructor(letters: LetterModel[] = [], state: WordState = WordState.IN_PROGRESS) {
        this.letters = letters;
        this.state = state;
    }

    setState(newState: WordState) {
        this.state = newState;
    }

    isCompleted() {
        return this.letters.every(letter => letter.state === LetterState.CORRECT);
    }

    addLetters(letters: string) {
        this.letters.push(...letters.split('').map(letter => new LetterModel(letter)));
    }
>>>>>>> jxav22-frontend
}
