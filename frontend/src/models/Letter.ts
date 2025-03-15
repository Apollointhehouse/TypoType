import { LetterState } from "../enums/enums";

<<<<<<< HEAD
export class Letter {
=======
export class LetterModel {
>>>>>>> jxav22-frontend
    value: string;
    state: LetterState;

    constructor(value: string, state: LetterState = LetterState.MISSING) {
        this.value = value;
        this.state = state;
    }

    // Method to change the state
    setState(newState: LetterState) {
        this.state = newState;
    }
}
