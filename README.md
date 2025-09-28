# PicVid Organizer - 前端

一个用于管理和浏览个人图片、漫画和图集收藏的应用程序前端。该项目使用现代化的前端技术栈构建，界面美观，体验流畅。

## ✨ 主要功能

- **多资源库管理**: 支持漫画 (Comic) 和图片合集 (ImageSet) 两种类型的资源库。
- **流畅的阅读体验**: 提供翻页和无限滚动两种阅读模式。
- **强大的标签系统**: 支持对系列、角色、作者、自定义标签等多个维度进行标记和管理。
- **内容分级**: 内置 R-18 模式，用于过滤和显示成人内容。
- **搜索与排序**: 提供全局关键字搜索和多种排序方式（如按名称、添加日期）。
- **数据仪表盘**: 在“资源管理”页面提供数据统计和批量操作功能。
- **个性化设置**: 支持明亮/暗黑模式切换、主页模块定制和隐私设置。
- **历史记录**: 自动记录浏览历史，方便快速回顾。

## 🛠️ 技术栈

- **核心框架**: [Vue 3](https://vuejs.org/) (使用 Composition API)
- **构建工具**: [Vite](https://vitejs.dev/)
- **UI 组件库**: [Element Plus](https://element-plus.org/)
- **CSS 方案**: [Tailwind CSS](https://tailwindcss.com/)
- **状态管理**: [Pinia](https://pinia.vuejs.org/)
- **路由**: [Vue Router](https://router.vuejs.org/)
- **HTTP 请求**: [Axios](https://axios-http.com/)
- **图标**: [Iconify](https://iconify.design/)

## 🚀 快速上手

在开始之前，请确保您的开发环境中已安装 [Node.js](https://nodejs.org/) (推荐 v18 或更高版本) 和 npm。

### 1. 克隆项目

```bash
git clone <your-repository-url>
cd pvo_frontend
```

### 2. 安装依赖

在项目根目录下运行以下命令：

```bash
npm install
```

### 3. 启动开发服务器

该命令会启动 Vite 开发服务器，并自动在浏览器中打开应用。

```bash
npm run dev
```

### 4. 打包构建

该命令会将应用打包到 `dist` 目录，用于生产环境部署。

```bash
npm run build
```

## 📦 可用脚本

- `npm run dev`: 启动开发服务器。
- `npm run build`: 执行生产环境构建。
- `npm run preview`: 在本地预览生产环境构建后的应用。
- `npm run format`: 使用 Prettier 格式化整个项目的代码。
- `npm run lint`: 使用 ESLint 检查代码规范。

## 📂 项目结构概览

```
src
├── api/          # API 请求模块
├── assets/       # 静态资源 (图片、字体等)
├── components/   # 可复用的 Vue 组件
│   ├── base/     # 基础组件 (如卡片、轮播)
│   ├── dialog/   # 对话框组件
│   └── layout/   # 布局组件 (如头部、侧边栏)
├── composables/  # 组合式函数 (封装核心业务逻辑)
├── config/       # 配置文件 (如菜单)
├── router/       # Vue Router 路由配置
├── stores/       # Pinia 状态管理
└── views/        # 页面级视图组件
```
