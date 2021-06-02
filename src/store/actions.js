
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
}
