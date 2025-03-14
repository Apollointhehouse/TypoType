<script setup lang="ts">
import type { LetterModel } from '../../../models/Letter';
import { LetterState } from '../../../enums/enums';

const props = defineProps<{ value: LetterModel }>();
const { value, state } = props.value;

</script>

<template>
    <p v-if="state === LetterState.CORRECT" class="text-stone-50">{{ value }}</p>
    <p v-else-if="state === LetterState.INCORRECT" class="text-red-400">{{ value }}</p>
    <p v-else-if="state === LetterState.MISSING" class="text-grey-500">{{ value }}</p>
    <p v-else-if="state === LetterState.EXTRA" class="text-red-950">{{ value }}</p>
</template>

<style scoped></style>
