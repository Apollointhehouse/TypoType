import { LetterState } from './enums';

export const letterStateColors: Record<LetterState, string> = {
    [LetterState.CORRECT]: 'text-stone-50',
    [LetterState.INCORRECT]: 'text-red-400',
    [LetterState.MISSING]: 'text-zinc-600',
    [LetterState.EXTRA]: 'text-red-700',
};