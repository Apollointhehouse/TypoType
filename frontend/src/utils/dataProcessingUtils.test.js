import { describe, it, expect } from 'vitest';
import { processWord, processData } from './dataProcessingUtils';
import { LetterState } from '@/constants/enums';

describe('processWord', () => {
  it('should mark all letters as CORRECT when input equals prompt', () => {
    const wordModel = processWord('test', 'test');
    const letters = wordModel.letters;
    expect(letters).toHaveLength(4);
    letters.forEach(letter => {
      expect(letter.state).toBe(LetterState.CORRECT);
    });
  });

  it('should mark differing letters as INCORRECT', () => {
    const wordModel = processWord('abcd', 'abef');
    const letters = wordModel.letters;
    expect(letters).toHaveLength(4);
    expect(letters[0]).toMatchObject({ value: 'a', state: LetterState.CORRECT });
    expect(letters[1]).toMatchObject({ value: 'b', state: LetterState.CORRECT });
    expect(letters[2]).toMatchObject({ value: 'c', state: LetterState.INCORRECT });
    expect(letters[3]).toMatchObject({ value: 'd', state: LetterState.INCORRECT });
  });

  it('should mark extra letters as EXTRA when input is longer than prompt', () => {
    const wordModel = processWord('abcde', 'abc');
    const letters = wordModel.letters;
    expect(letters).toHaveLength(5);
    // First three letters should be correct.
    expect(letters[0]).toMatchObject({ value: 'a', state: LetterState.CORRECT });
    expect(letters[1]).toMatchObject({ value: 'b', state: LetterState.CORRECT });
    expect(letters[2]).toMatchObject({ value: 'c', state: LetterState.CORRECT });
    // The remaining letters should be marked as EXTRA.
    expect(letters[3]).toMatchObject({ value: 'd', state: LetterState.EXTRA });
    expect(letters[4]).toMatchObject({ value: 'e', state: LetterState.EXTRA });
  });

  it('should mark missing letters as MISSING when prompt is longer than input', () => {
    const wordModel = processWord('abc', 'abcdef');
    const letters = wordModel.letters;
    expect(letters).toHaveLength(6);
    // First three letters should be correct.
    expect(letters[0]).toMatchObject({ value: 'a', state: LetterState.CORRECT });
    expect(letters[1]).toMatchObject({ value: 'b', state: LetterState.CORRECT });
    expect(letters[2]).toMatchObject({ value: 'c', state: LetterState.CORRECT });
    // The remaining letters should be marked as MISSING.
    expect(letters[3]).toMatchObject({ value: 'd', state: LetterState.MISSING });
    expect(letters[4]).toMatchObject({ value: 'e', state: LetterState.MISSING });
    expect(letters[5]).toMatchObject({ value: 'f', state: LetterState.MISSING });
  });

  it('should mark all letters as EXTRA when prompt is empty', () => {
    const wordModel = processWord('hello', '');
    const letters = wordModel.letters;
    expect(letters).toHaveLength(5);
    letters.forEach(letter => {
      expect(letter.state).toBe(LetterState.EXTRA);
    });
  });

  it('should mark all letters as MISSING when input is empty', () => {
    const wordModel = processWord('', 'hello');
    const letters = wordModel.letters;
    expect(letters).toHaveLength(5);
    letters.forEach(letter => {
      expect(letter.state).toBe(LetterState.MISSING);
    });
  });
});

describe('processData', () => {
  it('should process multiple word pairs correctly', () => {
    const inputs = ['hello', 'world'];
    const prompts = ['hello', 'wurld'];
    const wordList = processData(inputs, prompts);

    // Assuming wordList.words is the array containing WordModel objects.
    expect(wordList.words).toHaveLength(2);

    // First word: "hello" vs "hello" should be all CORRECT.
    const word1Letters = wordList.words[0].letters;
    word1Letters.forEach(letter => {
      expect(letter.state).toBe(LetterState.CORRECT);
    });

    // Second word: "world" vs "wurld"
    const word2Letters = wordList.words[1].letters;
    expect(word2Letters).toHaveLength(5);
    expect(word2Letters[0]).toMatchObject({ value: 'w', state: LetterState.CORRECT });
    expect(word2Letters[1]).toMatchObject({ value: 'o', state: LetterState.INCORRECT });
    expect(word2Letters[2]).toMatchObject({ value: 'r', state: LetterState.CORRECT });
    expect(word2Letters[3]).toMatchObject({ value: 'l', state: LetterState.CORRECT });
    expect(word2Letters[4]).toMatchObject({ value: 'd', state: LetterState.CORRECT });
  });

  it('should handle cases where inputList is longer than promptList', () => {
    const inputs = ['hello', 'world', 'test'];
    const prompts = ['hello', 'world'];
    const wordList = processData(inputs, prompts);

    // Expect three words since the while-loop iterates until both iterators are done.
    expect(wordList.words).toHaveLength(3);

    // The third word ("test" vs empty prompt) should have all letters marked as EXTRA.
    const thirdWordLetters = wordList.words[2].letters;
    thirdWordLetters.forEach(letter => {
      expect(letter.state).toBe(LetterState.EXTRA);
    });
  });

  it('should handle cases where promptList is longer than inputList', () => {
    const inputs = ['hello', 'world'];
    const prompts = ['hello', 'world', 'extra'];
    const wordList = processData(inputs, prompts);

    // Expect three words since the while-loop iterates until both iterators are done.
    expect(wordList.words).toHaveLength(3);

    // The third word (empty input vs "extra") should have all letters marked as MISSING.
    const thirdWordLetters = wordList.words[2].letters;
    thirdWordLetters.forEach(letter => {
      expect(letter.state).toBe(LetterState.MISSING);
    });
  });
});
