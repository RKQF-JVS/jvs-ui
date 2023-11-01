import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import common from './modules/common'
import tags from './modules/tags'
import getters from './getters'
import socket from './modules/socket'
import iconLib from './modules/icon'
import * as globalTypes from './types/global'
import { setStore } from "@/util/store";

Vue.use(Vuex)

const initState = {
  direction: 'forward',
  theme: 'dark', // light / dark
  // 主题风格参数
  params: {
    themeColor: '', // 主题颜色
    activeColor: '', // 激活状态颜色
    // 字体
    font: {
      size: '', // 大小
      color: '', // 颜色
    },
    // logo设置
    logo: {
      width: '240px', // 宽
      height: '64px', // 高
      fit: 'contain', // 图片显示填充方式
      color: '#1890ff', // 字体颜色
      fontSize: '16px', // 字体大小
      fontWeight: 400, // 字体粗细
      backgroundColor: '#fff', // 背景颜色
    },
    // 表单设置
    form: {
      size: 'mini', // 表单内组件的尺寸  medium / small / mini
    },
    btn: {
      size: 'mini', // 表单内组件的尺寸  medium / small / mini
    },
    table: {
      size: 'small', // 表单内组件的尺寸  medium / small / mini
    }
  },
  labelValue: null
}
const actions = {};
const mutations = {
  [globalTypes.UPDATE_DIRECTION](state, direction) {
    state.direction = direction;
  },
  [globalTypes.UPDATE_THEME](state, theme) {
    state.theme = theme;
  },
  SET_LabelValue: (state, labelValue) => {
    state.labelValue = labelValue;
    setStore({
      name: "labelValue",
      content: state.labelValue
    });
  },
}

const store = new Vuex.Store({
  modules: {
    user,
    common,
    tags,
    socket,
    iconLib
  },
  getters,
  actions,
  state: initState,
  mutations
})

export default store
