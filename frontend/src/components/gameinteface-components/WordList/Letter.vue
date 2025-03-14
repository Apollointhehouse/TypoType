<script setup lang="ts">
import type { Letter } from '../../../models/Letter';
import { LetterState } from '../../../enums/enums';

const props = defineProps<{ value: Letter }>();
const { value, state } = props.value;

</script>

<template>
    <p v-if="state === LetterState.CORRECT" class="bg-sky-950">{{ value }}</p>
    <p v-else-if="state === LetterState.INCORRECT" class="bg-sky-950">{{ value }}</p>
    <p v-else-if="state === LetterState.MISSING" class="bg-sky-950">{{ value }}</p>
    <p v-else-if="state === LetterState.EXTRA" class="bg-sky-950">{{ value }}</p>
</template>

<style scoped></style>
