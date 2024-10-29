<script setup lang="ts">
import Navbar from "~/components/Navbar.vue";
import {useUserStore} from "~/store/userStore.js";

const userStore = useUserStore()
if (userStore.csrfToken === null){
  userStore.fetchCsrfToken()

}
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