import {request} from './api.js'
const baseUrl = `/gnc-manager/v1`

// 获取项目
export function getMenusList() {
  return request({
    url: `${baseUrl}/projects`,
    method: 'get',
  })
}
// 获取菜单
export function getMenu(data) {
  return request({
    url: `${baseUrl}/apis/menus/${data}`,
    method: 'get'
  })
}
//获取公共说明
export function getDocCommonInfos(data) {
  return request({
    url: `${baseUrl}/docCommonInfos/getDataById/${data}`,
    method: 'get'
  })
}
//获取api文档说明
export function getDocApiInfos(data) {
  return request({
    url: `${baseUrl}/docApiInfos/${data}`,
    method: 'get'
  })
}
//获取搜索列表
export function getApiSearch() {
  return request({
    url: `${baseUrl}/apis/search`,
    method: 'get'
  })
}
//登录