import request from '@/utils/request'

// 查询国家政策列表
export function listGjzc(query) {
  return request({
    url: '/gjzc/gjzc/list',
    method: 'get',
    params: query
  })
}

// 查询国家政策详细
export function getGjzc(id) {
  return request({
    url: '/gjzc/gjzc/' + id,
    method: 'get'
  })
}

// 新增国家政策
export function addGjzc(data) {
  return request({
    url: '/gjzc/gjzc',
    method: 'post',
    data: data
  })
}

// 修改国家政策
export function updateGjzc(data) {
  return request({
    url: '/gjzc/gjzc',
    method: 'put',
    data: data
  })
}

// 删除国家政策
export function delGjzc(id) {
  return request({
    url: '/gjzc/gjzc/' + id,
    method: 'delete'
  })
}

// 导出国家政策
export function exportGjzc(query) {
  return request({
    url: '/gjzc/gjzc/export',
    method: 'get',
    params: query
  })
}