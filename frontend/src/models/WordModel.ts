// src/models/Word.ts
import { WordState, LetterState } from "@/constants/enums";
import { LetterModel } from "./LetterModel";

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

    validateState() {
        if (this.isCorrect()) {
            this.state = WordState.CORRECT;
        } else {
            this.state = WordState.INCORRECT;
        }
    }

    isCorrect() {
        return this.letters.every(letter => letter.state === LetterState.CORRECT);
    }

    addLetters(letters: string) {
        this.letters.push(...letters.split('').map(letter => new LetterModel(letter)));
    }

    getLength() {
        return this.letters.length;
    }

    getNumberOfCorrectLetters() {
        return this.letters.filter(letter => letter.state === LetterState.CORRECT).length;
    }
    
    getNumberOfIncorrectLetters() {
        return this.letters.filter(letter => letter.state === LetterState.INCORRECT).length;
    }

    getNumberOfExtraLetters() {
        return this.letters.filter(letter => letter.state === LetterState.EXTRA).length;
    }

    getNumberOfMissingLetters() {   
        return this.letters.filter(letter => letter.state === LetterState.MISSING).length;
    }
}
