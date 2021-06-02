import getters from './getters.js';

var state = {
  isLoading: false, //loading加载
  isMobile: false,
  isMenuStatus: false //默认展开导航菜单
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
}
export default {state, mutations, getters};
