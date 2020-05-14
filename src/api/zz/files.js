import request from '@/utils/request'

// 查询企业资质附件列表
export function listFiles(query) {
  return request({
    url: '/zz/files/list',
    method: 'get',
    params: query
  })
}

// 查询企业资质附件详细
export function getFiles(id) {
  return request({
    url: '/zz/files/' + id,
    method: 'get'
  })
}

// 新增企业资质附件
export function addFiles(data) {
  return request({
    url: '/zz/files',
    method: 'post',
    data: data
  })
}

// 修改企业资质附件
export function updateFiles(data) {
  return request({
    url: '/zz/files',
    method: 'put',
    data: data
  })
}

// 删除企业资质附件
export function delFiles(id) {
  return request({
    url: '/zz/files/' + id,
    method: 'delete'
  })
}

// 导出企业资质附件
export function exportFiles(query) {
  return request({
    url: '/zz/files/export',
    method: 'get',
    params: query
  })
}

// 查询文件夹下拉树结构
export function treeselect(treeselect) {
  return request({
    url: '/zz/files/treeselect/'+treeselect,
    method: 'get',

  })
}
//文件上传
// export function uploadAvatar(data) {
//   return request({
//     url: '/zz/files/upload',
//     method: 'post',
//     data: data
//   })
// }
//文件夹上传，功能已经废弃
export function uploadfilder(data) {
  return request({
    url: '/zz/files/uploader',
    method: 'post',
    enctype:"multipart/form-data",
    contentType: false,
    processData: false,
    data: data
  })
}

export function uploadAvatar(data) {
  return request({
    url: '/system/file/upload',
    method: 'post',
    
    data: data
  })
}