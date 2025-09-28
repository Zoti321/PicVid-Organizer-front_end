<script setup>
import { ref, onMounted, onUnmounted, inject } from "vue"
import { useRoute } from "vue-router"
import ComicReaderToolBarSide from "@/components/ComicReaderToolBar/ComicReaderToolBarSide.vue"
import comicsAPI from "@/api/comics.js"

// 组件注入函数方法
const toggleSideMenu = inject("toggleSideMenu")

// 侧边栏组件
const asideToolBar = ref(null)

function openAsideToolBar() {
  asideToolBar.value.changeVisble()
}

// 通过路由获取漫画id
const route = useRoute()
const id = route.params.id

// 组件变量
const comicName = ref("")
const comicContentImagesData = ref([])
const currentPage = ref(1)
const imgRatio = ref(100)
const loaded = ref(false)

// 请求数据
async function getComicData() {
  try {
    const [comicDetail, comicPages] = await Promise.all([
      comicsAPI.getComicById(id),
      comicsAPI.getComicPages(id),
    ])
    comicName.value = comicDetail.name
    comicContentImagesData.value = comicPages.pages
    loaded.value = true
  } catch (error) {
    console.error(error)
    loaded.value = false
  }
}

// 组件函数方法
// 跳转到对应的漫画页
const handleCurrentPageChange = (newPage) => {
  currentPage.value = newPage
  const targetImage = document.getElementById(`comic-page-${newPage - 1}`)
  if (targetImage) {
    targetImage.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

// 回到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// 根据视口中心调整当前页面
function handleScroll() {
  let closetImageIndex = 0
  let minDistance = Infinity
  if (comicContentImagesData.value) {
    for (let i = 0; i < comicContentImagesData.value.length; i++) {
      const imgElement = document.getElementById(`comic-page-${i}`)
      if (imgElement) {
        const rect = imgElement.getBoundingClientRect()
        const imgCenterY = rect.top + rect.height / 2
        const viewportCenterY = window.innerHeight / 2
        const distance = Math.abs(imgCenterY - viewportCenterY)

        if (distance < minDistance) {
          minDistance = distance
          closetImageIndex = i
        }
      }
    }
  }
  currentPage.value = closetImageIndex + 1
}

// 组件挂载钩子函数
onMounted(() => {
  getComicData()
  toggleSideMenu(false)
  window.addEventListener("scroll", handleScroll)
})

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
  toggleSideMenu(true)
})
</script>

<template>
  <section v-if="loaded" class="relative">
    <figure
      id="comic"
      class="relative mx-auto my-0 max-w-[1000px] rounded-xl bg-white p-1 shadow-md transition-all duration-300 ease-linear"
      @click="openAsideToolBar"
    >
      <figcaption
        class="relative mb-8 border-b border-solid border-[#eee] px-0 py-4 text-center text-2xl font-bold text-[#333] after:absolute after:-bottom-px after:left-1/2 after:h-[3px] after:w-[100px] after:-translate-x-1/2 after:rounded-[3px] after:bg-gradient-to-t after:from-[#ff7a00] after:to-[#ff9e00] after:content-['']"
      >
        {{ comicName }}
      </figcaption>
      <div class="flex flex-col items-center gap-1">
        <img
          v-for="(img, index) in comicContentImagesData"
          :id="`comic-page-${index}`"
          :key="index"
          :src="img"
          :alt="index"
          class="h-auto max-w-full object-contain transition-transform duration-300 ease-linear"
        />
      </div>
    </figure>
    <ComicReaderToolBarSide
      ref="asideToolBar"
      :loaded="loaded"
      :comic-id="id"
      :pages="comicContentImagesData.length"
      :current-page="currentPage"
      @scroll-to-top="scrollToTop"
      @current-page-change="handleCurrentPageChange"
    />
  </section>
</template>

<style scoped>
.comic-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  position: relative;
}

.comic-title::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, #ff7a00, #ff9e00);
  border-radius: 3px;
}

.comic-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.comic-content img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
}

/* 添加响应式设计 */
@media (max-width: 768px) {
  .comic {
    padding: 15px;
    border-radius: 8px;
  }

  .comic-title {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .comic-content {
    gap: 15px;
  }

  .comic-reader-toolbar {
    right: 20px;
  }
}

/* 添加加载动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.comic-content img {
  animation: fadeIn 0.5s ease-out;
  animation-fill-mode: both;
}

.comic-content img:nth-child(1) {
  animation-delay: 0.1s;
}

.comic-content img:nth-child(2) {
  animation-delay: 0.2s;
}

.comic-content img:nth-child(3) {
  animation-delay: 0.3s;
}

.comic-content img:nth-child(4) {
  animation-delay: 0.4s;
}

.comic-content img:nth-child(5) {
  animation-delay: 0.5s;
}

.comic-content img:nth-child(n + 6) {
  animation-delay: 0.6s;
}
</style>
