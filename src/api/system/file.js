import request from '@/utils/request'

// 文件上传
export function uploadAvatar(data) {
  return request({
    url: '/system/file/upload',
    method: 'post',
    
    data: data
  })
}

export function uploadfilder(data) {
  return request({
    url: '/system/file/uploader',
    method: 'post',
    enctype:"multipart/form-data",
    contentType: false,
    processData: false, 
    data: data
  })
}
