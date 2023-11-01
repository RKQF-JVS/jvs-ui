<template>
  <div class="table-form">
    <jvs-table :option="options" :data="tableData">
      <template slot="menu" slot-scope="scope">
        <slot name="menuBtn" :row="scope.row" :index="scope.index"></slot>
      </template>
      <template v-for="(item, index) in options.tableColumn" :slot="item.prop" slot-scope="scope">
        <div :key="item.prop+'node'+index">
          <div v-if="item.text && item.text.label && scope.row[item.prop] == item.text.value" :key="item.prop+'text'+index">
            <span>{{item.text.label}}</span>
          </div>
          <div v-if="item.needSlot !== true && !(item.text && item.text.label && scope.row[item.prop] == item.text.value) && displayByBind(item, scope.row)" :key="item.prop+'item'">
            <!-- 文本类型 -->
            <el-input
              v-if="!item.type || item.type == 'input'"
              :key="item.prop+'input'+index"
              :class="!handleCheck(scope.row[item.prop]) ? 'reg-err' : ''"
              v-model="scope.row[item.prop]"
              :disabled="scope.row.disabled === false ? ((options.disableList && options.disableList.indexOf(item.prop) > -1) ? true : false) : (item.disabled === true ? item.disabled : (options.disableList && options.disableList.indexOf(item.prop)) > -1 )"
              @blur="valueChange(item, scope.row, scope.index)"
              size="mini"
            ></el-input>
<!--            {{scope.row[item.prop]}}-->
            <!-- 下拉选择 -->
            <el-select
              v-if="item.type == 'select'"
              :key="item.prop+'select'+index"
              v-model="scope.row[item.prop]"
              :default-first-option="true"
              :placeholder="'请选择'+item.label"
              :disabled="scope.row.disabled === false ? ((options.disableList && options.disableList.indexOf(item.prop) > -1) ? true : false) : (item.disabled === true ? item.disabled : (options.disableList && options.disableList.indexOf(item.prop)) > -1 )"
              :multiple="item.multiple"
              @change="valueChange(item, scope.row, scope.index)"
              size="mini"
            >
              <el-option
                v-for="(it, ix) in item.dicData"
                :key="it.value+item.prop+ix"
                :label="it.label"
                :value="it.value"
                size="mini"
              >
              </el-option>
            </el-select>
            <!-- 开关 -->
            <el-switch
              v-if="item.type == 'switch'"
              :key="item.prop+'switch'+index"
              v-model="scope.row[item.prop]"
              active-color="#409EFF"
              inactive-color="#eee"
              @change="valueChange(item, scope.row, scope.index)"
              size="mini"
            >
            </el-switch>
            <!-- 数字类型 -->
            <el-input-number
              v-if="item.type == 'number'"
              :key="item.prop+'number'+index"
              style="width:100%"
              v-model="scope.row[item.prop]"
              @change="valueChange(item, scope.row, scope.index)"
              size="mini"
            ></el-input-number>
          </div>
          <div v-if="displayByBind(item, scope.row) && !(item.text && item.text.label && scope.row[item.prop] == item.text.value) && item.needSlot === true" :key="item.prop+'needslotitem'">
            <slot :name="item.prop+'Item'" :row="scope.row" :index="scope.index"></slot>
          </div>
        </div>
      </template>
    </jvs-table>
  </div>
</template>
<script>
import {getSelectData} from '@/api/index'
export default {
  name: 'table-Form',
  props: {
    option: {
      type: Object
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    options(){
      let temp = JSON.parse(JSON.stringify(this.option))
      if(temp.column) {
        temp.tableColumn = temp.column
      }
      for(let i in temp.tableColumn) {
        temp.tableColumn[i].slot = true
      }
      temp.column = temp.tableColumn
      temp.showOverflow = false
      temp.hideTop = true
      return temp
    },
    tableData: {
      get () {
        return this.data
      },
      set () {}
    }
  },
  created () {
    this.init()
  },
  data () {
    return {
      regErr: true,
    }
  },
  methods: {
    init () {
      for(let i in this.options.tableColumn) {
        if(this.options.tableColumn[i].dicUrl) {
          getSelectData(this.options.tableColumn[i].dicUrl).then(res => {
            if(res.data.code == 0) {
               for(let sitem in res.data.data){
                if(typeof sitem == 'string') {
                  this.options.tableColumn[i].dicData.push({
                    label: res.data.data[sitem],
                    value: res.data.data[sitem]
                  })
                }else{
                  this.options.tableColumn[i].dicData.push({
                    label: res.data.data[sitem][this.options.tableColumn[i].props.label ? this.options.tableColumn[i].props.label : 'label'],
                    value: res.data.data[sitem][this.options.tableColumn[i].props.value ? this.options.tableColumn[i].props.value : 'value']
                  })
                }
              }
            }
          })
        }
        if(this.options.tableColumn[i].dicData) {
          let temp = []
          let bool = false
          for(let j in this.options.tableColumn[i].dicData) {
            if(typeof this.options.tableColumn[i].dicData[j] == 'string') {
              bool = true
              temp.push({
                label: this.options.tableColumn[i].dicData[j],
                value: this.options.tableColumn[i].dicData[j]
              })
            }
          }
          if(bool) {
            this.options.tableColumn[i].dicData = temp
          }
        }
      }
    },
    // 正则校验
    handleCheck(str) {
      const regularExpression = /^[A-Za-z0-9]+$/
      const reg = new RegExp(regularExpression)
      return reg.test(str)
    },
    // 下拉选择change
    valueChange (item, row, index) {
      this.regErr = this.handleCheck(row.aliasColumnName)
      if (!this.regErr) {
        this.$message.error('字段名不能包含空格和特殊符号。')
      }
      this.$emit((item.prop+'Change'), {
        item: item,
        row: row,
        index: index,
        regErr: this.regErr
      })
    },
    // 根据绑定字段值决定显隐
    displayByBind (item, row) {
      let temp = true
      if(item.display) {
        if(typeof item.display.value == 'object' && (item.display.value instanceof Array)) {
          if(item.display.value.indexOf(row[item.display.key]) > -1) {
            temp = true
          }else{
            temp = false
          }
        }else{
          if(row[item.display.key] == item.display.value) {
            temp = true
          }else{
            temp = false
          }
        }
      }else{
        temp = true
      }
      return temp
    }
  }
}
</script>
<style lang="scss">
.reg-err{
  .el-input__inner{
    border: 1px solid #ff6969 !important;
  }
}
</style>
