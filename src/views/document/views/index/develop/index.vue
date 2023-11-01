<template>
  <div class="dev-info">
    <div class="dev-info-item">
      <h3 style="color: red;">jvs-ui&nbsp;&nbsp;&nbsp;&nbsp;jvs-upms-ui&nbsp;&nbsp;&nbsp;&nbsp;本地代码未经审核不得提交！！！</h3>
      <h3>nginx环境配置</h3>
      <div>
        <p>软件包解压后，修改配置文件conf/nginx.conf</p>
        <div v-highlight>
          <pre>
            <code class="json" v-html="`
            sever {
              listen  80;
              server_name  localhost;
        

              #父架
              location / {
                  proxy_pass http://localhost:8080/;
              }
              location /jvs-children-ui-public/ {
                  proxy_pass http://localhost:8081/jvs-children-ui-public/; 
              }
              location ^~ /jquery-3.6.0.min.js {
                    proxy_pass http://localhost:8080/; 
              }
              location /api {
                    proxy_pass http://10.0.0.125:10000/api; 
              }
              location /webjars/ {
                  proxy_pass http://10.0.0.125:10000/webjars/; 
              }
              location /swagger-resources/{
                  proxy_pass http://10.0.0.125:10000/swagger-resources/; 
              }

              #子项目
              location /项目名称(-ui结尾)/ {
                  proxy_pass http://localhost:8081/项目名称(-ui结尾)/; 
              }
        
            }

            `">
            </code>
          </pre>
        </div>
        <p>
          重启命令:  nginx -s reload
        </p>
        <p style="color: red;">注意: <span>listen 80端口时，父架端口也保持80，子项目名称必须 -ui 结尾</span></p>
      </div>
      <h3>环境参数</h3>
      <div>
        <p>网关: http://10.0.0.125:10000</p>
      </div>
      <h3>本机开发</h3>
      <div>
        <p>路由统一hash模式，子项目由iframe引入，本地启动后联调子项目需搭建nginx，通过ip直接访问</p>
      </div>
      <h3>开发环境</h3>
      <div>
        <p>未搭建nginx环境下，子项目添加菜单后，直接修改路径参数urlPath为本地(ip+端口)的路由地址即可</p>
        <p>主架访问：/#/myiframe/urlPath?name=菜单名称&src=带http的本地路由地址</p>
        <p>单独访问：ip+端口/项目名称/#/路由</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'develop-info',
  data(){
    return {}
  }
}
</script>
<style lang="scss" scoped>
.dev-info{
  padding-bottom: 20px;
}
</style>