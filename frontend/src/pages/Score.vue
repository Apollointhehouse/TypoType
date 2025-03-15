<script setup lang="ts">
import { ref } from "vue";
import PersonalScore from "@/components/score-components/PersonalScore.vue";
import ShowScores from "@/components/score-components/ShowScores.vue";
import SaveScoreBtn from "@/components/score-components/SaveScoreBtn.vue";
import SaveScoreModal from "@/components/score-components/SaveScoreModal.vue";
import Footer from "@/components/gameinterface-components/footer-components/Footer.vue";

const showScoreModal = ref(false);

const openScoreModal = () => {
  console.log("attempting to save score");
  showScoreModal.value = true;
};
</script>

<template>
  <div class="flex flex-col gap 8 w-full items-center justify-center">
    <div class="flex flex-col gap-2">
      <PersonalScore />
      <SaveScoreBtn @click="openScoreModal" class="w-l" />
      <br />
      <ShowScores />
      <SaveScoreModal v-model:model-value="showScoreModal" />
    </div>
    <Footer class="w-2xl" />
  </div>
</template>
