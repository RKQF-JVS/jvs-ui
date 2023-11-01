<template>
  <div class="calendar-info">
    <div class="item-title-bar" v-if="item.displayTitle">
      <h4>{{item.title}}</h4>
    </div>
    <div class="calendar-info-content">
      <!-- <el-row class="calendar-info-top">
        <el-date-picker
          v-model="date"
          type="date"
          editable
          :popper-class="'calendar-info-top-date'"
          placeholder="选择日期">
        </el-date-picker>
      </el-row> -->
      <el-calendar>
      <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
        <template
          slot="dateCell"
          slot-scope="{date, data}">
          <p :class="data.isSelected ? 'is-selected' : ''">
            <span>{{ data.day.split('-').slice(1).join('-') }}</span>
            <el-tooltip class="item" effect="dark" :content="getContent(data, item.data)" placement="top">
              <span class="content-item">{{getContent(data, item.data)}}</span>
            </el-tooltip>
          </p>
        </template>
      </el-calendar>
    </div>
  </div>
</template>
<script>
export default {
  name: 'calendar-info',
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          data: []
        }
      }
    }
  },
  data(){
    return {
      date: ''
    }
  },
  methods: {
    getContent (data, list) {
      let str = data.day.split('-').slice(0).join('-')
      let temp = ''
      for(let i in list) {
        if(list[i].createTime == str) {
          temp = list[i].content
        }
      }
      return temp
    }
  }
}
</script>
<style lang="scss" scoped>
.item-title-bar{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border-left: 3px solid #409EFF;
  p, h4{
    margin: 0;
    padding: 0;
  }
  p{
    cursor: pointer;
  }
}
.calendar-info-top{
  width: 100%;
  margin-top: 10px;
  .el-date-editor {
    width: 100%;
  }
}
.calendar-info-top-date{
  display: none;
  visibility: hidden;
}
.is-selected {
  background-color: #1890ff;
  color: #fff;
}
.content-item{
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre;
}
</style>
<style lang="scss">
.calendar-info{
  .el-calendar-table thead th{
    padding: 0;
  }
  .el-calendar-table .el-calendar-day{
    height: 46px;
    padding: 0;
    text-align: center;
    p{
      margin: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      span{
        display: block;
      }
    }
  }
  .el-calendar__body{
    padding: 12px;
  }
}

</style>