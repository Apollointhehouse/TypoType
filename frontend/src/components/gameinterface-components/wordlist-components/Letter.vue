<script setup lang="ts">
import type { LetterModel } from '@/models/LetterModel';
import { LetterState } from '@/constants/enums';

const props = defineProps<{ value: LetterModel }>();
const { value, state } = props.value;
</script>

<template>
    <span v-if="state === LetterState.CORRECT" class="text-stone-50">{{ value }}</span>
    <span v-else-if="state === LetterState.INCORRECT" class="text-red-400">{{ value }}</span>
    <span v-else-if="state === LetterState.MISSING" class="text-zinc-600">{{ value }}</span>
    <span v-else-if="state === LetterState.EXTRA" class="text-red-700">{{ value }}</span>
</template>

<style scoped></style>
