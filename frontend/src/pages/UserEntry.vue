<script setup lang="ts">
import { ref, onMounted } from "vue";
import StartButton from "@/components/userentry-components/StartButton.vue";
import UserModal from "@/components/userentry-components/UserModal.vue";
import Footer from "@/components/gameinterface-components/footer-components/Footer.vue";
import Giphy from "@/components/userentry-components/Giphy.vue";

import { useSound } from "@/utils/soundUtils";

// ✅ Create a reactive state for modal
const showModal = ref(false);

const openModal = () => {
  console.log("Opening modal");
  showModal.value = true;
};

const { playMusic } = useSound();

onMounted(() => {
  playMusic();
});
</script>

<template>
  <div class="w-2xl h-screen">
    <div class="flex flex-col items-center">
      <UserModal v-model="showModal" class="text-black" />

      <h1>Test your Might!</h1>
      <Giphy />
      <!-- ✅ Ensure button triggers modal -->
      <StartButton @click="openModal" class="w-[50%]" />
    </div>
    <Footer />
  </div>
</template>
