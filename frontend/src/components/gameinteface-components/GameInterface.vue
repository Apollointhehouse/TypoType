<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount} from 'vue';
import {processData} from '../../utils/DataProcessor';
import {DummyPrompt} from '../../enums/DummyPrompt';
import WordList from './WordList/WordList.vue';
import {WordModel} from '../../models/Word';
import {WordState} from '../../enums/enums';

const userInput = ref<string>("");
const prompt = {value: DummyPrompt};

// List to store completed words
const data = computed<WordModel[]>(() => {
  const promptList = prompt.value.split(" ");
  return processData(userInput.value.split(" "), promptList);
});

const progress = computed<{current: number, total: number}>(() => {
  const userInputList = userInput.value.split(" ");
  const promptList = prompt.value.split(" ");
  return {current: userInputList.length - 1, total: promptList.length};
});

// Function to handle input changes
let lastInput = " ";
function handleInput(event: KeyboardEvent) {
  const key = event.key;

  if (key === " " && lastInput === " ") {
    // prevent consecutive spaces
    return;
  } else if (key === 'Backspace') {
    userInput.value = userInput.value.slice(0, -1);
  } else if (/^[a-zA-Z0-9\s.,!?;:'"(){}[\]<>@#$%^&*-_=+|\\/~`€¢€]$/.test(key)) {
    // Add alphanumeric characters (letters and numbers) to the current word
    userInput.value += key;
    lastInput = key;
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
    <!-- <div>{{ userInput }}</div> -->
    <div>{{ progress.current }} / {{ progress.total }}</div>
    <WordList :value="data" :key="userInput.length"/>
  </div>
</template>

<style scoped>
/* Add styles for your component here */
</style>
