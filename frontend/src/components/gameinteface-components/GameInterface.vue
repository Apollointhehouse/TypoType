<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount} from 'vue';
import {processData} from '../../utils/DataProcessor';
import {DummyPromptList} from '../../enums/DummyPrompt';
import WordList from './WordList/WordList.vue';

const promptList = DummyPromptList;
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

  // Check if the key is a space, backspace, or alphanumeric character
  if (key === ' ') {
    // If there's any word in the list, update the last element with the current word
    if (currentWord.value.trim() !== '') { // If the list is empty, add the first word
      wordList.value.push('');
      currentWord.value = ''; // Reset the current word
    }
  } else if (key === 'Backspace') {
    // Delete the last character of the current word
    currentWord.value = currentWord.value.slice(0, -1);
    if (wordList.value.length > 0) {
      wordList.value[wordList.value.length - 1] = currentWord.value;
    } else {
      wordList.value.push(currentWord.value);
    }
  } else if (/^[a-zA-Z0-9]$/.test(key)) {
    // Add alphanumeric characters (letters and numbers) to the current word
    currentWord.value += key;
    if (wordList.value.length > 0) {
      wordList.value[wordList.value.length - 1] = currentWord.value;
    } else {
      wordList.value.push(currentWord.value);
    }
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
    <WordList :value="data" :key="currentWord.length"/>
    <!-- <div>Output: {{output}}</div> -->
  </div>
</template>

<style scoped>
/* Add styles for your component here */
</style>
