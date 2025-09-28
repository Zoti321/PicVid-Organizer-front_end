<script setup lang="js">
import _ from "lodash"
import { Icon } from "@iconify/vue"
import { ref, watch } from "vue"
import { onClickOutside } from "@vueuse/core"

const props = defineProps({
  modelValue: {
    // 已选中的标签名列表
    type: Array,
    default: () => [],
  },
  options: {
    // 所有可选的标签名列表
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(["update:modelValue"])

const isExpand = ref(false) // 展开状态
const internalSelectedTags = ref([...props.modelValue]) // 内部选中的标签名列表
const adderRef = ref(null) // Template ref for the root element

// 监听外部传入的 modelValue 变化，更新内部状态
watch(
  () => props.modelValue,
  (newValue) => {
    internalSelectedTags.value = [...newValue]
  },
)

function handleBlur() {
  isExpand.value = false
  // 检查列表是否有实质性变化
  if (
    !_.isEqual(
      [...props.modelValue].sort(),
      [...internalSelectedTags.value].sort(),
    )
  ) {
    emit("update:modelValue", internalSelectedTags.value)
  }
}

// Click outside logic
onClickOutside(adderRef, (event) => {
  // Ignore clicks on the select dropdown itself, as it's outside the component's DOM tree
  if (event.target.closest(".el-select-dropdown")) {
    return
  }

  if (isExpand.value) {
    handleBlur()
  }
})
</script>

<template>
  <div ref="adderRef" class="size-8">
    <el-select
      v-if="isExpand"
      v-model="internalSelectedTags"
      placeholder="选择标签"
      filterable
      multiple
      collapse-tags
      collapse-tags-tooltip
      class="w-128 hide-selected-tags"
      style="width: 128px"
      automatic-dropdown
      @blur="handleBlur"
    >
      <el-option
        v-for="option in options"
        :key="option"
        :label="option"
        :value="option"
      />
    </el-select>
    <div
      v-else
      class="flex size-8 cursor-pointer items-center justify-center rounded-sm border border-[#999999] transition-colors duration-300 hover:border-[rgb(255,122,0)] hover:text-[rgb(255,122,0)]"
      @click="isExpand = true"
    >
      <el-icon>
        <Icon icon="material-symbols:add" />
      </el-icon>
    </div>
  </div>
</template>

<style scoped>
.hide-selected-tags :deep(.el-select__tags-text) {
  display: none;
}

.hide-selected-tags :deep(.el-tag) {
  display: none;
}
</style>
