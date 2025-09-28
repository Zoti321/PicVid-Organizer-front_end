import apiClient from "./index.js"

const categoryTagsAPI = {
  // 获取分类标签列表
  getCategoryTags: (params) => {
    return apiClient.get("/meta/category-tags/", { params })
  },

  // 创建新标签
  createCategoryTags: (data) => {
    return apiClient.post("/meta/category-tags/", data, {
      successMessage: "标签创建成功", // Custom success message
    })
  },

  // 删除分类标签
  deleteCategoryTag: (tagType, tagName) => {
    return apiClient.delete("/meta/category-tags/", {
      params: { type: tagType, name: tagName },
    })
  },

  // 更新分类标签的 R18 属性
  updateCategoryTag: (tagType, tagName, is_r18) => {
    return apiClient.patch("/meta/category-tags/", {
      type: tagType,
      name: tagName,
      is_r18: is_r18,
    })
  },
}

export default categoryTagsAPI
