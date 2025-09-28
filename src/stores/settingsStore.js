import { defineStore } from "pinia"

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    // 主页显示设置
    showRecentlyAdded: true,
    showBrowsingHistory: true,
    homepageSectionItemCount: 10,
    carouselItemCount: 5,
  }),
  actions: {
    setShowRecentlyAdded(value) {
      this.showRecentlyAdded = value
    },
    setShowBrowsingHistory(value) {
      this.showBrowsingHistory = value
    },
    setHomepageSectionItemCount(count) {
      this.homepageSectionItemCount = count
    },
    setCarouselItemCount(count) {
      this.carouselItemCount = count
    },
  },
  persist: true, // 开启持久化
})
