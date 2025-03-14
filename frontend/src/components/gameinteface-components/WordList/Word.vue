<script setup lang="ts">
import Letter from './Letter.vue';
import { Letter as LetterClass } from '../../../models/Letter';
import { LetterState } from '../../../enums/enums';

const testLetter = new LetterClass('A', LetterState.CORRECT);
</script>

<template>
    <Letter :value="testLetter" />
</template>

<style scoped></style>
