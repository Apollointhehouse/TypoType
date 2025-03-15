<script setup lang="ts">
import type { LetterModel } from '../../../models/Letter';
import { LetterState } from '../../../enums/enums';

const props = defineProps<{ value: LetterModel }>();
const { value, state } = props.value;

</script>

<template>
    <span v-if="state === LetterState.CORRECT" class="text-stone-50">{{ value }}</span>
    <span v-else-if="state === LetterState.INCORRECT" class="text-red-400">{{ value }}</span>
    <span v-else-if="state === LetterState.MISSING" class="text-grey-500">{{ value }}</span>
    <span v-else-if="state === LetterState.EXTRA" class="text-red-950">{{ value }}</span>
</template>

<style scoped></style>
