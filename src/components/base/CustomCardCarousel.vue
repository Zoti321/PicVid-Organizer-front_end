<script setup>
import { ref, computed, onUnmounted, nextTick, watch } from "vue"
import { Icon } from "@iconify/vue"
import gsap from "gsap"

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
  // Speed of the marquee, lower is faster (seconds per item)
  speed: {
    type: Number,
    default: 3,
  },
})

const emit = defineEmits(["item-click"])

// =======================================================================
// Marquee Logic
// =======================================================================
const container = ref(null)
let timeline = null

const duplicatedItems = computed(() => {
  return [...props.items, ...props.items]
})

function setupAnimation() {
  nextTick(() => {
    // Clean up previous animation
    if (timeline) {
      timeline.kill()
      gsap.set(container.value, { clearProps: "all" })
    }

    // Set up new animation if we have items
    if (props.autoplay && container.value && props.items.length > 0) {
      const duration = props.items.length * props.speed
      timeline = gsap.to(container.value, {
        xPercent: -50,
        ease: "none",
        duration: duration,
        repeat: -1,
      })
    }
  })
}

// Watch for changes in items array to re-initialize the animation
watch(
  () => props.items,
  () => {
    setupAnimation()
  },
  { deep: true },
)

onUnmounted(() => {
  if (timeline) {
    timeline.kill()
  }
  if (container.value) {
    gsap.set(container.value, { clearProps: "all" })
  }
})

function onMouseEnter() {
  if (timeline) timeline.pause()
}

function onMouseLeave() {
  if (timeline) timeline.resume()
}

function onItemClick(item) {
  emit("item-click", item)
}
</script>

<template>
  <div v-if="items.length > 0" class="mb-10">
    <h2 v-if="title" class="mb-4 text-2xl font-semibold text-slate-700">
      {{ title }}
    </h2>
    <div
      class="relative overflow-hidden"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <div ref="container" class="flex gap-5">
        <div
          v-for="(item, index) in duplicatedItems"
          :key="index"
          class="w-40 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg bg-slate-50 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
          @click="onItemClick(item)"
        >
          <img
            :src="item.cover_url"
            :alt="item.name"
            class="h-56 w-full object-cover"
          />
          <p
            class="m-0 overflow-hidden p-2 text-center text-sm text-ellipsis whitespace-nowrap text-slate-600"
          >
            {{ item.name }}
          </p>
        </div>
      </div>

      <!-- Controls are hidden in marquee mode -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* No controls needed for marquee */
</style>
