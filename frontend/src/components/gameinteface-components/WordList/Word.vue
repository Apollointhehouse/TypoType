<script setup lang="ts">
import Letter from './Letter.vue';
<<<<<<< HEAD
import { Letter as LetterClass } from '../../../models/Letter';
import { LetterState } from '../../../enums/enums';

const testLetter = new LetterClass('A', LetterState.CORRECT);
</script>

<template>
    <Letter :value="testLetter" />
=======
import { WordModel } from '../../../models/Word';
import { WordState } from '../../../enums/enums';
const props = defineProps<{ value: WordModel }>();

const { letters, state } = props.value;

function getStateClass(state: WordState): string {
    switch (state) {
        case WordState.INCORRECT:
            return 'underline decoration-red-400';
        case WordState.CORRECT:
        case WordState.IN_PROGRESS:
        default:
            return '';
    }
}

</script>

<template>
    <span :class="getStateClass(state)">
        <template v-for="(letter, index) in letters" :key="index">
            <Letter :value="letter" />
        </template>
        {{ " " }}
    </span>
>>>>>>> jxav22-frontend
</template>

<style scoped></style>
