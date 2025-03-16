<<<<<<< HEAD
<script setup lang="ts">

import {ref} from 'vue';
const props = defineProps<{ value: string }>();

const FLASHING_INTERVAL = 500;

const letters = props.value.split('');

function* generateIndexes(maxIndex: number = letters.length):Generator<number> {
  let index = 0;
  while (true) {
    yield index % maxIndex;  
    index++;
  }
}

const indexTracker = ref(generateIndexes());
const flashedIndex = ref<number>(indexTracker.value.next().value);

setInterval(() => {
        flashedIndex.value = indexTracker.value.next().value;
}, FLASHING_INTERVAL);

</script>

<template>
    <h1 @click="flashedIndex = indexTracker.next().value">
        <span v-for="(letter, index) in letters" :key="index" :class="{fancyLetter: true, flashingLetter : flashedIndex === index}">{{ letter }}</span>
    </h1>
</template>

<style scoped>
.fancyLetter {
  transition: opacity 1000ms ease-in-out; /* Smooth transition for opacity */
}

.flashingLetter {
  opacity: 0; /* Start with opacity 0 for the flashing effect */
}

h1 {
  font-size: 2rem;
}
</style>
=======
<script setup lang="ts">

import {ref} from 'vue';
const props = defineProps<{ value: string }>();

const FLASHING_INTERVAL = 500;

const letters = props.value.split('');

function* generateIndexes(maxIndex: number = letters.length):Generator<number> {
  let index = 0;
  while (true) {
    yield index % maxIndex;  
    index++;
  }
}

const indexTracker = ref(generateIndexes());
const flashedIndex = ref<number>(indexTracker.value.next().value);

setInterval(() => {
        flashedIndex.value = indexTracker.value.next().value;
}, FLASHING_INTERVAL);

</script>

<template>
    <h1 @click="flashedIndex = indexTracker.next().value">
        <span v-for="(letter, index) in letters" :key="index" :class="{fancyLetter: true, flashingLetter : flashedIndex === index}">{{ letter }}</span>
    </h1>
</template>

<style scoped>
.fancyLetter {
  transition: opacity 1000ms ease-in-out; /* Smooth transition for opacity */
}

.flashingLetter {
  opacity: 0; /* Start with opacity 0 for the flashing effect */
}
</style>
>>>>>>> jojorioch-frontend
