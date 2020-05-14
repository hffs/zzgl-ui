import request from '@/utils/request'

// 查询部门列表
export function evaluationTableList(query) {
  return request({
    url: '/assessment/evaluationTable/evaluationTableList',
    method: 'get',
    params: query
  })
}
// 新增部门
export function add(data) {
  return request({
    url: '/assessment/evaluationTable',
    method: 'post',
    data: data
  })
}