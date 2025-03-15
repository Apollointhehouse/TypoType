<script setup lang="ts">
const props = defineProps<{ char: string, count: number, flashed: boolean }>();
</script>

<template>
    <p :class="{ key: true, flashed: props.flashed }">
        {{ props.char }}:{{ props.count }}
    </p>
</template>

<style scoped>
.key {
  /* Initial state */
  transition: background-color 0.1s ease, opacity 0.1s ease;
}

.flashed {
  background-color: #ff0; /* Example: Change background color when flashed */
  opacity: 0.5; /* Example: Fade out effect */
}
</style>
