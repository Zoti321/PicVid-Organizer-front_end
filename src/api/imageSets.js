import apiClient from "./index.js"

const imageSetsAPI = {
  // 获取图集列表
  getImageSets: (params) => {
    return apiClient.get("/imagesets/", { params })
  },

  // 创建新图集
  createImageSet: (data) => {
    return apiClient.post("/imagesets/", data, {
      headers: { "Content-Type": "multipart/form-data" },
      successMessage: "图集创建成功",
    })
  },

  // 获取单个图集的详细信息
  getImageSetById: (id) => {
    return apiClient.get(`/imagesets/${id}/`)
  },

  // 更新图集信息
  updateImageSet: (id, data) => {
    return apiClient.patch(`/imagesets/${id}/`, data, {
      successMessage: "图集信息更新成功",
    })
  },

  // 删除图集
  deleteImageSet: (id) => {
    return apiClient.delete(`/imagesets/${id}/`, {
      successMessage: "图集删除成功",
    })
  },

  // 获取图集所有页面 URL
  getImageSetPages: (id) => {
    return apiClient.get(`/imagesets/${id}/pages/`)
  },

  // 为图集添加更多图片
  addImagesToImageSet: (id, data) => {
    return apiClient.post(`/imagesets/${id}/add-images/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
      successMessage: "图片添加成功",
    })
  },
}

export default imageSetsAPI
