<script setup>
import { ref, onMounted, computed } from "vue"
import comicsAPI from "@/api/comics.js"
import imageSetsAPI from "@/api/imageSets.js"
import categoryTagsAPI from "@/api/categoryTags.js"
import { useHistory } from "@/composables/useHistory.js"
import _ from "lodash"
import { Icon } from "@iconify/vue"
import { ElMessage, ElMessageBox } from "element-plus"

// =======================================================================
// State
// =======================================================================

// --- Statistics State ---
const stats = ref({
  comicCount: 0,
  imageSetCount: 0,
  categoryTagCount: 0,
})
const recentTopTags = ref([])
const isLoading = ref(true)

// --- Bulk Operations State ---
const selectedResourceType = ref("comics")
const tableData = ref([])
const isTableLoading = ref(false)
const selectedItems = ref([])
const showBatchR18Dialog = ref(false)
const batchR18Value = ref(false)

const { getHistory } = useHistory()

const resourceCategory = computed(() => {
  if (selectedResourceType.value.startsWith("category-tags")) {
    return "tags"
  }
  return selectedResourceType.value
})

// =======================================================================
// API & Methods
// =======================================================================

async function getSpecificCategoryTags(tagType) {
  const allTagsData = await categoryTagsAPI.getCategoryTags()
  return allTagsData[tagType] || []
}

const apiMap = {
  comics: {
    getAll: comicsAPI.getComics,
    delete: comicsAPI.deleteComic,
    update: comicsAPI.updateComic,
  },
  "image-sets": {
    getAll: imageSetsAPI.getImageSets,
    delete: imageSetsAPI.deleteImageSet,
    update: imageSetsAPI.updateImageSet,
  },
  "category-tags-general": {
    getAll: () => getSpecificCategoryTags("tags"),
  },
  "category-tags-author": {
    getAll: () => getSpecificCategoryTags("authors"),
  },
  "category-tags-series": {
    getAll: () => getSpecificCategoryTags("series"),
  },
  "category-tags-character": {
    getAll: () => getSpecificCategoryTags("characters"),
  },
}

// --- Statistics Methods ---
async function fetchStats() {
  try {
    const [comics, imageSets, allTagsData] = await Promise.all([
      comicsAPI.getComics().catch(() => []),
      imageSetsAPI.getImageSets().catch(() => []),
      categoryTagsAPI
        .getCategoryTags()
        .catch(() => ({ tags: [], authors: [], series: [], characters: [] })),
    ])
    stats.value.comicCount = comics.length
    stats.value.imageSetCount = imageSets.length
    stats.value.categoryTagCount =
      (allTagsData.tags?.length || 0) +
      (allTagsData.authors?.length || 0) +
      (allTagsData.series?.length || 0) +
      (allTagsData.characters?.length || 0)
  } catch (error) {
    console.error("Failed to fetch core stats:", error)
  }
}

function analyzeHistory() {
  const history = getHistory(20)
  if (!history || history.length === 0) return

  const allCategoryTags = _.flatMap(history, (item) => [
    ...(item.tags || []),
    ...(item.series || []),
    ...(item.characters || []),
    ...(item.authors || []),
  ])

  const tagCounts = _.countBy(allCategoryTags, "name")

  recentTopTags.value = _.chain(tagCounts)
    .map((count, name) => ({ name, count }))
    .orderBy("count", "desc")
    .take(5)
    .value()
}

// --- Bulk Operations Methods ---
async function fetchTableData() {
  isTableLoading.value = true
  try {
    const api = apiMap[selectedResourceType.value].getAll
    tableData.value = await api()
  } catch (error) {
    console.error(`Failed to fetch ${selectedResourceType.value}:`, error)
    tableData.value = []
  } finally {
    isTableLoading.value = false
  }
}

function handleResourceTypeChange() {
  tableData.value = []
  selectedItems.value = []
  fetchTableData()
}

function handleSelectionChange(selection) {
  selectedItems.value = selection
}

async function handleBatchDelete() {
  try {
    await ElMessageBox.confirm(
      `您确定要永久删除这 ${selectedItems.value.length} 个项目吗？此操作不可撤销。`,
      "确认删除",
      { type: "warning" },
    )

    let deletePromises
    if (resourceCategory.value === "tags") {
      const typeMapping = {
        general: "tags",
        author: "authors",
        series: "series",
        character: "characters",
      }
      const tagTypeKey = selectedResourceType.value.split("-")[2]
      const apiTagType = typeMapping[tagTypeKey]
      deletePromises = selectedItems.value.map((item) =>
        categoryTagsAPI.deleteCategoryTag(apiTagType, item.name),
      )
    } else {
      deletePromises = selectedItems.value.map((item) =>
        apiMap[selectedResourceType.value].delete(item.id),
      )
    }

    await Promise.all(deletePromises)

    ElMessage.success("批量删除成功")
    await fetchTableData() // Refresh table
    selectedItems.value = []
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("批量删除失败")
    }
  }
}

async function handleBatchModifyR18() {
  let modifyPromises
  if (resourceCategory.value === "tags") {
    if (selectedResourceType.value === "category-tags-general") {
      modifyPromises = selectedItems.value.map((item) =>
        categoryTagsAPI.updateCategoryTag("tags", item.name, batchR18Value.value),
      )
    } else {
      return // Should not happen as button is disabled
    }
  } else {
    modifyPromises = selectedItems.value.map((item) =>
      apiMap[selectedResourceType.value].update(item.id, {
        is_r18: batchR18Value.value,
      }),
    )
  }

  await Promise.all(modifyPromises)

  ElMessage.success("批量修改成功")
  showBatchR18Dialog.value = false
  await fetchTableData() // Refresh table
  selectedItems.value = []
}

/**
 * Formats a date string into yyyy-mm-dd.
 * @param {object} row - The table row data.
 * @param {object} column - The table column data.
 * @param {string} cellValue - The value of the cell (the date string).
 */
function formatDate(row, column, cellValue) {
  if (!cellValue) return ""
  const date = new Date(cellValue)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  return `${year}-${month}-${day}`
}

// =======================================================================
// Lifecycle
// =======================================================================

onMounted(async () => {
  isLoading.value = true
  await fetchStats()
  analyzeHistory()
  await fetchTableData()
  isLoading.value = false
})
</script>

<template>
  <div class="p-6 md:p-8">
    <h1 class="mb-8 text-3xl font-bold text-gray-800 dark:text-gray-200">
      资源管理
    </h1>

    <!-- Statistics Section -->
    <section>
      <h2 class="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-300">
        数据概览
      </h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <!-- Core Stats -->
        <el-card shadow="hover">
          <el-statistic title="漫画总数" :value="stats.comicCount" />
        </el-card>
        <el-card shadow="hover">
          <el-statistic title="图集总数" :value="stats.imageSetCount" />
        </el-card>
        <el-card shadow="hover">
          <el-statistic title="分类标签总数" :value="stats.categoryTagCount" />
        </el-card>

        <!-- Recent Reading Analysis -->
        <el-card shadow="hover" class="md:col-span-2 lg:col-span-1">
          <template #header>
            <div class="flex items-center gap-2">
              <Icon icon="mdi:fire" class="text-orange-500" />
              <span class="font-semibold text-gray-600">近期阅读偏好</span>
            </div>
          </template>
          <ul v-if="recentTopTags.length > 0" class="space-y-2">
            <li
              v-for="tag in recentTopTags"
              :key="tag.name"
              class="flex items-center justify-between text-sm"
            >
              <span class="text-gray-700">{{ tag.name }}</span>
              <span class="font-medium text-gray-500">{{ tag.count }} 次</span>
            </li>
          </ul>
          <el-empty v-else description="暂无历史记录" :image-size="60" />
        </el-card>
      </div>
    </section>

    <!-- Spacer -->
    <el-divider class="my-10" />

    <!-- Bulk Operations Section -->
    <section>
      <h2 class="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-300">
        批量管理
      </h2>

      <!-- Controls -->
      <div
        class="mb-4 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm"
      >
        <div class="flex items-center gap-4">
          <el-select
            v-model="selectedResourceType"
            style="width: 140px"
            @change="handleResourceTypeChange"
          >
            <el-option label="漫画" value="comics" />
            <el-option label="图集" value="image-sets" />
            <el-option-group label="分类标签">
              <el-option label="通用标签" value="category-tags-general" />
              <el-option label="作者标签" value="category-tags-author" />
              <el-option label="系列标签" value="category-tags-series" />
              <el-option label="角色标签" value="category-tags-character" />
            </el-option-group>
          </el-select>
          <span v-if="selectedItems.length > 0" class="text-sm text-gray-500"
            >已选择 {{ selectedItems.length }} 项</span
          >
        </div>
        <div class="flex items-center gap-2">
          <el-button
            type="danger"
            :disabled="selectedItems.length === 0"
            @click="handleBatchDelete"
            >批量删除
          </el-button>
          <el-button
            type="primary"
            plain
            :disabled="
              selectedItems.length === 0 ||
              (resourceCategory === 'tags' &&
                selectedResourceType !== 'category-tags-general')
            "
            @click="showBatchR18Dialog = true"
          >
            修改R18属性
          </el-button>
        </div>
      </div>

      <!-- Data Table -->
      <div v-if="resourceCategory !== 'tags'">
        <el-table
          v-loading="isTableLoading"
          :data="tableData"
          border
          stripe
          style="width: 100%"
          height="500"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column prop="id" label="ID" width="80" sortable />
          <el-table-column prop="name" label="名称" show-overflow-tooltip />
          <el-table-column
            prop="is_r18"
            label="R18"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-tag :type="row.is_r18 ? 'danger' : 'success'">{{
                row.is_r18 ? "是" : "否"
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="tags" label="标签">
            <template #default="{ row }">
              <el-tag
                v-for="tag in row.tags.slice(0, 3)"
                :key="tag.name"
                size="small"
                class="mr-1"
                >{{ tag.name }}
              </el-tag>
              <el-tag v-if="row.tags.length > 3" size="small">...</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="add_date"
            label="添加日期"
            width="180"
            sortable
            :formatter="formatDate"
          />
        </el-table>
      </div>
      <div v-else>
        <el-table
          v-loading="isTableLoading"
          :data="tableData"
          border
          stripe
          style="width: 100%"
          height="500"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column prop="id" label="ID" width="80" sortable />
          <el-table-column prop="name" label="名称" show-overflow-tooltip />
          <el-table-column
            prop="is_r18"
            label="R18"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-tag :type="row.is_r18 ? 'danger' : 'success'">{{
                row.is_r18 ? "是" : "否"
              }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </section>

    <!-- Batch Modify R18 Dialog -->
    <el-dialog
      v-model="showBatchR18Dialog"
      title="批量修改R18属性"
      width="400px"
      align-center
    >
      <div class="flex flex-col items-center gap-4">
        <p>将 {{ selectedItems.length }} 个项目的R18属性统一设置为:</p>
        <el-switch v-model="batchR18Value" size="large" />
      </div>
      <template #footer>
        <el-button @click="showBatchR18Dialog = false">取消</el-button>
        <el-button type="primary" @click="handleBatchModifyR18"
          >确认修改</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
