// src/models/Word.ts
import { WordState, LetterState } from "../enums/Enums";
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
}
