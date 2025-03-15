<script setup lang="ts">
import { WordModel } from '../../../models/Word';
import Word from './Word.vue';

const props = defineProps<{ value: WordModel[] }>();
console.log(props)

</script>

<template>
    <template v-for="(word, index) in props.value" :key="index">
        <Word :value="word" />
    </template>
</template>

<style scoped></style>
