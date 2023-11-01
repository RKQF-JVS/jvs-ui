<template>
  <div class="coder-editor-entity" :id="prop">
  </div>
</template>
<script>
export default {
  name: 'coder-editor',
  props: {
    prop: {
      type: String
    },
    code: {
      type: String
    }
  },
  data() {
    return {
      codeCon: ''
    }
  },
  methods: {
    initCodeEdit () {
      let _this = this
      let editor = ace.edit(this.prop)
      // editor.setTheme("ace/theme/twilight"); // 黑色
      let JsonMode = ace.require("ace/mode/json").Mode;
      editor.session.setMode(new JsonMode());
      editor.getSession().setUseWrapMode(true); // 自动换行
      editor.setHighlightActiveLine(false); // 高亮显示
      if(_this.codeCon) {
        editor.setValue(codeCon)
      }
      editor.getSession().on('change', function(e) {
        _this.codeCon = editor.getValue()
        if(!_this.codeCon && !_this.trim(_this.code)) {
          _this.$emit('change', _this.codeCon)
        }else{
          // editor.getSession().$worker.changeListener
          if(_this.isJSON(_this.codeCon)) {
            _this.$emit('change', _this.codeCon)
          }else{
            _this.$emit('change', "error")
          }
        }
      });
    },
    trim (str){
      return (str || "").replace(/^\s+|\s+$/g,"");
    },
    isJSON(str) {
      if (typeof str == 'string') {
        try {
          var obj=JSON.parse(str);
          if(typeof obj == 'object' && obj ){
              if(obj instanceof Array) {
                return false
              }else{
                if(JSON.stringify(obj) == "{}") {
                  return false
                }else{
                  return true
                }
              }
          }else{
              return false;
          }
        }catch(e) {
          // console.log('error：'+str+'!!!'+e);
          return false;
        }
      }
    }
  },
  mounted () {
    this.initCodeEdit()
  },
}
</script>
<style lang="scss">
  .coder-editor-entity{
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>