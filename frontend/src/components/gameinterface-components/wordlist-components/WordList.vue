<script setup lang="ts">
import { WordListModel } from '@/models/WordListModel';
import Word from './Word.vue';

const props = defineProps<{ value: WordListModel }>();
const lineBreaks = props.value.getLineBreaks();

</script>

<template>
    <template v-for="(word, index) in value.getWords()" :key="index">
        <Word :value="word" />
        <template v-if="lineBreaks.includes(index + 1)">
            <br v-for="(n, i) in value.getLineBreaks().filter(x => x === index + 1)" :key="i" />
        </template>
    </template>
</template>

<style scoped></style>
