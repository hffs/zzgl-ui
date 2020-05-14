import request from '@/utils/request'

// 查询个人资质列表
export function listCert(query) {
  return request({
    url: '/zz/pers/cert/list',
    method: 'get',
    params: query
  })
}

// 查询个人资质详细
export function getCert(id) {
  return request({
    url: '/zz/pers/cert/' + id,
    method: 'get'
  })
}

// 新增个人资质
export function addCert(data) {
  return request({
    url: '/zz/pers/cert',
    method: 'post',
    data: data
  })
}

// 修改个人资质
export function updateCert(data) {
  return request({
    url: '/zz/pers/cert',
    method: 'put',
    data: data
  })
}

// 删除个人资质
export function delCert(id) {
  return request({
    url: '/zz/pers/cert/' + id,
    method: 'delete'
  })
}

// 导出个人资质
export function exportCert(query) {
  return request({
    url: '/zz/pers/cert/export',
    method: 'get',
    params: query
  })
}
