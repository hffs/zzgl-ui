import request from '@/utils/request'

// 查询资质小类列表
export function listSubclass(query) {
  return request({
    url: '/zztp/subclass/list',
    method: 'get',
    params: query
  })
}

// 查询资质小类详细
export function getSubclass(id) {
  return request({
    url: '/zztp/subclass/' + id,
    method: 'get'
  })
}

// 新增资质小类
export function addSubclass(data) {
  return request({
    url: '/zztp/subclass',
    method: 'post',
    data: data
  })
}

// 修改资质小类
export function updateSubclass(data) {
  return request({
    url: '/zztp/subclass',
    method: 'put',
    data: data
  })
}

// 删除资质小类
export function delSubclass(id) {
  return request({
    url: '/zztp/subclass/' + id,
    method: 'delete'
  })
}

// 导出资质小类
export function exportSubclass(query) {
  return request({
    url: '/zztp/subclass/export',
    method: 'get',
    params: query
  })
}

// 导出资质大类
export function getAll() {
  return request({
    url: '/zztp/subclass/alllist',
    method: 'get',
    
  })
}