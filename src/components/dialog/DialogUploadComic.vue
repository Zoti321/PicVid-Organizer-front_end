<script setup>
import { ref, onMounted, computed } from "vue"
import comicsAPI from "@/api/comics.js"
import categoryTagsAPI from "@/api/categoryTags.js"
import { Icon } from "@iconify/vue"

// Component state
const dialogVisible = ref(false)
const categoryTagsData = ref(null)
const categoryTagsDataLoaded = ref(false)

// Form data
const formRef = ref(null)
const comicInfo = ref({
  name: null,
  is_r18: false,
  series: [],
  characters: [],
  tags: [],
  authors: [],
  narrate: "",
})
const comicImages = ref([])

// Form rules
const rules = {
  name: [{ required: true, message: "请输入漫画名", trigger: "blur" }],
}

// Fetch category tags
const fetchCategoryTags = async () => {
  try {
    categoryTagsData.value = await categoryTagsAPI.getCategoryTags()
    categoryTagsDataLoaded.value = true
  } catch (error) {
    console.error("Failed to fetch category tags:", error)
  }
}

onMounted(() => {
  fetchCategoryTags()
})

// Form submission
const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid && comicImages.value.length > 0) {
      const metadata = {
        name: comicInfo.value.name,
        is_r18: comicInfo.value.is_r18,
        narrate: comicInfo.value.narrate,
        series: comicInfo.value.series.map(name => ({ name })),
        characters: comicInfo.value.characters.map(name => ({ name })),
        authors: comicInfo.value.authors.map(name => ({ name })),
        tags: comicInfo.value.tags.map(name => {
          const existingTag = categoryTagsData.value?.tags.find(t => t.name === name);
          return { name, is_r18: existingTag ? existingTag.is_r18 : false };
        }),
      };

      const formData = new FormData();
      // Use 'data' as the key
      formData.append('data', JSON.stringify(metadata));

      comicImages.value.forEach(file => {
        formData.append('uploaded_files', file.raw);
      });

      try {
        await comicsAPI.createComic(formData);
        resetForm();
        dialogVisible.value = false;
        emit('upload-success');
      } catch (error) {
        console.error('Failed to upload comic:', error);
      }
    }
  });
}

// Reset form
const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  comicImages.value = []
}

// Dialog visibility control
const openDialog = () => {
  dialogVisible.value = true
}

const emit = defineEmits(["upload-success"])

// File list display
const headImages = computed(() => comicImages.value.slice(0, 3))
const tailImages = computed(() => comicImages.value.slice(-3))
const isCollapsible = computed(() => comicImages.value.length > 6)

const removeFile = (file) => {
  comicImages.value = comicImages.value.filter((f) => f.uid !== file.uid)
}

defineExpose({
  openDialog,
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="上传新漫画"
    width="1200px"
    top="5vh"
    custom-class="p-0"
    @close="resetForm"
  >
    <div class="grid grid-cols-2 gap-0 bg-gray-50">
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
          <el-upload
            v-model:file-list="comicImages"
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
        </el-card>
        <el-card v-if="comicImages.length > 0" shadow="never" class="flex-grow">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Icon
                  icon="material-symbols:list-alt-outline"
                  class="text-xl"
                />
                <span class="text-lg font-semibold">文件列表</span>
              </div>
              <el-button type="danger" text @click="comicImages = []"
                >清空列表
              </el-button>
            </div>
          </template>
          <ul class="m-0 max-h-64 list-none overflow-y-auto p-0">
            <template v-if="!isCollapsible">
              <li
                v-for="file in comicImages"
                :key="file.uid"
                class="flex items-center justify-between rounded-md p-2 hover:bg-gray-100"
              >
                <span>{{ file.name }}</span>
                <el-button type="danger" text @click="removeFile(file)"
                  >删除
                </el-button>
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
                  >删除
                </el-button>
              </li>
              <li class="p-2 text-center">...</li>
              <li
                v-for="file in tailImages"
                :key="file.uid"
                class="flex items-center justify-between rounded-md p-2 hover:bg-gray-100"
              >
                <span>{{ file.name }}</span>
                <el-button type="danger" text @click="removeFile(file)"
                  >删除
                </el-button>
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
              <span class="text-lg font-semibold">漫画信息</span>
            </div>
          </template>
          <el-form
            ref="formRef"
            :model="comicInfo"
            :rules="rules"
            label-position="top"
          >
            <el-form-item label="漫画名称" prop="name">
              <el-input
                v-model="comicInfo.name"
                placeholder="请输入漫画名称"
                size="large"
              />
            </el-form-item>
            <el-form-item label="R18">
              <el-switch v-model="comicInfo.is_r18" size="large" />
            </el-form-item>
            <el-divider />
            <div class="grid grid-cols-2 gap-4">
              <el-form-item label="系列">
                <el-select
                  v-model="comicInfo.series"
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
                  v-model="comicInfo.characters"
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
                  v-model="comicInfo.tags"
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
                  v-model="comicInfo.authors"
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
            <el-form-item label="简介">
              <el-input
                v-model="comicInfo.narrate"
                type="textarea"
                :rows="5"
                placeholder="请输入简介"
              />
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
    <template #footer>
      <div
        class="flex justify-end gap-2 border-t border-gray-200 bg-gray-100 px-8 py-4"
      >
        <el-button size="large" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" size="large" @click="handleSubmit"
          >创建
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
