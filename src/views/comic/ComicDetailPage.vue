<script setup>
import { useRoute, useRouter } from "vue-router"
import { onMounted, ref, watch } from "vue"
import comicsAPI from "@/api/comics.js"
import categoryTagsAPI from "@/api/categoryTags.js"
import { useHistory } from "@/composables/useHistory.js"

// Import new components
import ComicMetadata from "@/components/comic/ComicMetadata.vue"
import ComicTagSection from "@/components/comic/ComicTagSection.vue"
import ComicActions from "@/components/comic/ComicActions.vue"
import ComicTagMenu from "@/components/comic/ComicTagMenu.vue"

const route = useRoute()
const router = useRouter()

// Component data
const comicId = route.params.id
const comicDetail = ref()
const loaded = ref(false)
const allCategoryTags = ref({
  series: [],
  characters: [],
  tags: [],
  authors: [],
})

const selectedTag = ref({
  categoryType: null,
  tagName: null,
})

function handleTagSelected(categoryType, tagName) {
  if (selectedTag.value.tagName === tagName) {
    // If the same tag is clicked again, deselect it
    selectedTag.value.categoryType = null
    selectedTag.value.tagName = null
  } else {
    selectedTag.value.categoryType = categoryType
    selectedTag.value.tagName = tagName
  }
}

function cancelTagSelection() {
  selectedTag.value.categoryType = null
  selectedTag.value.tagName = null
}

async function handleTagDelete() {
  if (!selectedTag.value.tagName || !selectedTag.value.categoryType) return

  const { categoryType, tagName } = selectedTag.value
  const currentTags = comicDetail.value[categoryType].map((t) => t.name)
  const newTags = currentTags.filter((t) => t !== tagName)

  try {
    await comicsAPI.updateComic(comicId, {
      [categoryType]: newTags.map((name) => ({ name })),
    })
    // Refresh data
    await getComicDetail()
    // Reset selection
    cancelTagSelection()
  } catch (error) {
    console.error("Failed to delete tag:", error)
  }
}

function handleTagSearch() {
  if (!selectedTag.value.tagName) return
  router.push({
    path: "/comic",
    query: { keyword: selectedTag.value.tagName },
  })
}

// Define tag categories for easier looping in the template
const tagCategories = [
  { type: "series", title: "作品", icon: "mdi:source-repository" },
  {
    type: "characters",
    title: "登场人物",
    icon: "mdi:account-multiple-outline",
  },
  { type: "tags", title: "分类标签", icon: "mdi:tag-multiple-outline" },
  { type: "authors", title: "作者", icon: "mdi:account-edit-outline" },
]

// History tracking
const { addItemToHistory } = useHistory()
watch(
  comicDetail,
  (newDetail) => {
    if (newDetail && newDetail.id) {
      addItemToHistory({
        id: newDetail.id,
        type: "comic",
        name: newDetail.name,
        cover_url: newDetail.cover_url,
        tags: newDetail.tags,
        series: newDetail.series,
        characters: newDetail.characters,
        authors: newDetail.authors,
      })
    }
  },
  { deep: true },
)

// Fetch all available category tags for the dropdowns
async function getCategoryTagsList() {
  try {
    allCategoryTags.value = await categoryTagsAPI.getCategoryTags()
  } catch (error) {
    console.error(error)
  }
}

// Fetch comic details
const getComicDetail = async () => {
  try {
    comicDetail.value = await comicsAPI.getComicById(comicId)
    loaded.value = true
  } catch (error) {
    console.error(error)
    loaded.value = false
  }
}

// Handler for when a child component successfully updates tags
function onTagsUpdated(categoryType, newTagList) {
  // To ensure reactivity, we need to create a new object/array
  comicDetail.value = {
    ...comicDetail.value,
    [categoryType]: newTagList.map((name) => ({ name })),
  }
}

// Lifecycle hooks
onMounted(() => {
  getComicDetail()
  getCategoryTagsList()
})
</script>

<template>
  <div v-if="loaded" class="p-4">
    <div class="mx-auto shadow-md">
      <div class="">
        <h1 class="text-gray bg-[#f9f9f9] p-2 font-normal">
          <span class="text-xl font-bold text-zinc-900">{{
            comicDetail.name
          }}</span>
        </h1>
      </div>
      <div class="grid grid-cols-1 gap-8 p-4 md:grid-cols-3">
        <div class="md:col-span-1">
          <img
            :src="comicDetail.cover_url"
            alt="漫画封面"
            class="w-full rounded-md shadow-lg"
          />
        </div>
        <div class="flex flex-col space-y-1 md:col-span-2">
          <ComicTagSection
            v-for="category in tagCategories"
            :key="category.type"
            :comic-id="comicId"
            :title="category.title"
            :icon="category.icon"
            :category-type="category.type"
            :tags="comicDetail[category.type] || []"
            :all-available-tags="
              allCategoryTags[category.type]
                ? allCategoryTags[category.type].map((t) => t.name)
                : []
            "
            :selected-tag="selectedTag.tagName"
            @tags-updated="onTagsUpdated"
            @tag-selected="handleTagSelected"
          />
          <comic-tag-menu
            class="mt-2"
            :category-type="selectedTag.categoryType"
            :tag="selectedTag.tagName"
            :comic-id="comicId"
            :disabled="!selectedTag.tagName"
            @cancel-selection="cancelTagSelection"
            @delete="handleTagDelete"
            @search="handleTagSearch"
          />

          <div class="pt-4">
            <span class="comic-detail-text">叙述:</span>
            <p class="comic-detail-text">
              {{ comicDetail.narrate }}
            </p>
          </div>

          <ComicMetadata :comic-detail="comicDetail" />

          <ComicActions :comic-id="comicId" />
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <!-- You can add a loading skeleton here -->
  </div>
</template>
