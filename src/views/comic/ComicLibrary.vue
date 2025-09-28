<script setup>
// Components
import ComicCard from "@/components/base/ComicCard.vue"
import ComicLibraryHeader from "@/components/comic/ComicLibraryHeader.vue"

// Vue
import { ref, onMounted, nextTick, watch } from "vue"
import { onBeforeRouteLeave, useRoute } from "vue-router"

// Composables
import { useComics } from "@/composables/useComics.js"

// =======================================================================
// Core
// =======================================================================
const route = useRoute()

// =======================================================================
// Composables
// =======================================================================
const {
  sortedComicCards,
  comicNumber,
  fetchComics,
  changeSort,
  currentSort,
  currentOrder,
  fetchError,
} = useComics()

// =======================================================================
// State
// =======================================================================
const isReadyForDisplay = ref(false)

// =======================================================================
// Lifecycle Hooks & Watchers
// =======================================================================

watch(
  () => route.query.keyword,
  (newKeyword, oldKeyword) => {
    if (newKeyword !== oldKeyword) {
      fetchComics({ keyword: newKeyword })
    }
  },
)

onBeforeRouteLeave((to) => {
  if (to.name === "漫画详情") {
    sessionStorage.setItem(
      "comicAlbumScrollPosition",
      window.scrollY.toString(),
    )
  }
})

onMounted(async () => {
  const savedPosition = sessionStorage.getItem("comicAlbumScrollPosition")
  const initialParams = { keyword: route.query.keyword }

  if (!savedPosition) {
    isReadyForDisplay.value = true
    await fetchComics(initialParams)
  } else {
    await fetchComics(initialParams)
    await nextTick(() => {
      window.scrollTo({ top: parseInt(savedPosition, 10), behavior: "auto" })
      sessionStorage.removeItem("comicAlbumScrollPosition")
      isReadyForDisplay.value = true
    })
  }
})
</script>

<template>
  <div
    v-if="
      fetchError && fetchError.response && fetchError.response.status === 404
    "
    class="h-[calc(100vh-150px)] w-full items-center justify-center"
  >
    <ComicLibraryHeader
      :comic-number="0"
      :current-sort="currentSort"
      :current-order="currentOrder"
      @change-sort="changeSort"
      @refresh-data="fetchComics"
    />
    <el-empty description="这里什么都没有，快去添加一个吧！" />
  </div>

  <div
    v-else
    :style="{
      opacity: isReadyForDisplay ? 1 : 0,
      transition: 'opacity 0.2s ease-in',
    }"
  >
    <ComicLibraryHeader
      :comic-number="comicNumber"
      :current-sort="currentSort"
      :current-order="currentOrder"
      @change-sort="changeSort"
      @refresh-data="fetchComics"
    />

    <!-- Comic Grid -->
    <div
      id="comic-cards-container"
      class="mb-10 grid grid-cols-5 justify-items-center p-2.5 px-8"
    >
      <ComicCard
        v-for="data in sortedComicCards"
        :id="data.id"
        :key="data.id"
        v-model:is_star="data.is_started"
        :comic-name="data.name"
        :comic-cover-src="data.cover_url"
        :comic-tags="data.tags"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comic-reader-grid {
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

/* Staggered animation for comic cards */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

#comic-cards-container {
  animation: fadeIn 0.5s ease-out;
}

:deep(.comic-card) {
  animation: fadeIn 0.5s ease-out both;
}

@for $i from 1 through 10 {
  :deep(.comic-card:nth-child(10n + #{$i})) {
    animation-delay: #{$i * 0.05}s;
  }
}
</style>
