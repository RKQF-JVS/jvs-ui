<template>
  <div class="table-form">
    <jvs-table :option="options" :data="tableData" :pageheadertitle="pageheadertitle">
      <template slot="menuLeft">
        <slot name="menuLeftSlot"></slot>
      </template>
      <template slot="menu" slot-scope="scope">
        <slot name="menuBtn" :row="scope.row" :index="scope.index"></slot>
      </template>
      <template v-for="(item, index) in options.column" :slot="item.prop" slot-scope="scope">
        <div :key="item.prop+'node'+index">
          <div v-if="item.text && item.text.label && scope.row[item.prop] == item.text.value" :key="item.prop+'text'">
            <span>{{item.text.label}}</span>
          </div>
          <div v-if="item.needSlot !== true && !(item.text && item.text.label && scope.row[item.prop] == item.text.value) && displayByBind(item, scope.row)" :key="item.prop+'item'">
            <!-- 文本类型 -->
            <el-input
              v-if="!item.type || item.type == 'input'"
              :key="item.prop+'input'"
              v-model="scope.row[item.prop]"
              :disabled="scope.row.disabled === false ? ((options.disableList && options.disableList.indexOf(item.prop) > -1) ? true : false) : (item.disabled === true ? item.disabled : (options.disableList && options.disableList.indexOf(item.prop)) > -1 )"
              @blur="valueChange(item, scope.row)"
              size="mini"
            ></el-input>
            <!-- 下拉选择 -->
            <el-select
              v-if="item.type == 'select'"
              :key="item.prop+'select'"
              v-model="scope.row[item.prop]" 
              :default-first-option="true" 
              :placeholder="'请选择'+item.label"
              :disabled="scope.row.disabled === false ? ((options.disableList && options.disableList.indexOf(item.prop) > -1) ? true : false) : (item.disabled === true ? item.disabled : (options.disableList && options.disableList.indexOf(item.prop)) > -1 )"
              :multiple="item.multiple"
              :collapse-tags="!item.collapsetags"
              :clearable="item.clearable"
              :filterable="item.filterable"
              :allow-create="item.allowcreate"
              @change="valueChange(item, scope.row)"
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
              :key="item.prop+'switch'"
              v-model="scope.row[item.prop]"
              active-color="#409EFF"
              inactive-color="#eee"
              @change="valueChange(item, scope.row)"
              size="mini"
            >
            </el-switch>
            <!-- 数字类型 -->
            <el-input-number
              v-if="item.type == 'number'"
              :key="item.prop+'number'"
              style="width:100%"
              v-model="scope.row[item.prop]"
              @change="valueChange(item, scope.row)"
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
    },
    pageheadertitle: {
      type: String
    }
  },
  computed: {
    options(){
      let temp = JSON.parse(JSON.stringify(this.option))
      for(let i in temp.column) {
        temp.column[i].slot = true
      }
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
    return {}
  },
  methods: {
    init () {
      for(let i in this.options.column) {
        if(this.options.column[i].dicUrl) {
          getSelectData(this.options.column[i].dicUrl).then(res => {
            if(res.data.code == 0) {
               for(let sitem in res.data.data){
                if(typeof sitem == 'string') {
                  this.options.column[i].dicData.push({
                    label: res.data.data[sitem],
                    value: res.data.data[sitem]
                  })
                }else{
                  this.options.column[i].dicData.push({
                    label: res.data.data[sitem][this.options.column[i].props.label ? this.options.column[i].props.label : 'label'],
                    value: res.data.data[sitem][this.options.column[i].props.value ? this.options.column[i].props.value : 'value']
                  })
                }
              }
            }
          })
        }
        if(this.options.column[i].dicData) {
          let temp = []
          let bool = false
          for(let j in this.options.column[i].dicData) {
            if(typeof this.options.column[i].dicData[j] == 'string') {
              bool = true
              temp.push({
                label: this.options.column[i].dicData[j],
                value: this.options.column[i].dicData[j]
              })
            }
          }
          if(bool) {
            this.options.column[i].dicData = temp
          }
        }
      }
    },
    // 下拉选择change
    valueChange (item, row) {
      this.$emit((item.prop+'Change'), {
        item: item,
        row: row
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
<style lang="scss" scoped>
</style>