# PicVid Organizer API 文档

本文档详细描述了 PicVid Organizer 后端项目的所有 API 端点。

**注意**: 为了获得更好的开发体验，建议使用项目集成的可交互 API 文档：

- **Swagger UI**: (http://127.0.0.1:8080/swagger/)
- **ReDoc**: (http://127.0.0.1:8080/redoc/)

---

## 漫画 (Comics)

基础路径: `/api/comics/`

**通用漫画对象格式**:

```json
{
  "id": 1,
  "name": "Example Comic",
  "cover_url": "http://127.0.0.1:8080/media/comics/example/cover.jpg",
  "series": [
    {
      "name": "Series Name"
    }
  ],
  "characters": [
    {
      "name": "Character Name"
    }
  ],
  "tags": [
    {
      "name": "Tag Name"
    }
  ],
  "authors": [
    {
      "name": "Author Name"
    }
  ],
  "pages": 24,
  "is_r18": false,
  "add_date": "2025-09-25T10:00:00Z",
  "directory_path": "comics/example-comic"
}
```

### `GET /api/comics/`

- **描述**: 获取所有漫画的分页列表。
- **请求参数**:
    - `keyword` (str): 用于在漫画名称、标签、系列等中进行搜索的关键字。
    - `mode` (str): 设置为 `random` 可随机获取漫画。
    - `count` (int): 配合 `mode=random` 使用，指定返回数量。
- **返回格式**: 返回一个包含多个“通用漫画对象”的数组。
  ```json

[
{ "...通用漫画对象..." },
{ "...通用漫画对象..." }
]

```

### `POST /api/comics/`
- **描述**: 创建一部新漫画。
- **请求体**: `multipart/form-data`，包含：
  - `data` (JSON 字符串): 包含漫画元数据，如 `name`, `tags`, `authors` 等。
  - `uploaded_files` (文件): 一个或多个漫画图片文件。
- **返回格式**: 返回新创建的“通用漫画对象”。

### `GET /api/comics/<id>/`
- **描述**: 根据 ID 获取单部漫画的详细信息。
- **返回格式**: 返回一个“通用漫画对象”。

### `PUT /api/comics/<id>/`
- **描述**: 完整更新一部漫画的全部信息。
- **返回格式**: 返回更新后的“通用漫画对象”。

### `PATCH /api/comics/<id>/`
- **描述**: 部分更新一部漫画的信息。
- **返回格式**: 返回更新后的“通用漫画对象”。

### `DELETE /api/comics/<id>/`
- **描述**: 删除一部漫画及其关联的所有文件。
- **返回格式**: `HTTP 204 No Content`

### `POST /api/comics/<id>/read-frequency/`
- **描述**: 增加漫画的阅读次数计数。
- **返回格式**: `HTTP 200 OK` 并附带成功信息。

### `GET /api/comics/<id>/pages/`
- **描述**: 获取特定漫画关联的所有页面的 URL 列表。
- **返回格式**:
  ```json
  {
    "pages": [
      "http://127.0.0.1:8080/media/comics/example/01.jpg",
      "http://127.0.0.1:8080/media/comics/example/02.jpg"
    ]
  }
  ```

---

## 图集 (Image Sets)

基础路径: `/api/imagesets/`

**通用图集对象格式**:

```json
{
  "id": 1,
  "name": "Example Image Set",
  "cover_url": "http://127.0.0.1:8080/media/image_sets/example/cover.jpg",
  "series": [
    {
      "name": "Series Name"
    }
  ],
  "characters": [
    {
      "name": "Character Name"
    }
  ],
  "tags": [
    {
      "name": "Tag Name"
    }
  ],
  "authors": [
    {
      "name": "Author Name"
    }
  ],
  "pages": 100,
  "is_r18": false,
  "add_date": "2025-09-25T12:00:00Z",
  "directory_path": "image_sets/example-image-set"
}
```

### `GET /api/imagesets/`

- **描述**: 获取所有图集的分页列表。
- **返回格式**: 返回一个包含多个“通用图集对象”的数组。
  ```json

[
{ "...通用图集对象..." },
{ "...通用图集对象..." }
]

```

### `POST /api/imagesets/`
- **描述**: 创建一个新图集。
- **请求体**: `multipart/form-data`，格式同创建漫画。
- **返回格式**: 返回新创建的“通用图集对象”。

### `GET /api/imagesets/<id>/`
- **描述**: 根据 ID 获取单个图集的详细信息。
- **返回格式**: 返回一个“通用图集对象”。

### `PUT /api/imagesets/<id>/`
- **描述**: 完整更新一个图集的全部信息。
- **返回格式**: 返回更新后的“通用图集对象”。

### `PATCH /api/imagesets/<id>/`
- **描述**: 部分更新一个图集的信息。
- **返回格式**: 返回更新后的“通用图集对象”。

### `DELETE /api/imagesets/<id>/`
- **描述**: 删除一个图集及其关联的所有文件。
- **返回格式**: `HTTP 204 No Content`

### `GET /api/imagesets/<id>/pages/`
- **描述**: 获取特定图集关联的所有页面的 URL 列表。
- **返回格式**:
  ```json
  {
    "pages": [
      "http://127.0.0.1:8080/media/image_sets/example/01.jpg",
      "http://127.0.0.1:8080/media/image_sets/example/02.jpg"
    ]
  }
  ```

### `POST /api/imagesets/<id>/add-images/`

- **描述**: 为一个已存在的图集添加一个或多个新图片。
- **请求体**: `multipart/form-data`，包含：
    - `images` (文件): 一个或多个图片文件。
- **返回格式**:
  ```json
  {
    "message": "成功向图集 'Example Image Set' 添加了 2 张图片。",
    "total_pages": 102
  }
  ```

---

## 元数据 (Meta)

基础路径: `/api/meta/`

### `GET /api/meta/category-tags/`

- **描述**: 获取所有类型的分类标签（系列、角色、标签、作者）的列表。
- **请求参数**:
    - `mode` (str): 设置为 `rank` 可获取每个分类下最热门的标签。
    - `ref_type` (str): 当 `mode=rank` 时，指定用于排序的关联类型，可选值为 `comics` (默认) 或 `imagesets`。
    - `type` (str): 指定返回的分类类型，可选值为 `series`, `characters`, `tags`, `authors`。
    - `limit` (int): 配合 `mode=rank` 使用，限制返回数量。
    - `r18` (bool): `false` 表示排除 R18 标签。
- **返回格式**: 返回一个以分类名为键，标签对象数组为值的字典。
  ```json
  {
    "series": [{"name": "Series A"}, {"name": "Series B"}],
    "characters": [{"name": "Character 1"}],
    "tags": [{"name": "Tag X"}, {"name": "Tag Y"}],
    "authors": [{"name": "Author Z"}]
  }
  ```

### `POST /api/meta/category-tags/`

- **描述**: 创建一个新的分类标签（系列、角色、标签、作者）。
- **请求体**: JSON 格式，例如 `{"tags": [{"name": "new-tag", "is_r18": true}]}`。
- **返回格式**: `HTTP 201 Created` 并附带创建的标签信息。

### `PATCH /api/meta/category-tags/`

- **描述**: 更新特定标签的 `is_r18` 属性。此操作仅对 `type` 为 `tags` 的标签有效。
- **请求体**: JSON 格式。
  ```json
  {
    "type": "tags",
    "name": "some-existing-tag",
    "is_r18": false
  }
  ```
- **返回格式**: `HTTP 200 OK` 并返回更新后的标签对象。
  ```json
  {
    "name": "some-existing-tag",
    "is_r18": false
  }
  ```

### `DELETE /api/meta/category-tags/`

- **描述**: 通过名称删除一个指定的分类标签。
- **请求参数**:
    - `type` (str, required): 要删除的标签类型，可选值为 `series`, `characters`, `tags`, `authors`。
    - `name` (str, required): 要删除的标签的名称。
- **返回格式**: `HTTP 204 No Content`