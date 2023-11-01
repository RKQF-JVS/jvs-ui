<template>
  <div class="data-table-form">
    <el-row class="data-table-form-tool">
      <el-input style="width:200px" placeholder="请输入列名" size='mini' v-model="lie"></el-input>
        <el-button size="mini" @click="addlie">添加列</el-button>
        <el-button size="mini" @click="addhang">添加行</el-button>
        <el-button size="mini" type="primary">保存组件</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column
        v-for="(item, index) in column"
        :prop="item.key"
        :key="index"
        align="center"
        :label="item.key"
      >
        <template slot="header">
          <div class="headeritem">
            <i
              v-if="index !== 0"
              class="el-icon-delete icon"
              @click="delcolumn(item.key)"
            ></i>
            <span>{{ item.key }}</span>
            <!-- <el-input disabled v-model="" size="mini"></el-input> -->
          </div>
        </template>
        <template slot-scope="scope">
          <el-input
            v-if="index == 0"
            size="mini"
            v-model="scope.row[item.key]"
            @blur="changeData"
          ></el-input>
          <el-input-number
            style="width: 100%"
            v-else
            size="mini"
            v-model="scope.row[item.key]"
            @change="changeData"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button @click="del(scope.row)" type="text" size="mini">
            移除
          </el-button>
          <el-button
            @click="generate(scope.row, scope.$index)"
            type="text"
            size="mini"
          >
            生成数据
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'data-table-form',
  props: {
    option: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      lie: '',
      column: [
        { key: '项' },
        { key: '1月' },
        { key: '2月' },
        { key: '3月' },
        { key: '4月' },
        { key: '5月' }
      ],
      tableData: [
        { '项': '电信', '1月': 18.9, '2月': 28.8, '3月': 39.3, '4月': 81.4, '5月': 47 },
        { '项': '微博', '1月': 12.4, '2月': 23.2, '3月': 34.5, '4月': 99.7, '5月': 52.6 }
      ]
    }
  },
  created () {
    // this.getLegend()
  },
  methods: {
    getLegend () {
      this.tableData=[]
      let column=[]
      for (let i in this.option.data) {
        column.push(this.option.data[i][this.option.legend])
      }
      column=Array.from(new Set(column))
      console.log(column)
      for (let c in column) {
        let obj={
          legend: column[c]
        }
        for (let d in this.option.data) {
          if (this.option.data[d][this.option.legend]==column[c]) {
            obj[this.option.data[d][this.option.x]]=this.option.data[d][this.option.y]
          }
        }
        this.tableData.push(obj)
      }
    },
    // 添加行
    addhang () {
      this.tableData.push({})
      this.$emit('reDraw', this.tableData)
    },
    // 删除行
    del (row) {
      this.tableData = this.tableData.filter(item => item !== row)
      this.$emit('reDraw', this.tableData)
    },
    // 生成数据
    generate (row, index) {
      for (let obj in row) {
        if (obj !== '项') {
          row[obj] = parseInt(Math.random() * 100)
        }
      }
      this.tableData[index] = row
      this.$emit('reDraw', this.tableData)
    },
    // 添加列
    addlie () {
      if (!this.lie) {
        this.$message.error('列不能为空')
        return
      }
      if (this.column.filter(item => item.key === this.lie).length === 0) {
        this.column.push({ key: this.lie })
        this.lie = ''
        this.$emit('reDraw', this.tableData)
      } else {
        this.$message.error('该列已存在')
      }
    },
    // 删除列
    delcolumn (key) {
      this.column = this.column.filter(item => item.key !== key)
      this.$emit('reDraw', this.tableData)
    },
    // 改变数据传递数据
    changeData () {
      this.$emit('reDraw', this.tableData)
    }
  }
}
</script>
<style lang="scss" scoped>
.data-table-form{
  margin: 0 10px;
}
.data-table-form-tool{
  margin:10px 0;
  display:flex;
  .el-input, .el-button{
    margin-right: 10px;
  }
}
.headeritem{
  width: 100%;
  height: 100%;
  position: relative;
}
.headeritem:hover .icon{
  display: block;
}
.icon{
  position: absolute;
  display: none;
  top: 0;
  right: 0;
  z-index: 10000;
  cursor: pointer;
}
</style>
