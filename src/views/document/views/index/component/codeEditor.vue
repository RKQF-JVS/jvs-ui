<template>
  <div class="componet-code-editor">
    <div class="code-box" v-if="!bool">
      <div v-highlight>
        <pre>
          <code :class="lang" v-html='dealHtml(content)'>
          </code>
          <slot></slot>
        </pre>
      </div>
    </div>
    <div :class="{'tool': true, 'code-tool': !bool}" v-if="needHide">
      <i class="el-icon-caret-bottom" v-if="bool" @click="changeShow"></i>
      <span class="show-code" v-if="bool" @click="changeShow">显示代码</span>
      <i class="el-icon-caret-top" v-if="!bool" @click="changeShow"></i>
      <span class="hide-code" v-if="!bool" @click="changeShow">隐藏代码</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    content: {
      type: String
    },
    lang: {
      type: String
    },
    needHide: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
      bool: true
    }
  },
  methods: {
    changeShow () {
      let bo = this.bool
      this.bool = !bo
    },
    dealHtml (str) {
      str = str.replace(/\</g, '&lt;')
      str = str.replace(/\>/g, '&gt;')
      return str
    }
  },
  created() {
    this.bool = this.initShow
  },
}
</script>
<style lang="scss">
.componet-code-editor{
  .code-box{
    pre{
      margin: 0;
      code{
        padding: 0 .5em;
      }
    }
  }
  .tool{
    color: #d3dce6;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #eaeefb;
    height: 34px;
    box-sizing: border-box;
    background-color: #fff;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    margin-top: 10px;
    span, i{
      cursor: pointer;
    }
    span{
      display: none;
    }
  }
  .tool:hover{
    span{
      display: block;
    }
    color: #409eff;
  }
  .code-tool{
    margin-top: -54px;
  }
}

</style>