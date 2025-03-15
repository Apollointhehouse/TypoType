import { ref, computed } from 'vue';
import { processData } from '@/utils/dataProcessingUtils';
import { dummyPrompt } from '@/constants/dummyPrompt.ts';
import type { WordListModel } from '@/models/WordListModel';

interface Dictionary {
  [key: string]: string;
}

export function useGameData() {
  // State
  const prompt = ref<string>(dummyPrompt);
  const keys = ref<Dictionary>({});
  const userInput = ref<string>('');
  const lastInput = ref<string>(' ');

  // Fetch prompt and key mapping from backend
  async function fetchPrompt() {
    const response = await fetch('http://localhost:5000/api/prompts');
    const json = await response.json();
    prompt.value = json['text'];
  }

  async function fetchKeys() {
    const response = await fetch('http://localhost:5000/api/keymaps');
    keys.value = await response.json();
  }

  // Computed game data
  const data = computed<WordListModel>(() => {
    const promptList = prompt.value.split(' ');
    return processData(userInput.value.split(' '), promptList);
  });

  const progress = computed(() => {
    const userInputList = userInput.value.split(' ');
    const promptList = prompt.value.split(' ');
    return { current: userInputList.length - 1, total: promptList.length };
  });

  // Calculate score based on game data
  function computeScore() {
    const wordsCompleted = data.value.getWordsCompleted();
    const wordsAttempted = data.value.getWordsAttempted();
    const TIMER_TIME_LIMIT = 10;
    const wordsPerMinute = Math.floor((wordsCompleted / TIMER_TIME_LIMIT) * 60);
    const rawWordsPerMinute = Math.floor((wordsAttempted / TIMER_TIME_LIMIT) * 60);
    const accuracy = data.value.getAccuracy();
    const letterCounts = data.value.getLetterCounts();
    return { accuracy, wordsPerMinute, rawWordsPerMinute, letterCounts };
  }

  // Keyboard event handler
  function handleKeyDown(event: KeyboardEvent) {
    const { key } = event;
  
    // Prevent consecutive spaces.
    if (key === ' ' && lastInput.value === ' ') return;
  
    // Handle backspace.
    if (key === 'Backspace') {
      userInput.value = userInput.value.slice(0, -1);
      return;
    }
  
    // Allowed characters pattern.
    const allowedKeyPattern = /^[a-zA-Z0-9\s.,!?;:'"(){}[\]<>@#$%^&*\-_=+|\\/~`€¢€]$/;
    if (!allowedKeyPattern.test(key)) return;
  
    // Use key mapping if defined, preserving case.
    const lowerKey = key.toLowerCase();
    const mappedKey = keys.value[lowerKey];
    const inputChar = mappedKey
      ? key === lowerKey
        ? mappedKey
        : mappedKey.toUpperCase()
      : key;
  
    userInput.value += inputChar;
    lastInput.value = inputChar;
  }  

  return {
    prompt,
    keys,
    userInput,
    fetchPrompt,
    fetchKeys,
    data,
    progress,
    computeScore,
    handleKeyDown,
  };
}
