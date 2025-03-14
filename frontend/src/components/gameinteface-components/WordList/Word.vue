<script setup lang="ts">
import Letter from './Letter.vue';
import { Letter as LetterClass } from '../../../models/Letter';
import { LetterState } from '../../../enums/enums';

const testLetter = new LetterClass('A', LetterState.MISSING);
</script>

<template>
    <Letter :value="testLetter" />
</template>

<style scoped></style>
