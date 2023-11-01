<template>
  <div>
    <el-dialog
      ref="formulaDialog"
      :modal="modal"
      :class="{
        'formula-component-dialog': true,
        'formula-component-dialog-modal': modal,
      }"
      :visible.sync="formulaVisible"
      append-to-body
      :before-close="handleClose"
      :title="headerTitle"
      width="900px"
      :close-on-click-modal="false"
      @opened="_initialize"
    >
      <div class="formula-panel-box" v-if="formulaVisible">
        <!-- 表达式 -->
        <div class="formula-panel-top">
          <div class="formula-panel formula-panel-editor">
            <p class="formula-panel-title">
              {{showLabel}}
              <span class="formula-panel-subtitle">=</span>
            </p>
            <div class="formula-panel-content">
              <div class="formula-editor">
                <textarea ref="textarea" id="textarea"></textarea>
              </div>
            </div>
          </div>
        </div>
        <!-- 字段、函数、说明 -->
        <div class="formula-panel-bottom"  @mouseleave="currentData = null">
          <!-- 字段列表 -->
          <div v-if="funcList.length == 0" class="formula-panel loading"></div>
          <div v-if="funcList.length == 0" class="formula-panel loading"></div>
          <div v-if="funcList.length > 0" class="formula-panel" v-for="(item, index) in funcList" :key="'funcList-item-'+index">
            <p class="formula-panel-title" @mouseover="currentData = null">
              <span class="formula-panel-title-text">{{item.title}}</span>
            </p>
            <!-- list类型 -->
            <div class="formula-panel-content" v-if="item.type == 'list'">
              <div class="formula-panel-item-filed">
                <a class="formula-filed-item" v-for="(idata, idx) in item.data" :key="'data-item-'+idx" @click="addVariable(idata, index)" @mouseover="showInfo(idata)">
                  <span class="formula-filed-title">{{idata.name}}</span>
                  <div :class="{'formula-filed-capsule': true,
                    'blue': idata.jvsParamType == 'text',
                    'yellow': idata.jvsParamType == 'number',
                    'green': idata.jvsParamType == 'date',
                    'purple': idata.jvsParamType == 'array',
                    'red': idata.jvsParamType == 'object',
                    'cyan': idata.jvsParamType == 'unknown',
                  }">{{idata.jvsParamType | getLabeType}}</div>
                </a>
              </div>
            </div>
            <!-- 树形结构 -->
            <div class="formula-panel-content" v-if="item.type == 'tree'">
              <div class="formula-panel-item-filed">
                <el-collapse>
                  <el-collapse-item v-for="it in item.data" :title="it.title" :name="it.title" :key="'tree-data-item-'+it.title">
                    <template slot="title"><span @mouseover="currentData = null">{{it.title}}</span></template>
                    <ul class="function-panel-filed-list">
                      <li class="function-panel-filed-li" v-for="(idata, idx) in it.data" :key="'treedata-item-'+idx" @click="addVariable(idata, index)" @mouseover="showInfo(idata)">
                        <span class="formula-func-title show-type">{{idata.name}}</span>
                        <div :class="{'formula-func-capsule': true,
                          'blue': idata.jvsParamType == 'text',
                          'yellow': idata.jvsParamType == 'number',
                          'green': idata.jvsParamType == 'date',
                          'purple': idata.jvsParamType == 'array',
                          'red': idata.jvsParamType == 'object',
                          'cyan': idata.jvsParamType == 'unknown',
                        }">{{idata.jvsParamType | getLabeType}}</div>
                      </li>
                    </ul>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
          </div>
          <!-- 函数描述 -->
          <div class="formula-panel formula-panel-func-desc" v-if="funcList && funcList.length < 3">
            <p class="formula-panel-title">
              <span class="formula-panel-title-text">{{currentData ? currentData.name : '说明'}}</span>
            </p>
            <div class="formula-panel-content info-section" v-if="currentData">
              <!-- 详情 -->
              <div>
                <p v-if="currentData.type">{{currentData.type}}</p>
                <div v-if="currentData.info" class="info-text" v-html="currentData.info"></div>
              </div>
            </div>
            <div class="formula-panel-content info-section" v-else>
              <!-- 详情 -->
              <div>
                <p>请从左侧面板选择字段名和函数，或输入函数</p>
                <p>公式编辑举例：<span class="fun">SUM</span>(<span class="param">参数1</span>,<span class="param">参数2</span>)</p>
                <p><a @click="helpCenter('all-formula')">查看基本公式的帮助文档</a></p>
              </div>
            </div>
          </div>
        </div>
        <!-- 底部按钮栏 -->
        <div class="footer-button">
          <el-button size="mini" type="primary" @click="submitHandle">确定</el-button>
          <el-button size="mini" @click="handleClose">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// 引入全局实例
import {CodeMirror} from '../../../../public/jvs-ui-public/plugin/codemirror/src/edit/main'
import {getFuncList, addEditExec, getExec} from './api'
// 核心样式
// import 'codemirror/lib/codemirror.css'
// 引入主题后还需要在 options 中指定主题才会生效
import 'codemirror/theme/cobalt.css'
// import 'codemirror/mode/javascript/javascript'
import { mapState } from "vuex";
// 尝试获取全局实例
export default {
  computed: {
    headerTitle() {
      return this.title || '公式设置'
    },
    showLabel() {
      return this.label
    },
    modal() {
      if (this.hasModal) {
        return true;
      } else {
        return false;
      }
    },
    propData () {
      return this.props
    },
    requestPrefix () {
      return this.apiPrefix
    },
    useCaseString () {
      return this.useCase
    },
  },
  filters: {
    getLabeType(type) {
      let str = ''
      switch(type) {
        case 'text':
          str = '文字';break;
        case 'number':
          str = '数字';break;
        case 'date':
          str = '时间';break;
        case 'array':
          str = '数组';break;
        case 'object':
          str = '对象';break;
        case 'unknown':
          str = '未知';break;
        default: ;break;
      }
      return str
    }
  },
  data() {
    return {
      formulaVisible: false,
      coder: null, // 编辑器实例
      options: {   // 默认配置
        mode: 'javasctipt', // 语言
        // 缩进格式
        tabSize: 2,
        // 主题，对应主题库 JS 需要提前引入
        // theme: 'cobalt',
        // 显示行号
        lineNumbers: true,
        line: true
      },
      code: '', // 内容
      funcList: [],
      keyCode: -1,
      currentData: null,
      nodeDataList: {}
    }
  },
  methods: {
    init () {
      this.getFuncListHandle()
      if(this.execId) {
        this.getExecInfo()
      }else{
        this.formulaVisible = true
      }
    },
    // 根据公式id获取详情
    getExecInfo () {
      getExec(this.execId).then(res => {
        if(res.data && res.data.code == 0) {
          if(res.data.data) {
            // let str = res.data.data.body
            // str = str.replace(/[\$\{\}]/g, '')
            this.code = res.data.data.body
          }
        }
        this.formulaVisible = true
      })
    },
    handleClose() {
      this.formulaVisible = false
    },
    // 初始化富文本
    _initialize () {
      // 初始化编辑器实例，传入需要被实例化的文本域对象和默认配置
      this.coder = CodeMirror.fromTextArea(this.$refs.textarea, this.options)
      // 编辑器赋值
      this.coder.setValue(this.code)
      // 内容change
      this.coder.on('change', (coder) => {
        this.code = coder.getValue()
        // console.log(this.code)
      })
      // 输入或粘贴时编辑触发
      this.coder.on('cursorActivity', (coder) => {
        let pos = coder.getCursor()
        let lineCon = coder.getLine(pos.line)
        let reg = /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b\u200e\u200f\u2022\u2028\u2029\ufeff\ufff9-\ufffc]/g
        let charStr = lineCon.charAt(pos.ch)
        console.log(lineCon.length, '-------', pos.ch, charStr)
        if(pos.ch < lineCon.length) {
          // 获取光标位置处的内容，判断是否为变量函数，找到起始位置，移动光标至起点前一位
          // 特殊字符  /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b\u200e\u200f\u2022\u2028\u2029\ufeff\ufff9-\ufffc]/g.test()
          if(reg.test(charStr) || /[\0]/g.test(charStr)) {
            let lastOne = lineCon.charAt(pos.ch-1)
            console.log(lastOne)
            // 前一位不是空格
            if(lastOne && !reg.test(lastOne) && /[\0]/g.test(lastOne) == false) {
              // 前一位是 }
              if(lastOne == '}') {
                // }\0\0
                if((reg.test(lineCon.charAt(pos.ch+1)) || /[\0]/g.test(lineCon.charAt(pos.ch+1)))){
                  if(this.keyCode == -1 || this.keyCode == 39) {
                    coder.moveH(1, 'char')
                  }
                  if(this.keyCode == 37) {
                    let opEnd = pos.ch-1
                    for(let whCount=opEnd; whCount>=0; whCount--) {
                      if(lineCon[whCount] == '$') {
                        coder.moveH(-1, 'char');
                        break;
                      }
                      coder.moveH(-1, 'char')
                    }
                    coder.moveH(-1, 'char') // 左侧\0
                  }
                }
                // }\0(
                else if(lineCon.charAt(pos.ch+1) == '(') {
                  if(this.keyCode !== 37) {
                    coder.moveH(1, 'char')
                    coder.moveH(1, 'char')
                  }
                }else{
                  if(this.keyCode == -1 || this.keyCode == 39) {
                    coder.moveH(1, 'char')
                  }
                  if(this.keyCode == 37) {
                    let opEnd = pos.ch-1
                    for(let whCount=opEnd; whCount>=0; whCount--) {
                      if(lineCon[whCount] == '$') {
                        coder.moveH(-1, 'char');
                        break;
                      }
                      coder.moveH(-1, 'char')
                    }
                    coder.moveH(-1, 'char') // 左侧\0
                  }
                }
              }
              // ${}\0(\0\0)
              if(lastOne == '(') {
                if(this.keyCode == -1 || this.keyCode == 39) {
                  coder.moveH(1, 'char')
                }
                if(this.keyCode == 37) {
                  coder.moveH(-1, 'char')
                  let opEnd = pos.ch-1
                  for(let whCount=opEnd; whCount>=0; whCount--) {
                    if(lineCon[whCount] == '$') {
                      coder.moveH(-1, 'char');
                      break;
                    }
                    coder.moveH(-1, 'char')
                  }
                }
              }
              // )\0
              if(lastOne == ')') {
                if(this.keyCode == -1 || this.keyCode == 39) {
                  if((reg.test(lineCon[pos.ch-2]) || /\0/g.test(lineCon[pos.ch-2])) && lineCon[pos.ch - 3] == ')') {
                    coder.moveH(-1, 'char')
                  }else if((reg.test(lineCon[pos.ch+1]) || /\0/g.test(lineCon[pos.ch+1])) && lineCon[pos.ch+2] == ')'){
                    coder.moveH(1, 'char')
                  }else{
                    coder.moveH(1, 'char')
                  }
                  if(this.keyCode == 39) {
                    coder.moveH(1, 'char')
                  }
                }
                if(this.keyCode == 37) {
                  let opEnd = pos.ch-1
                  if(reg.test(lineCon[opEnd-1]) || /[\0]/g.test(lineCon[opEnd-1])) {
                    if((reg.test(lineCon[opEnd-2]) || /[\0]/g.test(lineCon[opEnd-2])) && lineCon[opEnd-3] == ')') {
                      coder.moveH(-1, 'char');
                      coder.moveH(-1, 'char');
                    }
                  }else{
                    let hasLeft = false
                    let moveCount = -1
                    for(let whCount=opEnd; whCount>=0; whCount--) {
                      if(lineCon[whCount] == '(') {
                        hasLeft = true
                      }
                      if(lineCon[whCount] == '$') {
                        moveCount += 1;
                        break;
                      }
                      moveCount += 1;
                    }
                    if(hasLeft) {
                      if(moveCount > -1) {
                        for(let mc=0; mc < moveCount; mc++) {
                          coder.moveH(-1, 'char');
                        }
                      }
                    }else{
                      coder.moveH(-1, 'char');
                      coder.moveH(-1, 'char');
                    }
                  }
                }
              }
            }
          }else{
            // 函数名  或  变量名
            if(charStr && ['$', '{', '}', '(', ')'].indexOf(charStr) == -1) {
              let left = -1
              let right = -1
              let alexLeft = pos.ch-1  // 左边计数起点
              let alexRight = pos.ch + 1 // 右边计数终点
              if(alexLeft > -1) {
                for(let whCount=alexLeft; whCount>=0; whCount--) {
                  // 排除手写字符
                  if(lineCon[whCount] == '}') {
                    left = -1;
                    break;
                  }
                  if(lineCon[whCount] == '$' && lineCon[whCount+1] == '{') {
                    left = whCount;
                    break;
                  }
                }
              }
              if(alexRight > -1) {
                for(let rCount=alexRight; rCount<lineCon.length; rCount++) {
                  // 排除手写字符
                  if(lineCon[rCount] == '$') {
                    right = -1;
                    break;
                  }
                  if(lineCon[rCount] == '}'){
                    // 函数
                    if((reg.test(lineCon[rCount+1]) || /[\0]/g.test(lineCon[rCount+1])) && lineCon[rCount+2] == '('){
                      right = rCount+4;
                      break;
                    }else{
                      right = rCount+2;
                      break;
                    }
                  }
                }
              }
              if(left > -1 && right > -1 && right > left) {
                console.log(left)
                console.log(right)
                let mcount = 0
                // 右移
                if(this.keyCode == 39) {
                  mcount = right - pos.ch
                }else{
                  mcount = pos.ch - left
                }
                for(let mc=0; mc < mcount; mc++) {
                  coder.moveH(this.keyCode == 39 ? 1 : -1, 'char')
                }
              }
            }
            // \0${}\0 或者 \0${}\0(\0\0)\0
            if(charStr == '$' || charStr == '{') {
              if(this.keyCode == -1 || this.keyCode == 37){
                coder.moveH(-1, 'char')
                if(charStr == '{') {
                  coder.moveH(-1, 'char');
                }
              }
              // 键盘右移动
              if(this.keyCode == 39) {
                for(let whCount=pos.ch; whCount<lineCon.length; whCount++) {
                  if(lineCon[whCount] == '}') {
                    coder.moveH(1, 'char')
                    coder.moveH(1, 'char') // 右侧空格\0
                    // ${}\0(\0\0)\0
                    if(lineCon[whCount+2] == '(') {
                      coder.moveH(1, 'char')
                      coder.moveH(1, 'char') // (空格\0
                    }
                    break;
                  }
                  coder.moveH(1, 'char')
                }
              }
            }
            // \0${}\0(\0\0)\0
            if(charStr == '(') {
              // 右移
              if(this.keyCode == 39) {
                if(reg.test(lineCon.charAt(pos.ch+1)) || /[\0]/g.test(lineCon.charAt(pos.ch+1))) {
                  coder.moveH(1, 'char')
                  coder.moveH(1, 'char')
                }
              }
              if(this.keyCode == -1 || this.keyCode == 37) {
                if(reg.test(lineCon.charAt(pos.ch-1)) || /[\0]/g.test(lineCon.charAt(pos.ch-1))) {
                  coder.moveH(-1, 'char')
                  let opEnd = pos.ch-2
                  if(charStr.charAt[opEnd] == '}') {
                    for(let cs=opEnd; cs>=0; cs--) {
                      if(lineCon.charAt(cs) == '$') {
                        coder.moveH(-1, 'char');
                        coder.moveH(-1, 'char');
                        break;
                      }
                      coder.moveH(-1, 'char')
                    }
                  }
                }
              }
            }
            // \0${}\0(\0\0)\0
            if(charStr == ')') {
              if(this.keyCode == -1 || this.keyCode == 39) {
                coder.moveH(1, 'char')
                coder.moveH(1, 'char')
              }
              if(this.keyCode == 37) {
                if(reg.test(lineCon.charAt(pos.ch-1)) || /[\0]/g.test(lineCon.charAt(pos.ch-1))) {
                  coder.moveH(-1, 'char')
                } 
              }
            }
          }
        }
        coder.refresh()
      })
      // 键盘按键，主要监听删除键
      this.coder.on('keyup', (coder, event) => {
        this.keyCode = event.keyCode
        // 删除
        if(event.keyCode == 8) {
          let from = null
          let to = null
          let pos = coder.getCursor()
          let lineCon = coder.getLine(pos.line)
          console.log(lineCon.length, '-------', pos.ch)
          let reg = /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b\u200e\u200f\u2022\u2028\u2029\ufeff\ufff9-\ufffc]/g
          let charStr = lineCon.charAt(pos.ch)
          console.log('删除。。。。。',reg.test(charStr), /[\0]/g.test(charStr), !charStr, charStr)
          let needDel = true
          if(!charStr) {
            let lastOne = lineCon.charAt(pos.ch-1)
            console.log(lastOne)
            if(reg.test(lastOne) || /[\0]/g.test(lastOne)) {
              // ${}\0
              if(lineCon.charAt(pos.ch-2) == '}') {
                let opEnd = pos.ch - 2
                let opStart = -1
                for(let whCount=opEnd; whCount>=0; whCount--) {
                  if(lineCon[whCount] == '$') {
                    opStart = whCount;
                    break;
                  }
                }
                if(opStart > -1) {
                  if(reg.test(lineCon.charAt(opStart-1)) || /[\0]/g.test(lineCon.charAt(opStart-1))) {
                    console.log('变量位置：',opStart-1, '--->', pos.ch)
                    from = CodeMirror.Pos(pos.line, opStart-1)
                    to = CodeMirror.Pos(pos.line, pos.ch-1)
                  }
                }
              }
              // )\0
              if(lineCon.charAt(pos.ch-2) == ')') {
                console.log(lineCon.charAt(pos.ch-2))
                // 无变量
                from = CodeMirror.Pos(pos.line, pos.ch-3)
                // 有变量 (\0     \0\0变量名\0\0      \0)
                if((reg.test(lineCon[pos.ch-4]) || /[\0]/g.test(lineCon[pos.ch-4])) && (reg.test(lineCon[pos.ch-5]) || /[\0]/g.test(lineCon[pos.ch-5]))) {
                  from = CodeMirror.Pos(pos.line, pos.ch-4)
                }
                to = CodeMirror.Pos(pos.line, pos.ch-1)
              }
              // 匹配左括号，一起删除函数名
              if(lineCon.charAt(pos.ch -2) == '(' && (reg.test(lineCon.charAt(pos.ch -3)) || /[\0]/g.test(lineCon.charAt(pos.ch -3)))) {
                let opEnd = pos.ch - 4
                let opStart = -1
                for(let whCount=opEnd; whCount>=0; whCount--) {
                  if(lineCon[whCount] == '$') {
                    opStart = whCount;
                    break;
                  }
                }
                if(opStart > -1) {
                  from = CodeMirror.Pos(pos.line, opStart-1)
                }
                to = CodeMirror.Pos(pos.line, pos.ch-1)
              }
              // 匹配 ( 含手动空格
              if(lineCon.charAt(pos.ch-2) == ' ') {
                if(lineCon.charAt(pos.ch -3) == '(' && (reg.test(lineCon.charAt(pos.ch -4)) || /[\0]/g.test(lineCon.charAt(pos.ch -4)))) {
                  let opEnd = pos.ch - 5
                  let opStart = -1
                  for(let whCount=opEnd; whCount>=0; whCount--) {
                    if(lineCon[whCount] == '$') {
                      opStart = whCount;
                      break;
                    }
                  }
                  if(opStart > -1) {
                    from = CodeMirror.Pos(pos.line, opStart-1)
                  }
                }
                to = CodeMirror.Pos(pos.line, pos.ch-1)
              }
            }else{
              // }
              if(['}', '('].indexOf(lastOne) > -1) {
                let opEnd = pos.ch - 1
                let opStart = -1
                for(let whCount=opEnd; whCount>=0; whCount--) {
                  if(lineCon[whCount] == '$') {
                    opStart = whCount;
                    break;
                  }
                }
                if(opStart > -1) {
                  from = CodeMirror.Pos(pos.line, opStart-1)
                }
                to = CodeMirror.Pos(pos.line, pos.ch)
              }
              // )
              if(lastOne == ')') {
                // 空白函数，括号内没有参数
                if(reg.test(lineCon.charAt(pos.ch-2)) || /[\0]/g.test(lineCon.charAt(pos.ch-2))) {
                  if(reg.test(lineCon.charAt(pos.ch-3)) || /[\0]/g.test(lineCon.charAt(pos.ch-3))) {
                    if(lineCon.charAt(pos.ch-4) == '(') {
                      let opEnd = pos.ch - 6
                      let opStart = -1
                      for(let whCount=opEnd; whCount>=0; whCount--) {
                        if(lineCon[whCount] == '$') {
                          opStart = whCount;
                          break;
                        }
                      }
                      if(opStart > -1) {
                        from = CodeMirror.Pos(pos.line, opStart)
                      }
                      to = CodeMirror.Pos(pos.line, pos.ch)
                    }else{
                      from = CodeMirror.Pos(pos.line, pos.ch-2)
                      to = CodeMirror.Pos(pos.line, pos.ch)
                      coder.setSelection(from, to)
                      coder.deleteH()
                      needDel = false
                      this.keyCode = -1
                    }
                  }
                }
              }
            }
          }else{
            if(reg.test(charStr) || /[\0]/g.test(charStr)) {
              // (\0
              if(lineCon[pos.ch-1] == '(') {
                if(reg.test(lineCon[pos.ch-2]) || /[\u0]/g.test(lineCon[pos.ch-2])) {
                  let opEnd = pos.ch - 3
                  let opStart = -1
                  for(let whCount=opEnd; whCount>=0; whCount--) {
                    if(lineCon[whCount] == '$') {
                      opStart = whCount;
                      break;
                    }
                  }
                  if(opStart > -1) {
                    from = CodeMirror.Pos(pos.line, opStart-1)
                  }
                }
                to = CodeMirror.Pos(pos.line, pos.ch)
              }
              // }\0
              if(lineCon.charAt(pos.ch-1) == '}') {
                let opEnd = pos.ch - 1
                let opStart = -1
                for(let whCount=opEnd; whCount>=0; whCount--) {
                  if(lineCon[whCount] == '$') {
                    opStart = whCount;
                    break;
                  }
                }
                if(opStart > -1) {
                  if(reg.test(lineCon.charAt(opStart-1)) || /[\0]/g.test(lineCon.charAt(opStart-1))) {
                    from = CodeMirror.Pos(pos.line, opStart-1)
                    to = CodeMirror.Pos(pos.line, pos.ch)
                  }
                }
              }
            }else{
              if(['(', ')', '$', '{', '}'].indexOf(charStr) == -1) {
                let lastOne = lineCon.charAt(pos.ch-1)
                console.log(lastOne)
                let opEnd = -1
                let opStart = -1
                if(['{', '}', '('].indexOf(lastOne) > -1) {
                  opEnd = pos.ch-1
                }
                if(lastOne == ')') {
                  // 空白函数
                  if((reg.test(lineCon[pos.ch-2]) || /[\0]/g.test(lineCon[pos.ch-2])) ){
                    if((reg.test(lineCon[pos.ch-3]) || /[\0]/g.test(lineCon[pos.ch-3]))) {
                      console.log(lineCon[pos.ch - 4])
                      if(lineCon[pos.ch - 4] == '(') {
                        opEnd = pos.ch-1
                      }else{
                        from = CodeMirror.Pos(pos.line, pos.ch-2)
                        to = CodeMirror.Pos(pos.line, pos.ch)
                        coder.setSelection(from, to)
                        coder.deleteH()
                        needDel = false
                        this.keyCode = -1
                      }
                    }
                  }
                }
                if(opEnd > -1) {
                  for(let whCount=opEnd; whCount>=0; whCount--) {
                    if(lineCon[whCount] == '$') {
                      opStart = whCount;
                      break;
                    }
                  }
                }
                if(opStart > -1) {
                  from = CodeMirror.Pos(pos.line, opStart-1)
                  to = CodeMirror.Pos(pos.line, pos.ch)
                }
              }
              // 删除括号中的变量
              if(charStr == ')') {
                let lastOne = lineCon.charAt(pos.ch-1)
                console.log(reg.test(lastOne) , /[\0]/g.test(lastOne))
                if(reg.test(lastOne) || /[\0]/g.test(lastOne)) {
                  let ep = pos.ch-2
                  // 括号里面清空了不做操作    (空格空格)
                  if(reg.test(lineCon.charAt(pos.ch-2)) || /[\0]/g.test(lineCon.charAt(pos.ch-2))){
                    ep = -1 // pos.ch - 3
                  }
                  if(ep > -1) {
                    // 变量
                    if(lineCon.charAt(ep) == '}') {
                      let opEnd = ep
                      let opStart = -1
                      for(let whCount=opEnd; whCount>=0; whCount--) {
                        if(lineCon[whCount] == '$') {
                          opStart = whCount;
                          break;
                        }
                      }
                      if(opStart > -1) {
                        if(reg.test(lineCon.charAt(opStart-1)) || /[\0]/g.test(lineCon.charAt(opStart-1))) {
                          from = CodeMirror.Pos(pos.line, opStart-1)
                          to = CodeMirror.Pos(pos.line, pos.ch-1)
                        }
                      }
                    }
                    // 函数左括号(
                    if(lineCon.charAt(ep) == '(') {
                      if(reg.test(lineCon.charAt(ep-1)) || /[\0]/g.test(lineCon.charAt(ep-1))) {
                        let opEnd = ep - 1
                        let opStart = -1
                        for(let whCount=opEnd; whCount>=0; whCount--) {
                          if(lineCon[whCount] == '$') {
                            opStart = whCount;
                            break;
                          }
                        }
                        if(opStart > -1) {
                          from = CodeMirror.Pos(pos.line, opStart-1)
                          to = CodeMirror.Pos(pos.line, pos.ch-1)
                        }
                      }
                    }
                    // 函数名
                    if(charStr && ['$', '{', '}', '(', ')'].indexOf(lineCon.charAt(ep)) == -1) {
                      let opEnd = ep
                      let opStart = -1
                      for(let whCount=opEnd; whCount>=0; whCount--) {
                        if(lineCon[whCount] == '$') {
                          opStart = whCount;
                          break;
                        }
                      }
                      if(opStart > -1) {
                        from = CodeMirror.Pos(pos.line, opStart-1)
                        to = CodeMirror.Pos(pos.line, pos.ch-1)
                      }
                    }
                  }
                }
              }
              // 删除函数名
              if(charStr == '(') {
                let opEnd = pos.ch-1
                let opStart = -1
                for(let whCount=opEnd; whCount>=0; whCount--) {
                  if(lineCon[whCount] == '$') {
                    opStart = whCount;
                    break;
                  }
                }
                if(opStart > -1) {
                  from = CodeMirror.Pos(pos.line, opStart-1)
                  to = CodeMirror.Pos(pos.line, pos.ch-1)
                }
              }
            }
          }
          if(from && to && needDel) {
            coder.setSelection(from, to)
            coder.deleteH()
            this.keyCode = -1
            console.log('00000000000000000000', from, to)
          }
        }else{
          this.keyCode = -1
        }
      })
      // 键盘按下，更新keycode，主要记录左右移动
      this.coder.on('keydown', (coder, event) => {
        if([8, 37, 39].indexOf(event.keyCode) > -1) {
          this.keyCode = event.keyCode
        }else{
          this.keyCode = -1
        }
      })
      // 鼠标按下， 重置keycode
      this.coder.on('mousedown', (coder, event) => {
        this.keyCode = -1
      })
    },
    // 获取全部函数
    getFuncListHandle () {
      let nodeDataList = {}
      this.funcList = []
      getFuncList(this.requestPrefix, this.useCaseString, this.propData.designId).then(res => {
        if(res.data && res.data.code == 0) {
          for(let i in res.data.data) {
            let obj = {
              title: i
            }
            if(typeof res.data.data[i] == 'object') {
              if(res.data.data[i] instanceof Array) {
                obj.type = 'list'
                obj.data = res.data.data[i]
                for(let o in obj.data) {
                  this.$set(nodeDataList, obj.data[o].id, {...obj.data[o], parent: (i+1)})
                }
              }else{
                obj.type = 'tree'
                let temp = []
                for(let k in res.data.data[i]) {
                  temp.push({
                    title: k,
                    data: res.data.data[i][k]
                  })
                  for(let ik in res.data.data[i][k]) {
                    this.$set(nodeDataList, res.data.data[i][k][ik].id, {...res.data.data[i][k][ik], parent: (this.funcList.length+1)})
                  }
                }
                obj.data = temp
              }
            }
            this.funcList.push(obj)
          }
          // console.log(this.funcList)
          sessionStorage.setItem('formulaData', JSON.stringify(nodeDataList))
          this.nodeDataList = nodeDataList
        }else{
          this.handleClose()
        }
      })
    },
    // 添加字段变量
    addVariable (item, index) {
      console.log(item)
      let con = '\0' + ('${'+item.id+'}') + '\0'
      if(!item.param) {
        con += ( '(' + '\0\0' + ')' + '\0')
      }
      this.coder.replaceSelection(con, undefined, undefined, {...item, parent: (index+1)})
    },
    // 确定
    submitHandle () {
      let obj = {...this.propData}
      if(this.execId) {
        obj.id = this.execId
      }
      obj.useCase = this.useCaseString
      obj.body = this.coder.getValue()
      addEditExec(this.requestPrefix, obj).then(res => {
        if(res.data && res.data.code == 0){
          if(this.afterSave) {
            this.afterSave(this.$refs.formulaDialog, res.data.data)
          }
        }
      })
    },
    // 添加说明
    showInfo (item) {
      this.currentData = item
    },
    helpCenter(str) {
      this.$openUrl('', '_blank', str)
    },
  },
};
</script>
<style lang="scss">
.formula-component-dialog {
  .el-dialog {
    .el-dialog__body{
      padding: 10px 20px!important;
    }
    .formula-panel-box{
      width: 858px;
      .cm-field{
        display: inline-block;
        border-radius: 2px;
        padding: 0 5px;
        margin: 1px;
        color: #fff;
        font-size: 12px;
        line-height: 20px;
        font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Arial,sans-serif;
      }
      .cm-field-function{
        color: #708;
      }
      .cm-field-param1{
        background: #178cdf;
      }
      .cm-field-param2{
        background: #E6A23C;
      }
      .cm-field-param3{
        background: #2ea320;
      }
      .cm-bracket{
        color: #997;
      }
      .formula-panel-title {
        margin: 0;
        padding: 0 10px;
        font-size: 12px;
        font-weight: 500;
        line-height: 30px;
        color: rgba(0,0,0,.8);
        border-bottom: 1px solid rgba(17, 31, 44, 8%);
      }
      .formula-panel-content{
        margin: 0;
        padding: 10px 0;
        overflow-y: auto;
        flex: 1 1;
      }
      .formula-panel-top{
        border: 1px solid rgba(17,31,44,.08);
        border-radius: 8px;
        width: 100%;
        .formula-panel{
          flex: none;
          height: 230px;
          display: flex;
          flex-direction: column;
          .formula-panel-title{
            margin: 0;
            padding: 0 10px;
            font-size: 12px;
            font-weight: 500;
            line-height: 30px;
            color: rgba(0,0,0,.8);
            border-bottom: 1px solid rgba(17,31,44,.08);
            .formula-panel-subtitle{
              font-size: 12px;
              margin-left: 5px;
            }
          }
          .formula-panel-content{
            padding: 0;
            height: 200px;
            overflow: hidden;
            .formula-editor{
              height: 100%;
              box-sizing: border-box;
            }
          }
        }
      }
      .formula-panel-bottom{
        display: flex;
        flex: auto;
        margin-top: 10px;
        flex-wrap: nowrap;
        color: #333;
        overflow: hidden;
        justify-content: space-between;
        .formula-panel{
          flex: none;
          width: 250px;
          height: 310px;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(17,31,44,.08);
          border-radius: 8px;
          margin-left: 10px;
          .formula-panel-title{
            border-bottom: none;
            border-bottom: 1px solid rgba(17,31,44,.08);
            .formula-panel-title-text{
              flex: 1 1;
              overflow: hidden;
            }
          }
          .formula-panel-content{
            .blue{
              color: #0089ff;
              background: #ebf6ff;
            }
            .yellow{
              color: #ff9200;
              background: #fff8eb;
            }
            .green{
              color: #00b853;
              background: #ebfaf2;
            }
            .purple{
              color: #5c72ff;
              background: #f2f4ff;
            }
            .red{
              color: #ff7357;
              background: #fff4f2;
            }
            .cyan{
              color: #70acc3;
              background: #eaf0f1;
            }
            .formula-panel-item-filed{
              list-style-type: none;
              .formula-filed-item{
                position: relative;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-decoration: none;
                color: #333;
                padding: 0 6px 0 18px;
                display: block;
                height: 32px;
                line-height: 32px;
                cursor: pointer;
                font-size: 12px;
                .formula-filed-title{
                  color: #171a1d;
                  font-size: 12px;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  overflow: hidden;
                  display: block;
                  width: 146px;
                  margin-right: 40px;
                }
                .formula-filed-capsule{
                  position: absolute;
                  top: 4px;
                  right: 8px;
                  bottom: 4px;
                  text-align: center;
                  padding: 0 8px;
                  line-height: 24px;
                  border-radius: 4px;
                }
              }
              .formula-filed-item:hover{
                background: rgba(126,134,142,.08);
                color: rgba(0,0,0,.75);
              }
              .el-collapse{
                border: 0;
                .el-collapse-item{
                  .el-collapse-item__header{
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    height: 26px;
                    line-height: 26px;
                    border: 0;
                    padding: 0 10px;
                    span{
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: pre;
                      max-width: calc(100% - 26px);
                      display: inline-block;
                    }
                    .el-collapse-item__arrow{
                      margin-left: 5px;
                      vertical-align: super;
                    }
                  }
                  .el-collapse-item__wrap{
                    border-bottom: 0;
                    .el-collapse-item__content{
                      padding-bottom: 0;
                    }
                  }
                }
              }
              .function-panel-filed-list{
                margin: 0;
                padding: 0;
                color: #333;
                .function-panel-filed-li{
                  cursor: pointer;
                  padding: 0 5px 0 22px;
                  line-height: 32px;
                  height: 32px;
                  color: #171a1d;
                  position: relative;
                  .formula-func-title{
                    margin-right: 50px;
                    display: block;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                  }
                  .formula-func-capsule{
                    position: absolute;
                    top: 4px;
                    right: 8px;
                    bottom: 4px;
                    text-align: center;
                    padding: 0 8px;
                    line-height: 24px;
                    border-radius: 4px;
                  }
                  .formula-func-capsule.yellow{
                    color: #ff9200;
                    background: #fff8eb;
                  }
                }
                .function-panel-filed-li:hover{
                  background: rgba(126,134,142,.08);
                }
              }
            }
          }
          .info-section{
            p{
              margin: 0;
              min-height: 24px;
              line-height: 24px;
              padding: 0 15px;
              position: relative;
              font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Arial,sans-serif;
              color: #0a5d7c;
              span.param{
                display: inline-block;
                border-radius: 2px;
                padding: 0 5px;
                margin: 1px;
                color: #fff;
                font-size: 12px;
                line-height: 20px;
                background: #178cdf;
              }
              span.fun{
                display: inline-block;
                border-radius: 2px;
                padding: 0 5px;
                margin: 1px;
                color: #fff;
                font-size: 12px;
                line-height: 20px;
                color: #708;
                background: #fff;
              }
              a{
                color: #0089ff;
                text-decoration: underline;
                font-size: 12px;
                cursor: pointer;
              }
            }
            p::before{
              content: "";
              position: absolute;
              display: block;
              left: 5px;
              top: 10px;
              width: 4px;
              height: 4px;
              background: #0a5d7c;
              border-radius: 50%;
              overflow: hidden;
            }
            p:nth-last-of-type(1)::before{
              display: none;
            }
            .info-text{
              font-size: 12px;
              line-height: 20px;
            }
          }
        }
        .formula-panel:nth-of-type(1) {
          margin-left: 0;
        }
        .formula-panel-func-desc{
          width: 310px;
        }
        .formula-panel.loading{
          background-color: rgba(255, 255, 255, 0.8);
          background-image: url('../../../../public/jvs-ui-public/img/loading.gif');
          background-repeat: no-repeat;
          background-position: center;
          background-position: center;
          background-size: 200px 160px;
        }
      }
      .footer-button{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
      }
    }
  }
}
</style>
