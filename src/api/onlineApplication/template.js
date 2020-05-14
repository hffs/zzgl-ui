import request from '@/utils/request'

// 查询资质申请模板列表
export function listTemplate(query) {
  return request({
    url: '/onlineApplication/template/list',
    method: 'get',
    params: query
  })
}

// 查询资质申请模板详细
export function getTemplate(id) {
  return request({
    url: '/onlineApplication/template/' + id,
    method: 'get'
  })
}




// 新增资质申请模板
export function addTemplate(data) {
  return request({
    url: '/onlineApplication/template',
    method: 'post',
    data: data
  })
}

// 修改资质申请模板
export function updateTemplate(data) {
  return request({
    url: '/onlineApplication/template',
    method: 'put',
    data: data
  })
}

// 删除资质申请模板
export function delTemplate(id) {
  return request({
    url: '/onlineApplication/template/' + id,
    method: 'delete'
  })
}

// 导出资质申请模板
export function exportTemplate(query) {
  return request({
    url: '/onlineApplication/template/export',
    method: 'get',
    params: query
  })
}

//查询关于资质申请流程入口类型数据，展现方式为级联数据组
export function CascadeConsultationJson() {
  return request({
    url: '/onlineApplication/template/CascadeConsultationJson',
    method: 'get'
  })
}

//查询流程选项卡
export function getTempAndData(data) {
  return request({
    url: "/consultationManagement/management/getTempAndData",
    method: 'post',
    data: data
  })
}
