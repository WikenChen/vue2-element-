
export default {
  commitLoading({ commit }, status) {
    commit('getContinue', status);
  },
  commitMobile({ commit }, val) {
    commit('setMobile', val);
  },
  commitMenuStatus({ commit }, val) {
    commit('setMenuStatus', val);
  },
  commitUserInfo({ commit }, val) {
    commit('setUserInfo', val);
  },
  commitKeepAliveRoute({ commit }, val) {
    commit('setKeepAliveRoute', val);
  },
}
