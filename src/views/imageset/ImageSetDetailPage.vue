<script setup>
import { ref, onMounted, computed } from "vue"
import { useRoute } from "vue-router"
import { ElMessage } from "element-plus"
import imageSetsAPI from "@/api/imageSets.js"
import categoryTagsAPI from "@/api/categoryTags.js"

// Import new components
import ImageSetMetadataCard from "@/components/imageset/ImageSetMetadataCard.vue"
import ImageGallery from "@/components/imageset/ImageGallery.vue"
import AddImagesToSetDialog from "@/components/dialog/AddImagesToSetDialog.vue"

const route = useRoute()
const imageSetId = computed(() => Number(route.params.id))

// State
const imageSet = ref(null)
const isLoading = ref(true)
const error = ref(null)
const allCategoryTags = ref({
  series: [],
  characters: [],
  tags: [],
  authors: [],
})

// Template refs
const addImagesDialog = ref(null)

// API Call
const fetchInitialData = async () => {
  if (!imageSetId.value) return

  isLoading.value = true
  error.value = null
  try {
    const [details, pages, allTags] = await Promise.all([
      imageSetsAPI.getImageSetById(imageSetId.value),
      imageSetsAPI.getImageSetPages(imageSetId.value),
      categoryTagsAPI.getCategoryTags(),
    ])

    details.images = pages.pages
    imageSet.value = details
    allCategoryTags.value = allTags
  } catch (e) {
    error.value = e
    console.error("Failed to fetch initial page data:", e)
    ElMessage.error("加载页面数据失败")
  } finally {
    isLoading.value = false
  }
}

// Event Handlers
function openAddImagesDialog() {
  addImagesDialog.value?.openDialog()
}

function onUploadSuccess() {
  // Just re-fetch all data to ensure consistency
  fetchInitialData()
}

function onTagUpdated(categoryType, newTagList) {
  imageSet.value = {
    ...imageSet.value,
    [categoryType]: newTagList.map((name) => ({ name })),
  }
}

// Lifecycle
onMounted(() => {
  fetchInitialData()
})
</script>

<template>
  <div class="p-4 md:p-8">
    <!-- Loading Skeleton -->
    <div v-if="isLoading">
      <el-skeleton :rows="3" animated />
      <el-divider class="my-6" />
      <div
        class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      >
        <el-skeleton v-for="n in 12" :key="n" style="width: 100%">
          <template #template>
            <el-skeleton-item
              variant="image"
              style="width: 100%; height: 240px"
            />
          </template>
        </el-skeleton>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error">
      <el-empty description="无法加载图集信息，或该图集不存在" />
    </div>

    <!-- Content -->
    <div v-else-if="imageSet">
      <!-- Metadata Card Component -->
      <ImageSetMetadataCard
        :image-set="imageSet"
        :all-category-tags="allCategoryTags"
        @open-add-images-dialog="openAddImagesDialog"
        @tag-updated="onTagUpdated"
      />

      <!-- Image Gallery Component -->
      <ImageGallery :images="imageSet.images" />

      <!-- Add Images Dialog Component -->
      <AddImagesToSetDialog
        ref="addImagesDialog"
        :image-set-id="imageSetId"
        @upload-success="onUploadSuccess"
      />
    </div>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here if needed */
</style>
