const iconLib = {
  state: {
    lib: [], // 图标库
    allType: [], // 所有分类
    iconList: [], // 所有图标
  },
  mutations: {
    setLib(state, val) {
      state.lib = val
    },
    setAllType(state, val) {
      state.allType = val
    },
    setIconList(state, val) {
      state.iconList = val
    }
  },
  getters: {},
  actions: {},
  modules: {}
};
export default iconLib;
