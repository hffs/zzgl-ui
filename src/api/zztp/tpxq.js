import request from '@/utils/request'
// 导出资质大类
export function gettable() {
    return request({
      url: '/zztp/details/getTable',
      method: 'get',
      
    })
  }
