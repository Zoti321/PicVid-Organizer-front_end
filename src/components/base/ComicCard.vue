<script setup>
import { defineModel, ref } from "vue"
import { Icon } from "@iconify/vue"
import { useRouter } from "vue-router"
import DialogDeleteComic from "../dialog/DialogDeleteComic.vue"

// 路由
const router = useRouter()

// 组件 props
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  comicCoverSrc: {
    type: String,
    required: true,
  },
  comicName: {
    type: String,
    required: true,
  },
  comicTags: {
    type: Array,
    default: () => [],
  },
})

// v-model for is_star
const is_star = defineModel("is_star", { type: Boolean, default: false })

// 组件函数
const changeStar = () => {
  is_star.value = !is_star.value
}
// 页面跳转
const jumpToComicPage = () => {
  router.push({ path: `/comic/${props.id}` })
}

// 漫画删除对话框
const delComicDialog = ref(null)
const openDelComicDialogVisible = () => {
  delComicDialog.value.open()
}

// Tag list horizontal scroll
const handleWheelScroll = (event) => {
  const element = event.currentTarget
  if (element.scrollWidth > element.clientWidth) {
    element.scrollLeft += event.deltaY
  }
}
</script>

<template>
  <DialogDeleteComic
    ref="delComicDialog"
    :comic-id="props.id"
    :comic-name="props.comicName"
  />
  <article class="relative mb-10 h-80 w-60">
    <div class="relative h-[290px] w-full">
      <img
        :src="props.comicCoverSrc"
        :alt="props.comicName"
        :title="props.comicName"
        class="h-full w-full cursor-pointer rounded-md object-cover transition-all duration-300 ease-in-out hover:-translate-y-1"
        @click="jumpToComicPage"
      />
      <div
        class="absolute right-1.5 bottom-1.5 z-50 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-gray-400/80 transition-all duration-300 ease-in-out"
        @click="changeStar"
      >
        <el-icon :color="is_star ? 'rgb(255, 122, 0)' : '#000'">
          <Icon icon="material-symbols:bookmark-star-outline" />
        </el-icon>
      </div>
      <div
        class="absolute top-1.5 right-1.5 z-50 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-gray-400/80 transition-all duration-300 ease-in-out"
        @click="openDelComicDialogVisible"
      >
        <el-icon>
          <Icon icon="line-md:document-delete" />
        </el-icon>
      </div>
    </div>
    <div class="w-full">
      <p
        class="m-0 w-full overflow-hidden pt-1 text-base text-ellipsis whitespace-nowrap text-gray-500"
      >
        {{ props.comicName }}
      </p>
    </div>
    <div class="tag-list-container relative w-full">
      <ul
        class="no-scrollbar m-0 flex h-full w-full list-none items-center justify-start gap-1 overflow-auto py-1 whitespace-nowrap"
        @wheel.prevent="handleWheelScroll"
      >
        <li
          v-for="tag in props.comicTags"
          :key="tag.name"
          class="max-w-20 cursor-pointer rounded-full bg-gray-600 px-2 py-0.5 text-xs text-white"
        >
          {{ tag.name }}
        </li>
      </ul>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.tag-list-container {
  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 2rem;
    height: 100%;
    background: linear-gradient(to left, white, rgba(255, 255, 255, 0));
    pointer-events: none;
  }
}

.no-scrollbar {
  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
