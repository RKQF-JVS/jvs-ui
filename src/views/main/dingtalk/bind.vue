<template>
  <div class="empty-back-loading-page"></div>
</template>
<script>
import { encryption } from "@/util/util";
import { enCodeKey, client_id } from "@/const/const";
import { bindDD } from "@/api/admin/user";
export default {
  data() {
    return {
      showType: "",
    };
  },
  created() {
    if(this.$route && this.$route.query) {
      this.showType = "bind"
      let query = this.$route.query
      let tp = {
        data: JSON.stringify(query)
      }
      let temp = encryption({
        data: tp,
        key: enCodeKey,
        param: ["data"]
      })
      bindDD({ code: temp.data, appId: client_id }).then((res) => {
        if(res.data.code != 0) {
          this.$message.error(res.data.msg)
        }
        localStorage.setItem("bindRandom", "")
        this.$router.push({
          path: this.$router.$jvsRouter.getPath({
            name: "个人信息",
            src: "/#/userinfo"
          })
        })
      }).catch((e) => {
        this.$router.push({
          path: this.$router.$jvsRouter.getPath({
            name: "个人信息",
            src: "/#/userinfo"
          })
        })
      })
    }
  },
};
</script>
<style lang="scss" scoped>
.empty-back-loading-page {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.8);
  background-image: url("../../../../public/jvs-ui-public/img/loading.gif");
  background-repeat: no-repeat;
  background-position: center;
  background-position: center;
  background-size: 200px 160px;
}
</style>