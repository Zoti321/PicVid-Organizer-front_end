<script setup>
import { inject, ref } from "vue"
import comicsAPI from "@/api/comics.js"
import { useComics } from "@/composables/useComics.js"

// 组件变量
const { fetchComics } = useComics()
// props参数
const prop = defineProps({
  comicId: {
    type: Number,
    required: true,
  },
  comicName: {
    type: String,
    default: "",
  },
})
const isVisible = ref(false)

// 组件函数
async function deleteComic() {
  const comicId = prop.comicId
  await comicsAPI.deleteComic(comicId)
  await fetchComics() // 重新获取数据
  close()
}

function open() {
  isVisible.value = true
}

function close() {
  isVisible.value = false
}

// 组件对外暴露函数
defineExpose({
  open,
})
</script>

<template>
  <teleport to="body">
    <el-dialog v-model="isVisible" :title="comicName" width="500" align-center>
      <span>您确定要从LGM中删除这个漫画吗?</span>
      <template #footer>
        <el-button type="warning" @click="deleteComic">确认</el-button>
        <el-button plain type="info" @click="close">取消</el-button>
      </template>
    </el-dialog>
  </teleport>
</template>

<style scoped></style>
