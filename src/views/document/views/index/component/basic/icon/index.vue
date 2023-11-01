<template>
 <div class="component-item">
    <h4>{{detail.title}}</h4>
    <p>{{detail.info}}</p>
    <p v-text="detail.useInfo"></p>
    <div class="demo">
      <div class="demo-item">
        <h5>element ui提供</h5>
        <div class="show">
          <div class="icon-box">
            <p v-for="item in elIcon" :key="item">
              <i :class="item"></i>
              <span>{{item}}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="demo-item">
        <h5>图标组件</h5>
        <div class="show">
          <div class="icon-box">
            <p v-for="item in iconList" :key="item">
              <i :class="item"></i>
              <span>{{item}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {elList} from './icon'
import icList from '@/const/iconfont'
export default {
  name: 'icon',
  data () {
    return {
      detail: {
        title: '图标',
        info: '提供了一套常用的图标集合',
        useInfo: '直接通过设置类名为 el-icon-iconName 来使用即可'
      },
      elIcon: elList,
      iconList: icList
    }
  }
}
</script>
<style lang="scss" scoped>
.icon-box {
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0;
  font-size: 14px;
  color: #5e6d82;
  line-height: 2em;
  border-top: 1px solid #eee;
  border-left: 1px solid #eee;
  p{
    margin: 0;
    width: 16.66%;
    text-align: center;
    height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 13px;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    margin-right: -1px;
    margin-bottom: -1px;
    span, i {
      font-size: 32px;
      margin-bottom: 15px;
      color: #606266;
      transition: color .15s linear;
    }
    span{
      color: #99a9bf;
    }
  }
}
</style>