<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps<{ value: string }>();
const emit = defineEmits(['update:value']);

const modelValue = computed({
  get: () => props.value,
  set: (newValue) => emit('update:value', newValue),
});
</script>

<template>
    <input v-model="modelValue" />
</template>