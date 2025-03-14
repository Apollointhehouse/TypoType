// src/models/Word.ts
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
}
