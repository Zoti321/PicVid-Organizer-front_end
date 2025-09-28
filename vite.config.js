import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import tailwindcss from "@tailwindcss/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import VueDevTools from "vite-plugin-vue-devtools"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import Icons from "unplugin-icons/vite"
import path from "node:path"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 基于当前工作目录和模式加载.env文件
  const env = loadEnv(mode, process.cwd(), "")
  return {
    plugins: [
      vue(),
      tailwindcss(),
      VueDevTools(),
      Icons({ compiler: "vue3", autoInstall: true }),
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ["vue", "vue-router"],
        // 指定 ElementPlus 组件的自动导入
        resolvers: [ElementPlusResolver()],
        // 生成类型声明文件，提供更好的类型支持
        dts: "src/auto-imports.d.ts",
      }),
      Components({
        // 自动导入 ElementPlus 组件
        resolvers: [ElementPlusResolver()],
        // 指定自定义组件位置，实现自动导入
        dirs: ["src/components"],
        // 生成类型声明文件
        dts: "src/components.d.ts",
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: "localhost",
      port: Number(env.VITE_SERVER_PORT) || 5000,
      open: true,
      proxy: {
        [env.VITE_API_BASE_URL]: {
          target: env.VITE_PROXY_TARGET,
          changeOrigin: true,
        },
      },
    },
  }
})
