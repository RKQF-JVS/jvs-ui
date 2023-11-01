export default class assembly {
    constructor (type,label,span){
      this.prop = type + new Date().getTime()
      this.type = type
      this.label = label
      this.span = span
      this.tips = {
        text: "",
        position: "right"
      }
    }
  }