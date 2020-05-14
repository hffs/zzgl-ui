import request from '@/utils/request'

// 查询资质大类列表
export function listAtlas(query) {
  return request({
    url: '/zztp/atlas/list',
    method: 'get',
    params: query
  })
}

// 查询资质大类详细
export function getAtlas(id) {
  return request({
    url: '/zztp/atlas/' + id,
    method: 'get'
  })
}

// 新增资质大类
export function addAtlas(data) {
  return request({
    url: '/zztp/atlas',
    method: 'post',
    data: data
  })
}

// 修改资质大类
export function updateAtlas(data) {
  return request({
    url: '/zztp/atlas',
    method: 'put',
    data: data
  })
}

// 删除资质大类
export function delAtlas(id) {
  return request({
    url: '/zztp/atlas/' + id,
    method: 'delete'
  })
}

// 导出资质大类
export function exportAtlas(query) {
  return request({
    url: '/zztp/atlas/export',
    method: 'get',
    params: query
  })
}


// 导出资质大类
export function getAll() {
  return request({
    url: '/zztp/atlas/alllist',
    method: 'get',
    
  })
}