<script setup lang="ts">
import FlashingTitle from '@/components/gameinterface-components/animated-title-components/FlashingTitle.vue';
import CheatSphere from '@/components/gameinterface-components/cheat-sphere-components/CheatSphere.vue';
import Footer from '@/components/gameinterface-components/footer-components/Footer.vue';
import WordList from '@/components/gameinterface-components/wordlist-components/WordList.vue';
import { useGameData } from '@/utils/gameDataUtils';
import { useTimer } from '@/utils/timerUtils';
import BootstrapIcons from 'bootstrap-icons/bootstrap-icons.svg';
import { onBeforeUnmount, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { useSound } from '@/utils/soundUtils';

// Get game data and input handler from utils
const {
  keys,
  prompt,
  userInput,
  progress,
  computeScore,
  fetchPrompt,
  fetchKeys,
  setUpGameEventListeners,
  data,
} = useGameData();

const router = useRouter();
const { setUpSoundEventListeners } = useSound();

// Timer callback when time is up
function onTimeUp() {
  const { accuracy, wordsPerMinute, rawWordsPerMinute, letterCounts } = computeScore();
  window.alert(
    `Accuracy: ${accuracy}%\nWPM: ${wordsPerMinute}\nRAW WPM: ${rawWordsPerMinute}\nLetter counts: ${JSON.stringify(letterCounts)}`
  );
  router.push("/scores");
}

// Timer management from utils
const { timeLeft, startTimer, stopTimer, resetTimer } = useTimer(onTimeUp);

function restartGame() {
  fetchPrompt();
  stopTimer();
  userInput.value = "";
  resetTimer();
}

onMounted(() => {
  fetchPrompt();
  fetchKeys();
  startTimer();
});

setUpGameEventListeners();
setUpSoundEventListeners();

</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <!-- Header with fancy title -->
    <CheatSphere :keymap="keys" />
    <FlashingTitle value="T Y P O T Y P E" />
    <div class="flex flex-col gap-2">
      <div>{{ timeLeft }}</div>
      <div>{{ progress.current }} / {{ progress.total }}</div>
    </div>
    <!-- Word List Display -->
    <div>
      <WordList :value="data" :key="`${userInput.length},${prompt.length}`" />
    </div>
    <!-- Restart button -->
    <span class="group flex justify-center">
      <svg @click="restartGame" width="20" height="20" fill="currentColor"
        class="cursor-pointer opacity-20 group-hover:opacity-80 transition-opacity duration-300">
        <use :href="`${BootstrapIcons}#arrow-clockwise`" />
      </svg>
    </span>
  </div>
  <Footer />
</template>

<style scoped>
/* Component-specific styles */
</style>
