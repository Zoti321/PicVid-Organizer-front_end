<script setup>
import { ref, onMounted, onUnmounted, watch, inject } from "vue"
import { useRoute } from "vue-router"
import { useMagicKeys, useIntervalFn } from "@vueuse/core"
import comicsAPI from "@/api/comics.js"
import { Icon } from "@iconify/vue"
import { useUiStore } from "@/stores/uiStore.js"

const toggleSideMenu = useUiStore().toggleSideMenu

// Route
const route = useRoute()
const comicId = route.params.id

// Component state
const comicImgsData = ref([])
const currentPage = ref(1)
const comicPages = ref(0)
const loaded = ref(false)
const isAutoPlay = ref(false)
const scale = ref(1)
const toolbarVisible = ref(true)

// Fetch comic pages
async function getComicPages() {
  try {
    const res = await comicsAPI.getComicPages(comicId)
    comicImgsData.value = res.pages
    comicPages.value = res.pages.length
    loaded.value = true
  } catch (error) {
    console.error(error)
  }
}

// Page navigation
const nextPage = () => {
  if (currentPage.value < comicPages.value) {
    currentPage.value++
  }
}
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Autoplay
const { pause, resume } = useIntervalFn(
  () => {
    nextPage()
  },
  3000,
  { immediate: false },
)

watch(isAutoPlay, (value) => {
  if (value) {
    resume()
  } else {
    pause()
  }
})

// Keyboard navigation
const { ArrowLeft, ArrowRight } = useMagicKeys()
watch(ArrowLeft, (v) => v && prevPage())
watch(ArrowRight, (v) => v && nextPage())

// Zoom
const zoomIn = () => (scale.value = Math.min(scale.value + 0.1, 2))
const zoomOut = () => (scale.value = Math.max(scale.value - 0.1, 0.5))

// Lifecycle hooks
onMounted(() => {
  toggleSideMenu(false)
  getComicPages()
})
onUnmounted(() => {
  toggleSideMenu(true)
})
</script>

<template>
  <div
    class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-100"
  >
    <div v-if="!loaded" class="flex h-full items-center justify-center"></div>
    <template v-else>
      <div
        class="flex w-full flex-grow items-center justify-center"
        @click="toolbarVisible = !toolbarVisible"
        @wheel.prevent="(e) => (e.deltaY > 0 ? nextPage() : prevPage())"
      >
        <img
          :src="comicImgsData[currentPage - 1]"
          :alt="`漫画第${currentPage}页`"
          class="max-h-[calc(100vh-120px)] max-w-full object-contain transition-transform duration-300"
          :style="{ transform: `scale(${scale})` }"
        />
      </div>
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-300 ease-in"
        enter-from-class="opacity-0 translate-y-full"
        enter-to-class="opacity-100 translate-y-0"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-full"
      >
        <div
          v-show="toolbarVisible"
          class="fixed bottom-5 left-1/2 w-[750px] -translate-x-1/2 rounded-lg bg-white/80 p-4 shadow-lg backdrop-blur-sm"
        >
          <el-slider
            v-model="currentPage"
            :min="1"
            :max="comicPages"
            class="mb-4"
          />
          <div class="flex items-center justify-between">
            <div class="text-lg font-semibold text-gray-800">
              {{ currentPage }} / {{ comicPages }}
            </div>
            <div class="flex gap-2">
              <el-button @click.stop="prevPage">
                <Icon icon="ep:arrow-left" />
              </el-button>
              <el-button @click.stop="isAutoPlay = !isAutoPlay">
                <Icon
                  :icon="
                    isAutoPlay ? 'ri:pause-large-line' : 'ri:play-large-line'
                  "
                />
              </el-button>
              <el-button @click.stop="nextPage">
                <Icon icon="ep:arrow-right" />
              </el-button>
            </div>
            <div class="flex gap-2">
              <el-button @click.stop="zoomOut">
                <Icon icon="ep:zoom-out" />
              </el-button>
              <el-button @click.stop="zoomIn">
                <Icon icon="ep:zoom-in" />
              </el-button>
            </div>
          </div>
        </div>
      </transition>
    </template>
  </div>
</template>
