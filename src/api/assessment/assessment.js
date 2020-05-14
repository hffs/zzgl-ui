import request from '@/utils/request'

// 查询邀约评审列表
export function listAssessment(query) {
  return request({
    url: '/assessment/assessment/list',
    method: 'get',
    params: query
  })
}

// 查询邀约评审详细
export function getAssessment(id) {
  return request({
    url: '/assessment/assessment/' + id,
    method: 'get'
  })
}

// 新增邀约评审
export function addAssessment(data) {
  return request({
    url: '/assessment/assessment',
    method: 'post',
    data: data
  })
}

// 修改邀约评审
export function updateAssessment(data) {
  return request({
    url: '/assessment/assessment',
    method: 'put',
    data: data
  })
}

// 删除邀约评审
export function delAssessment(id) {
  return request({
    url: '/assessment/assessment/' + id,
    method: 'delete'
  })
}

// 导出邀约评审
export function exportAssessment(query) {
  return request({
    url: '/assessment/assessment/export',
    method: 'get',
    params: query
  })
}

// 查询历史记录
export function getHistry(invitationId) {

  return request({
    url: '/assessment/assessment/getHistry',
    method: 'get',
    params: invitationId
  })
}
// 查询历史记录
export function downloadpsba(aid) {

  return request({
    url: '/assessment/evaluationTable/downlodepsb',
    method: 'get',
    params: aid
  })
}



// 提交类型查重
export function judgementExists(auditType) {
  return request({
    url: '/assessment/assessment/judgementExists',
    method: 'get',
    params: auditType
  })
}
