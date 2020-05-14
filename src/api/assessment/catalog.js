import request from '@/utils/request'

// 查询部门列表
export function listCatalog(query) {
  return request({
    url: '/assessment/catalog/list',
    method: 'get',
    params: query
  })
}

// 查询部门详细
export function getCatalog(deptId) {
  return request({
    url: '/assessment/catalog/' + deptId,
    method: 'get'
  })
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
    url: '/assessment/catalog/treeselect',
    method: 'get'
  })
}


// 查询部门下拉树结构
export function treeselectbytenantId(tenantId) {
  return request({
    url: '/assessment/catalog/treeselectbytenantId/'+tenantId,
    method: 'get'
  })
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
  return request({
    url: '/assessment/catalog/roleDeptTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增部门
export function addCatalog(data) {
  return request({
    url: '/assessment/catalog',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateCatalog(data) {
  return request({
    url: '/assessment/catalog',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delCatalog(deptId) {
  return request({
    url: '/assessment/catalog/' + deptId,
    method: 'delete'
  })
}
