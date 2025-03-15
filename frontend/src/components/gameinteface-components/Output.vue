<script setup lang="ts">
// import Word from './WordList/Word.vue';
// import { WordModel } from '../../models/Word';

// const testWord = new WordModel();
// testWord.addLetters("TESTWORDYEAHYEAHYEAHWOWOWOJEFKDSJFKL");
// console.log(testWord);

import WordList from './WordList/WordList.vue';
// import { WordModel } from '../../models/Word';
import { processWord, processData } from '../../utils/InputDataProcessor';

// const testWordList = new Array<WordModel>();

// const testWord1 = new WordModel();
// testWord1.addLetters("TEST");
// testWordList.push(testWord1);

// const testWord2 = new WordModel();
// testWord2.addLetters("WORD");
// testWordList.push(testWord2);

// const testWord3 = new WordModel();
// testWord3.addLetters("YEAHDJSHFDJSHFDJLJFLKSDJFKLDSJF");
// testWord3.setState(WordState.INCORRECT)
// testWordList.push(testWord3);

// const input : string[] = ["BUNCH", "OF", "WORDS", "HERE"];
// const prompt : string [] = ["THIS", "IS", "THE", "PROMPT"];

// const testWord: WordModel = processWord("TESTINGLKFDJSDF", "TESTING");
const testWordlList = processData(["TESTDJSDF", "DSLKFJKLFJEW", "DLKSFJLKFJES", "SDKLJFLSKDJKJDSF"], ["TESTING", "DSLDLKFJSKLDFJKDS", "DSLKFJDKLSFJDK"]);

</script>

<template>
    <WordList :value="testWordlList" />
</template>

<style scoped></style>
