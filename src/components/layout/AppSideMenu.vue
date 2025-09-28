<script setup>
import { Icon } from "@iconify/vue"
import { ref } from "vue"
import { mainMenuItems, bottomMenuItems } from "@/config/menu.js"

// Component State
const isCollapse = ref(false)

// Methods
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<template>
  <transition name="slide">
    <el-menu
      class="flex h-screen flex-col border-r border-solid border-gray-200 bg-white"
      :collapse="isCollapse"
      role="menubar"
      router
    >
      <!-- Collapse Toggle -->
      <el-menu-item class="nav-control" @click="toggleCollapse">
        <el-icon>
          <Icon :icon="isCollapse ? 'basil:expand-outline' : 'ep:fold'" />
        </el-icon>
      </el-menu-item>

      <!-- Main Menu Items -->
      <template v-for="item in mainMenuItems" :key="item.index">
        <!-- SubMenu -->
        <el-sub-menu v-if="item.type === 'submenu'" :index="item.index">
          <template #title>
            <el-icon v-if="item.icon">
              <Icon :icon="item.icon" />
            </el-icon>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item
            v-for="child in item.children"
            :key="child.index"
            :index="child.index"
          >
            <template #title>{{ child.title }}</template>
          </el-menu-item>
        </el-sub-menu>

        <!-- Single Menu Item -->
        <el-menu-item v-else :index="item.index">
          <el-icon v-if="item.icon">
            <Icon :icon="item.icon" />
          </el-icon>
          <template #title>{{ item.title }}</template>
        </el-menu-item>
      </template>

      <!-- Bottom Menu Items -->
      <template v-for="item in bottomMenuItems" :key="item.index">
        <el-menu-item :index="item.index">
          <el-icon v-if="item.icon">
            <Icon :icon="item.icon" />
          </el-icon>
          <template #title>{{ item.title }}</template>
        </el-menu-item>
      </template>
    </el-menu>
  </transition>
</template>

<style lang="scss" scoped>
.el-menu {
  transition: width 0.3s ease;
  position: sticky;
  top: 0;
  left: 0;
}

.slide-enter-active {
  animation: slide-in 0.3s ease;
}

.slide-leave-active {
  animation: slide-out 0.3s ease;
}

@keyframes slide-in {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}
</style>
