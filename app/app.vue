<template>
  <div>
    <nuxt-page></nuxt-page>
  </div>
</template>
<script setup lang="ts">
useHead({
  link: [{ rel: "manifest", href: "/manifest.json" }],
  meta: [{ name: "theme-color", content: "#1e3c72" }],
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap");

body {
  font-family: "Orbitron", sans-serif;
}
</style>
