import request from '@/utils/request'

// 查询资质详情列表
export function listDetails(query) {
  return request({
    url: '/zztp/details/list',
    method: 'get',
    params: query
  })
}

// 查询资质详情详细
export function getDetails(id) {
  return request({
    url: '/zztp/details/' + id,
    method: 'get'
  })
}

// 新增资质详情
export function addDetails(data) {
  return request({
    url: '/zztp/details',
    method: 'post',
    data: data
  })
}

// 修改资质详情
export function updateDetails(data) {
  return request({
    url: '/zztp/details',
    method: 'put',
    data: data
  })
}

// 删除资质详情
export function delDetails(id) {
  return request({
    url: '/zztp/details/' + id,
    method: 'delete'
  })
}

// 导出资质详情
export function exportDetails(query) {
  return request({
    url: '/zztp/details/export',
    method: 'get',
    params: query
  })
}