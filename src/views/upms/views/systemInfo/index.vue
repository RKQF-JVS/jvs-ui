<template>
  <div>
    <div class="system-info-page">
      <div class="basic-info">
        <div class="left-info">
          <div style="font-weight: bold;margin-bottom: 10px;">基础信息</div>
          <div style="font-size: 12px;color: #a2a3a5;">更新平台信息，定制个性平台</div>
          <div style="display: flex;align-items: center;padding: 20px 0;">
            <img style="height: 40px;" :src="$store.getters.userInfo.tenant.logo" alt=""/>
            <div style="font-weight: bold;font-size: 16px;margin-left: 12px;">{{ $store.getters.userInfo.tenant.shortName }}</div>
          </div>
          <div style="font-size: 13px;display: flex;align-items: center;margin-bottom: 12px;">
            <div>系统域名</div>
<!--            <el-divider direction="vertical"></el-divider>-->
<!--            <div style="color: #3471ff;cursor: pointer;">去配置<i class="el-icon-arrow-right"/></div>-->
          </div>
          <div style="font-weight: bold">{{ $store.getters.userInfo.tenant.loginDomain }}</div>
          <el-divider></el-divider>
          <div class="basic-data-info">
            <div class="info-item">
              <div class="title">企业人数</div>
              <div class="number">{{ basicDataInfo.users }}</div>
            </div>
            <div class="info-item">
              <div class="title">团队数</div>
              <div class="number">{{ basicDataInfo.groups }}</div>
            </div>
            <div class="info-item">
              <div class="title">部门数</div>
              <div class="number">{{ basicDataInfo.depts }}</div>
            </div>
            <div class="info-item">
              <div class="title">昨日使用人数</div>
              <div class="number">{{ basicDataInfo.yesterdays }}</div>
            </div>
          </div>
        </div>
        <!--      <div style="width: 1px;height: 100%;background-color: #eeeeee;margin: 0 8px;"/>-->
        <!--      <div class="right-img">-->
        <!--        <img src="./img/example.jpg"/>-->
        <!--      </div>-->
      </div>
    </div>
  </div>
</template>

<script>

import {getBasicDataInfo} from "@/views/upms/views/systemInfo/api";

export default {
  name: "systemInfo",
  components: {
  },
  data () {
    return {
      basicDataInfo: {},
    }
  },
  created() {
    this.getBasicDataInfo()
  },
  methods: {
    getBasicDataInfo() {
      getBasicDataInfo().then(res => {
        this.basicDataInfo = JSON.parse(JSON.stringify(res.data.data))
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.system-info-page {
  padding: 20px;
  border-radius: 6px;
  background-color: #ffffff;
  margin-bottom: 10px;
  //overflow-y: auto;
  .basic-info{
    display: flex;
    .left-info{
      width: 50%;
      padding: 0 20px;
      color: #333;
      .basic-data-info{
        display: grid;
        grid-template-columns: 200px 200px;
        grid-template-rows: 90px 90px;
        .info-item{
          text-align: left;
          .title{
            font-size: 14px;
            margin-bottom: 8px;
            color: #7a7a7a;
          }
          .number{
            font-size: 16px;
            color: #333;
            font-weight: bold;
          }
        }
      }
    }
    .right-img{
      height: 100%;
      width: 50%;
      text-align: center;
      img{
        height: 100%;
      }
    }
  }
}
.resource{
  display: flex;
  flex-wrap: wrap;
  .resource-item{
    color: #333;
    padding: 15px;
    width: 200px;
    border-radius: 6px;
    margin-right: 100px;
    margin-bottom: 30px;
    //border: 1px solid #e7e7e7;
  }
}
</style>
