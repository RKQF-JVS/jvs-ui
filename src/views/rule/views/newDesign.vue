<template>
  <div class="cont design-cont">
    <!-- 头部 -->
    <title-page-header title="逻辑引擎设计" @save="emitSave" @close="emitClose">
      <template slot="left">
        <div class="cont-top">
          <div class="cont-top-item">
            <p>{{LjName}}</p>
            <p>{{formData.enable ? '启用': '禁用'}}</p>
          </div>
        </div>
      </template>
      <template slot="right">
        <p v-if="false">
          <el-tooltip effect="dark" content="代码模式" placement="top">
            <img :src="rightToolIcon.codeIcon" alt="" @click="changeModel">
          </el-tooltip>
        </p>
        <p v-if="false">
          <el-tooltip effect="dark" content="定时设置" placement="top">
            <img :src="rightToolIcon.timeIcon" alt="" @click="setFromHandle">
          </el-tooltip>
        </p>
        <p @click="openVariable">
          <el-tooltip effect="dark" content="变量设置" placement="top">
            <i class="el-icon-c-scale-to-original" style="font-size: 24px;font-weight: 550;cursor:pointer;"></i>
          </el-tooltip>
        </p>
        <p>
          <el-tooltip effect="dark" :content="formData.enable ? '禁用' : '启用'" placement="top">
            <img :src="rightToolIcon.startIcon" alt="" @click="endisabledHandle(formData.enable)">
          </el-tooltip>
        </p>
        <p>
          <el-tooltip effect="dark" content="测试" placement="top">
            <img :src="rightToolIcon.testIcon" alt="" @click="testHandle">
          </el-tooltip>
        </p>
      </template>
    </title-page-header>
    <!-- 设计部分 -->
    <div :class="{'cont-box': true, 'data-cont-box': showDataInfo}">
      <!-- 展开收起参数 -->
      <i v-if="false" class="openclose" @click="openCloseData" :class="showDataInfo?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
      <!-- 组件栏 -->
      <div v-if="false" class="cont-box-left" v-show="designModel == 'graph'">
        <p v-for="(item, index) in toolList" :key="'tool_' + index"
          @dragstart="dragstart(item)"
          @dragend="dragend"
        >
          <a @click="addAssembly(item.functionName, item)">
            <img :src="item.icon" alt="">
            <span>{{item.functionName}}</span>
          </a>
        </p>
      </div>
      <!-- 设计器及工具栏 -->
      <div class="cont-box-right" style="width:100%;">
        <!-- 设计器 -->
        <G6Editor v-if="showG6Editor" ref="g6Editor" mode="edit" :data="data" v-show="designModel == 'graph'" @saveGraph="saveGraph"></G6Editor>
        <!-- 代码编译器 -->
        <div class="javacode-box" v-show="designModel == 'code'">
          <p>提示：设计模式保存时会替换代码模式的修改，请谨慎操作！</p>
          <div id="javaCodeEditor"></div>
          <div class="javacode-tool">
            <p>
              <span>控制台</span>
              <jvs-button style="margin-left:20px;padding:0;" type="text" @click="clrearConsole">清空</jvs-button>
            </p>
            <section v-html="excuteResult" id="excuteResultConsole"></section>
          </div>
        </div>
        <!-- 双击修改文本 -->
        <div class="tool-bar" v-if="showInput" :style="'width:'+editObj.size[0]+'px;left:'+editPosition.x+'px;top:'+editPosition.y+'px;'">
          <el-input size="mini" class="edit-input" style="width:100%;" v-model="editObj.label" @focus="noChangeHandle" @blur="editLabelHandle"></el-input>
        </div>
        <!-- 双击线修改线的文本 -->
        <div class="tool-bar" v-if="showEdgeInput" :style="'width:100px;left:'+editEdgePosition.x+'px;top:'+editEdgePosition.y+'px;'">
          <el-input size="mini" class="edit-input" style="width:100%;" v-model="editEdge.label" @focus="noEdgeChangeHandle" @blur="editEdgeLabelHandle"></el-input>
        </div>
      </div>
    </div>
    <!-- 参数 -->
    <div class="cont-bottom" v-if="showDataInfo">
      <jvs-table size="mini" :option="tableOption" :data="formData.parameterPos" @on-load="initTable" @delRow="delRowHandle">
        <template slot="menuLeft">
          <jvs-button size="mini" @click="addRowHandle">添加参数</jvs-button>
        </template>
        <template slot="key" slot-scope="scope">
          <el-input size="mini" v-model="scope.row.key"></el-input>
        </template>
        <template slot="info" slot-scope="scope">
          <el-input size="mini" v-model="scope.row.info"></el-input>
        </template>
        <template slot="classType" slot-scope="scope">
          <el-select size="mini" v-model="scope.row.classType" placeholder="请选择类型" style="width:100%;">
            <el-option
              v-for="(item, index) in classTypeList"
              :key="item+index+scope.row.key"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </template>
        <template slot="defaultValue" slot-scope="scope">
          <el-input size="mini" v-model="scope.row.defaultValue"></el-input>
        </template>
      </jvs-table>
    </div>
    <!-- 定时设置 -->
    <el-dialog title="逻辑设置" append-to-body :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
      <setForm v-if="dialogVisible" :formData="formData" @close="closeHandle" style="padding-bottom: 10px;"/>
    </el-dialog>

    <!-- 条件填写  判断 结束 -->
    <el-dialog
      title="条件填写"
      append-to-body
      :visible.sync="paramDialogVisible"
      width="50%"
      :before-close="handleCloseParamDialog">
      <div v-if="paramDialogVisible">
        <div v-if="endJudgeShow">
          <el-input v-model="paramString"></el-input>
        </div>
        <div class="param-list-box" v-else>
          <div class="param-list-item" v-for="(item, index) in paramObjList" :key="'paramItem'+index">
            <el-select size="mini" v-model="item.operator" placeholder="请选择" v-if="index > 0" style="width:100%;">
              <el-option
                v-for="o in operatorList"
                :key="o.value+'group-'+index"
                :label="o.label"
                :value="o.value">
              </el-option>
            </el-select>
            <div class="param-list-item-left">
              <span v-if="index == 0">判断条件</span>
              <jvs-button v-else size="mini" @click="delOneGroup(index)">删除组</jvs-button>
            </div>
            <div class="param-list-item-right">
              <div class="param-list-item-right-item">
                <div v-for="(it, ix) in item.list" :key="'items'+ix">
                  <span style="margin: 0 10px;" v-if="ix == 0">(</span>
                  <el-input size="mini" v-model="it.str"></el-input>
                  <el-select size="mini" v-model="it.operator" placeholder="请选择" v-if="ix < item.list.length -1">
                    <el-option
                      v-for="o in operatorList"
                      :key="o.value+'pl'+index+'-'+ix"
                      :label="o.label"
                      :value="o.value">
                    </el-option>
                  </el-select>
                  <jvs-button size="mini" v-if="ix > 0" @click="delOneItem(item, ix)">删除</jvs-button>
                  <jvs-button size="mini" v-if="ix == (item.list.length - 1)" @click="addOneItem(item)">添加</jvs-button>
                  <span v-if="ix == (item.list.length - 1)" style="margin: 0 10px;">)</span>
                </div>
              </div>
            </div>
          </div>
          <jvs-button size="mini" @click="addOneGroup">添加一组</jvs-button>
        </div>
        <span slot="footer" class="dialog-footer">
          <jvs-button type="primary" @click="paramSubmit">确 定</jvs-button>
          <jvs-button @click="handleCloseParamDialog">取 消</jvs-button>
        </span>
      </div>
    </el-dialog>
    <!-- 代码模式-相关说明 -->
    <div class="functionInfo" v-if="designModel == 'code' && false" :style="showhide?'width:30%;':'width:0px;padding:0;'">
      <span @click="showhideHandle" class="showhide-menu-icon" :style="showhide?'right: calc(30% + 60px);':'right:0;'"><i :class="showhide?'el-icon-arrow-right':'el-icon-arrow-left'"></i></span>
      <div v-html="functionInfo"></div>
    </div>

    <!-- 设置变量 -->
    <el-dialog
      title="变量设置"
      class="form-fullscreen-dialog variable-set-dialog"
      :visible.sync="variableVisible"
      fullscreen
      append-to-body
      :before-close="variableClose">
      <variableSet v-if="variableVisible" :varialbeData="varialbeData" @variableSave="variableSave" />
    </el-dialog>
  </div>
</template>

<script>
import eventBus from "../utils/eventBus";
import { setStore } from '@/util/store'
import { getTemplatejson, saveOrUpdateDesign, delVersion, getClassType, testLJ, getCodeDoc, enable, saveParameter} from '../api/rule'
import setForm from './design/form'
import G6Editor from '../components/g6-editor/G6Editor'
import variableSet from './design/variable'

import codeicon from '../const/img/代码模式.png'
import timeicon from '../const/img/定时.png'
import starticon from '../const/img/启用.png'
import testicon from '../const/img/测试.png'

export default {
  components: {setForm, G6Editor, variableSet},
  computed: {
    // 逻辑测试时的入参变量
    interface_constants_user_constants () {
      return this.$store.state.qlConstants.interface_constants_user_constants
    },
    ClassType () {
      return this.$store.state.ClassType
    },
    // 可以选的方法
    Funcs () {
      return this.$store.getters.Funcs
    },
    // 数据
    tableData () {
      return JSON.parse(JSON.stringify(this.$store.state.qlConstants.constants_user_variable)).concat(JSON.parse(JSON.stringify(this.$store.state.qlConstants.interface_constants_user_constants)))
    },
  },
  created () {
    if (this.$route.query.token) {
      this.$store.commit('SET_ACCESS_TOKEN', this.$route.query.token)
    }
    if (this.$route.query.id) {
      this.queryId = this.$route.query.id
      this.versionChange(this.queryId)
    }
    if(this.$route.query.name) {
      this.LjName = this.$route.query.name
    }
    // getCodeDoc().then(res => {
    //   if(res.data.code == 0) {
    //     this.functionInfo = res.data.data
    //   }
    // })
  },
  data () {
    return {
      queryId: '', // 逻辑的唯一key
      LjName: '', // 逻辑名称
      // 是否正在拖动左侧的组件 1 没有动  2 已经拖动没有进入中间的界面  3拖动进入中间的页面 4 进入设计页面中的组件
      drag1: '1',
      dragCom: null, // 当前拖拽组件
      dialogVisible: false,
      designDrawingJson: null,
      // 逻辑详情信息
      formData: {
        enable: false,
        parameterPos: {}, //  []  ！！！！！！！！！！！！！！！！
      },
      graph: {}, // 图形
      version: '', // 版本号
      com: '', // 当前组件名
      startSelect: '', // 开始选择的组件
      startToolSelectShow: false,
      toolList: [],
      data: {
        nodes: [
          {
            id: 'start',
            label: '开始',
            nodeType: 'start',
            name: "开始",
            size: [170, 34],
            type: "node",
            shape: "customNode",
            color: "#1890ff",
            x: 100,
            y: 100,
            image: 'https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg',
            inPoints: [[0, 0.5]],
            outPoints: [[1, 0.5]]
          },
        ],
        edges: []
      },
      menuTool: {
        top: 0,
        left: 0,
        functionName: ''
      },
      startMenu: {
        functionName: 'start-tool',
        id: 'start',
        list: [
          { title: '判断', icon: 'el-icon-share' },
          { title: '节点选择', icon: 'el-icon-menu' },
          { title: '连线', icon: 'el-icon-bottom-right' },
          { title: '结束', icon: 'el-icon-help' },
        ]
      },
      // 其他组件的工具栏
      toolMenu: {
        functionName: 'other-tool',
        list: [
          { title: '设置', icon: 'el-icon-setting' },
          { title: '判断', icon: 'el-icon-share' },
          { title: '节点交换', icon: 'el-icon-sort' },
          { title: '连线', icon: 'el-icon-bottom-right' },
          { title: '结束', icon: 'el-icon-help' },
          { title: '删除', icon: 'el-icon-delete' },
        ]
      },
      // tableData: [{}], // 表格值
      // 表格配置
      tableOption: {
        addBtn: false,
        editBtn: false,
        viewBtn: false,
        menuAlign: 'center',
        cancal: false,
        column: [
          {
            label: '参数名',
            prop: 'key',
            slot: true
          },
          {
            label: '解释',
            prop: 'info',
            slot: true
          },
          {
            label: '类型',
            prop: 'classType',
            slot: true,
            dicData: [
              {label: '字符串', value: 'String'},
              {label: '时间', value: 'Date'},
              {label: '数字', value: 'Number'},
              {label: '布尔', value: 'Boolean'},
              {label: '集合', value: 'Array'},
              {label: '对象', value: 'Object'},
            ]
          },{
            label: '默认值',
            prop: 'defaultValue',
            slot: true
          },
          {
            label: '执行后的值',
            prop: 'result',
          }
        ]
      },
      showDataInfo: false, // 是否显示数据表格
      count: 1,
      lastItem: 'start', // 上一个节点,不算线
      // 判断的顺序
      Csort: 0,
      // 线的id后缀
      edgeSize: 0,
      // 当前选中的是 节点 还是 线  node/line
      acttype: '',
      // 选择的节点
      actNode: {},
      // 选择的线
      actEdge: {},
      mode: 'edit', // 当前模式
      addingEdge: null, // 添加的线
      noChangeLabel: '', // 修改前的label名称
      editObj: {}, // 双击修改的组件对象
      editPosition: {}, // 位置参数
      showInput: false, // 显示隐藏双击出的文本框
      edge: {}, // 连线数据
      delLineBool: false, // 是否显示删除线的工具栏
      deleteLinePosition: {}, // 连线删除工具位置
      classTypeList: [], // 参数类型列表
      firstId: '', // 连线第一个点的id
      editEdge: {}, // 当前编辑的线
      showEdgeInput: false, // 编辑线文本框
      // 编辑线文本框位置
      editEdgePosition: {
        x: 0,
        y: 0
      },
      noChangeEdgeLabel: '', // 线修改前的label值
      paramDialogVisible: false, // 条件弹框
      // 条件
      paramString: '', // 结束
      paramObjList: [  // 判断
        {
          operator: '',
          list: [
            {
              str: '',
              operator: ''
            }
          ]
        }
      ],
      setType: '', // 设置条件的类型  判断线 还是  结束节点
      designModel: 'graph', // 当前模式  graph图形设计  code代码设计
      codeEditor: null, // 代码编译器
      excuteResult: '',
      operatorList: [
        {label: '与', value: '&'},
        {label: '或', value: '|'},
        // {label: '非', value: '!'}
      ],
      functionInfo: '<h1>说明</h1>',
      showhide: true,
      endToolBool: false, // 是否显示结束节点工具
      endTool: {
        top: 0,
        left: 0,
        functionName: ''
      },
      endJudgeShow: false,
      rightToolIcon: {
        codeIcon: codeicon,
        timeIcon: timeicon,
        startIcon: starticon,
        testIcon: testicon
      },
      needFreshBool: null,
      showG6Editor: false,
      needFreshStr: "",
      variableVisible: false, // 设置变量弹框
      variableJsonList: [],
      variableItems: [],
      varialbeData: null
    }
  },
  mounted () {
    // 获取所有方法--工具栏
    this.toolList = this.Funcs
    // 获取参数类型
    getClassType().then(res => {
      if(res.data.code == 0) {
        this.classTypeList = res.data.data
      }
    })
    this.initCodeEditor()
  },
  methods: {
    // 测试，对节点通过状态设置
    async testHandle () {
      this.needFreshBool = false
      this.needFreshStr = "已自动保存"
      eventBus.$emit('saveGraph', true)
      // this.saveHandle(false, null)
      // await this.saveHandle(false, '已自动保存')
      // this.$message.success("已自动保存")
      this.versionChange(this.queryId)
      if(this.designModel == 'graph') {
         testLJ(this.formData.id, {variableMap: this.formData.parameterPos}).then(res => {
          if(res.data.code == 0) {
            for(let i in this.formData.parameterPos) {
              let key = this.formData.parameterPos[i].key
              if(res.data.data.variableMap[key]) {
                this.formData.parameterPos[i].result = res.data.data.variableMap[key]
              }
            }
            this.$forceUpdate()
            // this.initTable()
            // // 获取所有节点对象
            // let nodeAll = this.graph.findAll('node', node => {
            //   return node.get('model')
            // })
            // for(let i in nodeAll) {
            //   let model = nodeAll[i].getModel()
            //   if(model.id != 'start') {
            //     // 逻辑测试未通过
            //     if(res.data.data && res.data.data.errorNodeId && model.id == res.data.data.errorNodeId){
            //       model.style = {
            //         fill: '#9EC9FF',
            //         lineWidth: 1,
            //         shadowOffsetX: 0,
            //         shadowOffsetY: 0,
            //         shadowColor: '#ff0000',
            //         shadowBlur: 20,
            //         stroke: '#ff0000', // F56C6C
            //         hover: {
            //           fillOpacity: 0.8
            //         }
            //       }
            //       // 模拟测试高亮显示数据
            //       // model.testData = [
            //       //   {key: 'name', value: '张三'},
            //       //   {key: 'age', value: 5},
            //       //   {key: 'aa', value: '其他'}
            //       // ]
            //     }else{
            //       model.style = {
            //         fill: '#9EC9FF',
            //         stroke: '#5B8FF9',
            //         lineWidth: 1,
            //         hover: {
            //           fillOpacity: 0.8
            //         }
            //       }
            //       if(res.data.data && res.data.data.nodeResult) {
            //         model.testData = JSON.stringify(res.data.data.nodeResult[model.id])
            //       }
            //     }
            //     // 更新节点
            //     this.graph.updateItem(model.id, model)
            //   }
            // }
          }
        })
      }else{
        testLJ(this.formData.id, {variableMap: this.formData.parameterPos}).then(res => {
          if(res.data.code == 0) {
            let _this = this
            if(res.data.data && res.data.data.logs) {
              for(let i in res.data.data.logs) {
                if(timer){
                  clearTimeout(timer)
                }
                let timer = setTimeout( ()=> {
                  _this.excuteResult += `
                    <span>${res.data.data.logs[i].time}</span>
                    <span>[ ${res.data.data.logs[i].type} ]</span>
                    <span>${res.data.data.logs[i].msg}</span>
                  `
                  if(res.data.data.logs[i].line) {
                    _this.excuteResult += `
                      <span>(${res.data.data.logs[i].line})</span>
                      <br/>
                    `
                  }else{
                    _this.excuteResult += '<br/>'
                  }
                }, 400)
              }
            }
          }
        })
      }
    },
    // 发送逻辑测试
    fetchljtest (obj, type) {
      // store.state.qlConstants
      let data = this.interface_constants_user_constants
      ruletest(this.$store.state.id, obj, type).then(res => {
        if (res.code === 0) {
          // 处理返回后的值
          let arr = []
          let variableMap = res.data.variableMap
          let keys = []
          for (let key in variableMap) {
            keys.push(key)
          }
          data.map(item => {
            if (keys.indexOf(item.key) !== -1) {
              item.handleValue = variableMap[item.key]
            }
            arr.push(item)
          })
          // 设置测试完成的最终结果
          this.testdata = res.data.obj
          this.ruleStr = res.data.ruleStr
          // 设置测试完成后变量的变化情况
          this.$store.commit('set_rc', arr)
          // 设置为 查看 test 数据模式
          this.test = true
          // 设置 查看的值
          if(res.data && res.data.nodeResult) {
            this.testNodesdata = res.data.nodeResult
          }
        }
        console.log(res)
      })
    },
    // 版本号change
    versionChange (val) {
      getTemplatejson(this.queryId, val).then(res => {
        if(res.data.code == 0) {
          this.formData = res.data.data
          // 模式
          if(this.formData.designModel) {
            this.designModel = this.formData.designModel
          }
          // 代码
          if(this.formData.executeCode && this.codeEditor) {
            this.codeEditor.setValue(this.formData.executeCode)
          }
          if(this.formData.designDrawingJson) {
            this.data = JSON.parse(this.formData.designDrawingJson)
            if(!this.data.nodes || this.data.nodes.length == 0) {
              this.data = {
                nodes: [
                  {
                    id: 'start',
                    label: '开始',
                    nodeType: 'start',
                    name: "开始",
                    size: [170, 34],
                    type: "node",
                    shape: "customNode",
                    color: "#1890ff",
                    x: 100,
                    y: 100,
                    inPoints: [[0, 0.5]],
                    outPoints: [[1, 0.5]]
                  },
                ],
                edges: []
              }
            }
          }
          // for(let j in this.formData.parameterPos) {
          //   if(!this.formData.parameterPos[j].result) {
          //     this.formData.parameterPos[j].result = ''
          //   }
          // }
          if(this.formData.parameterPos) {
            this.varialbeData = this.formData.parameterPos
          }
          this.showG6Editor = true
        }
      })
    },
    // 展开收起 参数显示
    openCloseData () {
      let bool = this.showDataInfo
      this.showDataInfo = !bool
    },
    // 添加参数
    addRowHandle () {
      this.formData.parameterPos.push({
        classType: '',
        defaultValue: '',
        info: '',
        key: '',
        result: ''
      })
      this.$forceUpdate()
    },
    // 删除参数
    delRowHandle (row) {
      let index = -1
      for(let i in this.formData.parameterPos) {
        if(this.formData.parameterPos[i].key == row.key) {
          index = i
        }
      }
      if(index != -1) {
        this.formData.parameterPos.splice(index, 1)
      }
    },
    // 返回
    goBack () {
      this.$router.push({path: '/ruleList'})
    },
    // 定时设置
    setFromHandle () {
      this.dialogVisible = true
    },
    // 关闭弹框
    handleClose () {
      this.dialogVisible = false
    },
    // 子级通知关闭
    closeHandle (bool) {
      if(bool) {
        this.handleClose()
        this.versionChange(this.formData.version)
      }
    },
    // 保存
    async saveHandle (needFresh, str, data) {
      this.formData.key = this.queryId
      this.formData.designModel = this.designModel
      if(this.designModel == 'graph') {
        let nodeAll = data
        for(let i in nodeAll.nodes) {
          nodeAll.nodes[i].style = {
            fill: '#9EC9FF',
            stroke: '#5B8FF9',
            lineWidth: 1,
            hover: {
              fillOpacity: 0.8
            }
          }
          nodeAll.nodes[i].testData = ""
        }
        this.formData.designDrawingJson = JSON.stringify(nodeAll)
      }else{
        let code = this.codeEditor.getValue()
        this.formData.executeCode = code
      }
      await saveOrUpdateDesign(this.formData).then(res => {
        if(res.data.code == 0) {
          if(needFresh === false) {
            if(str) {
              this.$message.success(str)
            }
            return false
          }
          if(str) {
            this.$message.success(str)
          }else{
            this.$message.success("保存成功")
          }
          this.versionChange(this.queryId)
        }
      })
    },
    // 通知保存
    emitSave (bool) {
      if(bool) {
        this.needFreshBool = null
        this.needFreshStr = null
        if(this.designModel == 'code') {
          this.saveGraph()
        }else{
          eventBus.$emit('saveGraph', true)
        }
      }
    },
    // 设计的数据保存
    saveGraph (data) {
      this.saveHandle(this.needFreshBool, this.needFreshStr, data)
    },
    emitClose (bool) {
      if(bool) {
        this.enable = false
        this.variableItems = []
        setStore({ name: 'variableItems', content: this.variableItems, type: 'session' })
        this.goBack()
      }
    },
    // 启用  禁用
    endisabledHandle (bool) {
      let str = '启用成功'
      if(bool) {
        str = '禁用成功'
      }
      enable(this.formData.secret).then(res => {
        if(res.data.code == 0) {
          this.$message.success(str)
          this.formData.enable = !bool
        }
      })
    },
    // 初始化参数表格
    initTable () {
      if(!this.formData.parameterPos) {
        this.formData.parameterPos = []
      }
    },
    // 设置判断线的条件
    setLineparamHandle () {
      console.log(this.actEdge)
      if(this.actEdge.paramObjList) {
        this.paramObjList = this.actEdge.paramObjList
      }
      this.setType = 'line'
      this.endJudgeShow = false
      this.paramDialogVisible = true
    },
    // 关闭条件弹框
    handleCloseParamDialog () {
      this.paramDialogVisible = false
      this.paramObjList = []
      this.paramString = ""
    },
    // 提交条件
    paramSubmit () {
      if(this.setType == 'line') {
        this.actEdge.paramObjList = this.paramObjList
        let str = ""
        for(let p in this.paramObjList) {
          str += `${this.paramObjList[p].operator}(`
          for(let l in this.paramObjList[p].list) {
            str += `${this.paramObjList[p].list[l].str}${this.paramObjList[p].list[l].operator}`
          }
          str += ')'
        }
        this.actEdge.label = str
        this.graph.updateItem(this.actEdge.id, this.actEdge)
      }else{
        if(this.actNode.nodeType == 'end') {
          this.actNode.paramString = this.paramString
        }else{
          this.actNode.paramObjList = this.paramObjList
        }
        this.graph.updateItem(this.actNode.id, this.actNode)
      }
      this.handleCloseParamDialog()
    },
    // 切换模式
    changeModel () {
      let temp = this.designModel
      if(temp == 'graph') {
        temp = 'code'
        this.showG6Editor = false
      }else{
        temp = 'graph'
        this.showG6Editor = true
        if(this.$refs.g6Editor) {
          this.$refs.g6Editor.resize()
        }
      }
      this.designModel = temp
    },
    // 初始化代码编译器
    initCodeEditor () {
      this.codeEditor = ace.edit('javaCodeEditor')
      this.codeEditor.setTheme("ace/theme/twilight"); // 黑色
      let JavaMode = ace.require("ace/mode/java").Mode;
      this.codeEditor.session.setMode(new JavaMode());
      this.codeEditor.enableBasicAutocompletion = true
    },
    // 添加一项条件
    addOneItem (item) {
      item.list.push({str: '', operator: ''})
    },
    // 删除一项条件
    delOneItem (item, index) {
      item.list.splice(index, 1)
    },
    // 添加一组
    addOneGroup () {
      this.paramObjList.push({
        operator: '',
        list: [{str: '', operator: ''}]
      })
    },
    // 删除一组
    delOneGroup (index) {
      this.paramObjList.splice(index, 1)
    },
    // 清空控制台
    clrearConsole () {
      this.excuteResult = ''
    },
    // 展开收起
    showhideHandle () {
      let bool = this.showhide
      this.showhide = !bool
    },
    // 设置变量
    openVariable () {
      this.variableVisible = true
    },
    // 关闭设置变量
    variableClose () {
      this.variableVisible = false
    },
    // 保存变量
    variableSave (data) {
      this.variableJsonList = []
      this.formatJson(data, this.variableJsonList)
      saveParameter({
        secret: this.queryId,
        parameterPo: data.length > 0 ? this.variableJsonList[0] : {}
      }).then(res => {
        if(res.data.code == 0) {
          this.variableItemsHandle()
          this.$message.success("保存成功")
          this.variableClose()
        }
      })
    },
    formatJson (list, temp) {
      for(let i in list) {
        let tp = {
          key: list[i].key,
          classType: list[i].classType,
          description: list[i].description
        }
        if(['布尔', '数字', '浮点数', '字符串'].indexOf(list[i].classType) > -1) {
          tp.value = list[i].value
        }else{
          if(list[i].value == '[]' || list[i].value == '{}' || !list[i].value) {
            tp.value = null
          }else{
            tp.value = JSON.parse(list[i].value)
          }
        }
        if(list[i].children && list[i].children.length > 0) {
          tp.children = []
          this.formatJson(list[i].children, tp.children)
        }
        temp.push(tp)
      }
    },
    getVariableItems (list, parent) {
      for(let i in list) {
        let pt = parent.parent ? JSON.parse(JSON.stringify(parent.parent)) : []
        if(parent.key != 'root') {
          pt.push(parent.key)
        }
        let tp = {
          key: list[i].key,
          parent: pt,
          description: list[i].description
        }
        list[i].parent = pt
        if(list[i].children && list[i].children.length > 0) {
          this.getVariableItems(list[i].children, list[i])
        }
        this.variableItems.push(tp)
      }
    },
    variableItemsHandle () {
      let tp = JSON.parse(JSON.stringify(this.variableJsonList))
      tp[0].parent = []
      this.getVariableItems(tp[0].children, tp[0])
      setStore({ name: 'variableItems', content: this.variableItems, type: 'session' })
    }
  },
  watch: {
    excuteResult () {
      this.$nextTick(() => {
        var container = this.$el.querySelector('#excuteResultConsole')
        container.scrollTop = container.scrollHeight
      })
    }
  }
}
</script>

<style lang="scss" scoped>
p {
  padding: 0;
  margin: 0;
}
.cont {
  position: relative;
  overflow: hidden;
  margin: -8px 0;
  .cont-top {
    overflow: hidden;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #606266;
    background: #fff;
    // margin-top: 8px;
    // padding: 8px 0;
    border-radius: 5px;
    .cont-top-item {
      display: flex;
      justify-content: space-between;
      p {
        margin: 0 10px;
        height: 32px;
        line-height: 32px;
      }
    }
  }
  .cont-box {
    display: flex;
    height: calc(100vh - 76px);
    justify-content: space-between;
    // border: 1px solid #e5e5e5;
    margin-top: 10px;
    position: relative;
    .openclose{
      position: absolute;
      left: 50%;
      bottom: 0;
      font-size: 20px;
      cursor: pointer;
      z-index: 2;
    }
    .cont-box-left {
      // border-right: 1px solid #e5e5e5;
      width: 200px;
      overflow: hidden;
      overflow-y: auto;
      scrollbar-width: none; /* firefox */
      -ms-overflow-style: none; /* IE 10+ */
      overflow-x: hidden;
      overflow-y: auto;
      padding-top: 7px;
      background: #F6F6F6;
      min-width: 200px;
      p {
        margin: 13px 0;
        // padding: 5px 0;
        font-size: 16px;
        text-align: center;
        cursor: pointer;
        height: 30px;
        display: flex;
        align-items: center;
        a{
          display: flex;
          align-items: center;
          margin-left: 20px;
        }
        img{
          display: inline-block;
          width: 20px;
          height: 20px;
          margin-right: 20px;
        }
      }
      p:hover{
        background: #EEEEEE;
        a{
          color: #3471FF;
        }
      }
    }
    .cont-box-left::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
    .cont-box-right{
      // flex: 1;
      position: relative;
      background: #fff;
      .javacode-box{
        position: relative;
        height: 100%;
        background: #141414;
        color: #fff;
        p{
          margin: 0;
          padding: 0 10px;
          text-align: left;
          height: 24px;
          font-size: 14px;
          line-height: 24px;
        }
        #javaCodeEditor{
          height: calc(100% - 30% - 32px);
          overflow: hidden;
          overflow-y: auto;
          scrollbar-width: none; /* firefox */
          -ms-overflow-style: none; /* IE 10+ */
          .ace_scrollbar{
            display: none;
          }
        }
        #javaCodeEditor::-webkit-scrollbar {
          display: none; /* Chrome Safari */
        }
        .javacode-tool{
          height: 30%;
          p{
            display: flex;
            padding: 0;
            border-top: 1px solid #fff;
            border-bottom: 1px solid #fff;
            span{
              text-indent: 10px;
            }
          }
          section{
            height: calc(100% - 48px);
            scrollbar-width: none; /* firefox */
            -ms-overflow-style: none; /* IE 10+ */
            overflow-x: hidden;
            overflow-y: auto;
          }
          section::-webkit-scrollbar {
            display: none; /* Chrome Safari */
          }
        }
      }
    }
  }
  .data-cont-box{
    height: calc(100vh - 395px);
  }
  .cont-bottom{
    height: 300px;
    padding: 0 20px;
    position: relative;
    background: #fff;
    padding-top: 10px;
    z-index: 9;
  }
}
.tool-bar{
  position: absolute;
  left: 0;
  top: 0;
  min-width: 100px;
  box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  border: 1px solid #e2e2e2;
  background: #fff;;
  ul{
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    height: 32px;
    font-size: 20px;
    li{
      cursor: pointer;
    }
  }
}
.other-tool{
  width: 150px;
}
.param-list-box{
  .param-list-item{
    display: flex;
    flex-wrap: wrap;
    .param-list-item-left{
      height: 48px;
      line-height: 48px;
    }
    .param-list-item-right{
      .param-list-item-right-item{
        >div{
          display: flex;
          align-items: center;
          margin: 10px 0;
        }
      }
      .el-input, .el-select{
        margin: 0 5px;
      }
    }
  }
}
#excuteResultConsole{
  padding: 10px 40px;
  font-size: 14px;
  span{
    margin: 10px 10px;
  }
}
.functionInfo{
  position: fixed;
  right: 0;
  top: 57px;
  // width: 30%;
  height: calc(100% - 58px);
  overflow: hidden;
  overflow-y: auto;
  background: #000;
  color: #fff;
  font-size: 12px;
  padding: 0 30px;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  .showhide-menu-icon{
    position: fixed;
    width: 20px;
    height: 40px;
    right: 0;
    text-align: center;
    top: calc(50% - 20px);
    cursor: pointer;
    border: 1px solid rgba(0,21,41,.15);
    border-left: 0;
    font-size: 20px;
    line-height: 40px;
    z-index: 9;
    background-color: #ccc;
    opacity: .7;
    display: block;
    border-radius: 20px 0px 0px 20px;
    overflow: hidden;
    i{
      margin-left: 2px;
    }
  }
}
.functionInfo::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>
<style lang="scss">
.cont-top-item {
  p{
    .el-select{
      height: 32px;
      .el-input{
        height: 100%;
      }
    }
  }
}
.cont-bottom{
  border-top: 1px solid #dcdfe6;
  .el-table__body-wrapper{
    height: 235px;
    overflow: hidden;
    overflow-y: auto;
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    overflow-x: hidden;
    overflow-y: auto;
    .el-table__empty-block{
      min-height: 135px;
      height: 135px;
    }

  }
  .el-table__body-wrapper::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}
#container {
  position: relative;
  // 提示框
  .g6-component-tooltip{
    box-shadow: #F56C6C 0px 0px 10px;
  }
}
.edit-input{
  width: 100px;
  height:40px;
  .el-input__inner{
    height: 40px;
    line-height: 40px;
  }
}
.toolTip-box {
  min-width: 100px;
  p{
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    span{
      width: 50%;
    }
  }
}
.ace_scrollbar {
  width: 0!important;
}
.variable-set-dialog{
  .el-dialog.is-fullscreen{
    .el-dialog__body{
      position: unset;
      width: 100%;
      padding: 30px 20px;
      box-sizing: border-box;
    }
  }
}
</style>
