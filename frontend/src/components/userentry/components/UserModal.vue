<script setup lang="ts">
import { ref } from "vue";
import BootstrapIcons from "bootstrap-icons/bootstrap-icons.svg";

defineProps<{ icon: string }>();

const newUsername = ref(" ");

const addUsername = () => {
  if (newUsername.value.trim() !== "") {
    try {
      localStorage.setItem("newUsername", JSON.stringify(newUsername));
      console.log("Data saved to local storage:", newUsername);
      onClose();
    } catch (error) {
      console.error(error);
    }
  } else {
    alert("Please enter a Name");
  }
};
</script>

<template>
  <div class="submit">
    <form @submit.prevent="addUsername">
      <label for="username">Please Enter your name: </label>
      <input
        type="text"
        id="newUsername"
        name="newUsername"
        v-model="newUsername"
      />
      <button type="submit" class="userBtn">
        <p>
          Send
          <svg width="20" height="20" fill="currentColor">
            <use :href="`${BootstrapIcons}#${icon}`" />
          </svg>
        </p>
      </button>
    </form>
  </div>
</template>

<style scoped>
.submit {
  display: flex;
  gap: 1rem;
}
.userBtn {
  margin-left: 10px;
  padding: 0 10 10 0;
}

</style>
