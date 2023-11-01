import Vue from 'vue'
import { Message,MessageBox } from 'element-ui'
import MSG_LIST from './message'
import moment from 'moment'
import {getSelectData} from "@/api/index"
const commonUtil = {}
/**
 * @description:消息展示
 * @param  showClose 是否显示关闭按钮 boolean message 消息内容 type 消息类型 success/warning/info/error duration 显示时间, 毫秒。设为 0 则不会自动关闭
 */
commonUtil.showMessage = function(obj)
{
    Message({
        showClose: (obj.showClose == undefined)?true:obj.showClose,
        message: obj.message,
        type: (obj.type == undefined)?'success':obj.type,
        duration: (obj.duration == undefined)?3000:obj.duration
    })
}

/**
 * @description: 获取错误消息
 * @param msgid 消息的key
 * @param msgParams 消息参数
 */
commonUtil.getMessageFromList = function(msgid,msgParams)
{
    let msg = MSG_LIST[msgid];
    if ($.trim(msg) == "") {
        msg = msgid + "[该消息不存在。]";
        return msg;
    }
    if (msgParams != null) {
        for (var i=0; i<msgParams.length; i++) {
            msg = msg.replace("{" + i + "}", msgParams[i]);
        }
    }
    return msg;
}

//表格日期格式化
commonUtil.formatTableDate = function(row, column)
{
    var date = row[column.property];
    if (date == undefined) {
      return "";
    }
    return commonUtil.formatDate(date);
}
//日期格式化
commonUtil.formatDate = function(val)
{
   return moment(val).format("YYYY-MM-DD HH:mm:ss");
}

//获取当前时间
commonUtil.getCurrentDate = function(obj)
{

      switch (obj.format) {
          case '1':
            return moment().format("YYYY-MM-DD HH:mm:ss");
          case '2':
            return moment().format("YYYY-MM-DD HH:mm");
          case '3':
            return moment().format("YYYY-MM-DD");
          case '4':
            return moment().format("YYYY-MM");
          case '5':
            return moment().format("HH:mm:ss");
          case '6':
            return moment().format("HH:mm");
          case '7':
            return commonUtil.getWeek();
          default:
              break;
      }
}
commonUtil.getWeek = function(){
    let week = moment().day()
      switch (week) {
        case 1:
          return '星期一'
        case 2:
          return '星期二'
        case 3:
          return '星期三'
        case 4:
          return '星期四'
        case 5:
          return '星期五'
        case 6:
          return '星期六'
        case 0:
          return '星期日'
      }
}

/**
 * @description: 获取表格数据
 * @param url:后台请求地址
 * @param param:后台请求参数
 */
commonUtil.doPost = function(obj){
    return getSelectData(obj.url, 'post', obj.params)
}
/**
 * @description: 共通表格赋值
 * @param response:请求返回数据
 * @param tablePage:表格分页信息
 * @param tableData:表格数据
 */
commonUtil.tableAssignment = function(response,tablePage,tableData){
    if (response.code == "200")
    {
        var responseData = response.responseData;
        tableData.splice(0)
        if(responseData.data&&responseData.data.length > 0)
        {
            for (let index = 0; index < responseData.data.length; index++) {
                tableData.push(responseData.data[index])
            }
        }
        tablePage.pageTotal = Number(responseData.total);
    }
}
//清空map对象
commonUtil.clearObj = function(obj)
{
    for(var i in obj) {
       if(obj[i]  instanceof Array)
       {
        obj[i] = [];
       }else if(obj[i]  instanceof Object)
       {
        obj[i] = Object;
       }
       else{
        obj[i] = null;
       }

    }
}

commonUtil.removeEmpty = function (obj)
{
    for(var i in obj)
    {
        if(obj[i] == "")
        {
            delete obj[i]
        }
    }
}

//获取uuid
commonUtil.getUuid = function()
{
    var len = 32;//32长度
    var radix = 16;//16进制
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
    if(len) {
      for(i = 0; i < len; i++)uuid[i] = chars[0 | Math.random() * radix];
    } else {
      var r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      for(i = 0; i < 36; i++) {
        if(!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
}
//对象赋值
commonUtil.coperyProperties = function(target,source)
{
    if(source.id)
    {
        target.id = source.id;
    }
    for(var i in target) {
        if(i in source)
        {
            target[i] = source[i];
        }

    }
}

//获取表格数据字典值,数据字典定义在前台js文件中
commonUtil.getTableCodeName = function(prop,row,codeType)
{
    var value = row[prop];
    return commonUtil.getDictionaryValueName(codeType,value)
}

//获取表格数据字典值
commonUtil.formatterTableValue = function(row, column)
{
    var type = column.property;
    var value = row[column.property];
    if(type)
    {
        return commonUtil.getDictionaryValueName(type,value)
    }else{
        return "-"
    }
}
//获取表格数据字典值,数据字典定义在前台js文件中
commonUtil.returnScore = function(prop,row,codeType)
{
    if(row.appealStatus.toString() == '3'){
        return row.score
      }else{
        return " "
      }
}
commonUtil.getSystemCodeName = function(prop,row,codeType)
{
    var value = row[prop];
    let result = commonUtil.getSysCodeValueName(value,codeType);
    return result;
}

/**
 * @description: 获取后台定义的数据字典名称
 * @param {type}
 */
commonUtil.getSysCodeValueName = function(value,codeType)
{
    var codeValues = JSON.parse(localStorage.getItem("codeValues"));
    return codeValues[codeType+":"+value]?codeValues[[codeType+":"+value]]:"";
}

/**
 * @description: 根据数据字典类型获取数据字典所有的值
 * @param {codeType}  数据字典类型
 */
commonUtil.getSysCodeValues = function(codeType){
    let result = [];
    let data = commonUtil.doSyncPost("/api/sysCodeValue/selectValByType",{codeType:codeType});
    result = data.responseData;
    return result;
}

/**
 * @description: 根据地区编码获取地区
 * @param {areaCode} 地区编码
 */
commonUtil.getAreaName = function(areaCode)
{
    let areaName = "";
    let data = commonUtil.doSyncPost("/api/sysArea/getAreaNameByCode",{areaCode:areaCode});
    areaName = data.responseData;
    return areaName;
}
/**
 * @description: 获取下级地区，如果要获取一级地区则传'000000'
 * @param {type}
 */
commonUtil.getNextArea = function(areaCode)
{
    let areas = [];
    let data = commonUtil.doSyncPost("/api/sysArea/getNextAreasByCode",{areaCode:areaCode});
    areas = data.responseData;
    return areas;
}
/**
 * @description: 初始化所有数据字典的值
 * @param {type}
 */
commonUtil.initCodeTypeValue = function(){
    let data = commonUtil.doSyncPost("/api/sysCodeValue/getAllVal",{});
    // commonUtil.codeValues = data.responseData;
    localStorage.setItem("codeValues", JSON.stringify(data.responseData));
}

commonUtil.formArea = function(prop,row){
    return row.provinceName+row.cityName+row.reginName
}

commonUtil.disabled = function(){
    return true;
}
commonUtil.undisabled = function(){
    return false;
}

//三个连续字符判断
commonUtil.LxStr = function(str){
    var arr = str.split('');
        var flag = true;
        for (var i = 1; i < arr.length-1; i++) {
            var firstIndex = arr[i-1].charCodeAt();
            var secondIndex = arr[i].charCodeAt();
            var thirdIndex = arr[i+1].charCodeAt();
            if((thirdIndex - secondIndex == 1)&&(secondIndex - firstIndex==1)){
                flag =  false;
                return flag;
            }

        }
        for (var i = 1; i < arr.length-1; i++) {
            var firstIndex = arr[i-1].charCodeAt();
            var secondIndex = arr[i].charCodeAt();
            var thirdIndex = arr[i+1].charCodeAt();
            if((firstIndex - secondIndex  == 1)&&(secondIndex - thirdIndex==1)){
                flag =  false;
                return flag
            }
        }
        return flag;
}
//设置cookie
commonUtil.setCookie = function(key,value) {
    //字符串拼接cookie
    window.document.cookie = key+"="+value;
}

//获取cookie
commonUtil.getCookie = function(key){
    if (window.document.cookie.length > 0){
      var arr = document.cookie.split('; ');
      for (var i = 0; i < arr.length; i++) {
        var arr2 = arr[i].split('='); //再次切割
        //判断查找相对应的值
        if (arr2[0] == key) {
          return arr2[1];
        }
      }
    }
}
//校验身份证的合法性
commonUtil.idcardValid = function(code){
    if(!code)
    {
        return true;
    }
    code = code.toUpperCase();
    var city = {11: "北京",12: "天津",13: "河北",14: "山西",15: "内蒙古",21: "辽宁",22: "吉林",23: "黑龙江 ",31: "上海",32: "江苏",33: "浙江",34: "安徽",35: "福建",
    36: "江西",37: "山东",41: "河南",42: "湖北 ",43: "湖南",44: "广东",45: "广西",46: "海南",50: "重庆",51: "四川",52: "贵州",53: "云南",54: "西藏 ",61: "陕西",62: "甘肃",
    63: "青海",64: "宁夏",65: "新疆",71: "台湾",81: "香港",82: "澳门",91: "国外 "};
    if(!city[code.substr(0, 2)])
    {
        return false;
    }else{
        code = code.split('');
        //∑(ai×Wi)(mod 11)
        //加权因子
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        //校验位
        var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
        var sum = 0;
        var ai = 0;
        var wi = 0;
        for(var i = 0; i < 17; i++) {
            ai = code[i];
            wi = factor[i];
            sum += ai * wi;
        }
        var last = parity[sum % 11];
        if(parity[sum % 11] != code[17]) {
            return false;
        }
    }
    return true;
}

//form表单校验身份证号是否合法
commonUtil.idcardValidator = function(rule, value, callback){
    if(commonUtil.idcardValid(value))
    {
        callback();
    }else{
        callback(new Error(commonUtil.getMessageFromList("error.idcard.validate")));
    }
}
//启用禁用显示
commonUtil.label = function(row){
    if(row.status == 1)
    {
      return "禁用";
    }else{
      return "启用";
    }
}
/**
*判断是否是数字
*
**/
commonUtil.isRealNum = function (val){
    // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，
　　if(val === "" || val ==null){
        return false;
　　}
   if(!isNaN(val)){　　　　
　　//对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false,   //所以如果不需要val包含这些特殊情况，则这个判断改写为if(!isNaN(val) && typeof val === 'number' )
　　　 return true; 　　
    }　else{ 　　　　
        return false; 　　
    }
}

//秒转时分秒
commonUtil.secondToDate = function (result) {
    var h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
    var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
    var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
    result = h + "小时" + m + "分" + s + "秒";
    return result;
}
commonUtil.isNumber = function(val){
    if (isNaN(val)) {
        return false;
    } else {
        return true;
    }
}

//判断值是否是空
commonUtil.isEmpty = function(val)
{
    var result = false;
    if(!val || val == null || val == '')
    {
        result = true;
    }
    return result;
}

//从数组中获取元素和下标
commonUtil.getItemIndexFromList = function (list, attr, val) {
    var result = {
        index:-1,
        item:null
    };
    if (list && list.length > 0) {
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (val == element[attr]) {
                result.index = index;
                result.item = element;
                break;
            }
        }
    }
    return result;
}

//生成随机16进制颜色
commonUtil.color16 = function(){
    var str = "#";
    //一个十六进制的值的数组
    var arr = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
    for (var i=0;i<6;i++){
    var num = parseInt(Math.random()*16); //随机产生0-15之间的一个数
    str += arr[num]; //产生的每个随机数都是一个索引,根据索引找到数组中对应的值,拼接到一起
    }
    return str;
}
export default commonUtil;
