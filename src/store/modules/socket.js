import Socket from "@/api/socket"
import { getStore, setStore } from "@/util/store.js"
const wsUrl = 'ws://' + location.host + '/im/'
const env = process.env
let messageUrl = ''
if (env.NODE_ENV == 'development') {
  messageUrl = 'ws://10.0.0.38:10000'
} else {
  messageUrl = 'ws://' + location.host
}
import { Notification } from 'element-ui';
import store from "@/store";
const socket = {
  state: {
    $socket: null,
    socketMsg: {
      timeStamp: 0,
      type: '',
      data: {},
      command: null
    },
    $messageSocket:null,
    messageSocketMsg:getStore({name:'remainingCount'}) || {
      remainingCount:0
    }
  },
  mutations: {
    INIT: (state, docId) => {
      if(state.$socket) {
        if(!state.$socket._websocket || state.$socket._websocket.readyState === 3) {
          state.$socket = null
        }
      }
      if (state.$socket !== null) return
      const token = getStore({name: 'access_token'})
      if (!token) return
      let tempLinkId = docId
      const socketToken = 'Bearer ' + token
      state.$socket = new Socket(`${wsUrl}?logType=${encodeURI('default')}&value=${socketToken}&tempLinkId=${tempLinkId}`,token,true)
      state.$socket.init()
      state.$socket.addMethods([(e) => {
        if (e.type === 'close') {
          state.socketMsg = {
            timeStamp: e.timeStamp,
            type: e.type,
            data: 'socket已断开连接'
          }
          state.$socket = null
        }
        try {
          const parseData = e.data ? JSON.parse(e.data) : JSON.parse(e)
          state.socketMsg = {
            timeStamp: e.timeStamp,
            type: parseData.type || e.type,
            data: parseData.data,
            command: parseData.command
          }
        } catch (error) {
          console.error(error)
        }
      }])
    },
    MESSAGE_INIT:(state, userId)=>{
      if(state.$messageSocket) {
        if(!state.$messageSocket._websocket || state.$messageSocket._websocket.readyState === 3) {
          state.$messageSocket = null
        }
      }
      if (state.$messageSocket !== null) return
      state.$messageSocket = new Socket(`${messageUrl}/inside/notice/${userId}/${store.getters.tenantId}`,null,false)
      state.$messageSocket.init()
      state.$messageSocket.addMethods([(e) => {
        if (e.type === 'close') {
          state.messageSocketMsg = {
            timeStamp: e.timeStamp,
            type: e.type,
            data: 'socket已断开连接'
          }
          state.$socket = null
        }
        try {
          const parseData = e.data ? JSON.parse(e.data) : JSON.parse(e)
          state.messageSocketMsg = parseData
          console.log(parseData)
          if (parseData.remainingCount > 0) {
            Notification({
              title: '提示',
              message: '您有新消息' ,
              position: 'bottom-right'
            })
          }
          setStore({name:'remainingCount',content:parseData})
        } catch (error) {
          console.error(error)
        }
      }])
    },
    MESSAGE_CLOSE(state,data){
      if(state.$messageSocket){
        state.$messageSocket.wsClose()
        state.$messageSocket = null
      }
    },
    SET_MESSAGE_DATA:(state, data)=>{
      state.messageSocketMsg = data
      setStore({name:'remainingCount',content:data})
    }
  },
  actions: {
    // message socket 初始化
    MESSAGE_WS_INIT({ commit },userId){
      commit('MESSAGE_INIT', userId)
    },
    MESSAGE_WS_CLOSE({commit}){
      commit('MESSAGE_CLOSE')
    },
    // socket 初始化
    WS_INIT({ commit }, docId) {
      commit('INIT', docId)
    },
    // socket 断开连接
    DISCONNECT({ commit }) {
      console.log("socket连接已断开")
    },
    // 发送消息
    SEND_MESSAGE({ commit, state }, data) {
      if (state.$socket._websocket && state.$socket._websocket.readyState == 1) {
        state.$socket.send(data)
      }
    }
  }
}

export default socket
