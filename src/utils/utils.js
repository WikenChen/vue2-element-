import { Loading } from 'element-ui';

const utils = {
  loadingInstance: null,

  showLoading: function(type){
    if(type){
      utils.loadingInstance = Loading.service({ text: '拼命加载中...', 'background': 'rgba(0, 0, 0, 0.6)' })
    }else{
      if (utils.loadingInstance) {
        utils.loadingInstance.close()
      }
    }
  }
}

export { utils }