<script setup lang="ts">
import Navbar from "~/components/Navbar.vue";
</script>

<template>
  <div class="flex h-full ">

    <div class="flex-1 flex flex-col">
      <Navbar />
      <slot />
    </div>
  </div>
</template>

<style scoped>

</style>