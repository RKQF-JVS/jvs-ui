<template>
  <div class="setting-info">
    <!-- <div id='detailInfoBox' v-html="info.explain" :style="open ? 'height: auto;' : 'height: 50px;'"></div>
    <el-row v-if="info.explain && !hideOpen" style="width:100%;height:30px;position:relative;">
      <jvs-button type="text" style="position: absolute;left: 0;top:0;" @click="openclose">{{open ? '收起' : '展开使用说明'}}</jvs-button>
    </el-row> -->
    <jvs-form ref="paramForm" :formData="form" :option="formOption" @formChange="formChange" @submit="submitHandle">
      <div v-for="item in soltList" :key="item.prop" :slot="item.prop+'Form'">
        <!-- list类型 -->
        <div v-if="item.type == 'list'">
          <ul v-if="item.list && item.list.length > 0" class="input-list">
            <li v-for="(it, iindex) in item.list" :key="item.prop+'input'+iindex">
              <el-input v-model="item.list[iindex]" @blur="listChangeHandle(item)"></el-input>
              <jvs-button @click="delLine(iindex, item)">删除</jvs-button>
            </li>
          </ul>
          <jvs-button v-if="item.type == 'list'" @click="addLine(item, 'string')">添加</jvs-button>
          <div v-if="item.required == true && item.list && item.list.length == 0" class="el-form-item__error">必填</div>
        </div>
        
        <!-- map类型 -->
        <div class="map-box" v-if="item.type == 'map'">
          <p v-if="item.list && item.list.length > 0">
            <span>参数名</span>
            <span>参数值</span>
            <span>操作</span>
          </p>
          <div v-if="item.list && item.list.length > 0">
            <p v-for="(it, iindex) in item.list" :key="item.prop+'map'+iindex">
              <span>
                <el-input v-model="it.key" @blur="setValueOfMap(item, item.prop)"></el-input>
              </span>
              <span>
                <el-input v-model="it.value" @blur="setValueOfMap(item, item.prop)"></el-input>
              </span>
              <span>
                <jvs-button @click="delItem(iindex, item)">删除</jvs-button>
              </span>
            </p>
          </div>
          <jvs-button style="margin-top: 5px;" v-if="item.type == 'map'" @click="addLine(item, 'obj')">添加</jvs-button>
        </div>
        <!-- 富文本： longtext -->
        <div v-if="item.type == 'longtext' " :id="item.prop"></div>
        <div v-if="item.type == 'longtext' && item.required == true && (!form[item.prop] || form[item.prop] == '')" class="el-form-item__error">必填</div>
        <!-- 代码编译器： code 类型  -->
        <div class="codeEditor-box" v-if="item.type == 'code' || item.type == 'sql' || item.type == 'json'">
          <div class="codeEditor"  :id="item.prop"></div>
          <div v-if="(item.type == 'code' || item.type == 'sql' ) && item.required == true && (!form[item.prop] || form[item.prop] == '')" class="el-form-item__error">必填</div>
        </div>
      </div>
      <div v-for="(it, ix) in appendList" :key="it.key+'-append'" :slot="it.key+'Append'">
        <i class="el-icon-setting" style="margin-left:10px;cursor:pointer;" @click="openParamSet(it, ix)"></i>
      </div>
      <template slot="formButton">
        <jvs-button v-if="this.info && this.info.test === true" @click="testHandle">测试</jvs-button>
        <!-- <jvs-button @click="closeHandle">返回</jvs-button> -->
      </template>
    </jvs-form>
    <jvs-button v-if="this.info && this.info.test === true && (!this.formOption.column || this.formOption.column.length == 0)" @click="testHandle">测试</jvs-button>
    <div v-if="testJsonShow">
      <p>测试结果</p>
      <img v-if="this.info.functionName == '二维码生成器'" :src="result" :style="'width:'+(form.widthAndHeight || 200)+'px;height:'+(form.widthAndHeight || 200)+'px;'">
      <json-viewer v-else :value="result"></json-viewer>
    </div>
    <!-- 参数设置 -->
    <el-dialog
      title="参数配置"
      :visible.sync="paramVisible"
      append-to-body
      :before-close="paramClose">
      <div v-if="paramVisible">
        <div class="map-box">
          <p v-if="currentParam && currentParam.customOption && currentParam.customOption.length > 0">
            <span v-for="cp in currentParam.customOption" :key="cp.name+'_'+cp.filed">{{cp.name}}</span>
            <span>操作</span>
          </p>
          <div v-if="currentParam && currentParam.customOption && currentParam.customOption.length > 0">
            <p v-for="(row, rindex) in currentParam.options" :key="'param_row'+rindex">
              <span v-for="(it, iindex) in currentParam.customOption" :key="'row'+rindex+'_'+it.filed+'_column_'+iindex">
                <el-input v-model="row[it.filed]" size="mini"></el-input>
              </span>
              <span>
                <jvs-button size="mini" type="text" @click="delRowHandle(row, rindex, currentParam.options)">删除</jvs-button>
              </span>
            </p>
          </div>
          <jvs-button size="mini" style="margin-top: 5px;" @click="addRowHandle(currentParam.options)">添加</jvs-button>
        </div>
        <el-row style="margin-top:5px;display:flex;justify-content:center;align-items:center;">
          <jvs-button size="mini" type="primary" @click="saveHandle(currentParam)">保存</jvs-button>
          <jvs-button size="mini" @click="paramClose">取消</jvs-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import E from 'wangeditor'
import {testFunction, saveCustomOption} from '../../api/rule'
import {isMobile} from '@/util/validate'
import { encryption } from "@/util/util";
import {deCodeKey} from "@/const/const"
import eventBus from "../../utils/eventBus";
export default {
  name: 'setting-html',
  props: {
    info: {
      type: Object
    },
  },
  data () {
    return {
      form: {}, // 表单对象
      soltList: [], // 需要自定义的字段
      appendList: [], // 需要加后置插槽的字段
      formOption: {}, // 表单项
      editors: [], // 富文本
      codeEdit: [], // 代码编译器
      result: '', // 测试结果
      testJsonShow: false, // 测试结果是否显示
      open: false,
      hideOpen: false,
      requiredList: [],
      validatePhone: (rule, value, callback) => {
        if (isMobile(value)) {
          callback()
        } else {
          callback(new Error('手机号格式错误'))
        }
      },
      paramVisible: false, // 参数配置弹框
      currentParam: null,
      currentPIndex: -1
    }
  },
  created () {
    if(this.info.body && this.info.body) {
      this.form = JSON.parse(JSON.stringify(this.info.body))
    }
    this.init()
    console.log(this.info)
  },
  mounted () {
    this.initEditor()
    this.initCodeEdit()
  },
  methods: {
    init () {
      this.requiredList = []
      this.editors = []
      this.codeEdit = []
      let temp = {
        emptyBtn: false,
        cancal: false,
        formAlign: 'top',
        size: "mini",
        column: []
      }
      for(let i in this.info.parameters) {
        let obj = {
          label: this.info.parameters[i].info,
          prop: this.info.parameters[i].key,
          placeholder: this.info.parameters[i].explain,
          index: i
        }
        if(this.info.parameters[i].necessity){
          // 'map'
          if(['list', 'html', 'code', 'sql'].indexOf(this.info.parameters[i].inputType) > -1) {
            obj.required = this.info.parameters[i].necessity
            this.requiredList.push(obj.prop)
          }else{
            let msgstr = '请输入'
            if(['map'].indexOf(this.info.parameters[i].inputType) > -1) {
              msgstr = '请添加'
            }
            obj.rules = [
              { required: this.info.parameters[i].necessity, message: (msgstr+obj.label), trigger: ['blur', 'change'] },
            ]
          }
        }
        if(this.info.parameters[i].options) {
          obj.dicData = this.info.parameters[i].options
        }
        // 手机号
        if(obj.prop == 'phone') {
          obj.rules.push({ validator: this.validatePhone, trigger: 'blur' })
        }
        switch(this.info.parameters[i].inputType) {
          case 'text': obj.type="input";break;
          case 'input': obj.type="input";break;
          case 'selected': 
            obj.type="select";
            if(this.info.parameters[i].customOptionValue) {
              let dicTemp = []
              for(let p  in this.info.parameters[i].options) {
                let tp = {
                  data: JSON.stringify(this.info.parameters[i].options[p])
                }
                let temp = encryption({
                  data: tp,
                  key: deCodeKey,
                  param: ["data"]
                });
                dicTemp.push({
                  label: this.info.parameters[i].options[p].name,
                  value: temp.data
                })
              }
              obj.dicData = dicTemp
            }
            if(this.info.parameters[i].key == "templateCode") {
              obj.props = {
                label: 'name',
                value: 'code'
              }
            }
            break;
          case 'number': obj.type="inputNumber";break;
          case 'list': 
            obj.type="list";
            obj.formSlot=true;
            let tl = []
            if(this.form[obj.prop]) {
              tl = this.form[obj.prop]
            }
            this.soltList.push({prop: obj.prop, type: obj.type, list: tl, required: obj.required});
            break;
          case 'map': 
            obj.type="map";
            obj.formSlot=true;
            let tp = this.formatMap(this.form[obj.prop]);
            this.soltList.push({prop: obj.prop, type: obj.type, list: tp, required: obj.required});
            break;
          case 'longtext': 
            obj.type="textarea";
            // obj.formSlot=true;
            // this.soltList.push({prop: obj.prop, type: obj.type});
            // this.editors.push(obj.prop)
            break;
          case 'html': 
            obj.type="longtext";
            obj.formSlot=true;
            this.soltList.push({prop: obj.prop, type: obj.type, required: obj.required});
            this.editors.push(obj.prop)
            break;
          case 'code': 
            obj.type="code";
            obj.formSlot=true;
            this.soltList.push({prop: obj.prop, type: obj.type, required: obj.required});
            this.codeEdit.push(obj)
            break;
          case 'sql': 
            obj.type="sql";
            obj.formSlot=true;
            this.soltList.push({prop: obj.prop, type: obj.type, required: obj.required});
            this.codeEdit.push(obj)
            break;
          case 'json': 
            obj.type="json";
            obj.formSlot=true;
            this.soltList.push({prop: obj.prop, type: obj.type, required: obj.required});
            this.codeEdit.push(obj)
            break;
          default: obj.type="input";break;
        }
        // 默认值
        if(this.info.parameters[i].defaultValue && !this.form[obj.prop] && this.form[obj.prop] !== false && this.form[obj.prop] !== 0) {
          if(typeof this.info.parameters[i].defaultValue == 'object') {
            let tdv = {
              data: JSON.stringify(this.info.parameters[i].defaultValue)
            }
            let tdvt = encryption({
              data: tdv,
              key: deCodeKey,
              param: ["data"]
            })
            this.$set(this.form, obj.prop, tdvt.data)
          }
        }
        // 设置
        if(this.info.parameters[i].customOptionValue) {
          obj.appendSlot = true
          this.appendList.push({...this.info.parameters[i], index: Number.parseInt(i)})
        }
        temp.column.push(obj)
      }
      this.formOption = temp
      this.$forceUpdate()
    },
    // 新增行
    addLine (item, type) {
      if(type == 'string') {
        item.list.push('')
      }
      if(type == 'obj') {
        item.list.push({key: '', value: ''})
        if(item.list.length > 0) {
          this.$refs.paramForm.$refs.ruleForm.clearValidate(item.prop)
        }
      }
      this.$forceUpdate()
    },
    // 删除list行
    delLine (index, item) {
      item.list.splice(index, 1)
      this.listChangeHandle(item)
      this.$forceUpdate()
    },
    // 设置list的值
    listChangeHandle (item) {
      this.form[item.prop] = JSON.parse(JSON.stringify(item.list))
    },
    // 格式化map
    formatMap (obj) {
      if(!obj) {
        obj = {}
      }
      let tempList = []
      let keys = Object.keys(obj)
      for(let i in keys) {
        let tb = {
          key: keys[i],
          value: obj[keys[i]]
        }
        tempList.push(tb)
      }
      return tempList
    },
    // 删除map项
    delItem (index, item) {
      item.list.splice(index, 1)
      this.setValueOfMap(item, item.prop)
      this.$forceUpdate()
    },
    // 设置map的值
    setValueOfMap (item, prop) {
      this.$set(this.form, prop, {})
      for(let i in item.list) {
        // this.form[prop][item.list[i].key] = item.list[i].value
        this.$set(this.form[prop], item.list[i].key, item.list[i].value)
      }
      if(item.list.length > 0) {
        this.$refs.paramForm.$refs.ruleForm.clearValidate(prop)
      }else{
        this.$set(this.form, prop, null)
        this.$refs.paramForm.$refs.ruleForm.validateField(prop)
      }
      this.$forceUpdate()
    },
    // 初始化富文本
    initEditor () {
      for(let i in this.editors) {
        let _this = this
        let editor = new E('#'+this.editors[i])
        editor.config.uploadImgShowBase64 = true
        editor.config.menus = [
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
        editor.config.onblur = function (newHtml) {
          // _this.form[_this.editors[i]] = newHtml
          _this.$set(_this.form, _this.editors[i], newHtml)
        }
        editor.config.onchange = function (newHtml) {
          // _this.form[_this.editors[i]] = newHtml
           _this.$set(_this.form, _this.editors[i], newHtml)
        }
        editor.create()
        editor.txt.html(this.form[this.editors[i]])
      }
    },
    // 初始化 代码编译器
    initCodeEdit () {
      let _this = this
      for(let i in this.codeEdit) {
        let editor = ace.edit(this.codeEdit[i].prop)
        // editor.setTheme("ace/theme/twilight"); // 黑色
        if(this.codeEdit[i].type == 'sql') {
          let sqlScriptMode = ace.require("ace/mode/sql").Mode;
          editor.session.setMode(new sqlScriptMode());
        }else if(this.codeEdit[i].type == 'json'){
          let jsonMode = ace.require("ace/mode/json").Mode;
          editor.session.setMode(new jsonMode());
          editor.getSession().setUseWrapMode(true); // 自动换行
          editor.setHighlightActiveLine(false); // 高亮显示
        }else{
          let JavaScriptMode = ace.require("ace/mode/java").Mode;
          editor.session.setMode(new JavaScriptMode());
        }
        if(this.form[this.codeEdit[i].prop]) {
          if(this.codeEdit[i].type == 'json') {
            editor.setValue(JSON.stringify(JSON.parse(this.form[this.codeEdit[i].prop]), null , 2))
          }else{
            editor.setValue(this.form[this.codeEdit[i].prop])
          }
        }
        editor.getSession().on('change', function(e) {
          _this.$set(_this.form, _this.codeEdit[i].prop, editor.getValue())
        });
      }
    },
    // 表单变化
    formChange (form) {
      // this.form = form
      this.$forceUpdate()
      // console.log(this.form)
    },
    // 提交
    submitHandle () {
      for(let i in this.codeEdit) {
        this.form[this.codeEdit[i].prop] = ace.edit(this.codeEdit[i].prop).getValue() //.container.innerText
        if(!this.form[this.codeEdit[i].prop] || this.form[this.codeEdit[i].prop].length == 0) {
          return false
        }
      }
      for(let i in this.requiredList) {
        if(!this.form[this.requiredList[i]] || this.form[this.requiredList[i]].length == 0) {
          return false
        }
      }
      this.$emit('saveSetting', this.form)
    },
    // 返回
    closeHandle () {
      this.$emit('close', true)
    },
    // 测试
    testHandle () {
      let validate = false
      this.$refs.paramForm.$refs.ruleForm.validate( (bool, prop) => {
        validate = bool
      })
      if(!validate) {
        return false
      }
      for(let i in this.codeEdit) {
        this.form[this.codeEdit[i].prop] = ace.edit(this.codeEdit[i].prop).getValue()
      }
      let temp = {
        body: this.form,
        functionName: this.info.functionName
      }
      testFunction(temp).then(res => {
        if(res.data.code == 0) {
          this.result = res.data.data.result
          // this.form = res.data.data.body
        }else{
          this.result = res.data.msg
        }
        this.testJsonShow = true
      })
    },
    openclose () {
      let bool = this.open
      this.open = !bool
      // this.hideOpen = true
    },
    // 参数设置
    openParamSet (item, index) {
      if(!item.options) {
        item.options = []
      }
      this.currentParam = JSON.parse(JSON.stringify(item))
      this.currentPIndex = index
      this.paramVisible = true
    },
    // 关闭参数设置弹框
    paramClose () {
      this.paramVisible = false
      this.currentParam = null
      this.currentPIndex = -1
    },
    // 添加配置
    addRowHandle (list) {
      list.push({})
    },
    // 删除配置
    delRowHandle (row, index, list) {
      list = list.splice(index, 1)
    },
    // 保存参数设置
    saveHandle (row) {
      let tp = {
        data: JSON.stringify(row.options)
      }
      let temp = encryption({
        data: tp,
        key: deCodeKey,
        param: ["data"]
      });
      saveCustomOption(row.customOptionValue, temp.data).then(res => {
        if(res.data.code == 0) {
          this.$message.success('保存成功')
          this.paramVisible = false
          if(this.currentPIndex > -1) {
            this.$set(this.appendList[this.currentPIndex], 'options', row.options)
          }
          this.formOption.column.filter(col => {
            if(col.prop == row.key){
              if(row.customOptionValue) {
                let dicTemp = []
                for(let p  in row.options) {
                  let tp = {
                    data: JSON.stringify(row.options[p])
                  }
                  let temp = encryption({
                    data: tp,
                    key: deCodeKey,
                    param: ["data"]
                  });
                  dicTemp.push({
                    label: row.options[p].name,
                    value: temp.data
                  })
                }
                col.dicData = dicTemp
              }else{
                this.$set(col, 'dicData', row.options)
              }
            }
          })
          this.$set(this.info.parameters[row.index], 'options', row.options)
          // 更新节点
          this.$emit('updateNode', this.info)
          // 重新拉取左侧工具栏
          eventBus.$emit('regetFunc', true)
        }
      })
    }
  }
}
</script>
<style lang="scss">
#detailInfoBox{
  overflow: hidden;
}
.input-list{
  margin: 0;
  padding: 0;
  li{
    display: flex;
    flex-wrap: nowrap;
    margin: 5px 0;
    .el-button{
      margin-left: 10px;
    }
  }
}
.map-box{
  width: 100%;
  .el-button{
    span{
      border: 0!important;
      padding: 0;
    }
  }
  p{
    display: flex;
    justify-content: space-between;
    text-align: center;
    margin: 0;
    overflow: hidden;
    span{
      width: 100%;
      border-bottom: 1px solid #e5e5e5;
      border-right: 1px solid #e5e5e5;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px 10px;
    }
    span:nth-of-type(1){
      border-left: 1px solid #e5e5e5;
    }
  }
  p:nth-of-type(1) {
    span{
      border-top: 1px solid #e5e5e5;
    }
  }
  div p:nth-of-type(1) {
    span{
      border-top: 0;
    }
  }
}
.codeEditor-box {
  position: relative;
  width: 100%;
  height: 300px;
  .codeEditor{
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
.setting-info{
  .el-form{
    .el-input{
      height: 28px;
    }
  }
}
</style>