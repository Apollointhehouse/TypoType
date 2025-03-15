<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount} from 'vue';
import {processData} from '../../utils/DataProcessor';
import WordList from './WordList/WordList.vue';
import {WordModel} from '../../models/Word';

const prompt = ref<string>('');

const getPrompt = async () =>{
    const response = await fetch('http://localhost:5000/api/prompts')
    prompt.value = await response.text()
}

interface Dic {
    [key: string]: string
}
const keys = ref<Dic>({});

const getKeys = async () =>{
    const response = await fetch('http://localhost:5000/api/keymaps')
    keys.value = await response.json()
}

// Reactive variable to store the current word being typed
const userInput = ref<string>("");

// List to store completed words
const data = computed<WordModel[]>(() => {
  // const promptWords = await getPrompt()
  const promptList = prompt.value.split(" ");
  return processData(userInput.value.split(" "), promptList);
});

// Function to handle input changes
function handleInput(event: KeyboardEvent) {
  const key = event.key;

  if (key === 'Backspace') {
    userInput.value = userInput.value.slice(0, -1);
  } else if (/^[a-zA-Z0-9\s.,!?;:'"(){}[\]<>@#$%^&*-_=+|\\/~`€¢€]$/.test(key)) {
    // Add alphanumeric characters (letters and numbers) to the current word
    const is_upper = key !== key.toLowerCase()
    if (key.toLowerCase() in keys.value){
      userInput.value += is_upper ? keys.value[key.toLowerCase()].toUpperCase() : keys.value[key.toLowerCase()];
    } else {
      userInput.value += key;
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleInput);
  getPrompt();
  getKeys();
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleInput);
});
</script>

<template>
  <div>
    <!-- Display the current word and completed words -->
    <!-- <div>{{ userInput }}</div> -->
    <WordList :value="data" :key="userInput.length"/>
  </div>
</template>

<style scoped>
/* Add styles for your component here */
</style>
