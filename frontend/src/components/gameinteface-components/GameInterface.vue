<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount} from 'vue';
import {processData} from '../../utils/DataProcessor';
import {DummyPrompt} from '../../enums/DummyPrompt';
import WordList from './WordList/WordList.vue';
import {WordModel} from '../../models/Word';
import BootstrapIcons from "bootstrap-icons/bootstrap-icons.svg";

const TIME_LIMIT = 30;

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
  startTimer();
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleInput);
});
</script>

<template>
  <div class="flex flex-col justify-start gap-10 text-2xl">
    <!-- Display the current word and completed words -->
    <!-- <div>{{ userInput }}</div> -->
     <div class="flex flex-col gap-2">
       <div>{{ timeLeft }}</div>
       <div>{{ progress.current }} / {{ progress.total }}</div>
    </div>
    <div>
      <WordList :value="data" :key="userInput.length"/>
    </div>
    <span class="group flex justify-center">
      <svg @click="restart" width="30" height="30" fill="currentColor" class="cursor-pointer opacity-20 group-hover:opacity-80 transition-opacity duration-300">
        <use :href="`${BootstrapIcons}#arrow-clockwise`" />
      </svg>
    </span> 
  </div>
</template>

<style scoped>
/* Add styles for your component here */
</style>
