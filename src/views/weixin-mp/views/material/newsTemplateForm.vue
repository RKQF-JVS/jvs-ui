<template>
  <div>
    <div>
      <span style="display: inline-block;margin-right: 50px;font-weight: bold ">防止达到微信API接口访问上限，请先保存草稿，再发布到微信</span>
      <jvs-button size="mini" v-loading="loading" type="warning" @click="saveDraftData">草稿</jvs-button>
      <jvs-button size="mini" v-loading="loading" style="margin-left: 10px;" type="success" @click="uploadNews">发布</jvs-button>
    </div>
    <el-container style="padding: 20px 0px 30px 30px;">
      <el-aside width="360px">
        <div style="display: block;margin: auto;">
          <div :class="item.isBorder ? 'news-main' : 'news-main-noborder'" v-for="(item, index) in newsList.slice(0,1)" :key="index" @click="handlerClickItem(index)">
            <div :class="item.isBorder ? 'news-content' : 'news-content-noborder'">
              <img v-if="item.imageUrl && item.imageUrl.length > 0" :src="item.imageUrl[0].url" width="240px" height="140px"/>
              <div class="news-content-title">{{item.title ? item.title : '标题'}}</div>
            </div>
          </div>
          <div :class="item.isBorder ? 'news-main-item' : 'news-main-item-noborder'" v-for="(item, index) in newsList.slice(1)" :key="index + 1" @click="handlerClickItem(index+1)" @mouseover="showDeleteDiv(index+1)" @mouseout="hideDeleteDiv(index+1)">
            <div :class="item.isBorder ? 'news-content-item' : 'news-content-item-noborder'">
              <div class="news-content-item-title">{{item.title ? item.title : '标题'}}</div>
              <div class="news-content-item-img">
                <img v-if="item.imageUrl && item.imageUrl.length > 0" :src="item.imageUrl[0].url" width="100%" height="100%"/>
              </div>
            </div>
            <div class="hr-div"></div>
            <div class="news-content-item-delete" @click.stop="handlerDeleteItem(index+1)">
              <i class="el-icon-delete" style="font-size: 16px" />
            </div>
          </div>
          <div class="news-bottom" @click="handlerAddItem" v-show="newsList.length < 8">
            <i class="el-icon-plus news-bottom-plus"></i>
          </div>
        </div>
      </el-aside>
      <el-main>
        <!-- :key="new Date().getTime()" -->
        <jvs-form v-if="detailShow" ref="dataForm" :option="option" :formData="formData" :defaultData="formData" @formChange="setNewsData"></jvs-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import {addNews,getNews,uploadNews} from '../../api/wx-news-template'
  import store from "@/store";

  export default {
    filters: {},
    props: {
      rowData: {
        type: Object
      }
    },
    data() {
      return {
        option: {},
        formOption: {
          btnHide: true,
          column: [
            {
              label: '标题',
              prop: 'title',
              rules: [{required: true, message: '请输入标题', trigger: 'blur'}]
            },
            {
              label: '摘要',
              prop: 'digest',
              rules: [{required: true, message: '请输入摘要', trigger: 'blur'}]
            },
            {
              label: '作者',
              prop: 'author',
              rules: [{required: true, message: '请输入作者', trigger: 'blur'}]
            },
            {
              label: '封面',
              prop: 'imageUrl',
              type: 'imageUpload',
              action: '/mgr/jvs-auth/upload/jvs-public',
              fileList: [],
              limit: 1,
              rules: [{required: true, message: '请上传封面', trigger: 'change'}],
              headers: {
                Authorization: 'Bearer '+store.getters.access_token
              }
            },
            {
              label: '留言',
              prop: 'needOpenComment',
              type: 'switch',
              span: 8
            },
            {
              label: '',
              prop: 'onlyFansCanComment',
              span: 16,
              type: 'radio',
              dicData: [
                {label: '所有人可留言', value: false},
                {label: '仅粉丝可留言', value: true}
              ]
            },
            {
              label: '内容',
              prop: 'content',
              type: 'htmlEditor',
              rules: [{required: true, message: '请填写内容', trigger: ['blur', 'change']}]
            }
          ]
        },
        loading: false,
        newsId:"",
        newsList:[],//总的图文
        formData: {},
        detailShow: false,
        getNewsData:[],
        deleteArticleIds:[],//保存数据的时候，该ids需要删除
      }
    },
    created() {
      this.option = JSON.parse(JSON.stringify(this.formOption))
      if(this.rowData) {
        this.newsId = this.rowData.id;
        this.getNews();
      }
    },
    methods: {
      saveDraftData(){
       let tpdata = JSON.parse(JSON.stringify(this.newsList))
        //validate
        for(var i = 0; i < tpdata.length; i++){
          var temp = tpdata[i];
          if(!temp.title){
            this.$message({ message: '请填写第' + (i+1) + '个图文的标题', type: 'warning' });
            return false;
          }
          if(!temp.digest){
            this.$message({ message: '请填写第' + (i+1) + '个图文的摘要', type: 'warning' });
            return false;
          }
          if(!temp.author){
            this.$message({ message: '请填写第' + (i+1) + '个图文的作者', type: 'warning' });
            return false;
          }
          if(!temp.imageUrl || temp.imageUrl.length == 0){
            this.$message({ message: '请上传第' + (i+1) + '个图文的封面', type: 'warning' });
            return false;
          }else{
            temp.picPath = temp.imageUrl[0].url
          }
          if(!temp.content){
            this.$message({ message: '请填写第' + (i+1) + '个图文的内容', type: 'warning' });
            return false;
          }
        }

        this.$refs['dataForm'].$refs['ruleForm'].validate((valid) => {
          if (valid || true) {
            var params = {id: this.newsId, list: tpdata, deleteArticleIds: this.deleteArticleIds};
            addNews(params).then((res) => {
              if(res.data.code == 0) {
                this.$message.success('保存草稿成功')
                this.$emit('close', true)
              }
            })
          }
        })

      },
      uploadNews(){
        let tpdata = JSON.parse(JSON.stringify(this.newsList))
        for(var i = 0; i < tpdata.length; i++){
          var temp = tpdata[i];
          if(!temp.title){
            this.$message({ message: '请填写第' + (i+1) + '个图文的标题', type: 'warning' });
            return false;
          }
          if(!temp.digest){
            this.$message({ message: '请填写第' + (i+1) + '个图文的摘要', type: 'warning' });
            return false;
          }
          if(!temp.author){
            this.$message({ message: '请填写第' + (i+1) + '个图文的作者', type: 'warning' });
            return false;
          }
          if(!temp.imageUrl){
            this.$message({ message: '请填写第' + (i+1) + '个图文的封面', type: 'warning' });
            return false;
          }else{
            temp.picPath = temp.imageUrl[0].url
          }
          if(!temp.content){
            this.$message({ message: '请填写第' + (i+1) + '个图文的内容', type: 'warning' });
            return false;
          }
        }

        this.$refs['dataForm'].$refs['ruleForm'].validate((valid) => {
          if (valid) {
            var params = {id: this.newsId, list: tpdata, deleteArticleIds: this.deleteArticleIds};
            uploadNews(params).then(() => {
              if(res.data.code == 0) {
                this.$message.success('发布成功')
                this.$emit('close', true)
              }
            })
          }
        })
      },
      handlerClickItem(index){
        this.detailShow = false
        this.$set(this, 'formData', {})
        //修改border样式，先全部重置，在进行赋值
        for(var i=0;i<this.newsList.length;i++){
          this.newsList[i].isBorder = false;
        }
        this.newsList[index].isBorder = true;
        this.$nextTick( () => {
          this.$set(this, 'formData', JSON.parse(JSON.stringify(this.newsList[index])))
          this.option = JSON.parse(JSON.stringify(this.formOption))
          this.detailShow = true
        })
      },
      handlerAddItem(){
        let temp = {}
        temp.isBorder = true;
        //把之前存在的border修改为无border样式
        for(var i=0;i<this.newsList.length;i++){
          this.newsList[i].isBorder = false;
        }
        this.newsList.push(temp);
        this.handlerClickItem(this.newsList.length-1)
      },
      addDefault(){
        let _this = this;
        let temp = {}
        temp.isBorder = true;
        _this.newsList.push(temp);
      },
      showDeleteDiv(index){
        let _this = this;
        let temp = Object.assign({},_this.newsList[index]);
        temp.isShowDeleteDiv = true;
        _this.$set(_this.newsList,index,temp);
        //console.log(index + ";" + _this.newsList[index].isShowDeleteDiv);
      },
      hideDeleteDiv(index){
        let _this = this;
        let temp = Object.assign({},_this.newsList[index]);
        temp.isShowDeleteDiv = false;
        _this.$set(_this.newsList,index,temp);
        //console.log(index + ";" + _this.newsList[index].isShowDeleteDiv);
      },
      handlerDeleteItem(index){
        //console.log("handlerDeleteItem" + index);
        let _this = this;

        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //先清空数据
          //如果删除的当前item，存在id，需要在后台同时删除
          if(!!_this.newsList[index].id){
            _this.deleteArticleIds.push(_this.newsList[index].id);
          }

          //当前页面删除
          _this.newsList.splice(index,1);

          //把之前存在的border修改为无border样式
          for(var i=0;i<_this.newsList.length;i++){
            _this.newsList[i].isBorder = false;
          }
          //删除之后，默认选中第一个
          _this.newsList[0].isBorder = true;

          let currentIndex = _this.getCurrentIndex();
          _this.formData = _this.newsList[currentIndex];

        });

      },
      getCurrentIndex(){
        let _this = this;
        for(var i=0;i<_this.newsList.length;i++){
          if(_this.newsList[i].isBorder){
            return i;
          }
        }
      },
      async getNews(){
        let _this = this;
        var params = {id:_this.newsId};
        await getNews(params).then(res => {
          if(res.data.code == 0) {
            _this.getNewsData = res.data.data;
          }
          if(_this.getNewsData.length == 0){
            _this.addDefault();
            _this.handlerClickItem(0)
          }else{
            _this.getNewsData = []
            for(var i=0;i<res.data.data.length;i++){
              let temp = JSON.parse(JSON.stringify(res.data.data[i]))
              if(temp.picPath) {
                temp.imageUrl = [{url: temp.picPath}]
              }
              // temp.imageUrl = [{url: 'https://img0.baidu.com/it/u=699973849,3290692557&fm=26&fmt=auto'}]
              _this.newsList.push(temp);
            }
            this.handlerClickItem(0)
          }
        });
      },
      setNewsData (form) {
        let currentIndex = this.getCurrentIndex();
        if(this.formData && JSON.stringify(this.formData) != '{}') {
          this.$set(this.newsList, currentIndex, this.formData)
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .news-main{
    background-color: #FFFFFF;
    width: 280px;
    border: 3px solid #67C23A;
    padding: 20px;
    margin: 10px auto;
  }
  .news-main-noborder{
    background-color: #FFFFFF;
    width: 280px;
    border: 3px solid transparent;
    padding: 20px;
    margin: auto;
  }
  .news-content{
    background-color: #acadae;
    width: 240px;
    height: 140px;
    position: relative;
    margin-left: -3px
  }

  .news-content-noborder{
    background-color: #acadae;
    width: 240px;
    height: 140px;
    position: relative;
  }

  .news-content-title{
    display: inline-block;
    font-size: 15px;
    color: #FFFFFF;
    position: absolute;
    left: 10px;
    bottom: 15px;
  }

  .news-main-item{
    background-color: #FFFFFF;
    border: 3px solid #67C23A;
    padding: 10px 20px;
    margin-top: 10px;
    box-sizing: border-box;
    position: relative;
  }

  .news-main-item-noborder{
    background-color: #FFFFFF;
    border: 3px solid transparent;
    padding: 10px 20px;
    position: relative;
  }

  .news-content-item{
    height: 60px;
    position: relative;
    margin-left: -3px
  }

  .news-content-item-noborder{
    height: 60px;
    position: relative;
  }

  .news-content-item-title{
    display: inline-block;
    font-size: 15px;
    line-height: 60px;
    margin-left: 10px;
  }

  .news-content-item-img{
    float: right;
    display: inline-block;
    height: 50px;
    width: 50px;
    background-color: #acadae;
    margin-top: 5px;
    margin-right: 8px;
  }
  .news-content-item-delete{
    display: block;
    position: absolute;
    text-align:center;
    bottom: -1px;
    right: 0;
  }

  .news-bottom{
    height: 100px;
    background-color: #FFFFFF;
    text-align: center;
    margin: auto
  }
  .news-bottom-plus{
    font-size: 50px;
    color: #979797;
    margin-top: 25px
  }


  .hr-div{
    border-bottom: 1px solid #C0C4CC;display: block
  }

</style>
