export const menuItems = [
  { name: "主页", path: "/" },
  {
    name: "本子资源",
    children: [
      { name: "漫画", path: "/benzi/comics" },
      { name: "图片合集", path: "/benzi/image-set" },
    ],
  },
  {
    name: "多媒体资源",
    children: [
      { name: "3D作品", path: "/media/3D" },
      { name: "里番", path: "/media/ero-animation" },
      { name: "av", path: "/media/av" },
      { name: "音声漫画", path: "/media/sound-comic" },
    ],
  },
  { name: "资源管理", path: "/resource-management" },
  { name: "设置", path: "/settings" },
]
