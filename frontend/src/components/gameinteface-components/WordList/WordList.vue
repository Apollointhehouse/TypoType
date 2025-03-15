<script setup lang="ts">
import { WordListModel } from '../../../models/WordList';
import Word from './Word.vue';

const props = defineProps<{ value: WordListModel }>();

</script>

<template>
    <template v-for="(word, index) in props.value.getWords()" :key="index">
        <Word :value="word" />
    </template>
</template>

<style scoped></style>
