<script setup>
import { ref, watch, computed } from "vue"
import { Icon } from "@iconify/vue"
import categoryTagsAPI from "@/api/categoryTags.js"
import { useR18ModeStore } from "@/stores/r18ModeStore.js"
import DialogUploadComic from "@/components/dialog/DialogUploadComic.vue"
import DialogAddCategoryTag from "@/components/dialog/DialogAddCategoryTag.vue"

// =======================================================================
// Props and Emits
// =======================================================================

defineProps({
  comicNumber: {
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
const uploadComicDialog = ref(null)
const addTagDialog = ref(null)

// Ranking component state
const activeRankingType = ref("tags")
const rankingData = ref({
  tags: [],
  authors: [],
  series: [],
  characters: [],
})
const rankingTypes = [
  { label: "标签", name: "tags" },
  { label: "作者", name: "authors" },
  { label: "系列", name: "series" },
  { label: "角色", name: "characters" },
]

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
// Computed
// =======================================================================

const currentRankingList = computed(() => {
  return rankingData.value[activeRankingType.value] || []
})

const rankingTitle = computed(() => {
  const current = rankingTypes.find((t) => t.name === activeRankingType.value)
  return current ? `${current.label}排行榜` : "排行榜"
})

// =======================================================================
// Methods
// =======================================================================

async function fetchRankingData(type) {
  if (rankingData.value[type] && rankingData.value[type].length > 0) {
    return
  }
  try {
    const res = await categoryTagsAPI.getCategoryTags({
      mode: "rank",
      limit: 3,
      r18: r18ModeStore.isR18,
      type: type,
    })
    rankingData.value[type] = res[type]
  } catch (error) {
    console.error(`Failed to fetch ${type} ranking:`, error)
  }
}

function handleChangeSort(command) {
  emit("change-sort", command)
}

function handleUploadSuccess() {
  emit("refresh-data")
}

// =======================================================================
// Watchers & Lifecycle
// =======================================================================

watch(activeRankingType, (newType) => {
  fetchRankingData(newType)
})

// Fetch initial ranking data on mount
fetchRankingData(activeRankingType.value)
</script>

<template>
  <!-- Dialogs -->
  <DialogUploadComic
    ref="uploadComicDialog"
    @upload-success="handleUploadSuccess"
  />
  <DialogAddCategoryTag ref="addTagDialog" />

  <!-- Header -->
  <div
    class="mb-8 box-border flex h-auto w-full flex-col items-center justify-between gap-4 rounded-lg bg-white p-5 shadow-md transition-all duration-300 ease-linear hover:shadow-lg md:h-[70px] md:flex-row md:gap-0"
  >
    <div class="flex w-full items-center justify-center md:w-auto">
      <el-button-group>
        <el-button @click="uploadComicDialog.openDialog()">
          <el-icon class="el-icon--left">
            <Icon icon="ep:folder-add" />
          </el-icon>
          添加漫画
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
        <el-dropdown
          trigger="click"
          @command="(command) => (activeRankingType = command)"
        >
          <el-button>
            <el-icon class="el-icon--left">
              <Icon icon="ep:histogram" />
            </el-icon>
            切换排行
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in rankingTypes"
                :key="item.name"
                :command="item.name"
                :disabled="activeRankingType === item.name"
                >{{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-button-group>
    </div>
    <div class="flex w-full items-center justify-center gap-5 md:w-auto">
      <div
        class="min-w-full rounded-lg bg-slate-100 p-2.5 px-4 transition-colors duration-300 hover:bg-slate-200/60 md:min-w-[250px]"
      >
        <h3 class="tag-ranking-title">{{ rankingTitle }}</h3>
        <ul class="m-0 flex list-none items-start justify-start gap-2 p-0">
          <li
            v-for="item in currentRankingList"
            :key="item.name"
            class="flex w-full items-center gap-1.5 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div
              class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-orange-500/15 p-0.5 text-xs font-semibold text-orange-600"
            >
              {{ item.count }}
            </div>
            <el-tag
              type="info"
              effect="dark"
              class="w-full overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {{ item.name }}
            </el-tag>
          </li>
        </ul>
      </div>
      <el-statistic title="作品合计" :value="comicNumber"></el-statistic>
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
