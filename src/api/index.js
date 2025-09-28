import axios from "axios"
import { ElMessage } from "element-plus"

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
})

// Response Interceptor: Centralized handling of feedback messages
apiClient.interceptors.response.use(
  (response) => {
    // For successful responses
    const method = response.config.method
    const successMessage = response.config.successMessage
    const message = response.data.msg

    // Only show success messages for state-changing requests
    const showSuccessToast = ["post", "put", "patch", "delete"].includes(method)

    if (showSuccessToast && message !== "阅读次数已增加") {
      ElMessage({
        message: successMessage || "操作成功",
        type: "success",
      })
    }

    // By returning response.data, we ensure all .then() and await calls
    // in the application get the data payload directly.
    return response.data
  },
  (error) => {
    // For failed responses
    let message = "请求失败，请检查您的网络或联系管理员。"

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const detail = error.response.data?.detail
      const status = error.response.status
      if (detail) {
        message = `[${status}] ${detail}`
      } else {
        switch (status) {
          case 400:
            message = "请求无效 (400)"
            break
          case 401:
            message = "未授权，请重新登录 (401)"
            break
          case 403:
            message = "禁止访问 (403)"
            break
          case 404:
            message = "请求资源未找到 (404)"
            break
          case 500:
          case 502:
          case 503:
            message = `服务器错误 (${status})`
            break
          default:
            message = `请求失败，状态码: ${status}`
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      message = "无法连接到服务器，请检查您的网络。"
    }

    ElMessage({
      message: message,
      type: "error",
    })

    // We must reject the promise to allow individual .catch() blocks in components
    // (e.g., to turn off a loading spinner)
    return Promise.reject(error)
  },
)

export default apiClient
