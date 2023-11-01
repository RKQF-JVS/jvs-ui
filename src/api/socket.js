export default class Socket {
  constructor(url,token, isToken) {
    if (this._websocket) {
      this._websocket.close()
      this._websocket = null
    }
    if(!url && isToken && !token) return
    this._websocket = new WebSocket(url)
    this._methods = []
  }

  async init() {
    this._websocket.onopen = event => {
      this._sendBeat()
    }
    this._websocket.onmessage = event => {
      this._websocketOnMessage(event)
    }
    this._websocket.onerror = event => {
      this._websocket.close()
      this._websocket = null
    }
    this._websocket.onclose = event => {
      // this.reconnect()
    }
  }

  async _websocketOnMessage(event) {
    this._call(event)
  }

  addMethods(fns) {
    this._methods = fns
  }

  // 重连
  reconnect() {
    if (this._timer) {
      clearInterval(this._timer)
      this._timer = null
    }
    if(this._websocket){
      this._websocket.close()
      this._websocket = null
    }
    this.init()
  }
  // 手动断开连接
  async wsClose(){
    if(this._websocket){
      this._websocket.close()
      this._websocket = null
    }
  }

  /**
   * 发送信息
   * @param data {String}
   */
  send(data) {
    this._websocket.send(JSON.stringify(data))
  }

  // 关闭 socket
  close() {
    // 清除定时脚本
    if (this._timer) {
      clearInterval(this._timer)
      this._timer = null
    }
  }

  _call(...args) {
    for (let i = 0, l = this._methods.length; i < l; i++) {
      const fn = this._methods[i]
      if (typeof fn !== 'function') continue
      fn.apply(null, args)
    }
  }

  // 发送心跳包，表明连接激活
  _sendBeat() {
    this._timer = setInterval(() => {
      const data = {
        cmd: 13,
        hbbyte: '1'
      }
      this._websocket.send(JSON.stringify(data))
    }, 30 * 1000)
  }
}
