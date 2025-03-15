<script setup lang="ts">
import { ref } from "vue";
import StartButton from "../components/userentry-components/StartButton.vue";
import UserModal from "../components/userentry-components/UserModal.vue";

// ✅ Create a reactive state for modal
const showModal = ref(false);

const openModal = () => {
  console.log("Opening modal");
  showModal.value = true;
};

const closeModal = () => {
  console.log("Closing modal");
  showModal.value = false;
};
</script>

<template>
  <UserModal v-model="showModal" />
  
  <h1>Test your Might!</h1>
  
  <!-- Ensure button triggers modal -->
  <StartButton @click="openModal" />
</template>
