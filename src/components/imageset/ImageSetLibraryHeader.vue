<script setup>
import { ref } from "vue"
import { Icon } from "@iconify/vue"
import categoryTagsAPI from "@/api/categoryTags.js"
import { useR18ModeStore } from "@/stores/r18ModeStore.js"
import DialogUploadImageSet from "@/components/dialog/DialogUploadImageSet.vue"
import DialogAddCategoryTag from "@/components/dialog/DialogAddCategoryTag.vue"

// =======================================================================
// Props and Emits
// =======================================================================

defineProps({
  imageSetNumber: {
    type: Number,
    default: 0,
  },
  currentSort: { type: String, default: "" },
  currentOrder: { type: String, default: "" },
})

const emit = defineEmits(["change-sort", "refresh-data"])

// =======================================================================
// Stores
// =======================================================================
const r18ModeStore = useR18ModeStore()

// =======================================================================
// State
// =======================================================================

// Dialog visibility
const uploadImageSetDialog = ref(null)
const addTagDialog = ref(null)

// Ranking component state
const tagRanking = ref(null)

// Sort options
const sortOptions = [
  { label: "名称", value: "name" },
  { label: "添加日期", value: "add_date" },
]
const orderOptions = [
  { label: "递增", value: "asc" },
  { label: "递减", value: "desc" },
]

// =======================================================================
// Methods
// =======================================================================

async function getCategoryTags() {
  try {
    const res = await categoryTagsAPI.getCategoryTags({
      mode: "rank",
      ref_type: "imagesets",
      limit: 3,
      r18: r18ModeStore.isR18,
      type: "tags",
    })
    tagRanking.value = res.tags
  } catch (error) {
    console.error("Failed to fetch category tags:", error)
  }
}

function handleChangeSort(command) {
  emit("change-sort", command)
}

function handleUploadSuccess() {
  emit("refresh-data")
}

// =======================================================================
// Lifecycle
// =======================================================================

getCategoryTags()
</script>

<template>
  <!-- Dialogs -->
  <DialogUploadImageSet
    ref="uploadImageSetDialog"
    @upload-success="handleUploadSuccess"
  />
  <DialogAddCategoryTag ref="addTagDialog" />

  <!-- Header -->
  <div
    class="mb-8 box-border flex h-auto w-full flex-col items-center justify-between gap-4 rounded-lg bg-white p-5 shadow-md transition-all duration-300 ease-linear hover:shadow-lg md:h-[70px] md:flex-row md:gap-0"
  >
    <div class="flex w-full items-center justify-center md:w-auto">
      <el-button-group>
        <el-button @click="uploadImageSetDialog.openDialog()">
          <el-icon class="el-icon--left">
            <Icon icon="ep:folder-add" />
          </el-icon>
          添加图集
        </el-button>
        <el-button @click="addTagDialog.openDialog()">
          <el-icon class="el-icon--left">
            <Icon icon="ep:collection-tag" />
          </el-icon>
          添加Tag
        </el-button>
        <el-dropdown trigger="click" @command="handleChangeSort">
          <el-button>
            <el-icon class="el-icon--left">
              <Icon icon="ep:sort" />
            </el-icon>
            排序
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in sortOptions"
                :key="item.value"
                :command="item.value"
              >
                <div class="flex w-4 items-center">
                  <el-icon
                    v-if="item.value === currentSort"
                    class="el-icon--left"
                    size="6"
                  >
                    <Icon icon="ri:circle-fill" />
                  </el-icon>
                </div>
                {{ item.label }}
              </el-dropdown-item>
              <el-divider class="my-1" />
              <el-dropdown-item
                v-for="item in orderOptions"
                :key="item.value"
                :command="item.value"
              >
                <div class="flex w-4 items-center">
                  <el-icon
                    v-if="item.value === currentOrder"
                    class="el-icon--left"
                    size="6"
                  >
                    <Icon icon="ri:circle-fill" />
                  </el-icon>
                </div>
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-button-group>
    </div>
    <div class="flex w-full items-center justify-center gap-5 md:w-auto">
      <div
        class="min-w-full rounded-lg bg-slate-100 p-2.5 px-4 transition-colors duration-300 hover:bg-slate-200/60 md:min-w-[200px]"
      >
        <h3 class="tag-ranking-title">Tag排行榜</h3>
        <ul
          class="m-0 flex list-none flex-wrap items-center justify-start gap-2 p-0"
        >
          <li
            v-for="tag in tagRanking"
            :key="tag.name"
            class="flex items-center gap-1.5 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div
              class="rounded-full bg-orange-500/15 px-1.5 py-0.5 text-xs font-semibold text-orange-600"
            >
              {{ tag.count }}
            </div>
            <el-tag type="info" effect="dark">{{ tag.name }}</el-tag>
          </li>
        </ul>
      </div>
      <el-statistic title="作品合计" :value="imageSetNumber"></el-statistic>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tag-ranking-title {
  @apply relative mb-2 pl-2.5 text-sm leading-5 font-semibold text-gray-700;

  &::before {
    @apply absolute top-1/2 left-0 h-3.5 w-1 -translate-y-1/2 rounded-full bg-orange-500;
    content: "";
  }
}
</style>
