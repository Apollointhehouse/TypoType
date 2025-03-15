import { WordState } from "@/constants/enums";
import { WordModel } from "./WordModel";

export class WordListModel {
    words: WordModel[];

    constructor(words: WordModel[]) {
        this.words = words
    }

    getWords() {
        return this.words;
    }

    // Method to change the state
    setWords(words: WordModel[]) {
        this.words = words;
    }

    addWord(word: WordModel) {
        this.words.push(word);
    }

    getWordsCompleted() {
        return this.words.filter(word => word.state === WordState.CORRECT).length;
    }

    getWordsAttempted() {
        return this.words.filter(word => word.state === WordState.CORRECT || word.state === WordState.INCORRECT).length;
    }

    getAccuracy() {
        let { correctLetters, incorrectLetters } = this.getLetterCounts();
        const completedLetters = correctLetters + incorrectLetters;

        return completedLetters > 0 ? (correctLetters / completedLetters) * 100 : 0;
    }

    getLetterCounts() {
        let correctLetters = 0;
        let incorrectLetters = 0;
        let extraLetters = 0;
        let missingLetters = 0;

        for (let word of this.words) {
            correctLetters += word.getNumberOfCorrectLetters();
            incorrectLetters += word.getNumberOfIncorrectLetters();
            extraLetters += word.getNumberOfExtraLetters();
            missingLetters += word.getNumberOfMissingLetters();
        }

        return { correctLetters, incorrectLetters, extraLetters, missingLetters };
    }

    // validate the first x words
    checkWordsCorrect(x: number) {
        for (let i = 0; i < x && i <= this.words.length; i++) {
            this.words[i].validateState();
        }
    }
}
