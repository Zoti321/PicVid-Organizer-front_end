export function findBreadcrumb(items, path, breadcrumb = []) {
  for (const item of items) {
    breadcrumb.push({ name: item.name, path: item.path })

    if (item.path === path) {
      return breadcrumb
    }

    if (item.children) {
      const result = findBreadcrumb(item.children, path, [...breadcrumb])
      if (result) return result
    }

    breadcrumb.pop()
  }
  return null
}
