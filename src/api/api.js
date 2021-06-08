/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios';
import router from '@/router'
import { utils } from '@/utils/utils'

import { Message } from 'element-ui'

const http = 'http://gnc-test.gtg56.com:9000/router/service'
// create an axios instance
const request = axios.create({
  baseURL: http,
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 500000 // request timeout
})

request.interceptors.request.use(
  config => {
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    const token = `Bearer ${localStorage.getItem("lark_system_token")}`;
    if(localStorage.getItem("lark_system_token")){
      config.headers.Authorization = token
      config.headers['auth-project-name'] = localStorage.getItem('lark_system_project')
    }
    return config;
  }, error => {
    return Promise.reject(error)
  })

// 响应拦截器
request.interceptors.response.use(
  response => {
    if (response.status === 200) {
      if(!response.data.success){
        Message.error(response.data.msg)
        utils.showLoading(false)
      }else if(response.data.data.code === "ERROR"){
        utils.showLoading(false)
        Message.error("服务器错误")
      }else if(response.data.data.code === "TOKEN_ERROR"){
        utils.showLoading(false)
        Message.error("非法请求")
      }else if(response.data.data.code !== "SUCCESS"){
        utils.showLoading(false)
        Message.error(response.data.data.msg)
      }
      
      // 登录异常
      // "ACCESS_DENY"："访问未授权"、"TOKEN_EXPIRED"："用户登陆已过期"、 "AUTH_FAIL"："用户认证失败"
      if(response.data.data.code === "ACCESS_DENY" || response.data.data.code === "TOKEN_EXPIRED" || response.data.data.code === "AUTH_FAIL"){
        localStorage.removeItem('lark_system_token')
        router.replace({ name: "login" })
      }

      return Promise.resolve(response.data);
    } else {
      if (response.data.msg) {
        utils.showLoading(false)
        Message.error(response.data.msg)
      }
      return Promise.reject(response.data);
    }
  },
  // 服务器状态码不是200的情况    
  error => {
    let data = error.response.data
    if (data.code == 0) {
      utils.showLoading(false)
      Message.error('服务器错误')
    } else {
      if (data.msg) {
        utils.showLoading(false)
        Message.error(error.response.data.msg)
      } else {
        utils.showLoading(false)
        Message.error('服务器错误')
      }
    }
    return Promise.reject(error.response);
  }
);

export {
  request, 
  http
}