import { Loading } from 'element-ui';
import {request} from '@/api/api.js'
const SYSTEMURL = 'lark-system/v1'

const utils = {
  loadingInstance: null,

  showLoading: (type)=>{
    if(type ){
      !utils.loadingInstance && ( utils.loadingInstance = Loading.service({ text: '拼命加载中...', 'background': 'rgba(0, 0, 0, 0.6)' }) )
    }else{
      if (utils.loadingInstance) {
        utils.loadingInstance.close()
        utils.loadingInstance = null;
      }
    }
  },

  pager: ()=>{
    const page = {
      totalItems: 0,
      pageSize: 20,
      pageIndex:  1,
      pageOpt: [20, 40, 60, 80, 100]
    }
    return page
  },

  fullHeight: ()=> {
		let winHeight = 0,
			winWidth = 0;
		if (window.innerWidth)
			winWidth = window.innerWidth;
		else if ((document.body) && (document.body.clientWidth))
			winWidth = document.body.clientWidth;
		if (window.innerHeight)
			winHeight = window.innerHeight;
		else if ((document.body) && (document.body.clientHeight))
			winHeight = document.body.clientHeight;
		if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
			winHeight = document.documentElement.clientHeight;
			winWidth = document.documentElement.clientWidth;
		}
		return winHeight;
	},

  // 数据字典 筛选下拉框的数据
  getCodeDrop: (data) => {
    return request({
      url: `${SYSTEMURL}/dictionarys/getCode`,
      method: 'get',
      params: {code: data}
    }).then(res=>{
      return res.data.success ? (res.data.data?.children || []) : []
    })
  }
}

export { utils }