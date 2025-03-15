<script setup lang="ts">
import { ref } from "vue";
const score = ref(100);
const userName = ref(localStorage.getItem("newUsername"));
</script>

<template>
  <h1>Hi {{ userName }}</h1>
  <p>Your Score is {{ score }}</p>
</template>

<style></style>
