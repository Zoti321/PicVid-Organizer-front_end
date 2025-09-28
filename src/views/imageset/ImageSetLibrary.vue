<script setup>
// Components
import ImageSetCard from "@/components/base/ImageSetCard.vue"
import ImageSetLibraryHeader from "@/components/imageset/ImageSetLibraryHeader.vue"

// Vue
import { ref, onMounted, nextTick, watch, provide } from "vue"
import { onBeforeRouteLeave, useRoute } from "vue-router"

// Composables
import { useImageSets } from "@/composables/useImageSets.js"

// =======================================================================
// Core
// =======================================================================
const route = useRoute()

// =======================================================================
// Composables
// =======================================================================
const {
  sortedImageSets,
  imageSetNumber,
  fetchImageSets,
  changeSort,
  currentSort,
  currentOrder,
  fetchError,
} = useImageSets()

// Provide the data fetching function to child components
provide("getImageSetsData", fetchImageSets)

// =======================================================================
// State
// =======================================================================
const isReadyForDisplay = ref(false)

// =======================================================================
// Lifecycle Hooks & Watchers
// =======================================================================

watch(
  () => route.query.keyword,
  (newKeyword) => {
    fetchImageSets({ keyword: newKeyword })
  },
  { immediate: true },
)

onBeforeRouteLeave((to) => {
  // Assuming a detail page for image sets will exist
  if (to.name === "图集详情") {
    sessionStorage.setItem(
      "imageSetLibraryScrollPosition",
      window.scrollY.toString(),
    )
  }
})

onMounted(async () => {
  const savedPosition = sessionStorage.getItem("imageSetLibraryScrollPosition")

  if (savedPosition) {
    await nextTick(() => {
      window.scrollTo({ top: parseInt(savedPosition, 10), behavior: "auto" })
      sessionStorage.removeItem("imageSetLibraryScrollPosition")
    })
  }
  isReadyForDisplay.value = true
})
</script>

<template>
  <!-- Header -->
  <ImageSetLibraryHeader
    :image-set-number="imageSetNumber"
    :current-sort="currentSort"
    :current-order="currentOrder"
    @change-sort="changeSort"
    @refresh-data="fetchImageSets"
  />

  <!-- Content Area -->
  <div
    v-if="
      fetchError && fetchError.response && fetchError.response.status === 404
    "
    class="flex h-[calc(100vh-250px)] w-full items-center justify-center"
  >
    <el-empty description="这里什么都没有，快去添加一个吧！" />
  </div>

  <div
    v-else
    :style="{
      opacity: isReadyForDisplay ? 1 : 0,
      transition: 'opacity 0.2s ease-in',
    }"
  >
    <!-- ImageSet Grid -->
    <div
      id="image-set-cards-container"
      class="mb-10 grid grid-cols-5 justify-items-center p-2.5 px-8"
    >
      <ImageSetCard
        v-for="data in sortedImageSets"
        :id="data.id"
        :key="data.id"
        v-model:is_starred="data.is_starred"
        :name="data.name"
        :cover-url="data.cover_url"
        :tags="data.tags"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tag-ranking-title {
  @apply relative mb-2 pl-2.5 text-sm leading-5 font-semibold text-gray-700;

  &::before {
    @apply absolute top-1/2 left-0 h-3.5 w-1 -translate-y-1/2 rounded-full bg-orange-500;
    content: "";
  }
}

#image-set-cards-container {
  animation: fadeIn 0.5s ease-out;
}

:deep(.image-set-card) {
  animation: fadeIn 0.5s ease-out both;
}

@for $i from 1 through 10 {
  :deep(.image-set-card:nth-child(10n + #{$i})) {
    animation-delay: #{$i * 0.05}s;
  }
}
</style>
