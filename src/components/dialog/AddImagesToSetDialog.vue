<script setup>
import { ref } from "vue"
import { ElMessage } from "element-plus"
import imageSetsAPI from "@/api/imageSets.js"

const props = defineProps({
  imageSetId: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(["upload-success"])

const dialogVisible = ref(false)
const fileList = ref([])
const isUploading = ref(false)

const openDialog = () => {
  fileList.value = [] // Clear previous file list
  dialogVisible.value = true
}

const handleAddImages = async () => {
  if (fileList.value.length === 0) {
    ElMessage.warning("请选择要上传的图片")
    return
  }

  const formData = new FormData()
  fileList.value.forEach((file) => {
    formData.append("images", file.raw)
  })

  isUploading.value = true
  try {
    await imageSetsAPI.addImagesToImageSet(props.imageSetId, formData)
    dialogVisible.value = false
    emit("upload-success")
  } catch (e) {
    console.error("Failed to add images:", e)
  } finally {
    isUploading.value = false
  }
}

defineExpose({
  openDialog,
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="追加新图片"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-upload
      v-model:file-list="fileList"
      action="#"
      multiple
      :auto-upload="false"
      list-type="picture"
      accept="image/jpeg,image/png,image/webp,image/gif"
    >
      <el-button type="primary">选择文件</el-button>
      <template #tip>
        <div class="el-upload__tip">
          可选择多个图片文件 (jpg/png/webp/gif)
        </div>
      </template>
    </el-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="isUploading"
          @click="handleAddImages"
        >
          确认上传
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
