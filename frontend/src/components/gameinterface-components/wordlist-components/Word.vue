<script setup lang="ts">
import Letter from './Letter.vue';
import { WordModel } from '@/models/WordModel';
import { WordState } from '@/constants/enums';
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
    </span>
    {{ " " }}
</template>

<style scoped></style>
