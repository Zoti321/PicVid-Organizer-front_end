<script setup>
import InlineTagAdder from "@/components/base/InlineTagAdder.vue"
import comicsAPI from "@/api/comics.js"
import { Icon } from "@iconify/vue"

const props = defineProps({
  comicId: {
    type: [String, Number],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  categoryType: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    default: () => [],
  },
  allAvailableTags: {
    type: Array,
    default: () => [],
  },
  selectedTag: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(["tags-updated", "tag-selected"])

function selectTag(tagName) {
  emit("tag-selected", props.categoryType, tagName)
}

async function handleTagUpdate(newTagList) {
  try {
    const payload = {
      [props.categoryType]: newTagList.map((name) => ({ name })),
    }
    // 1. 调用 API 更新
    await comicsAPI.updateComic(props.comicId, payload)

    // 2. 通知父组件更新成功
    emit("tags-updated", props.categoryType, newTagList)
  } catch (error) {
    console.error(`Failed to update tags for ${props.categoryType}:`, error)
    // API 拦截器会自动显示错误消息
  }
}
</script>

<template>
  <div class="flex items-center gap-3 py-1.5">
    <span class="flex items-center">
      <el-icon color="#777">
        <Icon :icon="icon" />
      </el-icon>
    </span>
    <span class="comic-detail-text text-nowrap"> {{ title }}: </span>

    <div class="flex flex-wrap items-center gap-2">
      <span
        v-for="tag in tags"
        :key="tag.name"
        class="cursor-pointer rounded-sm border border-[#999999] bg-white px-2 py-1 text-sm text-[#999999] hover:border-[rgb(255,122,0)] hover:text-[rgb(255,122,0)]"
        :class="{ 'selected-tag': tag.name === selectedTag }"
        @click="selectTag(tag.name)"
      >
        {{ tag.name }}
      </span>
      <InlineTagAdder
        :model-value="tags.map((t) => t.name)"
        :options="allAvailableTags"
        @update:model-value="handleTagUpdate"
      />
    </div>
  </div>
</template>

<style scoped>
.selected-tag {
  background-color: rgb(51, 51, 51) !important;
  border-color: rgb(51, 51, 51) !important;
  color: white !important;
}
</style>
