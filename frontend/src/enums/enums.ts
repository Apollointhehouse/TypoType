// Define an enum for the state field
export enum WordState {
    IN_PROGRESS = 'in_progress',
    CORRECT = 'correct',
    INCORRECT = 'incorrect',
}

export enum LetterState {
    CORRECT = 'correct',
    INCORRECT = 'incorrect',
    MISSING = 'missing',
    EXTRA = 'extra',
}