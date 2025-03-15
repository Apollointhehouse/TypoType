<script setup lang="ts">
import { WordListModel } from '@/models/WordListModel';
import Word from './Word.vue';

const props = defineProps<{ value: WordListModel }>();
const lineBreaks = props.value.getLineBreaks();

</script>

<template>
    <template v-for="(word, index) in value.getWords()" :key="index">
        <Word :value="word" />
        <br v-if="lineBreaks.includes(index + 1)" />
    </template>
</template>

<style scoped></style>
