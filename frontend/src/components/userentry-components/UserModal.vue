<script setup lang="ts">
import { ref } from "vue";
import { VueFinalModal } from "vue-final-modal";
import { useRouter } from "vue-router";
import BootstrapIcons from "bootstrap-icons/bootstrap-icons.svg";
import axios from "axios";

defineProps<{ modelValue: boolean }>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
const router = useRouter();

const newUsername = ref("");

const addUsername = async () => {
  if (newUsername.value.trim() !== "") {
    try {
      // Send the username to the backend using Axios
      const response = await axios.post("http://localhost:5000/api/users", {
        name: newUsername.value,
      });

      console.log("Username saved to backend:", response.data);

      // Save the username to localStorage (optional)
      localStorage.setItem("newUsername", newUsername.value);

      emit("update:modelValue", false); // Close modal
      router.push("/type-test");
    } catch (error) {
      console.error("Error saving username:", error);
      alert("An error occurred while saving the username.");
    }
  } else {
    alert("Please enter a name.");
  }
};
</script>

<template>
  <VueFinalModal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="modal-container">
      <div class="modal-content">
        <form @submit.prevent="addUsername">
          <label for="username">Please Enter your name:</label>
          <input type="text" id="newUsername" v-model="newUsername" />
          <button type="submit" class="userBtn">
            <p>
              Send
              <svg width="20" height="20" fill="currentColor">
                <use :href="`${BootstrapIcons}#send`" />
              </svg>
            </p>
          </button>
        </form>
      </div>
    </div>
  </VueFinalModal>
</template>

<style scoped>
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
}

/* Center input and button */
input {
  display: block;
  width: 100%;
  margin-top: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.userBtn {
  margin-top: 15px;
  background-color: green;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.userBtn:hover {
  background-color: darkgreen;
}
</style>
