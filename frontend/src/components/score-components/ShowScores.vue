<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

interface Score {
  username: string;
  score: number;
}
const scores = ref<Score[]>([]);
const isLoading = ref(true);

const grabScores = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/scores");
    scores.value = response.data;
  } catch (error) {
    console.error("Failed to load scores:", error);
    alert("Failed to Load Scores");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  grabScores();
});
</script>

<template>
  <div class="leaderboard">
    <h1>Leaderboard</h1>
    <div v-if="isLoading">Loading scores...</div>
    <ul v-if="!isLoading && scores.length > 0">
      <li v-for="(score, index) in scores" :key="index">
        {{ score.username }}: {{ score.score }}
      </li>
    </ul>
    <p v-else-if="!isLoading">No scores available.</p>
  </div>
</template>

<style scoped>
.leaderboard {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h1 {
  font-size: 2rem;
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #f9f9f9;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

p {
  color: #888;
}
</style>
