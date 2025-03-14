<script setup lang="ts">
// import HelloWorld from "./components/HelloWorld.vue";
// import TextPrompt from "./components/textprompt/TextPrompt.vue";
// import UserEntry from "./components/userentry/UserEntry.vue";
import Output from './components/gameinteface-components/Output.vue';
</script>

<template>
  <Output />
  <!-- <GameInterface /> -->
  <!-- <HelloWorld msg="Test Your Might" />
  <UserEntry />
  <TextPrompt /> -->
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
