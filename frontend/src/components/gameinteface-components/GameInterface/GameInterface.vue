<script setup lang="ts">
import Input from "./Input.vue"
import Output from "./Output.vue"

import { ref } from "vue"

const input = ref("ENTER VALUE")
const prompt = "THIS IS THE PROMPT"
</script>

<template>
    <Input v-model:value="input" />
    <Output :prompt="prompt" :input="input"/>
</template>k