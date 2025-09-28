<script setup>
import { computed } from "vue"
import { Icon } from "@iconify/vue"

const props = defineProps({
  comicDetail: {
    type: Object,
    required: true,
  },
})
const formattedAddDate = computed(() => {
  if (props.comicDetail && props.comicDetail.add_date) {
    const date = new Date(props.comicDetail.add_date)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    return `${year}-${month}-${day}`
  }
  return ""
})
</script>

<template>
  <div class="flex flex-col space-y-2 text-base">
    <div class="flex items-center gap-3">
      <span class="comic-detail-text">页数:</span>
      <span class="comic-detail-text">{{ comicDetail.pages }}</span>
    </div>
    <div class="flex items-center gap-3">
      <span class="comic-detail-text">添加日期:</span>
      <span class="comic-detail-text">{{ formattedAddDate }}</span>
    </div>
    <div class="flex items-center gap-3">
      <span class="comic-detail-text"> 阅读次数: </span>
      <span class="comic-detail-text">
        {{ comicDetail.read_frequency }}
      </span>
    </div>
  </div>
</template>
