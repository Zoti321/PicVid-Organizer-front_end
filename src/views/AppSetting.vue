<script setup>
import { ref, watch } from "vue"
import { useR18ModeStore } from "@/stores/r18ModeStore.js"
import { useSettingsStore } from "@/stores/settingsStore.js"
import { useHistory } from "@/composables/useHistory.js"
import { useDark, useToggle } from "@vueuse/core"
import { ElMessageBox, ElMessage } from "element-plus"

// =======================================================================
// Stores and Composables
// =======================================================================
const r18ModeStore = useR18ModeStore()
const settingsStore = useSettingsStore()
const { clearHistory } = useHistory()

// =======================================================================
// State
// =======================================================================

// R18 Mode
const r18Mode = ref(r18ModeStore.isR18)

// Dark Mode
const isDarkMode = useDark()
const toggleDark = useToggle(isDarkMode)

// Homepage section item count
const itemCountOptions = [5, 10, 15, 20, 25, 30]

// =======================================================================
// Methods
// =======================================================================

/**
 * Handles clearing user browsing history with a confirmation dialog.
 */
async function handleClearHistory() {
  try {
    await ElMessageBox.confirm(
      "此操作将永久删除您的所有浏览记录，是否继续？",
      "确认清除",
      {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      },
    )
    clearHistory()
    ElMessage({ type: "success", message: "浏览记录已清除" })
  } catch (error) {
    // Catches the rejection from the dialog (user clicked cancel)
    ElMessage({ type: "info", message: "操作已取消" })
  }
}

// =======================================================================
// Watchers
// =======================================================================

// Sync local R18 mode state with the store
watch(r18Mode, (value) => {
  r18ModeStore.changeR18Mode(value)
})
</script>

<template>
  <div class="p-6 md:p-8">
    <h1 class="mb-8 text-3xl font-bold text-gray-800 dark:text-gray-200">
      设置
    </h1>

    <div class="max-w-2xl space-y-10">
      <!-- General Settings -->
      <section>
        <h2 class="setting-section-title">通用</h2>
        <div class="setting-item">
          <div class="setting-item-label">
            <p>R18模式</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              显示或隐藏R18+内容
            </p>
          </div>
          <el-switch v-model="r18Mode" size="large" />
        </div>
        <div class="setting-item">
          <div class="setting-item-label">
            <p>暗黑模式</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              切换浅色或深色主题
            </p>
          </div>
          <el-switch
            :model-value="isDarkMode"
            size="large"
            @change="toggleDark"
          />
        </div>
      </section>

      <!-- Homepage Display Settings -->
      <section>
        <h2 class="setting-section-title">主页显示</h2>
        <div class="setting-item">
          <div class="setting-item-label">
            <p>显示“最近添加”</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              在主页上显示“最近添加”模块
            </p>
          </div>
          <el-switch v-model="settingsStore.showRecentlyAdded" size="large" />
        </div>
        <div class="setting-item">
          <div class="setting-item-label">
            <p>显示“历史浏览”</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              在主页上显示“历史浏览”模块
            </p>
          </div>
          <el-switch v-model="settingsStore.showBrowsingHistory" size="large" />
        </div>
        <div class="setting-item">
          <div class="setting-item-label">
            <p>轮播图展示数量</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              “随机推荐”模块中展示的项目总数
            </p>
          </div>
          <el-input-number
            v-model="settingsStore.carouselItemCount"
            :min="5"
            :max="20"
            controls-position="right"
            style="width: 120px"
          />
        </div>
        <div class="setting-item">
          <div class="setting-item-label">
            <p>常规模块数量</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              “最近添加”和“历史浏览”的展示数量
            </p>
          </div>
          <el-input-number
            v-model="settingsStore.homepageSectionItemCount"
            :min="3"
            :max="50"
            controls-position="right"
            style="width: 120px"
          />
        </div>
      </section>

      <!-- Privacy Settings -->
      <section>
        <h2 class="setting-section-title">隐私</h2>
        <div class="setting-item">
          <div class="setting-item-label">
            <p>清除浏览记录</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              删除所有本地存储的浏览历史
            </p>
          </div>
          <el-button
            type="danger"
            plain
            class="mt-2"
            @click="handleClearHistory"
          >
            立即清除
          </el-button>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.setting-section-title {
  @apply mb-4 border-b border-gray-200 pb-2 text-xl font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-300;
}

.setting-item {
  @apply flex items-center justify-between py-4;
}

.setting-item-label {
  @apply flex flex-col gap-1;
  p {
    @apply m-0 leading-tight;
  }
}
</style>
