<script setup>
import { computed, reactive, ref } from "vue"
import { ElMessage } from "element-plus"
import categoryTagsAPI from "@/api/categoryTags.js"
import { Icon } from "@iconify/vue"

// 组件数据变量
// 对话框可视化变量
const dialogVisible = ref(false)
// 表单数据
const formData = ref({
  series: [],
  characters: [],
  tags: [],
  authors: [],
  r18_tags: [],
})

// 组件函数方法
// 提交表单数据
const submit = async () => {
  if (!checkEmpty()) {
    const data = {}

    // Handle series, characters, authors
    for (const key of ["series", "characters", "authors"]) {
      if (formData.value[key].length > 0) {
        data[key] = formData.value[key].map((name) => ({ name }))
      }
    }

    // Handle tags (non-R18 and R18)
    const tags = formData.value.tags.map((name) => ({ name, is_r18: false }))
    const r18Tags = formData.value.r18_tags.map((name) => ({
      name,
      is_r18: true,
    }))
    const allTags = [...tags, ...r18Tags]

    if (allTags.length > 0) {
      data.tags = allTags
    }

    await categoryTagsAPI.createCategoryTags(data)
    clearFormData()
    dialogVisible.value = false
  }
}
// 表单数据校验
const checkEmpty = () => {
  const isBlank =
    formData.value.series.length === 0 &&
    formData.value.characters.length === 0 &&
    formData.value.tags.length === 0 &&
    formData.value.authors.length === 0 &&
    formData.value.r18_tags.length === 0

  if (isBlank) {
    ElMessage({
      message: "表单数据不能全部为空",
      type: "warning",
    })
    return true
  } else return false
}
// 关闭对话框
const closeDialog = () => {
  dialogVisible.value = false
}
// 清除表单数据
const clearFormData = () => {
  formData.value.series = []
  formData.value.characters = []
  formData.value.tags = []
  formData.value.authors = []
  formData.value.r18_tags = []
}
// 打开对话框
const openDialog = () => {
  dialogVisible.value = true
}

// 组件对外暴露方法
defineExpose({
  openDialog,
})
</script>

<template>
  <el-dialog v-model="dialogVisible" title="添加分类标签" width="800px" top="5vh" custom-class="p-0" @close="clearFormData">
    <div class="p-8 bg-gray-50">
      <el-card shadow="never">
        <template #header>
          <div class="flex items-center gap-2">
            <Icon icon="material-symbols:create-new-folder-outline" class="text-xl" />
            <span class="text-lg font-semibold">创建新的分类标签</span>
          </div>
        </template>
        <el-form :model="formData" label-position="top">
          <div class="grid grid-cols-2 gap-8">
            <el-form-item label="系列">
              <el-input-tag v-model="formData.series" placeholder="输入系列并按回车确认" />
            </el-form-item>
            <el-form-item label="角色">
              <el-input-tag v-model="formData.characters" placeholder="输入角色并按回车确认" />
            </el-form-item>
            <el-form-item label="标签">
              <el-input-tag v-model="formData.tags" placeholder="输入标签并按回车确认" />
            </el-form-item>
            <el-form-item label="R18标签">
              <el-input-tag v-model="formData.r18_tags" placeholder="输入R18标签并按回车确认" />
            </el-form-item>
            <el-form-item label="作者">
              <el-input-tag v-model="formData.authors" placeholder="输入作者并按回车确认" />
            </el-form-item>
          </div>
        </el-form>
      </el-card>
    </div>
    <template #footer>
      <div class="px-8 py-4 bg-gray-100 border-t border-gray-200 flex justify-end gap-2">
        <el-button size="large" @click="closeDialog">取消</el-button>
        <el-button type="primary" size="large" @click="submit">创建</el-button>
      </div>
    </template>
  </el-dialog>
</template>
