<script setup>
import { computed } from "vue"
import { useRouter } from "vue-router"
import { Icon } from "@iconify/vue"
import imageSetsAPI from "@/api/imageSets.js"
import InlineTagAdder from "@/components/base/InlineTagAdder.vue"

const props = defineProps({
  imageSet: {
    type: Object,
    required: true,
  },
  allCategoryTags: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(["open-add-images-dialog", "tag-updated"])

const router = useRouter()

const tagCategories = computed(() => [
  { type: "series", label: "系列", items: props.imageSet?.series },
  { type: "authors", label: "作者", items: props.imageSet?.authors },
  { type: "characters", label: "角色", items: props.imageSet?.characters },
  { type: "tags", label: "标签", items: props.imageSet?.tags },
])

const formattedAddDate = computed(() => {
  if (!props.imageSet?.add_date) return ""
  return new Date(props.imageSet.add_date).toLocaleDateString()
})

async function handleTagUpdate(categoryType, newTagList) {
  try {
    const payload = { [categoryType]: newTagList.map((name) => ({ name })) }
    await imageSetsAPI.updateImageSet(props.imageSet.id, payload)
    emit("tag-updated", categoryType, newTagList)
  } catch (error) {
    console.error(`Failed to update tags for ${categoryType}:`, error)
  }
}
</script>

<template>
  <el-card shadow="never" class="mb-8 border-gray-200 bg-gray-50">
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h1 class="m-0 text-2xl font-bold text-gray-800">
          {{ imageSet.name }}
        </h1>
        <div class="flex items-center gap-2">
          <el-button type="success" plain @click="$emit('open-add-images-dialog')">
            <Icon
              icon="material-symbols:add-photo-alternate-outline"
              class="mr-1"
            />
            追加图片
          </el-button>
          <el-button type="primary" plain @click="router.back()"
            >返回列表
          </el-button>
        </div>
      </div>
    </template>
    <div class="flex flex-col gap-6 md:flex-row md:gap-8">
      <!-- Left Column: Cover Image -->
      <div
        v-if="imageSet.cover_url"
        class="mx-auto w-full max-w-xs flex-shrink-0 md:mx-0 md:w-60"
      >
        <img
          :src="imageSet.cover_url"
          alt="封面"
          class="h-auto w-full rounded-md object-cover shadow-md"
        />
      </div>

      <!-- Right Column: Metadata -->
      <div class="flex-grow space-y-4">
        <div
          v-for="category in tagCategories"
          :key="category.type"
          class="flex flex-wrap items-start gap-2"
        >
          <span class="flex-shrink-0 pt-1 font-semibold text-gray-600"
            >{{ category.label }}:</span
          >
          <div class="flex flex-wrap items-center gap-2">
            <el-tag
              v-for="item in category.items || []"
              :key="item.name"
              type="info"
              effect="light"
              size="large"
            >
              {{ item.name }}
            </el-tag>
            <InlineTagAdder
              :model-value="(category.items || []).map((t) => t.name)"
              :options="
                allCategoryTags[category.type]
                  ? allCategoryTags[category.type].map((t) => t.name)
                  : []
              "
              @update:model-value="
                (newTagList) => handleTagUpdate(category.type, newTagList)
              "
            />
          </div>
        </div>

        <el-divider class="my-2" />
        <div class="flex items-center gap-6 text-sm text-gray-500">
          <div class="flex items-center gap-1">
            <Icon icon="material-symbols:imagesmode-outline" />
            <span>共 {{ imageSet.pages }} 张</span>
          </div>
          <div class="flex items-center gap-1">
            <Icon icon="material-symbols:calendar-month-outline" />
            <span>添加于 {{ formattedAddDate }}</span>
          </div>
          <el-tag v-if="imageSet.is_r18" type="danger" effect="dark"
            >R-18
          </el-tag>
        </div>
      </div>
    </div>
  </el-card>
</template>
