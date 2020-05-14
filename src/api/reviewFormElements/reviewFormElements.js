import request from '@/utils/request'

// 评审表人员相关
export function list(query,url) {
  return request({
    url: url+'/list',
    method: 'get',
    params: query
  })
}

export function update(data,url) {
  return request({
    url: url,
    method: 'put',
    data: data
  })
}
export function add(data,url) {
  return request({
    url:url,
    method: 'post',
    data: data
  })
}

export function deleted(data,url) {
  return request({
    url:url,
    method: 'delete',
    data: data
  })
}
export function uploadAll(data) {
  return request({
    url: '/reviewFormElements/reviewSystemFile/uploadAll',
    method: 'post',
    data: data
  })
}
