<script setup>
import { ref, onMounted, computed } from "vue"
import { ElMessage } from "element-plus"
import imageSetsAPI from "@/api/imageSets.js"
import categoryTagsAPI from "@/api/categoryTags.js"
import { Icon } from "@iconify/vue"

// =======================================================================
// Emits
// =======================================================================
const emit = defineEmits(["upload-success"])

// =======================================================================
// State
// =======================================================================
const dialogVisible = ref(false)
const isSubmitting = ref(false)
const categoryTagsData = ref({
  series: [],
  characters: [],
  tags: [],
  authors: [],
})

// =======================================================================
// Form
// =======================================================================
const formRef = ref(null)

// Factory function for initial form state
const createInitialFormState = () => ({
  name: "",
  is_r18: false,
  series: [],
  characters: [],
  tags: [],
  authors: [],
})

const imageSetInfo = ref(createInitialFormState())
const imageSetImages = ref([])

const rules = {
  name: [{ required: true, message: "请输入图集名", trigger: "blur" }],
  files: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (imageSetImages.value.length === 0) {
          callback(new Error("请至少上传一个文件"))
        } else {
          callback()
        }
      },
    },
  ],
}

// =======================================================================
// API Calls
// =======================================================================
const fetchCategoryTags = async () => {
  try {
    const data = await categoryTagsAPI.getCategoryTags()
    categoryTagsData.value = data || {
      series: [],
      characters: [],
      tags: [],
      authors: [],
    }
  } catch (error) {
    console.error("Failed to fetch category tags:", error)
    ElMessage.error("获取分类标签失败")
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const isValid = await formRef.value.validate()
    if (!isValid || imageSetImages.value.length === 0) {
      if (imageSetImages.value.length === 0)
        ElMessage.warning("请至少上传一个文件")
      return
    }

    isSubmitting.value = true

    const metadata = {
      name: imageSetInfo.value.name,
      is_r18: imageSetInfo.value.is_r18,
      series: imageSetInfo.value.series.map((name) => ({ name })),
      characters: imageSetInfo.value.characters.map((name) => ({ name })),
      authors: imageSetInfo.value.authors.map((name) => ({ name })),
      tags: imageSetInfo.value.tags.map((name) => {
        const existingTag = categoryTagsData.value?.tags.find(
          (t) => t.name === name,
        )
        return { name, is_r18: existingTag ? existingTag.is_r18 : false }
      }),
    }

    const formData = new FormData()
    formData.append("data", JSON.stringify(metadata))
    imageSetImages.value.forEach((file) => {
      formData.append("uploaded_files", file.raw)
    })

    await imageSetsAPI.createImageSet(formData)
    ElMessage.success("图集创建成功！")

    dialogVisible.value = false
    emit("upload-success")
  } catch (error) {
    console.error("Failed to upload image set:", error)
    ElMessage.error("图集创建失败，请重试")
  } finally {
    isSubmitting.value = false
  }
}

// =======================================================================
// Methods
// =======================================================================
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  imageSetInfo.value = createInitialFormState()
  imageSetImages.value = []
}

const openDialog = () => {
  resetForm()
  dialogVisible.value = true
}

const removeFile = (file) => {
  imageSetImages.value = imageSetImages.value.filter((f) => f.uid !== file.uid)
}

// =======================================================================
// Computed & Lifecycle
// =======================================================================
const headImages = computed(() => imageSetImages.value.slice(0, 3))
const tailImages = computed(() => imageSetImages.value.slice(-3))
const isCollapsible = computed(() => imageSetImages.value.length > 6)

onMounted(() => {
  fetchCategoryTags()
})

// =======================================================================
// Exposed methods
// =======================================================================
defineExpose({
  openDialog,
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="上传新图集"
    width="1200px"
    top="5vh"
    custom-class="p-0"
    :close-on-click-modal="!isSubmitting"
    :close-on-press-escape="!isSubmitting"
    @close="resetForm"
  >
    <fieldset
      :disabled="isSubmitting"
      class="grid grid-cols-2 gap-0 bg-gray-50"
    >
      <div class="flex flex-col gap-4 border-r border-gray-200 p-8">
        <el-card shadow="never" class="flex-grow">
          <template #header>
            <div class="flex items-center gap-2">
              <Icon
                icon="material-symbols:upload-file-outline"
                class="text-xl"
              />
              <span class="text-lg font-semibold">上传文件</span>
            </div>
          </template>
          <el-form-item prop="files">
            <el-upload
              v-model:file-list="imageSetImages"
              action="#"
              :auto-upload="false"
              multiple
              drag
              :show-file-list="false"
              class="w-full"
            >
              <div class="flex h-48 flex-col items-center justify-center">
                <Icon
                  icon="material-symbols:cloud-upload-outline"
                  class="text-6xl text-gray-400"
                />
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
              </div>
            </el-upload>
          </el-form-item>
        </el-card>
        <el-card
          v-if="imageSetImages.length > 0"
          shadow="never"
          class="flex-grow"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Icon
                  icon="material-symbols:list-alt-outline"
                  class="text-xl"
                />
                <span class="text-lg font-semibold">文件列表</span>
              </div>
              <el-button type="danger" text @click="imageSetImages = []"
                >清空列表</el-button
              >
            </div>
          </template>
          <ul class="m-0 max-h-64 list-none overflow-y-auto p-0">
            <template v-if="!isCollapsible">
              <li
                v-for="file in imageSetImages"
                :key="file.uid"
                class="flex items-center justify-between rounded-md p-2 hover:bg-gray-100"
              >
                <span>{{ file.name }}</span>
                <el-button type="danger" text @click="removeFile(file)"
                  >删除</el-button
                >
              </li>
            </template>
            <template v-else>
              <li
                v-for="file in headImages"
                :key="file.uid"
                class="flex items-center justify-between rounded-md p-2 hover:bg-gray-100"
              >
                <span>{{ file.name }}</span>
                <el-button type="danger" text @click="removeFile(file)"
                  >删除</el-button
                >
              </li>
              <li class="p-2 text-center">...</li>
              <li
                v-for="file in tailImages"
                :key="file.uid"
                class="flex items-center justify-between rounded-md p-2 hover:bg-gray-100"
              >
                <span>{{ file.name }}</span>
                <el-button type="danger" text @click="removeFile(file)"
                  >删除</el-button
                >
              </li>
            </template>
          </ul>
        </el-card>
      </div>
      <div class="p-8">
        <el-card shadow="never" class="h-full">
          <template #header>
            <div class="flex items-center gap-2">
              <Icon
                icon="material-symbols:edit-document-outline"
                class="text-xl"
              />
              <span class="text-lg font-semibold">图集信息</span>
            </div>
          </template>
          <el-form
            ref="formRef"
            :model="imageSetInfo"
            :rules="rules"
            label-position="top"
          >
            <el-form-item label="图集名称" prop="name">
              <el-input
                v-model="imageSetInfo.name"
                placeholder="请输入图集名称"
                size="large"
              />
            </el-form-item>
            <el-form-item label="R18">
              <el-switch v-model="imageSetInfo.is_r18" size="large" />
            </el-form-item>
            <el-divider />
            <div class="grid grid-cols-2 gap-4">
              <el-form-item label="系列">
                <el-select
                  v-model="imageSetInfo.series"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  class="w-full"
                  placeholder="请选择或创建系列"
                  size="large"
                >
                  <el-option
                    v-for="item in categoryTagsData?.series"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="角色">
                <el-select
                  v-model="imageSetInfo.characters"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  class="w-full"
                  placeholder="请选择或创建角色"
                  size="large"
                >
                  <el-option
                    v-for="item in categoryTagsData?.characters"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="标签">
                <el-select
                  v-model="imageSetInfo.tags"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  class="w-full"
                  placeholder="请选择或创建标签"
                  size="large"
                >
                  <el-option
                    v-for="item in categoryTagsData?.tags"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="作者">
                <el-select
                  v-model="imageSetInfo.authors"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  class="w-full"
                  placeholder="请选择或创建作者"
                  size="large"
                >
                  <el-option
                    v-for="item in categoryTagsData?.authors"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
            </div>
            <el-divider />
          </el-form>
        </el-card>
      </div>
    </fieldset>
    <template #footer>
      <div
        class="flex justify-end gap-2 border-t border-gray-200 bg-gray-100 px-8 py-4"
      >
        <el-button
          size="large"
          :disabled="isSubmitting"
          @click="dialogVisible = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          size="large"
          :loading="isSubmitting"
          @click="handleSubmit"
        >
          创建
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
