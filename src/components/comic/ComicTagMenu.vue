<script setup>
const props = defineProps({
  categoryType: {
    type: String,
    default: null,
  },
  tag: {
    type: String,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["search", "delete", "cancel-selection"])

function searchTag() {
  if (props.disabled) return
  emit("search")
}

function deleteTag() {
  if (props.disabled) return
  emit("delete")
}

function cancelSelection() {
  if (props.disabled) return
  emit("cancel-selection")
}
</script>

<template>
  <div
    class="flex items-center gap-1 text-sm"
    :class="{ 'is-disabled': disabled }"
  >
    <button :disabled="disabled" class="btn-tag-menu" @click="searchTag">
      搜索分类标签
    </button>
    <button :disabled="disabled" class="btn-tag-menu" @click="deleteTag">
      删除
    </button>
    <button :disabled="disabled" class="btn-tag-menu" @click="cancelSelection">
      取消选取
    </button>
  </div>
</template>

<style scoped>
.btn-tag-menu {
  /* Your existing button styles */
}

.is-disabled .btn-tag-menu {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>