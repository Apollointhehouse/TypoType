<script setup lang="ts">
import Letter from './Letter.vue';
import { LetterModel } from '../../../models/Letter';
import { LetterState } from '../../../enums/enums';

const testLetter = new LetterModel('A', LetterState.MISSING);
</script>

<template>
    <Letter :value="testLetter" />
</template>

<style scoped></style>
