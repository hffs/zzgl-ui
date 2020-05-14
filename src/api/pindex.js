import request from '@/utils/request'

export function getindexdata() {//获取租户使用情况
  return request({
    url: '/chart/sysTenantChart',
    method: 'get',
    // params: data
  })
}
export function getshengdata() {//国家政策统计-省市自治区
  return request({
    url: '/chart/gjzcByPolicyprovince',
    method: 'get',
    // params: data
  })
}
export function getzhengdata() {//国家政策统计-政策类型
  return request({
    url: '/chart/gjzcBytype',
    method: 'get',
    // params: data
  })
}
export function getqiyedata() {//企业资质统计
  return request({
    url: '/chart/enterpriseQualification',
    method: 'get',
    // params: data
  })
}
export function getqyrenyuandata() {//企业人员资质统计
  return request({
    url: '/chart/personalQualification',
    method: 'get',
    // params: data
  })
}
export function getzztpdata() {//资质图谱图表
  return request({
    url: '/chart/zztpCount',
    method: 'get',
    // params: data
  })
}
