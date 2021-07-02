import getters from './getters.js';

var state = {
  isLoading: false, //loading加载
  isMobile: false,
  isMenuStatus: false, //默认展开导航菜单
  userInfo: null,
  keepAliveRoute: ['dashboard']  //缓存的路由数组
};
const mutations = {
  getContinue(state, status) {
    state.isLoading = status;
  },
  setMobile(state, val) {
    state.isMobile = val
  },
  setMenuStatus(state, val) {
    state.isMenuStatus = val
  },
  setUserInfo(state, val){
    state.userInfo = val
  },
  setKeepAliveRoute(state, val){
    state.keepAliveRoute = val
  }
}
export default {state, mutations, getters};
