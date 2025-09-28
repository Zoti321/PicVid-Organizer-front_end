import { defineStore } from "pinia";
import { ref } from "vue";

export const useUiStore = defineStore("ui", () => {
  const isSideMenuVisible = ref(true);

  function toggleSideMenu(value) {
    if (typeof value === "boolean") {
      isSideMenuVisible.value = value;
    } else {
      isSideMenuVisible.value = !isSideMenuVisible.value;
    }
  }

  return { isSideMenuVisible, toggleSideMenu };
});
