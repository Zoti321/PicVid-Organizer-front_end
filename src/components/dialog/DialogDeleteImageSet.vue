<script setup>
import { inject, ref, computed } from "vue"
import { ElMessage } from "element-plus"
import imageSetsAPI from "@/api/imageSets.js"

// =======================================================================
// Props
// =======================================================================
const props = defineProps({
  imageSet: {
    type: Object,
    required: true,
    // 验证器，确保传入的对象包含 id 和 name
    validator: (value) => {
      return value && typeof value.id === "number" && typeof value.name === "string"
    },
  },
})

// =======================================================================
// Injected from parent
// =======================================================================
const getImageSetsData = inject("getImageSetsData")

// =======================================================================
// State
// =======================================================================
const isVisible = ref(false)
const isLoading = ref(false)

// =======================================================================
// Computed
// =======================================================================
const dialogTitle = computed(() => {
  return `删除图集: ${props.imageSet?.name || ""}`
})

// =======================================================================
// Methods
// =======================================================================
async function confirmDelete() {
  if (!props.imageSet?.id) return

  isLoading.value = true
  try {
    await imageSetsAPI.deleteImageSet(props.imageSet.id)
    ElMessage.success("删除成功")

    // 如果注入了刷新函数，则调用它
    if (getImageSetsData) {
      await getImageSetsData()
    }

    closeDialog()
  } catch (error) {
    console.error("Failed to delete image set:", error)
    ElMessage.error("删除失败，请查看控制台获取更多信息")
  } finally {
    isLoading.value = false
  }
}

function openDialog() {
  isVisible.value = true
}

function closeDialog() {
  isVisible.value = false
}

// =======================================================================
// Exposed methods
// =======================================================================
defineExpose({
  open: openDialog,
})
</script>

<template>
  <teleport to="body">
    <el-dialog v-model="isVisible" :title="dialogTitle" width="500" align-center>
      <span>
        您确定要删除图集
        <strong class="text-red-500">《{{ props.imageSet?.name }}》</strong>
        吗？此操作不可撤销。
      </span>
      <template #footer>
        <el-button
          type="danger"
          :loading="isLoading"
          @click="confirmDelete"
        >
          确认删除
        </el-button>
        <el-button plain type="info" @click="closeDialog">取消</el-button>
      </template>
    </el-dialog>
  </teleport>
</template>

<style scoped></style>
