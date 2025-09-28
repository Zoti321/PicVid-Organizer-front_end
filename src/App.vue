<script setup>
import AppSideMenu from "./components/layout/AppSideMenu.vue";
import AppHeader from "./components/layout/AppHeader.vue";
import { useUiStore } from "@/stores/uiStore"; // 导入 store

const uiStore = useUiStore();
</script>

<template>
  <div class="flex">
    <app-side-menu v-show="uiStore.isSideMenuVisible" />
    <div class="w-full overflow-x-hidden">
      <app-header />
      <router-view />
    </div>
  </div>
</template>

<style scoped></style>
