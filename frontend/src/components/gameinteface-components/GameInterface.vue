<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount} from 'vue';
import {processData} from '../../utils/InputDataProcessor';
import WordList from './WordList/WordList.vue';

const promptList: string[] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.".split(" ");

// Reactive variable to store the current word being typed
const currentWord = ref('');

// List to store completed words
const wordList = ref<string[]>([]);
const data = computed(() => {
  const temp = processData(wordList.value, promptList);
  console.log(temp);
  return temp;
});


// Function to handle input changes
function handleInput(event: KeyboardEvent) {
  const key = event.key;

  if (key === ' ') {
    // Append the current word to the word list and clear the current word
    wordList.value.push(currentWord.value);
    currentWord.value = '';
  } else if (key === 'Backspace') {
    // Delete the last character of the current word
    currentWord.value = currentWord.value.slice(0, -1);
  } else {
    // Add the typed character to the current word
    currentWord.value += key;
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleInput);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleInput);
});
</script>

<template>
  <div>
    <!-- Display the current word and completed words -->
    <div>Current Word: {{ currentWord }}</div>
    <div>Word List: {{ wordList }}</div>
    <!-- <div>Output: {{ data }}</div> -->
    <WordList :value="data" />
    <!-- <div>Output: {{output}}</div> -->
  </div>
</template>

<style scoped>
/* Add styles for your component here */
</style>
