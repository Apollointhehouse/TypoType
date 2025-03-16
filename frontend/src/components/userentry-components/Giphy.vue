<script setup lang="ts">
import { ref } from "vue";

const iframeSrc = ref("https://giphy.com/embed/TmOpUpxHEtW7ZtdvUc");
const giphySrc = ref(
  "https://giphy.com/gifs/gaming-mortal-kombat-liu-kang-1-TmOpUpxHEtW7ZtdvUc"
);
</script>
<template>
  <div>
    <!-- Giphy Embed -->
    <div class="w-[100%] pb-[.5%] relative">
      <iframe
        :src="iframeSrc"
        class="w-[600px] h-[400px]"
        frameBorder="0"
        allowFullScreen
      >
      </iframe>
      <!-- Giphy Attribution Link -->
      <p>
        <a :href="giphySrc" class="text-xs">via GIPHY</a>
      </p>
    </div>
  </div>
</template>
