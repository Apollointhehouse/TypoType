<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount} from 'vue';
import {processData} from '../../utils/DataProcessor';
import {DummyPromptList} from '../../enums/DummyPrompt';
import WordList from './WordList/WordList.vue';

const promptList = DummyPromptList;
// Reactive variable to store the current word being typed
const userInput = ref<string>("");

// List to store completed words
const wordList = ref<string[]>([]);
const data = computed(() => {
  return processData(userInput.value.split(" "), promptList);
});


// Function to handle input changes
function handleInput(event: KeyboardEvent) {
  const key = event.key;

  if (key === 'Backspace') {
    userInput.value = userInput.value.slice(0, -1);
  } else if (/^[a-zA-Z0-9\s.,!?;:'"(){}[\]<>@#$%^&*-_=+|\\/~`€¢€]$/.test(key)) {
    // Add alphanumeric characters (letters and numbers) to the current word
    userInput.value += key;
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
    <div>{{ userInput }}</div>
    <WordList :value="data" :key="userInput.length"/>
  </div>
</template>

<style scoped>
/* Add styles for your component here */
</style>
