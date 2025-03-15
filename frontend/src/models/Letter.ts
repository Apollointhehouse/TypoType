import { LetterState } from "../enums/Enums";

export class LetterModel {
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
