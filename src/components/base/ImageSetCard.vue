<script setup>
import { defineModel, ref } from "vue"
import { Icon } from "@iconify/vue"
import { useRouter } from "vue-router"
import DialogDeleteImageSet from "../dialog/DialogDeleteImageSet.vue"

// 路由
const router = useRouter()

// 组件 props
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  coverUrl: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    default: () => [],
  },
})

// v-model for is_starred
const is_starred = defineModel("is_starred", { type: Boolean, default: false })

// 组件函数
const changeStar = () => {
  is_starred.value = !is_starred.value
}
// 页面跳转
const jumpToImageSetPage = () => {
  // Assuming a route for image set detail page exists or will be created
  router.push({ path: `/image-set/${props.id}` })
}

// 图集删除对话框
const deleteImageSetDialog = ref(null)
const openDeleteImageSetDialog = () => {
  deleteImageSetDialog.value.open()
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
  <DialogDeleteImageSet
    ref="deleteImageSetDialog"
    :image-set="{ id: props.id, name: props.name }"
  />
  <article class="relative mb-10 h-80 w-60">
    <div class="relative h-[290px] w-full">
      <img
        :src="props.coverUrl"
        :alt="props.name"
        :title="props.name"
        class="h-full w-full cursor-pointer rounded-md object-cover transition-all duration-300 ease-in-out hover:-translate-y-1"
        @click="jumpToImageSetPage"
      />
      <div
        class="absolute right-1.5 bottom-1.5 z-50 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-gray-400/80 transition-all duration-300 ease-in-out"
        @click="changeStar"
      >
        <el-icon :color="is_starred ? 'rgb(255, 122, 0)' : '#000'">
          <Icon icon="material-symbols:bookmark-star-outline" />
        </el-icon>
      </div>
      <div
        class="absolute top-1.5 right-1.5 z-50 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-gray-400/80 transition-all duration-300 ease-in-out"
        @click="openDeleteImageSetDialog"
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
        {{ props.name }}
      </p>
    </div>
    <div class="tag-list-container relative w-full">
      <ul
        class="no-scrollbar m-0 flex h-full w-full list-none items-center justify-start gap-1 overflow-auto py-1 whitespace-nowrap"
        @wheel.prevent="handleWheelScroll"
      >
        <li
          v-for="tag in props.tags"
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
