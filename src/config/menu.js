/**
 * @description 导航菜单配置文件
 * type: 'item' | 'submenu' | 'group'
 * title: 菜单标题
 * index: 路由路径 (对于 el-menu-item)
 * icon: 图标 (来自 iconify)
 * children: 子菜单项
 */
export const mainMenuItems = [
  {
    type: "item",
    index: "/",
    title: "主页",
    icon: "ep:home-filled",
  },
  {
    type: "submenu",
    index: "benzi",
    title: "本子资源",
    icon: "ep:notebook",
    children: [
      {
        type: "item",
        index: "/comic",
        title: "漫画",
      },
      {
        type: "item",
        index: "/image-set",
        title: "图片合集",
      },
    ],
  },
]

export const bottomMenuItems = [
  {
    type: "item",
    index: "/resource-management",
    title: "资源管理",
    icon: "ep:operation",
  },
  {
    type: "item",
    index: "/settings",
    title: "设置",
    icon: "ep:setting",
  },
]
