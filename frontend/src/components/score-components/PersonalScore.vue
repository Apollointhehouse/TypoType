<script setup lang="ts">
import { ref, onMounted } from "vue";

// Refs to hold the data
const score = ref<any>(null);

const userName = ref(localStorage.getItem("newUsername"));
const loading = ref(true); // Add a loading state

// Function to parse and set the score data
const parseScoreData = () => {
  const scoreData = localStorage.getItem("gameScore");
  if (scoreData) {
    try {
      score.value = JSON.parse(scoreData);
    } catch (error) {
      console.error("Failed to parse gameScore from localStorage:", error);
      // Fallback to default values if parsing fails
      score.value = {
        accuracy: 0,
        wordsPerMinute: 0,
        rawWordsPerMinute: 0,
        letterCounts: {
          correctLetters: 0,
          incorrectLetters: 0,
          extraLetters: 0,
          missingLetters: 0,
        },
      };
    }
  } else {
    // If no score data is found, initialize with default values
    score.value = {
      accuracy: 0,
      wordsPerMinute: 0,
      rawWordsPerMinute: 0,
      letterCounts: {
        correctLetters: 0,
        incorrectLetters: 0,
        extraLetters: 0,
        missingLetters: 0,
      },
    };
  }
  loading.value = false; // Data is ready
};

// Parse the score data when the component is mounted
onMounted(() => {
  parseScoreData();
});
</script>

<template>
  <div v-if="!loading">
    <h1>Hi {{ userName }}</h1>
    <div v-if="score">
      <p>Your Score:</p>
      <ul>
        <li>Accuracy: {{ score.accuracy }}%</li>
        <li>Words Per Minute: {{ score.wordsPerMinute }}</li>
        <li>Raw Words Per Minute: {{ score.rawWordsPerMinute }}</li>
        <li>Letter Counts:</li>
        <ul>
          <li>Correct Letters: {{ score.letterCounts.correctLetters }}</li>
          <li>Incorrect Letters: {{ score.letterCounts.incorrectLetters }}</li>
          <li>Extra Letters: {{ score.letterCounts.extraLetters }}</li>
          <li>Missing Letters: {{ score.letterCounts.missingLetters }}</li>
        </ul>
      </ul>
    </div>
    <p v-else>No score data available.</p>
  </div>
  <div v-else>Loading...</div>
</template>

<style></style>
