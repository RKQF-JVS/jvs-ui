<template>
  <div id="contentBox"></div>
</template>
<script>
import E from 'wangeditor'
export default {
  name: 'html-content',
  props: {
    editorProp: {
      type: Object
    },
    searchOption: {
      type: Object
    },
    rowData: {
      type: Object
    },
    form: {
      type: Object
    }
  },
  data(){
    return {}
    editor: null
  },
  methods: {
    // 初始化富文本
    initEditor () {
      let _this = this
      if(this.editor) {
        this.editor.destroy()
      }
      _this.editor = new E('#contentBox')
      _this.editor.config.uploadImgShowBase64 = true
      _this.editor.config.menus = [
        'head',
        'bold',
        'fontSize',
        'fontName',
        'italic',
        'underline',
        'strikeThrough',
        'indent',
        'lineHeight',
        'foreColor',
        'backColor',
        'link',
        'list',
        'justify',
        'quote',
        'emoticon',
        'image',
        'table',
        'code',
        'splitLine',
        'undo',
        'redo',
      ]
      _this.editor.config.onblur = function (newHtml) {
        if(_this.rowData && _this.rowData.sendType != 'sms') {
          if(!newHtml || JSON.stringify(newHtml) == '" "' || newHtml == '<p></p>' && newHtml == '<p><br></p>') {
            _this.rowData.content = ""
          }else{
            _this.rowData.content = newHtml
          }
        } 
      }
      _this.editor.config.onchange = function (newHtml) {
        if(_this.rowData && _this.rowData.sendType != 'sms') {
          if(!newHtml || JSON.stringify(newHtml) == '" "' || newHtml == '<p></p>' && newHtml == '<p><br></p>') {
            _this.rowData.content = ""
          }else{
            _this.rowData.content = newHtml
          }
        } 
      }
      _this.editor.create()
      if(_this.rowData && _this.rowData.sendType != 'sms' && _this.rowData.content) {
        _this.editor.txt.html(_this.rowData.content)
      }
      if(this.searchOption.disabled) {
        _this.editor.disable()
      }else{
        _this.editor.enable()
      }
      this.$forceUpdate()
    },
    submit() {
      if(this.form) {
        let _this = this
        this.editor.config.onblur = function (newHtml) {
          this.form.content = newHtml
        }
        this.editor.config.onchange = function (newHtml) {
          this.form.content = newHtml
        }
      }
    }
  },
  mounted() {
    this.initEditor()
  },
  watch: {
    'rowData.content': {
      handler(newHtml, oldHtml) {
        if(!newHtml || JSON.stringify(newHtml) == '" "' || newHtml == '<p></p>' && newHtml == '<p><br></p>') {
          this.$emit('validate', 'content')
        }else{
          this.$emit('clear', 'content')
        }
      }
    }
  }
}
</script>
<style scoped>

</style>