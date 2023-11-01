<template lang="html">
  <div class="cron" :val="value_">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="秒" name="s">
        <span slot="label"><i class="el-icon-date"></i> 秒</span>
        <second-and-minute v-model="sVal" lable="秒"></second-and-minute >
      </el-tab-pane>
      <el-tab-pane label="分" name="m">
        <span slot="label"><i class="el-icon-date"></i> 分</span>
        <second-and-minute v-model="mVal" lable="分"></second-and-minute >
      </el-tab-pane>
      <el-tab-pane label="时" name="h">
        <span slot="label"><i class="el-icon-date"></i> 时</span>
        <hour v-model="hVal" lable="时"></hour>
      </el-tab-pane>
      <el-tab-pane label="日" name="d">
        <span slot="label"><i class="el-icon-date"></i> 日</span>
        <day v-model="dVal" lable="日"></day>
      </el-tab-pane>
      <el-tab-pane label="月" name="month">
        <span slot="label"><i class="el-icon-date"></i> 月</span>
        <month v-model="monthVal" lable="月"></month>
      </el-tab-pane>
      <el-tab-pane label="周" name="week">
        <span slot="label"><i class="el-icon-date"></i> 周</span>
        <week v-model="weekVal" lable="周"></week>
      </el-tab-pane>
      <el-tab-pane label="年" name="year">
        <span slot="label"><i class="el-icon-date"></i> 年</span>
        <year v-model="yearVal" lable="年"></year>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SecondAndMinute from './cron/secondAndMinute'
import hour from './cron/hour'
import day from './cron/day'
import month from './cron/month'
import week from './cron/week'
import year from './cron/year'
export default {
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      //
      activeName: 's',
      sVal: '',
      mVal: '',
      hVal: '',
      dVal: '',
      monthVal: '',
      weekVal: '',
      yearVal: ''
    }
  },
  watch: {
    'value' (a, b) {
      this.updateVal()
    },
    tableData (newV) {
      console.log(newV)
    }
  },
  computed: {
    formdata () {
      return `${this.sVal} ${this.mVal} ${this.hVal} ${this.dVal} ${this.monthVal} ${this.weekVal} ${this.yearVal}`
    },
    tableData () {
      return [{
        sVal: this.sVal,
        mVal: this.mVal,
        hVal: this.hVal,
        dVal: this.dVal,
        monthVal: this.monthVal,
        weekVal: this.weekVal,
        yearVal: this.yearVal
      }]
    },
    value_ () {
      if (!this.dVal && !this.weekVal) {
        return ''
      }
      if (this.dVal === '?' && this.weekVal === '?') {
        this.$message.error('日期与星期不可以同时为“不指定”')
      }
      if (this.dVal !== '?' && this.weekVal !== '?') {
        this.$message.error('日期与星期必须有一个为“不指定”')
      }
      let v = `${this.sVal} ${this.mVal} ${this.hVal} ${this.dVal} ${this.monthVal} ${this.weekVal} ${this.yearVal}`
      if (v !== this.value) {
        this.$emit('input', v)
      }
      return v
    }
  },
  methods: {
    updateVal () {
      if (!this.value) {
        return
      }
      let arrays = this.value.split(' ')
      this.sVal = arrays[0]
      this.mVal = arrays[1]
      this.hVal = arrays[2]
      this.dVal = arrays[3]
      this.monthVal = arrays[4]
      this.weekVal = arrays[5]
      this.yearVal = arrays[6]
    }
  },
  created () {
    this.updateVal()
  },
  components: {
    SecondAndMinute, hour, day, month, week, year
  },
  watch: {
    formdata: function(newVal, oldVal) {
      if(newVal) {
        this.$emit('setCron', newVal)
      }
    }
  }
}
</script>

<style lang="css">
.cron {
  text-align: left;
  padding: 10px;
  background: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
}
</style>
