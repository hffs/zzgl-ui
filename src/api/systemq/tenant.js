import request from '@/utils/request'

// 查询系统租户列表
export function listTenant(query) {
  return request({
    url: '/system/tenant/list',
    method: 'get',
    params: query
  })
}

// 查询系统租户详细
export function getTenant(tenantId) {
  return request({
    url: '/system/tenant/getInfo/' + tenantId,
    method: 'get'
  })
}

// 新增系统租户
export function addTenant(data) {
  return request({
    url: '/system/tenant/add',
    method: 'post',
    data: data
  })
}

// 修改系统租户
export function updateTenant(data) {
  return request({
    url: '/system/tenant/edit',
    method: 'post',
    data: data
  })
}

// 删除系统租户
export function delTenant(tenantId) {
  return request({
    url: '/system/tenant/' + tenantId,
    method: 'delete'
  })
}
// 租户状态修改
export function changeTenantStatus(tenantId, status) {
  const data = {
    tenantId,
    status
  }
  return request({
    url: '/system/tenant/updateStatus',
    method: 'post',
    data: data
  })
}
// 租户密码重置
export function resetTenantPwd(tenantId, password) {
  const data = {
    tenantId,
    password
  }
  return request({
    url: '/system/tenant/resetPwd/',
    method: 'post',
    data: data
  })
}
// 导出系统租户
export function exportTenant(query) {
  return request({
    url: '/system/tenant/export',
    method: 'get',
    params: query
  })
}
// 根据角色ID查询菜单下拉树结构
export function TenantMenuTreeselect(TenantId) {
  return request({
    url: '/system/tenant/menuTree/' + TenantId,
    method: 'get'
  })
}