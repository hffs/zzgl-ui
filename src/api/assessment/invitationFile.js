import request from '@/utils/request'

// 查询部门列表
export function listInvitationFile(query) {
  return request({
    url: '/assessment/invitationFile/list',
    method: 'get',
    params: query
  })
}

export function selectInvitationFileList(query) {
  return request({
    url: '/assessment/invitationFile/selectInvitationFileList',
    method: 'get',
    params: query
  })
}

// 查询部门详细
export function getCatalog(deptId) {
  return request({
    url: '/assessment/catalog/' + deptId,
    method: 'get'
  })
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
    url: '/assessment/catalog/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
  return request({
    url: '/assessment/catalog/roleDeptTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增部门
export function addInvitationFile(data) {
  return request({
    url: '/assessment/invitationFile',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateInvitationfile(data) {
  console.log(data)

  return request({
    url: '/assessment/invitationfile',
    method: 'put',
    data: data
  })
}

// 删除附件
export function delInvitationFile(fileId) {
  return request({
    url: '/assessment/invitationFile/' + fileId,
    method: 'delete'
  })
}
export function getHistryByFileId(invitationId) {

  return request({
    url: '/assessment/invitationFile/getHistryByFileId',
    method: 'get',
    params: invitationId
  })
}
/**
 * 初始化加载
 * @param {fileId} invitationId 
 */
export function initialization(invitationId) {

  return request({
    url: '/assessment/invitationFile/initialization',
    method: 'get',
    params: invitationId
  })
}
