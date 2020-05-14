import request from '@/utils/request'

// 查询咨询管理列表
export function listManagement(query) {
  return request({
    url: '/consultationManagement/management/list',
    method: 'get',
    params: query
  })
}

// 查询咨询管理详细
export function getManagement(id) {
  return request({
    url: '/consultationManagement/management/' + id,
    method: 'get'
  })
}

// 新增咨询管理
export function addManagement(data) {
  return request({
    url: '/consultationManagement/management',
    method: 'post',
    data: data
  })
}

// 修改咨询管理
export function updateManagement(data) {
  return request({
    url: '/consultationManagement/management',
    method: 'put',
    data: data
  })
}

// 删除咨询管理
export function delManagement(id) {
  return request({
    url: '/consultationManagement/management/' + id,
    method: 'delete'
  })
}

// 导出咨询管理
export function exportManagement(query) {
  return request({
    url: '/consultationManagement/management/export',
    method: 'get',
    params: query
  })
}
export function getTempAndData(data) {
  return request({
    url: '/consultationManagement/management/getTempAndData',
    method: 'post',
    data: data
  })
}

//aaaaaa
export function applicationFeedback(data) {
  return request({
    url: '/consultationManagement/management/applicationFeedback',
    method: 'post',
    data: data
  })
}

export function changeStatus(params) {
  return request({
    url: '/consultationManagement/management/changeStatus',
    method: 'get',
    params: params
  })
}