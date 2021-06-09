import { request } from './api.js'

export function login(parameter) {
  return request({
    url: `/lark-authentication/auth/token`,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'auth-project-name': localStorage.getItem('projectxx_project')
    },
    params: parameter
  })
}

export function getInfo(param) {
  return request({
    url: `/lark-system/v1/auth/username`,
    method: 'get',
    headers: {
      'auth-project-name': localStorage.getItem('projectxx_project')
    },
    params:param
  })
}

export function logout() {
  return request({
    url: `/lark-authentication/auth/logout`,
    method: 'post',
    headers: {
      'auth-project-name': localStorage.getItem('projectxx_project')
    },
  })
}