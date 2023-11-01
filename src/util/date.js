import moment from 'moment'
moment.locale('zh-cn')
export const calcDate = (date1, date2) => {
  var date3 = date2 - date1

  var days = Math.floor(date3 / (24 * 3600 * 1000))

  var leave1 = date3 % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))

  var leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000))

  var leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
  var seconds = Math.round(date3 / 1000)
  return {
    leave1,
    leave2,
    leave3,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }
}

/**
 * 日期格式化
 */
export function dateFormat(date) {
  let format = 'yyyy-MM-dd hh:mm:ss';
  if (date != 'Invalid Date') {
    var o = {
      "M+": date.getMonth() + 1, //month
      "d+": date.getDate(), //day
      "h+": date.getHours(), //hour
      "m+": date.getMinutes(), //minute
      "s+": date.getSeconds(), //second
      "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
      "S": date.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
          RegExp.$1.length == 1 ? o[k] :
            ("00" + o[k]).substr(("" + o[k]).length));
    return format;
  }
  return '';

}

/**
 * 格式化相对时间
 * @returns {string}
 * @param value
 * @param now
 */
export const relativelyTime = (value, now) => {
  if (!now) {
    now = moment();
  }
  const diff = moment(now).diff(moment(value), 'hours');
  if (diff <= 1) {
    return moment(value).fromNow();
  }
  const today = moment(now).get('date');
  const current = moment(value).get('date');
  if (current < today - 1) {
    // return moment(value).format('M月D日 H:mm');
  }
  let detailTime = moment(value).format('H:mm');
  const currentDate = moment(value).format('YYYY-MM-DD');
  const currentMonday = moment().weekday(0).format('YYYY-MM-DD');
  const currentSunday = moment().weekday(6).format('YYYY-MM-DD');
  let weekDate = '';
  if (currentDate < currentMonday) {
    weekDate = '[上周]dd ' + detailTime;
  }else if (currentDate > currentSunday) {
    weekDate = '[下周]dd ' + detailTime;
  }else{
    weekDate = '[周]dd ' + detailTime;
  }
  return moment(value).calendar(null, {
    sameDay: '[今天 ]' + moment(value).format('H:mm'),
    nextDay: '[明天 ]' + detailTime,
    nextWeek: weekDate,
    lastDay: '[昨天 ]' + detailTime,
    lastWeek: weekDate,
    sameElse: 'M月D日 H:mm'
  });
};
