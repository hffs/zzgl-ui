import request from '@/utils/request'

// 查询企业资质列表
export function listCert(query) {
  return request({
    url: '/zz/comp/cert/list',
    method: 'get',
    params: query
  })
}

// 查询企业资质详细
export function getCert(id) {
  return request({
    url: '/zz/comp/cert/' + id,
    method: 'get'
  })
}

// 新增企业资质
export function addCert(data) {
  return request({
    url: '/zz/comp/cert',
    method: 'post',
    data: data
  })
}

// 修改企业资质
export function updateCert(data) {
  return request({
    url: '/zz/comp/cert',
    method: 'put',
    data: data
  })
}

// 删除企业资质
export function delCert(id) {
  return request({
    url: '/zz/comp/cert/' + id,
    method: 'delete'
  })
}

// 导出企业资质
export function exportCert(query) {
  return request({
    url: '/zz/comp/cert/export',
    method: 'get',
    params: query
  })
}