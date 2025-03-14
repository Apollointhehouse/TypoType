<script setup lang="ts">
import { ref } from "vue";
import UserModal from "./components/UserModal.vue";

const thisIsaTest = ref("This is a Test!");
</script>

<template>
  <UserModal icon="send" />
  <h1>{{ thisIsaTest }}</h1>
</template>

<style>
.read-the-docs {
  color: #888;
}
</style>
