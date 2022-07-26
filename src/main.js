import "babel-polyfill";
import "classlist-polyfill";
import Vue from "vue";
import axios from "./router/axios";
import VueAxios from "vue-axios";
import App from "./App";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./permission"; // 权限
import "./error"; // 日志
import router from "./router/router";
import store from "./store";
import { loadStyle } from "./util/util";
import * as urls from "@/config/env";
import { iconfontUrl, iconfontVersion } from "@/config/env";
import * as filters from "./filters"; // 全局filter
import JsonViewer from "vue-json-viewer";
import draggable from "vuedraggable"; // 可拖拽容器
import VueClipboard from 'vue-clipboard2'
import permissionMatch from "./util/permision";
import openUrl from "./util/url";
import loginForm from './util/login'
import drawImamge from './util/draw'
import getIconLib from './plugin/iconLib/index'
import "@/styles/newStyle.scss"
import "./styles/common.scss";
import './styles/resetAll.scss' // fixme 统一表单表格样式，自定义需要注释此代码
import './styles/reset2.0.scss' // 2.0版本ui迭代
import 'font-awesome/css/font-awesome.min.css'
/**
 * 全局注册容器、组件
 * 不可删除，添加全局组件引用请修改index.js
 */

import "./components/index";

// 滚动栏
import vuescroll from "vuescroll"; //引入vuescroll
import "vuescroll/dist/vuescroll.css"; //引入vuescroll样式
// 注册封装代码显示器
import vueHljs from "vue-hljs";
import hljs from "highlight.js";
//if you want to use default color, import this css file
import "vue-hljs/dist/style.css";
Vue.use(vueHljs, { hljs })
hljs.highlightAll()
Vue.use(vuescroll); //使用

Vue.use(VueAxios, axios);

Vue.use(ElementUI, {
    size: "medium",
    menuType: "text"
});
Vue.use(JsonViewer);
Vue.use(permissionMatch); // 权限
Vue.use(openUrl); // 打开链接 用于 预览、下载、打开地址


Vue.use(router);

// 注册全局容器
Vue.component("draggable", draggable);
Vue.use(VueClipboard)

Vue.prototype.$openLogin = loginForm.install
Vue.prototype.$consoleImage = drawImamge.install

// 加载相关url地址
Object.keys(urls).forEach(key => {
    Vue.prototype[key] = urls[key];
});

//加载过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
    loadStyle(iconfontUrl.replace("$key", ele));
});
if(store.getters.access_token) {
    getIconLib()
}

Vue.config.productionTip = false;

var instance = axios.create({
    baseURL: '',
    timeout: 3000,
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})
Vue.config.productionTip = false
Vue.prototype.instance = instance

Vue.prototype.$isNotEmpty = function(obj){
    return (obj !== undefined && obj !== null && obj !== '' && obj !== 'null')
}
Vue.prototype.$getDefalut = function(obj, key, df){
    return (obj === undefined || key === undefined || !this.$isNotEmpty(obj[key])) ? df : obj[key];
}

new Vue({
    router,
    store,
    render: h => h(App),
    data: {
        eventBus: new Vue()
    }
}).$mount("#app");
