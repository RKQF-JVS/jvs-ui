export default class gallery {
    constructor (shape){
      this.shape = shape
      this.span = 24
      this.id = shape + new Date().getTime()
    }
  }
