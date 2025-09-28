<script setup>
import { computed, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useDark, useToggle } from "@vueuse/core"
import { Icon } from "@iconify/vue"
import { menuItems } from "@/config/nav.js"
import { findBreadcrumb } from "@/utils/navigation.js"

// =================================================================
// Core
// =================================================================
const route = useRoute()
const router = useRouter()

// =================================================================
// Navigation
// =================================================================
const goBack = () => {
  router.back()
}

// =================================================================
// Breadcrumbs
// =================================================================
const breadcrumbs = computed(() => {
  return findBreadcrumb(menuItems, route.path) || []
})

// =================================================================
// Search
// =================================================================
const searchQuery = ref("")
const searchCategory = ref("1")

const SEARCH_PLACEHOLDERS = {
  DEFAULT: "搜索",
  FOCUSED: "作品,标签,作者等...",
}
const searchPlaceholder = ref(SEARCH_PLACEHOLDERS.DEFAULT)

const handleSearchFocus = () => {
  searchPlaceholder.value = SEARCH_PLACEHOLDERS.FOCUSED
}

const handleSearchBlur = () => {
  searchPlaceholder.value = SEARCH_PLACEHOLDERS.DEFAULT
}

const CATEGORY_ROUTE_MAP = {
  1: "/comic",
  2: "/image-set",
  3: "/media/3D",
  4: "/media/ero-animation",
}

const executeSearch = () => {
  const path = CATEGORY_ROUTE_MAP[searchCategory.value]

  if (path) {
    router.push({
      path: path,
      query: { keyword: searchQuery.value },
    })
  } else {
    // A user-facing message would be better, e.g., using ElMessage
    console.warn("Please select a category before searching.")
  }
}

// =================================================================
// Theme
// =================================================================
const isDarkMode = useDark()
const toggleTheme = useToggle(isDarkMode)
</script>

<template>
  <header
    class="sticky top-0 left-0 z-1000 box-border flex h-[60px] w-full items-center justify-between border-b border-solid border-gray-200 bg-white px-5 py-0 dark:border-gray-600 dark:bg-slate-800 dark:text-white"
  >
    <div class="flex items-center justify-start gap-1">
      <el-page-header title="返回" @back="goBack">
        <template #content>
          <el-breadcrumb separator="/">
            <template
              v-for="breadcrumb of breadcrumbs"
              :key="breadcrumb.path || breadcrumb.name"
            >
              <el-breadcrumb-item>
                <router-link v-if="breadcrumb.path" :to="breadcrumb.path"
                  >{{ breadcrumb.name }}
                </router-link>
                <span v-else>{{ breadcrumb.name }}</span>
              </el-breadcrumb-item>
            </template>
          </el-breadcrumb>
        </template>
      </el-page-header>
    </div>
    <div class="flex items-center justify-center">
      <div class="flex items-center justify-center">
        <el-input
          v-model="searchQuery"
          :placeholder="searchPlaceholder"
          clearable
          style="width: 360px"
          @focus="handleSearchFocus"
          @blur="handleSearchBlur"
          @keyup.enter="executeSearch"
        >
          <template #prefix>
            <el-icon class="cursor-pointer" @click="executeSearch">
              <Icon icon="ep:search" />
            </el-icon>
          </template>
          <template #prepend>
            <el-select
              v-model="searchCategory"
              style="width: 100px"
              placeholder="作品筛选"
              clearable
              default-first-option
            >
              <el-option label="漫画" value="1" />
              <el-option label="图集" value="2" />
              <el-option label="3D" value="3" />
              <el-option label="里番" value="4" />
            </el-select>
          </template>
        </el-input>
      </div>
      <div class="flex items-center justify-center px-2 py-2.5">
        <label class="switch">
          <input type="checkbox" :checked="isDarkMode" @change="toggleTheme" />
          <span>
            <el-icon size="14px">
              <Icon v-if="isDarkMode" icon="ep:moon" />
              <Icon v-else icon="ep:sunny" />
            </el-icon>
          </span>
        </label>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.switch {
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 42px;
  height: 22px;
  border-radius: 20px;
  border: 1px solid rgba(60, 60, 60, 0.29);
  background-color: #f1f1f1;
  cursor: pointer;

  input {
    width: 0;
    height: 0;
    margin: 0;
    padding: 0;
  }

  span {
    position: absolute;
    top: 1px;
    left: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 18px;
    height: 18px;
    background-color: #ffffff;
    border-radius: 50%;
    transition: transform 0.3s ease;
  }

  input:checked ~ span {
    transform: translateX(18px);
  }
}
</style>
