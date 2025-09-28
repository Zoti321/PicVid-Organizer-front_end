<script setup>
import { ref, computed } from "vue"

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },
})

// Pagination State
const currentPage = ref(1)
const pageSize = ref(12)

const totalImages = computed(() => props.images.length)

const paginatedImages = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = currentPage.value * pageSize.value
  return props.images.slice(start, end)
})
</script>

<template>
  <div>
    <div
      class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      <div
        v-for="(imgSrc, index) in paginatedImages"
        :key="imgSrc"
        class="overflow-hidden rounded-md shadow-md transition-shadow duration-300 hover:shadow-xl"
      >
        <el-image
          :src="imgSrc"
          :preview-src-list="images"
          :initial-index="(currentPage - 1) * pageSize + index"
          fit="cover"
          loading="lazy"
          class="aspect-[3/4] h-full w-full cursor-pointer"
        />
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalImages > pageSize" class="mt-8 flex justify-center">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[12, 24, 36, 48]"
        :total="totalImages"
        layout="total, sizes, prev, pager, next, jumper"
        background
      />
    </div>
  </div>
</template>
