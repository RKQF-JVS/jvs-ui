<template>
  <el-tabs
    :ref="formItem.prop"
    v-model="activeName"
    :type="option.type || defaultOption.type"
    :tab-position="option.tabPosition || defaultOption.tabPosition"
    :stretch="option.stretch || defaultOption.stretch"
    @tab-click="handleClick"
  >
    <el-tab-pane
      v-for="item in option.column"
      :key="item.name"
      :label="item.label"
      :disabled="item.disabled"
      :name="item.name"
      :lazy="item.lazy"
    >
      <el-form
        :model="forms[item.name]"
        :ref="formRef || 'ruleForm'"
        class="demo-dynamic"
        size='mini'
        :label-position="(originOption && originOption.formAlign) || defalutSet.option.formAlign"
        :label-width="(originOption && originOption.labelWidth) || defalutSet.option.labelWidth"
        :disabled='(originOption && originOption.disabled)'
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
              :label-width="it.type==='iframe'?'0':((originOption && originOption.labelWidth) || defalutSet.option.labelWidth)"
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
                :designId="designId"
                :isView="isView"
                :changeRandom="changeRandom"
                :changeDomItem="changeDomItem"
                :execsList="execsList"
                :jvsAppId="jvsAppId"
                :originForm="originForm"
                :parentDomWidth="parentDomWidth"
                @formChange="formChange(forms[item.name], it)"
                @reInitData="reInitData" />
            </el-form-item>
            <!-- 子表单项 -->
            <el-row v-if="it.type != 'formbox' && it.children && it.children.length > 0">
              <el-form-item
                :label="it.label"
                :prop="it.prop"
                :rules="it.rules"
                v-if="displayExpressHandle(it) && (it.display == false ? it.display : true)"
                v-model="forms[item.name][it.prop]"
                :class='(!it.label || (["tableForm","divider","p","tab","section"].indexOf(it.type) > -1))? "form-item-no-label" : ""'
              >
                <FormItem
                  v-if="!it.formSlot"
                  :form="forms[item.name]"
                  :item="it"
                  :originOption="originOption"
                  :defalutSet="defalutSet"
                  @formChange="formChange(forms[item.name], it)"
                  :roleOption="roleOption"
                  :userList="userList"
                  :departmentList="departmentList"
                  :postList="postList"
                  :designId="designId"
                  :resetRadom="resetRadom"
                  :isView="isView"
                  :changeRandom="changeRandom"
                  :changeDomItem="changeDomItem"
                  :execsList="execsList"
                  :jvsAppId="jvsAppId"
                  :originForm="originForm"
                  :parentDomWidth="parentDomWidth"
                  @reInitData="reInitData"
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
                  v-if="itc.display === false ? false : linkbindHandle(forms[item.name][it.prop], itc.linkbind)"
                  :rules="itc.rules"
                  v-model="forms[item.name][itc.prop]"
                  :class='{"form-item-no-label": (!itc.label || (["tableForm","divider","p","tab","section"].indexOf(itc.type) > -1)), "reportTable-item": itc.type == "reportTable"}'
                >
                  <FormItem
                    v-if="!itc.formSlot"
                    :form="forms[item.name]"
                    :item="itc"
                    :formRef="defalutSet.refs"
                    :originOption="originOption"
                    :defalutSet="defalutSet"
                    @formChange="formChange(forms[item.name], it)"
                    :roleOption="roleOption"
                    :userList="userList"
                    :departmentList="departmentList"
                    :postList="postList"
                    :resetRadom="resetRadom"
                    :designId="designId"
                    :isView="isView"
                    :changeRandom="changeRandom"
                    :changeDomItem="changeDomItem"
                    :execsList="execsList"
                    :jvsAppId="jvsAppId"
                    :originForm="originForm"
                    :parentDomWidth="parentDomWidth"
                    @reInitData="reInitData"
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
        <slot :name="item.name"></slot>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import FormItem from './formitem'
import {doExec} from '@/components/basic-container/formula/api'
import {dataModelTriggering} from '@/components/api'
export default {
  name: "jvs-tab",
  components: {FormItem},
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
    resetRadom: {
      type: Number
    },
    designId: {
      type: String
    },
    isView: {
      type: Boolean
    },
    changeRandom: {
      type: Number
    },
    changeDomItem: {
      type: Object
    },
    execsList: {
      type: Array
    },
    jvsAppId:  {
      type: String
    }
  },
  data () {
    return {
      activeName: '',
      defaultOption: {
        type: '', // tab风格， card/border-card
        tabPosition: 'top', // 选项卡所在位置, top/right/bottom/left
        stretch: false, // 标签的宽度是否自撑开
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
      initData: "",
      parentDomWidth: 0
    }
  },
  created () {
    this.dealPermission()
    if(this.active) {
      this.activeName = this.active
    }
    this.initData = JSON.stringify(this.forms)
  },
  mounted () {
    if(this.$refs[this.formItem.prop]) {
      this.parentDomWidth = this.$refs[this.formItem.prop].$el.offsetWidth
      this.$forceUpdate()
    }
  },
  methods: {
    handleClick (tab, event) {
      this.activeName = tab.name
      this.$emit('tab-click', tab.name)
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
        if(this.formItem && this.formItem.column) {
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
      }
      this.option.column = this.option.column.filter(item => item.show)
    },
    // 值变化
    async formChange (form, item) {
      if(this.isView === true) {
        this.$emit('formChange', this.forms, item)
      }else{
        this.$emit('formChange', this.forms, item)
        return false
        if([false, null, undefined, ""].indexOf(form) == -1 && this.designId) {
          if(this.dataModelId) {
            await  dataModelTriggering(this.designId, this.dataModelId, form).then(res => {
              if(res.data && res.data.code == 0) {
                if(res.data.data) {
                  for(let i in res.data.data) {
                    this.$set(form, i , res.data.data[i])
                  }
                  // 公式
                  doExec('jvs-design', this.designId, 'formItemValue', {parentPath: item.parentKey ? item.parentKey.split('.') : '', modifiedField: item.prop, params: form}).then(res => {
                    if(res.data && res.data.code == 0) {
                      if(res.data.data) {
                        for(let i in res.data.data) {
                          this.$set(form, i , res.data.data[i])
                        }
                      }
                      this.$set(this.forms, this.activeName, form)
                      this.$forceUpdate()
                      this.$emit('formChange', this.forms)
                    }
                  })
                }
              }
            })
          }else{
            await doExec('jvs-design', this.designId, 'formItemValue', {parentPath: item.parentKey ? item.parentKey.split('.') : '', modifiedField: item.prop, params: form}).then(res => {
              if(res.data && res.data.code == 0) {
                if(res.data.data) {
                  for(let i in res.data.data) {
                    this.$set(form, i , res.data.data[i])
                  }
                  this.$set(this.forms, this.activeName, form)
                  this.$forceUpdate()
                  this.$emit('formChange', this.forms)
                }
              }
            })
          }
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
          if(eval(temp.join(` ${item.showOperator || '||'} `))) {
            bool = true
          }
        }
      }else{
        bool = true
      }
      return bool
    },
    reInitData (prop, parentKey, index, tableType) {
      this.$emit('reInitData', prop, parentKey, index, tableType)
      return false
      if(typeof prop == 'string') {
        this.dataInitHandle(prop, parentKey)
      }else{
        if(prop) {
          this.$emit('reInitData', this.formItem.prop, this.formItem.parentKey)
        }
      }
    },
    // 内部触发联动公式
    dataInitHandle (prop, parentKey) {
      if(this.designId) {
        if(this.dataModelId) {
          dataModelTriggering(this.jvsAppId, this.designId, this.dataModelId, this.forms).then(res => {
            if(res.data && res.data.code == 0) {
              if(res.data.data) {
                for(let i in res.data.data) {
                  this.$set(this.formDatas, i , res.data.data[i])
                }
                // 公式
                let obp = {
                  params: this.forms
                }
                if(prop) {
                  obp.modifiedField = prop
                }
                if(parentKey) {
                  obp.parentKey = parentKey.split('.')
                }
                doExec('jvs-design', this.designId, 'formItemValue', obp).then(res => {
                  if(res.data && res.data.code == 0) {
                    if(res.data.data) {
                      for(let i in res.data.data) {
                        this.$set(this.forms, i , res.data.data[i])
                      }
                    }
                    this.$emit('reInitData', this.formItem.prop, this.formItem.parentKey)
                  }
                })
              }
            }
          })
        }else{
          let obp = {
            params: this.formDatas
          }
          if(prop) {
            obp.modifiedField = prop
          }
          if(parentKey) {
            obp.parentKey = parentKey.split('.')
          }
          doExec('jvs-design', this.designId, 'formItemValue', obp).then(res => {
            if(res.data && res.data.code == 0) {
              if(res.data.data) {
                for(let i in res.data.data) {
                  this.$set(this.formDatas, i , res.data.data[i])
                }
              }
              this.$emit('reInitData', this.formItem.prop, this.formItem.parentKey)
            }
          })
        }
      }
    },
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
