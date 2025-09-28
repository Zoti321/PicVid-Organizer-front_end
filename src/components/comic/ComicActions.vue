<script setup>
import { useRouter } from "vue-router"
import comicsAPI from "@/api/comics.js"
import { Icon } from "@iconify/vue"

const props = defineProps({
  comicId: {
    type: [String, Number],
    required: true,
  },
})

const router = useRouter()

// Increase read frequency
const increaseReadFrequency = async () => {
  await comicsAPI.increaseReadFrequency(props.comicId)
}

// Navigate to reader page
const readComic = () => {
  router.push(`/comic-reader/${props.comicId}`)
  increaseReadFrequency()
}
const readComicScrollMode = () => {
  router.push(`/comic-reader-scroll/${props.comicId}`)
  increaseReadFrequency()
}
</script>

<template>
  <div class="mt-4 flex justify-start gap-4 border-t border-gray-200 pt-6">
    <el-button class="btn-read-comic" @click="readComic">
      <Icon icon="mdi:book-open-page-variant-outline" class="mr-2" />
      开始阅读
    </el-button>
    <el-button class="btn-read-comic" @click="readComicScrollMode">
      <Icon icon="mdi:view-carousel-outline" class="mr-2" />
      条漫模式
    </el-button>
  </div>
</template>

<style scoped></style>
