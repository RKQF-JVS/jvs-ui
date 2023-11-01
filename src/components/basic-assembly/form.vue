<template>
  <el-form
    :model="formDatas"
    :ref="refs || defalutSet.refs"
    :option="option || defalutSet.option"
    :class="{'jvs-form': true, 'jvs-form-autoflexable': (option.labelWidth == 'auto' || option.labelwidth == 'auto' || option.formAuto ), 'jvs-form-transparent': option.useElStyle}"
    :size="$store.state.params.form.size || option.size || option.formsize || 'mini'"
    :inline="option.inline || defalutSet.option.inline"
    :label-position="option.formAlign || defalutSet.option.formAlign"
    :label-width="option.labelWidth || defalutSet.option.labelWidth"
    :disabled='option.disabled'
    :validateOnRuleChange="false"
  >
    <slot name="formTop"></slot>
    <el-row style="width:100%;">
      <el-col
        v-for="item in option.column"
        :key="['childrenForm', 'connectForm'].indexOf(item.type) > -1 ? ('children-form' + item.prop) : item.prop"
        :span="isSearch==true?(item.searchSpan || option.searchSpan || 24):(item.span || option.span || 24)"
        v-show="item.display == false ? item.display : true"
        :class="{'no-label-form-item': item.hideLabel}"
        v-if="displayExpressHandle(item)"
      >
        <el-form-item
          :class='{
            "form-item-no-label": ( (!item.label && item.type != "tab") || (["tableForm","divider","p","section"].indexOf(item.type) > -1) ),
            "form-item-no-label-tab": (!item.label && item.type == "tab"),
            "reportTable-item": item.type == "reportTable",
            "before-append-item": item.beforeSlot,
            "form-item-no-label-nopadding": (!item.label && ["childrenForm","connectForm"].indexOf(item.type) > -1),
          }'
          :label='item.type == "tableForm" ? (item.editable ? item.label : "") : item.label'
          :prop="item.prop"
          v-if="(item.prop !== freshDom) && (item.type !='title' && (!item.children || item.children.length == 0) || item.type == 'formbox') && $permissionMatch(item.permisionFlag) && (item.display == false ? item.display : true)"
          :rules="item.rules"
        >
          <span v-if="item.beforeSlot" class="before-append-content">
            <slot :name="item.prop+'Before'"></slot>
          </span>
          <FormItem
            v-if="!item.formSlot && !item.appendSlot"
            :form="formDatas"
            :item="item"
            :originOption="option"
            :defalutSet="defalutSet"
            @formChange="formChange"
            :roleOption="roleOption"
            :userList="userList"
            :departmentList="departmentList"
            :postList="postList"
            :rowData="rowData"
            :resetRadom="resetRadom"
            :designId="designId"
            :dataModelId="dataModelId"
            :changeRandom="changeRandom"
            :changeDomItem="changeDomItem"
            :isView="isView"
            :execsList="execsList"
            :jvsAppId="jvsAppId"
            @validateHandle="validateHandle"
            @reInitData="reInitData"
          />
          <!-- 自定义列插槽 -->
          <div v-if="item.formSlot">
            <slot :name="item.prop+'Form'"></slot>
            <!-- 右侧提示 -->
            <el-tooltip
              v-if="item.tips && item.tips.position == 'right' && item.tips.text"
              class="form-item-tooltip"
              effect="dark"
              :content="item.tips.text"
              placement="top"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <!-- 后置插槽 -->
          <div v-if="item.appendSlot">
            <span class="form-append">
              <FormItem
                v-if="!item.formSlot"
                :form="formDatas"
                :item="item"
                :originOption="option"
                :defalutSet="defalutSet"
                @formChange="formChange"
                :roleOption="roleOption"
                :userList="userList"
                :departmentList="departmentList"
                :postList="postList"
                :rowData="rowData"
                :resetRadom="resetRadom"
                :designId="designId"
                :dataModelId="dataModelId"
                :changeRandom="changeRandom"
                :changeDomItem="changeDomItem"
                :isView="isView"
                :execsList="execsList"
                :jvsAppId="jvsAppId"
                @validateHandle="validateHandle"
                @reInitData="reInitData"
              >
                <slot :name="item.prop+'Append'" :slot="item.prop+'AppendItem'"></slot>
              </FormItem>
            </span>
          </div>
          <!-- 换行提示 -->
          <el-row
            v-if="item.tips && item.tips.position == 'bottom'"
            class="form-item-tips"
          >
            <span v-html="item.tips.text"></span>
          </el-row>
        </el-form-item>
        <h5 v-if="item.type == 'title'">{{item.label}}</h5>
        <!-- 子表单项 -->
        <el-row v-if="item.type != 'formbox' && item.children && item.children.length > 0 && displayExpressHandle(item)" style="display:flex;flex-wrap:wrap;">
          <el-form-item
            :label="item.label"
            :prop="item.prop"
            :rules="item.rules"
            v-if="(item.prop !== freshDom) && (item.display == false ? item.display : true)"
            :class='(!item.label || (["tableForm","divider","p","tab","section"].indexOf(item.type) > -1))? "form-item-no-label" : ""'
            style="width:100%;"
          >
            <FormItem
              v-if="!item.formSlot"
              :form="formDatas"
              :item="item"
              :originOption="option"
              :defalutSet="defalutSet"
              @formChange="formChange"
              :roleOption="roleOption"
              :userList="userList"
              :departmentList="departmentList"
              :postList="postList"
              :rowData="rowData"
              :resetRadom="resetRadom"
              :designId="designId"
              :dataModelId="dataModelId"
              :changeRandom="changeRandom"
              :changeDomItem="changeDomItem"
              :isView="isView"
              :execsList="execsList"
              :jvsAppId="jvsAppId"
              @validateHandle="validateHandle"
              @reInitData="reInitData"
            >
              <!-- 后置插槽 -->
              <span v-if="item.appendSlot">
                <slot :name="item.prop+'Append'" :slot="item.prop+'AppendItem'"></slot>
              </span>
            </FormItem>
            <!-- 自定义列插槽 -->
            <div v-if="item.formSlot">
              <slot :name="item.prop+'Form'"></slot>
              <!-- 右侧提示 -->
              <el-tooltip
                v-if="item.tips && item.tips.position == 'right' && item.tips.text"
                class="form-item-tooltip"
                effect="dark"
                :content="item.tips.text"
                placement="top"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
            <!-- 换行提示 -->
            <el-row
              v-if="item.tips && item.tips.position == 'bottom'"
              class="form-item-tips"
            >
              <span v-html="item.tips.text"></span>
            </el-row>
          </el-form-item>
          <el-col
            v-for="it in item.children"
            :key="it.prop"
            :span="isSearch==true?(it.searchSpan || option.searchSpan || 24):(it.span || option.span || 24)"
            v-if="linkbindHandle(formDatas[item.prop], it.linkbind) && displayExpressHandle(it)"
          >
            <el-form-item
              :label="it.label"
              :prop="it.prop"
              v-if="(it.prop !== freshDom) && $permissionMatch(it.permisionFlag) && (!option.isSearch || (option.isSearch && it.search == true)) && (it.display == false ? it.display : true)"
              :rules="it.rules"
              :class='{
                "form-item-no-label": (!it.label || (["tableForm","divider","p","tab","section"].indexOf(it.type) > -1)),
                "reportTable-item": it.type == "reportTable"
              }'
            >
              <FormItem
                v-if="!it.formSlot"
                :form="formDatas"
                :item="it"
                :formRef="refs || defalutSet.refs"
                :originOption="option"
                :defalutSet="defalutSet"
                @formChange="formChange"
                :roleOption="roleOption"
                :userList="userList"
                :departmentList="departmentList"
                :postList="postList"
                :rowData="rowData"
                :resetRadom="resetRadom"
                :designId="designId"
                :dataModelId="dataModelId"
                :changeRandom="changeRandom"
                :changeDomItem="changeDomItem"
                :isView="isView"
                :execsList="execsList"
                :jvsAppId="jvsAppId"
                @validateHandle="validateHandle"
                @reInitData="reInitData"
              >
                <!-- 后置插槽 -->
                <span v-if="it.appendSlot">
                  <slot :name="it.prop+'Append'" :slot="it.prop+'AppendItem'"></slot>
                </span>
              </FormItem>
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
          </el-col>
        </el-row>
      </el-col>
      <el-col
        :span="option.isSearch ? 6 :  24"
        v-if="option.column.length > 0 && option.btnHide!==true"
        class="form-item-btn"
      >
        <el-form-item class="form-btn-bar">
          <template v-if="isSearch">
            <el-button
              size="mini"
              v-if="!(option.searchBtn == false)"
              type="primary"
              icon="el-icon-search"
              @click="submitForm(refs || defalutSet.refs)"
              :loading="option.submitLoading"
            >{{option.searchBtnText || defalutSet.option.searchBtnText}}</el-button>
            <el-button
              size="mini"
              v-if="!(option.emptyBtn == false)"
              @click="resetForm(refs || defalutSet.refs)"
            >{{option.emptyBtnText || defalutSet.option.emptyBtnText}}</el-button>
          </template>
          <template v-if="!isSearch">
            <el-button
              size="mini"
              v-if="!(option.submitBtn == false)"
              type="primary"
              @click="submitForm(refs || defalutSet.refs)"
              :loading="option.submitLoading"
            >{{option.submitBtnText || defalutSet.option.submitBtnText}}</el-button>
            <el-button
              size="mini"
              v-if="!(option.emptyBtn == false)"
              @click="resetForm(refs || defalutSet.refs)"
            >{{option.emptyBtnText || defalutSet.option.emptyBtnText}}</el-button>
            <el-button
              size="mini"
              v-if="!(option.cancal == false)"
              @click="$emit('cancalClick')"
            >{{option.cancalBtnText || defalutSet.option.cancalBtnText}}</el-button>
          </template>
          <slot name="formButton"></slot>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import FormItem from './formitem'
import {getDeptList, getRoleList, getPostList, getUserListAll} from '../api'
import {doExec} from '@/components/basic-container/formula/api'
import {dataModelTriggering} from '@/components/api'
export default {
  name: "jvsForm",
  components: { FormItem },
  props: {
    // 是否为搜索表单
    isSearch: {
      type: Boolean,
      default: false
    },
    // 表单绑定
    refs: {
      type: String,
      default: 'ruleForm'
    },
    // 表单对象
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 表单数据
    defalutFormData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 表单设置
    option: {
      type: Object,
      default: () => {
        return {
          formAlign: 'right', //对其方式
          inline: false, // 表单项是否可以同行,当垂直方向空间受限且表单较简单时，可以在一行内放置表单
          labelWidth: 'auto', // label宽
          searchBtn: true,
          searchBtnText: '',
          submitBtn: true, // 提交按钮是否显示，默认显示
          submitBtnText: '保存', // 提交按钮文字，默认 提交
          emptyBtn: true, // 重置按钮，默认显示
          emptyBtnText: '', // 重置按钮文字，默认 重置
          isSearch: false, // 是否为搜索表单
          cancal: true, // 取消按钮， 默认显示
          cancalBtnText: '取消',
          column: [ // 字段
            {
              label: '', // 文字
              prop: '', // 字段
              type: '', // 文本类型，默认input
              dicData: [], // 字典数据
              span: 24, // 表单项栅格比，默认24
              formSlot: false, // 是否自定义
              permisionFlag: '', // 权限标识
              rules: [], // 校验规则
              linkbind: '', // 父级联动控制对应的表单值
            }
          ],
        }
      }
    },
    rowData: {
      type: Object
    },
    designId: {
      type: String
    },
    dataModelId: {
      type: String
    },
    isView: {
      type: Boolean
    },
    execsList: {
      type: Array
    },
    jvsAppId:  {
      type: String
    }
  },
  computed: {
    // formDatas: {
    //   get: function () {
    //     return this.formData
    //   },
    //   set: function () { }
    // }
  },
  data () {
    return {
      formDatas: {}, // 表单对象
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
      roleOption: [], // 角色列表
      userList: [], // 用户列表
      departmentList: [], // 部门列表
      postList: [], // 岗位列表
      clearAll: false, // 重置是否为初始对象{}
      resetRadom: -1, // 通知子项重置随机数 -1不重置
      resetData: "", // 原始数据，用于重置
      freshDom: '',
      changeRandom: -1,
      changeDomItem: null,
      deptBool: false,
      roleBool: false,
      postBool: false,
      userBool: false,
      dataLinkageBool: false,
      formulaBool: false,
      parentDom: null,
    }
  },
  async created () {

    this.resetData = JSON.stringify(this.formData)
    this.formDatas = this.formData
    if (this.defalutFormData) {
      for (let i in this.defalutFormData) {
        this.formDatas[i] = this.defalutFormData[i]
      }
    }
    if(JSON.stringify(this.formDatas) == '{}') {
      this.clearAll = true
    }
    await this.getConst()
    if(!this.isView && (this.dataLinkageBool || this.formulaBool)) {
      this.dataInitHandle(null, null, null, 'init')
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('submit', this.formDatas)
        } else {
          console.log('error submit!!')
          return false;
        }
      });
      // this.$refs[formName].validate((valid, obj) => {
      //   if (valid) {
      //     this.$emit('submit', this.formDatas)
      //   } else {
      //     // 二次校验
      //     let submit = true
      //     Object.keys(obj).forEach(item => {
      //       if (this.formDatas[item] === undefined || this.formDatas[item].length === 0) {
      //         submit = false
      //       } else {
      //         this.$refs[formName].clearValidate(item)
      //       }
      //     })
      //     if (!submit) {
      //       console.log('error submit!!')
      //       return false;
      //     }
      //     this.$emit('submit', this.formDatas)
      //   }
      // });
    },
    resetForm (formName) {
      if (this.option.isSearch === true) {
        this.resetRadom = Math.random()
        this.formDatas = {}
      } else {
        if(this.clearAll) {
          this.formDatas = {}
        }else{
          this.$refs[formName].resetFields()
        }
        this.resetRadom = Math.random()
        if(this.resetData.startsWith('{')) {
          this.$set(this, 'formDatas', JSON.parse(this.resetData))
        }
      }
      this.$emit('reset', formName)
    },
    formChange (form, item, beforeValue) {
      this.$emit('formChange', form)
      // 仅 第一层级文本数字组件判断失焦后的值，改变才触发change
      if(item && form[item.prop] != beforeValue) {
        this.changeRandom = Math.random()
        this.changeDomItem = item
      }
    },
    async getConst () {
      // 优化：表单内无对应公共组件不发请求
      this.eachDomTree(this.option.column)
      if(this.deptBool) { // 默认数据填充的部门只有id，需要查询
        await getDeptList().then(res => {
          if(res.data.code == 0) {
            this.departmentList = res.data.data
          }
        })
      }
      if(this.roleBool) {
        await getRoleList().then(res => {
          if(res.data.code == 0) {
            this.roleOption = res.data.data
          }
        })
      }
      if(this.postBool) {
        await getPostList().then(res => {
          if(res.data.code == 0) {
            this.postList = res.data.data
          }
        })
      }
    },
    // 联动控制
    linkbindHandle (val, bind) {
      let bool = true
      if(bind && ['boolean', 'number'].indexOf(typeof bind) == -1) {
        let arr = (bind instanceof Array) ? bind : bind.split(',')
        if(val instanceof Array) {
          let tb = false
          for(let i in val) {
            if(arr.indexOf(val[i]) > -1 || arr.indexOf((val[i] + '')) > -1) {
              tb = true
            }
          }
          bool = tb
        }else{
          if(arr.indexOf(val) > -1 || arr.indexOf((val + '')) > -1) {
            bool = true
          }else{
            bool = false
          }
        }
      }else{
        if(bind || bind === 0 || bind === false) {
          if(val || val === 0 || val === false) {
            if(bind !== val) {
              bool = false
            }
          }else{
            bool = true
          }
        }else{
          bool = true
        }
      }
      return bool
    },
    validateHandle (data) {
      let type = data.type
      let item = data.item
      if(['user', 'role', 'department', 'group', 'job', 'htmlEditor'].indexOf(item.type) === -1) {
        this.freshDom = item.prop
      }
      this.$nextTick( () => {
        if(type == 'clear') {
          this.$refs[this.refs || this.defalutSet.refs].clearValidate(item.prop)
        }else{
          this.$refs[this.refs || this.defalutSet.refs].validateField(item.prop)
        }
        this.freshDom = ''
      })
      this.$forceUpdate()
    },
    // 表达式控制显示
    displayExpressHandle (item) {
      let bool = false
      let formStr = 'this.formDatas' // 表单值参数名
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
    // 联动或公式初始化
    dataInitHandle (prop, parentKey, index, optype, tableType) {
      if(this.designId) {
        let hasDataTrigger = false // 是否执行联动
        if(prop) {
          let tp = {
            prop: prop,
          }
          if(parentKey) {
            tp.parentKey = parentKey
          }
          let tlist = this.dataTriggerEnableDom(tp) // 同级的联动组件
          tlist.filter(tit => {
            if(tit.dataLinkageList) {
              tit.dataLinkageList.filter(tid => {
                // 当前组件作为同级中的联动条件
                if(tid.value == prop) {
                  hasDataTrigger = true
                }
              })
            }
          })
        }
        if(optype == 'init' || tableType) {
          hasDataTrigger = true
        }
        if(this.dataModelId && hasDataTrigger) {
          let triobj = {
            params: this.formDatas
          }
          if(prop) {
            triobj.modifiedField = prop
          }
          if(parentKey) {
            triobj.parentKey = parentKey.split('.')
          }
          if(index > -1) {
            triobj.index = index
          }
          dataModelTriggering(this.jvsAppId, this.designId, this.dataModelId, triobj, optype == 'init' ? {init: true} : (tableType ? {tableType: tableType} : null) ).then(res => {
            if(res.data && res.data.code == 0) {
              if(res.data.data) {
                // console.log('联动。。。。', res.data.data)
                for(let i in res.data.data) {
                  this.$set(this.formDatas, i , res.data.data[i])
                }
                // 公式
                let obp = {
                  params: this.formDatas
                }
                if(prop) {
                  obp.modifiedField = prop
                }
                if(parentKey) {
                  obp.parentKey = parentKey.split('.')
                }
                if(index > -1) {
                  obp.index = index
                }
                if(optype == 'init' || (this.execsList && this.execsList.indexOf(parentKey ? parentKey+'.'+prop : prop) > -1)) {
                  doExec('jvs-design', this.designId, 'formItemValue', obp, optype == 'init' ? {init: true} : null ).then(res => {
                    if(res.data && res.data.code == 0) {
                      if(res.data.data) {
                        // console.log('公式。。。。', res.data.data)
                        for(let i in res.data.data) {
                          this.$set(this.formDatas, i , res.data.data[i])
                        }
                      }
                    }
                  })
                }
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
          if(index > -1) {
            obp.index = index
          }
          if(optype == 'init' || (this.execsList && this.execsList.indexOf(parentKey ? parentKey+'.'+prop : prop) > -1)) {
            doExec('jvs-design', this.designId, 'formItemValue', obp).then(res => {
              if(res.data && res.data.code == 0) {
                if(res.data.data) {
                  for(let i in res.data.data) {
                    this.$set(this.formDatas, i , res.data.data[i])
                  }
                }
              }
            })
          }
        }
      }
    },
    reInitData (prop, parentKey, index, tableType) {
      if(prop) {
        this.dataInitHandle(prop, parentKey, index, null, tableType)
      }
      if(prop == '' && parentKey == '') {
        this.dataInitHandle('', '')
      }
    },
    eachDomTree(list) {
      for(let i in list) {
        // 加入自定义校验
        if(list[i].regularExpression) {
          let required = false
          if(list[i].rules && list[i].rules[0].required) {
            required = true
          }
          let str = '/' + list[i].regularExpression + '/'
          list[i].rules.push({
            validator: function(rule, value, callback) {
              if(eval(str).test(value)) {
                callback()
              }else{
                let msg = '正则校验不通过'
                if(list[i].regularMessage) {
                  msg = list[i].regularMessage
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
        if(list[i].type == 'department') {
          this.deptBool = true
        }
        if(list[i].type == 'role') {
          this.roleBool = true
        }
        if(list[i].type == 'job') {
          this.postBool = true
        }
        if(list[i].type == 'user') {
          this.userBool = true
        }
        if(list[i].dataLinkageModelId) {
          this.dataLinkageBool = true
        }
        if(list[i].formula) {
          this.formulaBool = true
        }
        if(['tab', 'step'].indexOf(list[i].type) > -1) {
          for(let c in list[i].column) {
            this.eachDomTree(list[i].column[c])
          }
        }
        if(['tableForm', 'reportTable'].indexOf(list[i].type) > -1 && list[i].tableColumn && list[i].tableColumn.length > 0){
          if(list[i].formId) {
            this.dataLinkageBool = true
          }
          this.eachDomTree(list[i].tableColumn)
        }
        if(list[i].children && list[i].children.length > 0) {
          this.eachDomTree(list[i].children)
        }
      }
    },
    dataTriggerEnableDom (dom) {
      if(dom.parentKey) {
        let list = []
        this.findParentDom(this.option.column, dom.parentKey)
        if(this.parentDom) {
          let parentType = this.parentDom.type
          switch(parentType) {
            case 'tableForm':
              if(this.parentDom.tableColumn) {
                list = this.parentDom.tableColumn.filter(item => {
                  return (item.dataLinkageList && item.dataLinkageList.length > 0)
                })
              }
            break;
            default: list = this.option.column.filter(item => { return (item.dataLinkageList && item.dataLinkageList.length > 0)});break;
          }
        }else{
          list = this.option.column.filter(item => { return (item.dataLinkageList && item.dataLinkageList.length > 0)})
        }
        return list
      }else{
        return this.option.column.filter(item => {
          return (item.dataLinkageList && item.dataLinkageList.length > 0)
        })
      }
    },
    findParentDom (list, key) {
      if(list && list.length > 0) {
        list.filter(item => {
          if(key) {
            let pks = key.split('.')
            if(pks && pks.length > 0 && item.prop == pks[pks.length - 1]) {
              this.parentDom = item
            }
          }
          if(['tab', 'step'].indexOf(item.type) > -1) {
            for(let j in item.column) {
              if(item.column[j] && item.column[j].length > 0) {
                this.findParentDom(item.column[j], key)
              }
            }
          }
        })
      }
    },
  }
};
</script>

<style lang="scss">
.jvs-form {
  h5 {
    margin: 0;
    padding: 0;
    margin-bottom: 10px;
  }
  .el-form-item.form-btn-bar {
    // margin: 10px;
    .el-form-item__content {
      text-align: center;
      margin-left: 0 !important;
    }
  }
  .no-label-form-item{
    .el-form-item{
      .el-form-item__content{
        margin-left: 0!important;
      }
    }
  }
}
.jvs-form-autoflexable {
  .el-form-item {
    display: flex;
    margin: 0 10px;
    .el-form-item__label-wrap {
      margin-left: 0 !important;
      word-break: keep-all;
    }
    .el-form-item__content {
      margin-left: 0 !important;
      flex: 1;
      div {
        .el-input,
        .el-select {
          width: 100%;
        }
      }
    }
  }
}
.form-item-tooltip {
  display: inline-block;
  margin: 0 10px;
}
.form-item-no-label-tab{
  >.el-form-item__content{
    margin-left: 0!important;
  }
}
.form-item-no-label{
  .el-form-item__content{
    margin-left: 0!important;
  }
}
.form-item-no-label-nopadding{
  padding: 0!important;
}
.form-item-tips{
  font-size: 12px;
  color: #c3c3c3;
  width: 100%;
}
.reportTable-item{
  display: flex;
  flex-wrap: wrap;
  .el-form-item__content{
    margin-left: 0!important;
    width: 100%;
  }
}
.before-append-item{
  .el-form-item__content{
    display: flex;
    align-items: center;
  }
}
</style>
