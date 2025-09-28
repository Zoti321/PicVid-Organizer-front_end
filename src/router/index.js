import {createRouter, createWebHistory} from "vue-router"

/**
 * @description 路由配置
 *
 * 采用路由懒加载（动态导入）来分割代码，实现按需加载，优化初始加载性能。
 * 每个路由的 component 都使用 () => import(...) 的形式。
 */
const routes = [
  {
    path: "/",
    name: "主页",
    component: () => import("../views/home/AppHome.vue"),
  },
  {
    path: "/comic",
    name: "漫画",
    component: () => import("../views/comic/ComicLibrary.vue"),
  },
  {
    path: "/image-set",
    name: "图片合集",
    component: () => import("../views/imageset/ImageSetLibrary.vue"),
  },
  {
    path: "/image-set/:id",
    name: "图集详情",
    component: () => import("../views/imageset/ImageSetDetailPage.vue"),
  },
  {
    path: "/comic/:id",
    name: "漫画详情",
    component: () => import("../views/comic/ComicDetailPage.vue"),
  },
  {
    path: "/comic-reader/:id",
    name: "漫画阅读器",
    component: () => import("../views/comic/ComicReader.vue"),
  },
  {
    path: "/comic-reader-scroll/:id",
    name: "漫画阅读器-滚动模式",
    component: () => import("../views/comic/ComicReaderScrollMode.vue"),
  },

  {
    path: "/resource-management",
    name: "资源管理",
    component: () => import("../views/AppResourceManagement.vue"),
  },
  {
    path: "/settings",
    name: "设置",
    component: () => import("../views/AppSetting.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
