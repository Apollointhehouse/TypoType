<script setup lang="ts">
import { ref } from "vue";

const testing2 = ref("This is also a test");
</script>

<template>
  <h1>{{ testing2 }}</h1>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
