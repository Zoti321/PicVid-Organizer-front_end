import apiClient from "./index.js"

const comicsAPI = {
  // 获取漫画列表
  getComics: (params) => {
    return apiClient.get("/comics/", { params })
  },

  // 创建新漫画
  createComic: (data) => {
    return apiClient.post("/comics/", data, {
      headers: { "Content-Type": "multipart/form-data" },
      successMessage: "漫画上传成功",
    })
  },

  // 获取单个漫画的详细信息
  getComicById: (id) => {
    return apiClient.get(`/comics/${id}/`)
  },

  // 更新漫画信息
  updateComic: (id, data) => {
    return apiClient.patch(`/comics/${id}/`, data, {
      successMessage: "漫画信息更新成功",
    })
  },

  // 删除漫画
  deleteComic: (id) => {
    return apiClient.delete(`/comics/${id}/`, {
      successMessage: "漫画删除成功",
    })
  },

  // 获取漫画所有页面 URL
  getComicPages: (id) => {
    return apiClient.get(`/comics/${id}/pages/`)
  },

  // 增加漫画阅读次数
  increaseReadFrequency: (id) => {
    return apiClient.post(`/comics/${id}/read-frequency/`)
  },
}

export default comicsAPI
