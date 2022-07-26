<template>
  <div class="jvs-step">
    <div class="step-bar-header">
      <div class="step-bar-header-item"
        v-for="(ti, tindex) in option.column"
        :key="'step-bar'+ti.name"
        :class="{'last': tindex == (stepNumber - 1), 'active': ti.name == activeName}"
        v-if="ti.show"
        @click="handleClick(ti, tindex)"
      >
        <span class="step-bar-header-item-title">{{ti.label}}</span>
      </div>
    </div>
    <div class="step-bar-content">
      <div
        v-for="(item, index) in option.column"
        :key="item.name"
        :label="item.label"
        :disabled="item.disabled"
        :name="item.name"
        :lazy="item.lazy"
        v-if="item.name == activeName"
      >
        <el-form
          :model="forms[item.name]"
          :ref="formRef || 'ruleForm'"
          class="demo-dynamic"
          size='mini'
          :label-position="originOption.formAlign || defalutSet.option.formAlign"
          :label-width="originOption.labelWidth || defalutSet.option.labelWidth"
          :disabled='originOption.disabled'
        >
          <el-row v-if="formItem.column && formItem.column[item.name] && formItem.column[item.name].length > 0" style="width:100%;">
            <el-col
              v-for="it in formItem.column[item.name]"
              :key="it.prop"
              :span="it.span || 24"
              v-show="it.display == false ? it.display : true"
              :class="{'no-label-form-item': it.hideLabel}"
              v-if="displayExpressHandle(it)"
            >
              <!-- 一般项 -->
              <el-form-item
                v-if="(it.type !='title' && (!it.children || it.children.length == 0) || it.type == 'formbox') && $permissionMatch(it.permisionFlag) && (it.display == false ? it.display : true)"
                :label="it.label"
                :prop='it.prop'
                :rules='it.rules'
                v-model="forms[item.name][it.prop]"
                :label-width="it.type==='iframe'?'0':(originOption.labelWidth || defalutSet.option.labelWidth)"
                :class='{"form-item-no-label": ( (!it.label && it.type != "tab") || (["tableForm","divider","p","section"].indexOf(it.type) > -1) ), "form-item-no-label-tab": (!it.label && it.type == "tab"), "reportTable-item": it.type == "reportTable"}'
              >
                <FormItem  :item="it" :form="forms[item.name]"
                  :originOption="originOption"
                  :defalutSet="defalutSet"
                  :roleOption="roleOption"
                  :userList="userList"
                  :departmentList="departmentList"
                  :postList="postList"
                  :resetRadom="resetRadom"
                  @formChange="formChange" />
              </el-form-item>
              <!-- 子表单项 -->
              <el-row v-if="it.type != 'formbox' && it.children && it.children.length > 0">
                <el-form-item
                  :label="it.label"
                  :prop="it.prop"
                  :rules="it.rules"
                  v-model="forms[item.name][it.prop]"
                  v-if="displayExpressHandle(it) && (it.display == false ? it.display : true)"
                  :class='(!it.label || (["tableForm","divider","p","tab","section"].indexOf(it.type) > -1))? "form-item-no-label" : ""'
                >
                  <FormItem
                    v-if="!it.formSlot"
                    :form="forms[item.name]"
                    :item="it"
                    :originOption="originOption"
                    :defalutSet="defalutSet"
                    @formChange="formChange"
                    :roleOption="roleOption"
                    :userList="userList"
                    :departmentList="departmentList"
                    :postList="postList"
                    :resetRadom="resetRadom"
                  />
                  <!-- 自定义列插槽 -->
                  <div v-if="it.formSlot">
                    <slot :name="it.prop+'Form'"></slot>
                    <!-- 右侧提示 -->
                    <el-tooltip
                      v-if="it.tips && it.tips.position == 'right' && it.tips.text"
                      class="form-item-tooltip"
                      effect="dark"
                      :content="it.tips.text"
                      placement="top"
                    >
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </div>
                  <!-- 换行提示 -->
                  <el-row
                    v-if="it.tips && it.tips.position == 'bottom'"
                    class="form-item-tips"
                  >
                    <span v-html="it.tips.text"></span>
                  </el-row>
                </el-form-item>
                <el-col
                  v-for="itc in it.children"
                  :key="itc.prop"
                  :span="itc.span || originOption.span || 24"
                  v-if="displayExpressHandle(itc)"
                >
                  <el-form-item
                    :label="itc.label"
                    :prop="itc.prop"
                    v-model="forms[item.name][itc.prop]"
                    v-if="itc.display === false ? false : linkbindHandle(forms[item.name][it.prop], itc.linkbind)"
                    :rules="itc.rules"
                    :class='(!itc.label || (["tableForm","divider","p","tab","section"].indexOf(itc.type) > -1))? "form-item-no-label" : ""'
                  >
                    <FormItem
                      v-if="!itc.formSlot"
                      :form="forms[item.name]"
                      :item="itc"
                      :formRef="defalutSet.refs"
                      :originOption="originOption"
                      :defalutSet="defalutSet"
                      @formChange="formChange"
                      :roleOption="roleOption"
                      :userList="userList"
                      :departmentList="departmentList"
                      :postList="postList"
                      :resetRadom="resetRadom"
                    />
                    <!-- 自定义列插槽 -->
                    <div v-if="itc.formSlot">
                      <slot :name="itc.prop+'Form'"></slot>
                      <!-- 右侧提示 -->
                      <el-tooltip
                        v-if="itc.tips && itc.tips.position == 'right' && itc.tips.text"
                        class="form-item-tooltip"
                        effect="dark"
                        :content="itc.tips.text"
                        placement="top"
                      >
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                    </div>
                    <!-- 换行提示 -->
                    <el-row
                      v-if="itc.tips && itc.tips.position == 'bottom'"
                      class="form-item-tips"
                    >
                      <span v-html="itc.tips.text"></span>
                    </el-row>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
        <slot :name="item.name"></slot>
        <div class="step-bar-button" :style="'display:flex;justify-content:'+ (formItem.toolAlign ? formItem.toolAlign : 'center') +';'">
          <jvs-button size="mini" type="primary" v-for="(bi, bindex) in formItem.dicData[index].btns" :key="bi.name+bindex" @click="btnClick(bi)">{{bi.name}}</jvs-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {sendMyRequire} from '@/api/newDesign'
export default {
  name: "jvs-step",
  components: {FormItem: () => import('@/components/basic-assembly/formitem')},
  props: {
    // 绑定值，选中选项卡的 name
    active: {
      type: String,
      default: ''
    },
    // 选项卡配置
    option: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 表单传递对象
    forms: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 表单结构对象
    formItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formRef: {
      type: String,
      default: 'ruleForm'
    },
    originOption: {
      type: Object
    },
    originForm: {
      type: Object
    },
    // 用户列表
    userList : {
      type: Array,
      default: () => {
        return []
      }
    },
    // 角色列表
    roleOption: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 部门列表
    departmentList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 岗位列表
    postList: {
      type: Array,
      default: () => {
        return []
      }
    },
    rowData: {
      type: Object
    },
    resetRadom: {
      type: Number
    }
  },
  data () {
    return {
      activeName: '',
      stepNumber: 0,
      defaultOption: {
        column: [
          {
            label: '', // 选项卡标题
            disabled: false, // 是否禁用
            name: '', // 与选项卡绑定值 value 对应的标识符，表示选项卡别名, 该选项卡在选项卡列表中的顺序值，如第一个选项卡则为'1'
            lazy: false, // 标签是否延迟渲染
            permisionFlag: '', // 权限标识
          }
        ]
      },
      defalutSet: {
        refs: 'ruleForm',
        option: {
          formAlign: 'right', //对其方式
          inline: false, // 表单项是否可以同行,当垂直方向空间受限且表单较简单时，可以在一行内放置表单
          labelWidth: 'auto', // label宽
          searchBtn: true, // 搜索按钮是否显示，默认显示
          searchBtnText: '查询', // 搜索按钮，默认查询
          submitBtn: true, // 提交按钮是否显示，默认显示
          submitBtnText: '提交', // 提交按钮文字，默认 提交
          emptyBtn: true, // 重置按钮，默认显示
          emptyBtnText: '重置', // 重置按钮文字，默认 重置
          cancalBtnText: '取消', // 取消按钮文字， 默认 取消
        }
      },
      stepType: '',
      tempData: null,
      initData: ""
    }
  },
  created () {
    this.dealPermission()
    if(this.active) {
      this.activeName = this.active
      for(let i in this.option.column) {
        if(this.option.column[i].name == this.activeName) {
          this.stepNumber = i
        }
      }
    }
    this.getStepEchoData()
    this.initData = JSON.stringify(this.forms)
  },
  methods: {
    handleClick (item, index) {
      return false
      this.stepNumber = index
      this.activeName = item.name
      this.getStepEchoData()
    },
    // 处理权限
    dealPermission () {
      for(let i in this.option.column) {
        if(!this.option.column[i].permisionFlag) {
          this.option.column[i].show = true
        }else{
          this.option.column[i].show = this.$permissionMatch(this.option.column[i].permisionFlag)
        }
        // 加入自定义校验
        let tcol = this.formItem.column[this.option.column[i].name]
        if(tcol && tcol.length > 0) {
          for(let t in tcol) {
            if(tcol[t].regularExpression){
              let required = false
              if(tcol[t].rules && tcol[t].rules[0].required) {
                required = true
              }
              let str = '/' + tcol[t].regularExpression + '/'
              let _this = this
              tcol[t].rules.push({
                validator: function(rule, value, callback) {
                  if(eval(str).test(value)) {
                    callback()
                  }else{
                    let msg = '正则校验不通过'
                    if(tcol[t].regularMessage) {
                      msg = tcol[t].regularMessage
                    }
                    if(required == false && !value) {
                      callback()
                    }else{
                      callback(new Error(msg));
                    }
                  }
                },
                trigger: ['blur', 'change']
              })
            }
          }
        }
      }
      this.option.column = this.option.column.filter(item => item.show)
    },
    // 值变化
    formChange (form) {
      this.$set(this.forms, this.activeName, form)
      this.$forceUpdate()
      this.$emit('formChange', this.forms)
    },
    lastHandle () {
      let num = Number.parseInt(this.stepNumber) - 1
      this.activeName = this.formItem.dicData[num].name
      this.stepNumber = num
      this.getStepEchoData()
    },
    nextHandle () {
      let num = Number.parseInt(this.stepNumber) + 1
      this.activeName = this.formItem.dicData[num].name
      this.stepNumber = num
      this.getStepEchoData()
    },
    btnClick (btn) {
      let tp = JSON.parse(JSON.stringify(btn))
      if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
        tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
      }
      if(btn.type) {
        this.stepType = btn.type
      }
      if(tp && tp.url) {
        sendMyRequire(tp, this.forms[this.activeName]).then(res => {
          if(res.data.code == 0) {
            if(res.data.data) {
              this.tempData = res.data.data
            }
            if(btn.type == 'next') {
              this.nextHandle()
            }
            if(btn.type == 'last') {
              this.lastHandle()
            }
          }
        })
        // .catch(e => {
        //   this.tempData = {test: '的手机客户端撒谎'}
        //   if(btn.type == 'next') {
        //     this.nextHandle()
        //   }
        //   if(btn.type == 'last') {
        //     this.lastHandle()
        //   }
        // })
      }else{
        if(btn.type == 'next') {
          this.nextHandle()
        }
        if(btn.type == 'last') {
          this.lastHandle()
        }
      }
    },
    // 联动控制
    linkbindHandle (val, bind) {
      let bool = true
      if(bind) {
        if(val) {
          let arr = bind.split(',')
          if(val instanceof Array) {
            let tb = false
            for(let i in val) {
              if(arr.indexOf(val[i]) > -1) {
                tb = true
              }
            }
            bool = tb
          }else{
            if(arr.indexOf(val) > -1) {
              bool = true
            }else{
              bool = false
            }
          }
        }
      }
      return bool
    },
    getStepEchoData () {
      if(this.option.column[this.stepNumber] && this.option.column[this.stepNumber].echoHttp) {
        let tp = JSON.parse(JSON.stringify(this.option.column[this.stepNumber].echoHttp))
        if(this.$store.state.labelValue && this.$store.state.labelValue.requestContentType) {
          tp.requestContentType = this.$store.state.labelValue.requestContentType[tp.requestContentType]
        }
        let query = null
        if(tp && tp.url) {
          if(['last', 'next'].indexOf(this.stepType) == -1) {
            if(this.rowData) {
              query = JSON.parse(JSON.stringify(this.rowData))
            }
          }else{
            if(this.tempData) {
              query = JSON.parse(JSON.stringify(this.tempData))
            }else{
              let key = ""
              if(this.stepType == 'last') {
                key = this.option.column[this.stepNumber+1].name
              }
              if(this.stepType == 'next') {
                key = this.option.column[this.stepNumber-1].name
              }
              if(key) {
                query = JSON.parse(JSON.stringify(this.forms[key]))
              }
            }
          }
          sendMyRequire(tp, query).then(res => {
            if(res.data.code == 0) {
              if(res.data.data) {
                for(let i in res.data.data) {
                  this.$set(this.forms[this.activeName], i, res.data.data[i])
                }
              }
            }
          })
          // .catch(e => {
          //   let tp = {aa: 11, cc: 22}
          //   for(let i in tp) {
          //     this.$set(this.forms[this.activeName], i, tp[i])
          //   }
          // })
        }
      }
    },
    // 表达式控制显示
    displayExpressHandle (item) {
      let bool = false
      let formStr = 'this.originForm' // 表单值参数名
      if(item.displayExpress && item.displayExpress.length > 0) {
        let list = item.displayExpress
        let temp = []
        for(let i in list) {
          let prop = (formStr + '.') // 控制字段名
          if(list[i].parent && list[i].parent.length > 0) {
            prop += list[i].parent.join('.')
            prop += '.'
          }
          prop += list[i].prop

          // 校验层级表单值是否为undefined
          let tpr = ''
          let exValidate = true
          tpr += formStr
          for(let p in list[i].parent) {
            tpr += ('.' + list[i].parent[p])
            if(eval(tpr) == undefined) {
              exValidate = false
              break;
            }
          }
          if(exValidate) {
            let tv = JSON.stringify(list[i].value.split(','))
            tv += '.indexOf( '
            let tp = (tv + prop + ' + ' + "''" + ')')
            tp += (' > -1')
            temp.push(tp)
          }
        }
        if(temp.length > 0) {
          if(eval(temp.join(' || '))) {
            bool = true
          }
        }
      }else{
        bool = true
      }
      return bool
    }
  },
  watch: {
    resetRadom: {
      handler (newVal, oldVal) {
        if(newVal > -1) {
          if(this.initData.startsWith('{')) {
            let temp = JSON.parse(this.initData)
            for(let i in this.option.column) {
              this.$set(this.forms, this.option.column[i].name, temp[this.option.column[i].name])
            }
          }
        }
      }
    }
  }
}
</script>
<style lang="scss">
.jvs-step{
  width: 100%;
  .step-bar-header{
    display: flex;
    width: 100%;
    align-items: center;
    flex-wrap: nowrap;
    word-break: keep-all;
    line-height: 40px;
    padding-bottom: 10px;
    .step-bar-header-item{
      height: 40px;
      background: #EEEEEE;
      color: #222222;
      text-align: center;
      flex: 1;
      position: relative;
      cursor: pointer;
      .step-bar-header-item-title{
        display: block;
        position: relative;
      }
      .step-bar-header-item-title::after{
        content: "";
        display: block;
        background: #EEEEEE;
        width: 0;
        height: 0;
        border-top: 20px solid transparent;
        border-left: 24px solid #EEEEEE;
        border-bottom: 20px solid transparent;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1;
      }
    }
    .step-bar-header-item.last{
      .step-bar-header-item-title::after{
        background: #3471FF;
      }
    }
    .step-bar-header-item.active{
      background: #3471FF;
      color: #fff;
      .step-bar-header-item-title::after{
        border-left-color: #3471FF;
        background: #EEEEEE;
      }
    }
    .step-bar-header-item::before, .step-bar-header-item::after{
        content: "";
        display: inline-block;
        position: absolute;
        background: #fff;
        width: 3px;
        height: 30px;
        top: 0;
        right: 0;
        z-index: 2;
    }
    .step-bar-header-item::before{
      transform-origin: 0 0;
      transform: rotate(-50deg) translateY(0px);
      right: 23px;
      height: 34px;
    }
    .step-bar-header-item::after{
      transform: rotate(46deg) translateY(27px);
      transform-origin: 0 0;
      right: -20px;
    }
    .step-bar-header-item:nth-last-of-type(1){
      .step-bar-header-item-title::after{
        display: none;
      }
    }
    .step-bar-header-item:nth-last-of-type(1)::before, .step-bar-header-item:nth-last-of-type(1)::after{
      display: none;
    }
    .step-bar-header-item:nth-of-type(1).active {
      .step-bar-header-item-title::after{
        background: #EEEEEE;
      }
    }
  }
}
</style>
