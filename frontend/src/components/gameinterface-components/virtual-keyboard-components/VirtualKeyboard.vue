<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import Key from './Key.vue';

const keys = ref([
  { char: 'A', count: 0, flashed: false },
  { char: 'B', count: 0, flashed: false },
  { char: 'C', count: 0, flashed: false },
  { char: 'D', count: 0, flashed: false },
  { char: 'E', count: 0, flashed: false },
  { char: 'F', count: 0, flashed: false },
  { char: 'G', count: 0, flashed: false },
  { char: 'H', count: 0, flashed: false },
  { char: 'I', count: 0, flashed: false },
  { char: 'J', count: 0, flashed: false },
  { char: 'K', count: 0, flashed: false },
  { char: 'L', count: 0, flashed: false },
  { char: 'M', count: 0, flashed: false },
  { char: 'N', count: 0, flashed: false },
  { char: 'O', count: 0, flashed: false },
  { char: 'P', count: 0, flashed: false },
  { char: 'Q', count: 0, flashed: false },
  { char: 'R', count: 0, flashed: false },
  { char: 'S', count: 0, flashed: false },
  { char: 'T', count: 0, flashed: false },
  { char: 'U', count: 0, flashed: false },
  { char: 'V', count: 0, flashed: false },
  { char: 'W', count: 0, flashed: false },
  { char: 'X', count: 0, flashed: false },
  { char: 'Y', count: 0, flashed: false },
  { char: 'Z', count: 0, flashed: false },
]);

// Handle key press
const handleKeyPress = (event: KeyboardEvent) => {
  let key = event.key;

  if (/^[a-zA-Z]$/.test(key)) {
    key = key.toUpperCase();
    let index = keys.value.findIndex((k) => k.char === key);
    
    incrementKey(index);
    flashKey(index);
  }
};

const incrementKey = (index: number) => {
  keys.value[index].count++;
};

const flashKey = (index: number) => {
  keys.value[index].flashed = true;
  setTimeout(() => {
    keys.value[index].flashed = false;
  }, 100);
};

// Listen to keyboard inputs on mount and clean up on unmount
onMounted(() => {
  window.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
});
</script>

<template>
  <div>
    <Key v-for="key in keys" :char="key.char" :count="key.count" :flashed="key.flashed"/>
  </div>
</template>

<style scoped>
</style>
