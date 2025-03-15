<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount} from 'vue';
import {processData} from '../../utils/DataProcessor';
import {DummyPrompt} from '../../enums/DummyPrompt';
import {WordModel} from '../../models/Word';
import WordList from './WordList/WordList.vue';
import BootstrapIcons from "bootstrap-icons/bootstrap-icons.svg";
import Footer from '../footer-components/Footer.vue';

const TIME_LIMIT = 60;

// Fetch the prompt from the backend
const prompt = ref<string>(DummyPrompt);

const getPrompt = async () =>{
    const response = await fetch('http://localhost:5000/api/prompts')
    const json = await response.json()
    prompt.value = json['text']
}

// Fetch the keymap from the backend
interface Dictionary {
    [key: string]: string
}
const keys = ref<Dictionary>({});

const getKeys = async () =>{
    const response = await fetch('http://localhost:5000/api/keymaps')
    keys.value = await response.json()
}

const userInput = ref<string>("");

// List to store completed words
const data = computed<WordModel[]>(() => {
  // const promptList = await getPrompt()
  const promptList = prompt.value.split(" ");
  return processData(userInput.value.split(" "), promptList);
});

const progress = computed<{current: number, total: number}>(() => {
  const userInputList = userInput.value.split(" ");
  const promptList = prompt.value.split(" ");
  return {current: userInputList.length - 1, total: promptList.length};
});

// Timer
const timeLeft = ref<number>(TIME_LIMIT);
const timerReference = ref<number>();

const startTimer = () => {
  timerReference.value = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      stopTimer(); // Stop the timer once it reaches 0
      window.alert("Time's up!");
    }
  }, 1000); // Update every second
};

const stopTimer = () => {
  clearInterval(timerReference.value);
};

const restart = () => {
  stopTimer();
  timeLeft.value = TIME_LIMIT;
  userInput.value = "";
  startTimer();
}

// Input Handler

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
    const is_upper = key !== key.toLowerCase()
    let input = " ";
    if (key.toLowerCase() in keys.value){
      input = is_upper ? keys.value[key.toLowerCase()].toUpperCase() : keys.value[key.toLowerCase()];
    } else {
      input = key;
    }
    userInput.value += input;
    lastInput = input;
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleInput);
  getPrompt();
  getKeys();
  startTimer();
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleInput);
});
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- Display the current word and completed words -->
    <!-- <div>{{ userInput }}</div> -->
     <h1>T Y P O T Y P E</h1>
     <div class="flex flex-col gap-2">
       <div>{{ timeLeft }}</div>
       <div>{{ progress.current }} / {{ progress.total }}</div>
    </div>
    <div>
      <WordList :value="data" :key="userInput.length"/>
    </div>
    <span class="group flex justify-center">
      <svg @click="restart" width="20" height="20" fill="currentColor" class="cursor-pointer opacity-20 group-hover:opacity-80 transition-opacity duration-300">
        <use :href="`${BootstrapIcons}#arrow-clockwise`" />
      </svg>
    </span> 
  </div>
  <Footer />
</template>

<style scoped>
/* Add styles for your component here */
</style>
