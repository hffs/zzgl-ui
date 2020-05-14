import request from '@/utils/request'

// 查询角色列表
export function listRole(query) {
  return request({
    url: '/tenant/role/list',
    method: 'get',
    params: query
  })
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: '/tenant/role/getInfo/' + roleId,
    method: 'get'
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/tenant/role/add',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/tenant/role/edit',
    method: 'post',
    data: data
  })
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: '/tenant/role/dataScope',
    method: 'put',
    data: data
  })
}

// 角色状态修改
export function changeRoleStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/tenant/role/updateStatus',
    method: 'post',
    data: data
  })
}

// 删除角色
export function delRole(roleId) {
  return request({
    url: '/tenant/role/' + roleId,
    method: 'delete'
  })
}
