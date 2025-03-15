<script setup lang="ts">
<<<<<<< HEAD
import type { Letter } from '../../../models/Letter';
import { LetterState } from '../../../enums/enums';

const props = defineProps<{ value: Letter }>();
=======
import type { LetterModel } from '../../../models/Letter';
import { LetterState } from '../../../enums/enums';

const props = defineProps<{ value: LetterModel }>();
>>>>>>> jxav22-frontend
const { value, state } = props.value;

</script>

<template>
<<<<<<< HEAD
    <p v-if="state === LetterState.CORRECT" class="bg-sky-950">{{ value }}</p>
    <p v-else-if="state === LetterState.INCORRECT" class="bg-sky-950">{{ value }}</p>
    <p v-else-if="state === LetterState.MISSING" class="bg-sky-950">{{ value }}</p>
    <p v-else-if="state === LetterState.EXTRA" class="bg-sky-950">{{ value }}</p>
=======
    <!-- TODO: EXTRACT THEMING INTO GLOBAL ENUMS -->
    <span v-if="state === LetterState.CORRECT" class="text-stone-50">{{ value }}</span>
    <span v-else-if="state === LetterState.INCORRECT" class="text-red-400">{{ value }}</span>
    <span v-else-if="state === LetterState.MISSING" class="text-grey-500">{{ value }}</span>
    <span v-else-if="state === LetterState.EXTRA" class="text-red-700">{{ value }}</span>
>>>>>>> jxav22-frontend
</template>

<style scoped></style>
