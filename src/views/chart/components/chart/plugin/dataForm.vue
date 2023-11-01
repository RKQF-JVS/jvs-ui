<template>
  <div style="padding: 10px">
<!--    <h4>数据设计</h4>-->
    <el-row>
      <div>
        <span style="margin-right: 8px">筛选条件</span>
        <el-popover
          style="cursor: pointer;"
          placement="top-start"
          width="300"
          trigger="hover">
          <div style="font-size: 12px; padding: 0 10px">
            可根据筛选标签内的内容，如使用${dept_id}拼凑执行sql或接口或逻辑引擎的执行结果进行数据动态筛选
          </div>
          <i slot="reference" class="el-icon-question"/>
        </el-popover>
      </div>
      <div style="padding: 8px 0">
        <el-tooltip style="cursor: pointer; margin: 6px" v-for="(item, key) in info.selectControl" :key="key" effect="dark" :content="item.filterKey" placement="bottom-end">
          <el-tag size="small">{{ item.label }}</el-tag>
        </el-tooltip>
      </div>
    </el-row>
    <div style="margin: 16px 0 8px">
      <span style="margin-right: 8px">数据来源</span>
      <el-popover
        style="cursor: pointer;"
        placement="top-start"
        width="300"
        trigger="hover">
        <div style="font-size: 12px; padding: 0 10px">
          模拟数据：为假数据。通常只做测试数据显示使用；<br/>
          逻辑引擎：可在逻辑引擎进行设计后操作外部或内部数据进行图表展示；<br/>
          <!-- 暂时注释掉 -->
          <!-- Mysql数据库：可运行一段Sql，并将其结果返回以界面上；<br/>
          接口Api：可添加一个url地址，进行设置处理数据处理 -->
        </div>
        <i slot="reference" class="el-icon-question"/>
      </el-popover>
    </div>
    <jvs-tab :active="dataForm.datasourceType" :option="tabOption" @tab-click="tabClick"></jvs-tab>
    <jvs-form :option="option" :formData="dataForm" @formChange="formChange">
      <template slot="apiUrlForm">
        <el-row v-if="dataForm.datasourceType == 'API'">
          <el-input
            type="apiUrl"
            placeholder="请输入URL地址"
            v-model="dataForm.apiUrl">
          </el-input>
          <div style="color: #606266; font-size: 14px;">提示：可支持后台服务lb.xxx地址</div>
        </el-row>
      </template>
      <template slot="sqlForm">
        <div v-if="dataForm.datasourceType == 'MYSQL'">
          <el-input
            v-if="dataForm.datasourceType == 'MYSQL'"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入查询语句"
            v-model="dataForm.sql">
          </el-input>
          <el-row v-if="false" class="paramtips">
            <span>变量引用</span>
            <div style="display:flex;">
              <p>
                <span>变量名称</span>
                <span>{startTime}</span>
                <span>{endTime}</span>
                <span>{chartDeptId}</span>
                <span>{chartUserId}</span>
                <span>{chartUserRoles}</span>
              </p>
              <p>
                <span>说明</span>
                <span>开始时间</span>
                <span>结束时间</span>
                <span>部门id</span>
                <span>用户id</span>
                <span>角色ID以逗号分割</span>
              </p>
            </div>
          </el-row>
        </div>

      </template>
      <template slot="queryForm">
        <div v-if="dataForm.datasourceType == 'MONGO'">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入查询语句"
            v-model="dataForm.query">
          </el-input>
          <el-row v-if="false" class="paramtips">
            <span>变量引用</span>
            <div style="display:flex;">
              <p>
                <span>变量名称</span>
                <span>{startTime}</span>
                <span>{endTime}</span>
                <span>{chartDeptId}</span>
                <span>{chartUserId}</span>
                <span>{chartUserRoles}</span>
              </p>
              <p>
                <span>说明</span>
                <span>开始时间</span>
                <span>结束时间</span>
                <span>部门id</span>
                <span>用户id</span>
                <span>角色ID以逗号分割</span>
              </p>
            </div>
          </el-row>
        </div>

      </template>
    </jvs-form>
<!--    <el-row>-->
<!--      <jvs-button size="mini" @click="testHandle">测试</jvs-button>-->
<!--      <jvs-button size="mini" @click="saveHandle">保存</jvs-button>-->
<!--      <jvs-button size="mini" @click="mockTest">mock数据测试</jvs-button>-->
    <el-row v-show="isMock">
      <jvs-button size="mini" @click="mockTest">生成mock数据</jvs-button>
    </el-row>
<!--      <slot></slot>-->
<!--    </el-row>-->
    <el-row v-show="isMock" class="jsonShow">
      <div>
<!--        <span>数据示例：</span>-->
        <el-input
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 15}"
          v-model="editor">
        </el-input>
<!--        <div id="demoEditor" style="flex: 1;margin-top: 10px;"></div>-->
        <!-- <json-viewer
          style="margin-top: 10px"
          :value="demo"
          :expand-depth="2000"
          copyable
          boxed
          sort
        ></json-viewer> -->
      </div>
      <div v-show="returnResult">
        <span>接口返回：</span>
        <div id="codeEditor" style="flex: 1;"></div>
        <!-- <json-viewer
          style="margin-top: 10px"
          :value="returnResultJson"
          :expand-depth="2000"
          copyable
          boxed
          sort
        ></json-viewer> -->
      </div>
    </el-row>
  </div>
</template>
<script>
import {getSource} from '@/views/chart/api/chart'
export default {
  name: 'data-form',
  props: {
    info: {
      type: Object
    },
    returnResult: {
      type: Object
    }
  },
  computed: {
    returnResultJson () {
      return this.returnResult.data.tableData
    }
  },
  data () {
    return {
      dataForm: {
        // datasourceType: 'API',
        datasourceType: 'MOCK',
        dataSourceName: null,
        apiUrl: '',
        sql: '',
        query: ''
      },
      activeName: 'MOCK',
      tabOption: {
        type: "card",
        column: [
          { label: '模拟数据', name: 'MOCK' },
          // { label: '接口API', name: 'API' },
          { label: '逻辑引擎', name: 'RULE' },
          // { label: 'Mysql', name: 'MYSQL' }
        ]
      },
      option: { // 对应表单设置
        labelWidth: '80px',
        submitBtn: false,
        emptyBtn: false,
        btnHide: true,
        cancal: false,
        column: [
          // {
          //   label: '数据来源',
          //   prop: 'datasourceType',
          //   type: 'select',
          //   dicData: [
          //     { label: '接口API', value: 'API' },
          //     { label: 'Mysql', value: 'MYSQL' },
          //     { label: 'Mongo', value: 'MONGO' },
          //     { label: '逻辑引擎', value: 'RULE' }
          //   ],
          //   display: true
          //   // rules: [{ required: true, message: '请选择数据来源', trigger: 'change' }]
          // },
          // {
          //   label: '数据来源',
          //   prop: 'datasourceType',
          //   type: 'radio',
          //   dicData: [
          //     {label: '模拟数据', value: 'MOCK'},
          //     {label: '接口API', value: 'API' },
          //     {label: '逻辑引擎', value: 'RULE'},
          //     {label: 'Mysql', value: 'MYSQL'}
          //   ]
          // },
          {
            label: '数据源',
            prop: 'dataSourceName',
            type: 'select',
            dicData: [],
            display: false
            // rules: [{ required: true, message: '请选择数据源', trigger: 'change' }]
          },
          {
            label: '逻辑引擎',
            prop: 'key',
            type: 'select',
            dicData: [],
            display: false
          },
          {
            label: 'URL地址',
            prop: 'apiUrl',
            formSlot: true,
            display: false
          },
          {
            label: '查询语句',
            prop: 'sql',
            formSlot: true,
            display: false
          },
          {
            label: '查询语句',
            prop: 'query',
            formSlot: true,
            display: false
          }
        ]
      },
      isMock: true,
      testShow: false,
      demo: this.info.data.tableData,
      editor: null,
      demoEditor: null
    }
  },
  created () {
    this.demo = this.info.data.tableData ? this.info.data.tableData : this.info.data.cardContent
    // this.$nextTick(() => {
    //   this.demo = this.info.data.tableData ? this.info.data.tableData : this.info.data.cardContent
    // })
    if(this.info.dataSource) {
      this.dataForm = this.info.dataSource
    }
    if(this.dataForm.datasourceType == 'API') {
      this.option.column.filter( item => {
        if(item.prop == 'apiUrl') {
          item.display = true
        }
        if(item.prop == 'sql') {
          item.display = false
        }
      })
    }
  },
  methods: {
    tabClick(e) {
      this.dataForm.datasourceType = e
    },
    formChange(e) {
      // if (e.datasourceType === 'RULE' && e.key !== '') {
      //   console.log(e.key)
      // }
    },
    testHandle () {
      if(!this.dataForm.datasourceType) {
        this.$message.warning("请先选择数据来源")
        return false
      }
      if(this.dataForm.datasourceType == 'API') {
        if(!this.dataForm.apiUrl) {
          this.$message.warning("请求地址不能为空")
          return false
        }
      }
      if(this.dataForm.datasourceType == 'MYSQL' || this.dataForm.datasourceType == 'MONGO') {
        if(!this.dataForm.dataSourceName) {
          this.$message.warning("数据源不能为空")
          return false
        }
      }
      if(this.dataForm.datasourceType == "RULE") {
        if(!this.dataForm.key) {
          this.$message.warning("逻辑引擎不能为空")
          return false
        }
      }
      let temp = JSON.parse(JSON.stringify(this.info))
      temp.dataSource = this.dataForm
      this.$emit('testData', temp)
    },
    // 生成数据
    mockTest () {
      // this.$nextTick(() => {
      //   if (this.info.data.tableData) {
      //     this.demoEditor.setValue(JSON.stringify(this.demo))
      //   } else {
      //     this.demoEditor.setValue(JSON.stringify(this.info.data.cardContent))
      //   }
      // })
      this.$nextTick(() => {
        if (this.info.data.tableData) {
          this.editor = JSON.stringify(this.demo)
        } else {
          this.editor = JSON.stringify(this.info.data.cardContent)
        }
      })
      this.$emit('mockTest', true)
    },
    // // 保存
    // saveHandle () {
    //   this.$emit('save', this.dataForm)
    // },
    // 初始话代码编译器
    initCodeeditor () {
      if(this.returnResult && this.returnResult.data) {
        this.editor = JSON.stringify(this.returnResult.data.tableData)
      }
      if(this.demo) {
        this.$nextTick(() => {
          this.editor = JSON.stringify(this.demo)
        })
      }
      // this.editor = ace.edit("codeEditor")
      // this.demoEditor = ace.edit("demoEditor")
      // // editor.setTheme("ace/theme/twilight"); // 黑色
      // let JavaScriptMode = ace.require("ace/mode/javascript").Mode;
      // this.editor.session.setMode(new JavaScriptMode());
      // if(this.returnResult && this.returnResult.data) {
      //   this.editor.setValue(JSON.stringify(this.returnResult.data.tableData))
      // }
      // this.demoEditor.session.setMode(new JavaScriptMode())
      // if(this.demo) {
      //   this.$nextTick(() => {
      //     this.demoEditor.setValue(JSON.stringify(this.demo))
      //   })
      // }
      // let _this = this
      // this.demoEditor.getSession().on('change', function(e) {
      //   let demo = JSON.parse(_this.demoEditor.getValue())
      //   _this.$emit('demoTest', demo)
      //   // _this.$set(_this.returnResultJson, _editor.getValue())
      // });
    }
  },
  mounted () {
    this.initCodeeditor()
  },
  watch: {
    info: {
      handler(newVal, oldVal) {
        if (newVal.data.tableData) {
          this.editor = JSON.stringify(newVal.data.tableData)
        } else {
          this.editor = JSON.stringify(newVal.data.cardContent)
        }
      },
      deep: true
    },
    editor(val) {
      try {
        const data = JSON.parse(val)
        this.$emit('mockDataChange', data)
      } catch (err) {
        const data = []
        this.$emit('mockDataChange', data)
      }
    },
    // activeName(newVal) {
    // },
    'dataForm.datasourceType': {
      deep: true,
      handler(newVal, oldVal) {
        if(newVal == 'MYSQL') {
          this.isMock = false
          this.option.column.filter( item => {
            if(item.prop == 'dataSourceName') {
              getSource('mysql').then(res => {
                if(res.data.code == 0) {
                  item.dicData = res.data.data
                }
              })
            }
            if(item.prop == 'apiUrl') {
              item.display = false
            }
            if(item.prop == 'sql') {
              item.display = true
            }
            if(item.prop == 'dataSourceName') {
              item.display = true
            }
            if(item.prop == 'key') {
              item.display = false
            }
            if(item.prop == 'query') {
              item.display = false
            }
          })
        }
        if(newVal == 'API') {
          this.isMock = false
          this.option.column.filter( item => {
            if(item.prop == 'dataSourceName') {
              item.display = false
            }
            if(item.prop == 'apiUrl') {
              item.display = true
            }
            if(item.prop == 'sql') {
              item.display = false
            }
            if(item.prop == 'key') {
              item.display = false
            }
            if(item.prop == 'query') {
              item.display = false
            }
          })
        }
        if(newVal == 'MONGO') {
          this.isMock = false
          this.option.column.filter( item => {
            if(item.prop == 'dataSourceName') {
              getSource('mongo').then(res => {
                if(res.data.code == 0) {
                  item.dicData = res.data.data
                }
              })
            }
            if(item.prop == 'apiUrl') {
              item.display = false
            }
            if(item.prop == 'sql') {
              item.display = false
            }
            if(item.prop == 'dataSourceName') {
              item.display = true
            }
            if(item.prop == 'key') {
              item.display = false
            }
            if(item.prop == 'query') {
              item.display = true
            }
          })
        }
        if(newVal == 'RULE') {
          this.isMock = false
          this.option.column.filter( item => {
            if(item.prop == 'key') {
              item.display = true
              getSource('rule').then(res => {
                if(res.data.code == 0) {
                  item.dicData = res.data.data
                }
              })
            }
            if(item.prop == 'dataSourceName') {
              item.display = false
            }
            if(item.prop == 'apiUrl') {
              item.display = false
            }
            if(item.prop == 'sql') {
              item.display = false
            }
            if(item.prop == 'dataSourceName') {
              item.display = false
            }
            if(item.prop == 'query') {
              item.display = false
            }
          })
        }
        if(newVal == 'MOCK') {
          this.isMock = true
          this.option.column.filter( item => {
            if(item.prop == 'dataSourceName') {
              item.display = false
            }
            if(item.prop == 'key') {
              item.display = false
            }
            if(item.prop == 'apiUrl') {
              item.display = false
            }
            if(item.prop == 'sql') {
              item.display = false
            }
            if(item.prop == 'dataSourceName') {
              item.display = false
            }
            if(item.prop == 'query') {
              item.display = false
            }
          })
        }
        this.$forceUpdate()
      }
    },
    returnResult: {
      handler(newVal, oldVal) {
        if(newVal && newVal.data) {
          this.editor = JSON.stringify(newVal.data.tableData)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.paramtips{
  display: flex;
  margin-top: 10px;
  div{
    display: flex;
    margin-left: 10px;
    border: 1px solid #e9e9e9;
    p{
      padding: 0;
      margin: 0;
      text-align: center;
      border-right: 1px solid #e9e9e9;
      span{
        display: block;
        border-bottom: 1px solid #e9e9e9;
        padding: 2px 20px;
      }
      span:nth-last-of-type(1){
        border: 0;
      }
    }
    p:nth-last-of-type(1){
      border: 0;
    }
  }
}
.jsonShow{
  margin-top: 10px;
  display: flex;
  div{
    //width: 50%;
    width: 100%;
    display: flex;
    font-size: 14px;
  }
}
</style>
<style lang="scss">
.jsonShow{
  position: relative;
  height: 350px;
  #codeEditor{
    flex: 1;
    width: 50%!important;
    position: absolute;
    width: 100%;
    height: 100%;
    // .ace_content{
    //   height: 100%!important;
    // }
  }
}
</style>
