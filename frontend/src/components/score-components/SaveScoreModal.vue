<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { VueFinalModal } from "vue-final-modal";
import { useRouter } from "vue-router";
import BootstrapIcons from "bootstrap-icons/bootstrap-icons.svg";
import axios from "axios";

defineProps<{ modelValue: boolean }>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const username = ref(localStorage.getItem("newUsername"));
const score = ref(localStorage.getItem("gameScore"));
const router = useRouter();

const closeModal = () => {
  localStorage.clear(); // Clear localStorage
  emit("update:modelValue", false); // Close the modal
  router.push("/"); // Redirect to home page
};
const saveScore = async () => {
  try {
    const response = await axios.post("http://localhost:5000/api/scores", {
      name: username.value,
      score: score.value,
    });
    console.log("Score Saved: ", response.data);
    emit("update:modelValue", false);
  } catch (error) {
    console.error("Failed to save score: ", error);
    alert("Failed to save score. Please try again");
    closeModal();
  }
};
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeModal(); // Clear localStorage, close modal, and redirect
  }
};

// Add event listener when the modal is mounted
onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

// Remove event listener when the modal is unmounted
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <VueFinalModal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="modal-container">
      <div class="modal-content">
        <h2>Are you sure you want to save your score?</h2>
        <button class="yesBtn" @click="saveScore">
          <svg width="20" height="20" fill="currentColor">
            <use :href="`${BootstrapIcons}#check-lg`" />
          </svg>
          <p>Yes</p>
        </button>
        <button class="noBtn" @click="closeModal">
          <p>
            <svg width="20" height="20" fill="currentColor">
              <use :href="`${BootstrapIcons}#x-lg`" />
            </svg>
            No
          </p>
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>

<style scoped>
/* added styling here as modal wasn't looking quite right with TailwindCSS yet */
/* Fullscreen overlay to center the modal */
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center; /* Centers horizontally */
  align-items: center; /* Centers vertically */
  background: rgba(0, 0, 0, 0.5); /* Dark overlay */
  backdrop-filter: blur(5px); /* Optional: Blur background */
  z-index: 1000;
}

/* Style the modal box */
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
  text-align: center;
  color: black;
}

.yesBtn {
  /* margin-top: 15px; */
  margin-right: 15px;
  background-color: green;
  color: white;
  /* padding: 10px 15px; */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100px;
}

.yesBtn:hover {
  background-color: darkgreen;
}

.noBtn {
  margin-top: 15px;
  background-color: red;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100px;
}

.noBtn:hover {
  background-color: darkred;
}
</style>
