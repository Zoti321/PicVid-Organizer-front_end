<script setup>
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import comicsAPI from "@/api/comics.js"
import { useHistory } from "@/composables/useHistory.js"
import { useSettingsStore } from "@/stores/settingsStore.js"
import { ElMessage } from "element-plus"
import CustomCardCarousel from "@/components/base/CustomCardCarousel.vue"

const router = useRouter()
const { getHistory } = useHistory()
const settingsStore = useSettingsStore()

const randomComics = ref([])
const recentlyAddedComics = ref([])
const browsingHistory = ref([])

// =======================================================================
// Data Fetching
// =======================================================================

async function fetchRandomComics() {
  try {
    const data = await comicsAPI.getComics({
      mode: "random",
      count: settingsStore.carouselItemCount,
    })
    randomComics.value = data
  } catch (error) {
    handleError(error, "获取随机漫画失败")
  }
}

async function fetchRecentlyAddedComics() {
  try {
    const data = await comicsAPI.getComics()
    recentlyAddedComics.value = data.slice(
      0,
      settingsStore.homepageSectionItemCount,
    )
  } catch (error) {
    handleError(error, "获取最近添加的漫画失败")
  }
}

function loadBrowsingHistory() {
  browsingHistory.value = getHistory(settingsStore.homepageSectionItemCount)
}

// =======================================================================
// Navigation & Error Handling
// =======================================================================

function navigateToDetail(item) {
  // The carousel component emits the raw item, which might not have the 'type' property.
  // We know it's a comic in this context.
  const itemWithType = { ...item, type: item.type || "comic" }

  if (!itemWithType.id || !itemWithType.type) {
    console.error("无效的导航项目:", itemWithType)
    return
  }

  switch (itemWithType.type) {
    case "comic":
      router.push({ path: `/comic/${itemWithType.id}` })
      break
    default:
      console.warn(`未知的媒体类型: ${itemWithType.type}`)
  }
}

function handleError(error, message) {
  console.error(message, error)
  if (error.response && error.response.status === 404) {
    return
  }
  ElMessage({
    message: `${message}: ${error.message}`,
    type: "error",
  })
}

/**
 * Handles horizontal scrolling via the vertical mouse wheel.
 * @param {WheelEvent} event
 */
function handleWheelScroll(event) {
  const element = event.currentTarget
  if (element.scrollWidth > element.clientWidth) {
    event.preventDefault()
    element.scrollLeft += event.deltaY
  }
}

onMounted(() => {
  fetchRandomComics()
  fetchRecentlyAddedComics()
  loadBrowsingHistory()
})
</script>

<template>
  <div class="p-5">
    <!-- Custom Card Carousel -->
    <CustomCardCarousel
      :items="randomComics"
      title="随机推荐"
      autoplay
      @item-click="navigateToDetail"
    />

    <!-- 最近添加 -->
    <div
      v-if="settingsStore.showRecentlyAdded && recentlyAddedComics.length > 0"
      class="mb-10"
    >
      <h2 class="mb-4 text-2xl font-semibold text-slate-700">最近添加</h2>
      <div
        class="horizontal-scroll-container flex gap-5 overflow-x-auto pb-4"
        @wheel="handleWheelScroll"
      >
        <div
          v-for="comic in recentlyAddedComics"
          :key="comic.id"
          class="w-40 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg bg-slate-50 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
          @click="navigateToDetail({ ...comic, type: 'comic' })"
        >
          <img
            :src="comic.cover_url"
            :alt="comic.name"
            class="h-56 w-full object-cover"
          />
          <p
            class="m-0 overflow-hidden p-2 text-center text-sm text-ellipsis whitespace-nowrap text-slate-600"
          >
            {{ comic.name }}
          </p>
        </div>
      </div>
    </div>

    <!-- 历史浏览 -->
    <div
      v-if="settingsStore.showBrowsingHistory && browsingHistory.length > 0"
      class="mb-10"
    >
      <h2 class="mb-4 text-2xl font-semibold text-slate-700">历史浏览</h2>
      <div
        class="horizontal-scroll-container flex gap-5 overflow-x-auto pb-4"
        @wheel="handleWheelScroll"
      >
        <div
          v-for="item in browsingHistory"
          :key="`${item.type}-${item.id}`"
          class="w-40 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg bg-slate-50 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
          @click="navigateToDetail(item)"
        >
          <img
            :src="item.cover_url"
            :alt="item.name"
            class="h-56 w-full object-cover"
          />
          <p
            class="m-0 overflow-hidden p-2 text-center text-sm text-ellipsis whitespace-nowrap text-slate-600"
          >
            {{ item.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.horizontal-scroll-container {
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
}
</style>
