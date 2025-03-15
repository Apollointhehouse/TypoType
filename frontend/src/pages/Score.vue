<script setup lang="ts">
import { ref } from "vue";
import PersonalScore from "@/components/score-components/PersonalScore.vue";
import ShowScores from "@/components/score-components/ShowScores.vue";
import SaveScoreBtn from "@/components/score-components/SaveScoreBtn.vue";
import SaveScoreModal from "@/components/score-components/SaveScoreModal.vue";

const showScoreModal = ref(false);

const openScoreModal = () => {
  console.log("attempting to save score");
  showScoreModal.value = true;
};


</script>

<template>
  <PersonalScore />
  <SaveScoreBtn @click="openScoreModal" />
  <br />
  <ShowScores />
  <SaveScoreModal v-model:model-value="showScoreModal" />
</template>

<style></style>
