<template>
  <div class="sort-info">
    <tableForm :option="option" :data="tableData" @columnNameChange="columnNameChange">
      <template slot="menuBtn" slot-scope="scope">
        <jvs-button size="mini" type="text" @click="deleteRow(scope.row, scope.index)">删除</jvs-button>
      </template>
    </tableForm>
    <el-row style="margin-top: 10px">
      <jvs-button size="mini" @click="addRowHandle">新增一行</jvs-button>
    </el-row>
  </div>
</template>
<script>
import tableForm from '../../../components/basic-design/tableForm'
export default {
  name: 'sort-info',
  components: { tableForm },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableSetNameOption: {
      type: Array
    }
  },
  computed: {
    tableData: {
      get () {
        return this.data
      },
      set () {}
    }
  },
  data () {
    return {
      option: {
        addBtn: false,
        viewBtn: false,
        delBtn: false,
        editBtn: false,
        page: false,
        border: true,
        align: 'center',
        menuAlign: 'center',
        cancal: false,
        column: [
          {
            label: '字段名称',
            prop: 'columnName',
            type: 'select',
            dicData: [],
            watch: true, // 是否监听字段值变化
          },
          {
            label: '字段解释',
            prop: 'columnComment',
            disabled: true
          },
          {
            label: '排序类型',
            prop: 'type',
            type: 'select',
            dicData: [
              {label: '升序', value: '升序'},
              {label: '降序', value: '降序'},
            ]
          }
        ]
      },
      // 可作为排序条件的类型
      constList: ['tinyint', 'smallint', 'mediumint', 'int', 'integer', 'year', 'bigint', 'float', 'double', 'decimal', 'date', 'time', 'datetime', 'timestamp']
    }
  },
  methods: {
    // 新增一行
    addRowHandle () {
      this.tableData.push({})
    },
    // columnName改变
    columnNameChange (data) {
      let item = data.item
      let row = data.row
      let tempLabel = ''
      for(let i in item.dicData) {
        if(item.props) {
          if(item.dicData[i][item.props.value] == row[item.prop]) {
            tempLabel = item.dicData[i][item.props.label]
          }
        }else{
          if(item.dicData[i].value == row[item.prop]) {
            tempLabel = item.dicData[i].label
          }
        }
      }
      row.columnComment = tempLabel
    },
    // 删除行
    deleteRow (row, index) {
      this.tableData.splice(index, 1)
    }
  },
  watch: {
    tableSetNameOption (newVal, oldVal) {
      this.option.column.filter( item => {
        if(item.prop == 'columnName') {
          let temp = []
          for(let i in newVal) {
            if(this.constList.indexOf((newVal[i].dataType).toLowerCase()) > -1) {
              temp.push(newVal[i])
            }
          }
          item.dicData = temp
        }
      })
    } 
  }
}
</script>
<style lang="scss" scoped>
</style>