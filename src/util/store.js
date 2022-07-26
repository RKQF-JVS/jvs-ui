import {
  validatenull
} from '@/util/validate'
import website from '@/const/website'

const keyName = website.key + '-';
/**
 * 存储localStorage
 */
export const setStore = (params = {}) => {
  let {
    name,
    content,
    type,
  } = params;
  name = keyName + name
  let obj = {
    dataType: typeof (content),
    content: content,
    type: type,
    datetime: new Date().getTime()
  }
  localStorage.setItem(name, JSON.stringify(obj));
  // if (type) sessionStorage.setItem(name, JSON.stringify(obj));
  // else localStorage.setItem(name, JSON.stringify(obj));
}
/**
 * 获取localStorage
 */

export const getStore = (params = {}) => {
  let {
    name,
    debug,
    type
  } = params;
  name = keyName + name
  let obj = {},
    content;
  obj = localStorage.getItem(name);
  // obj = sessionStorage.getItem(name);
  if (validatenull(obj)) {
    if(type){
      return;
    }else{
      obj = localStorage.getItem(name);
    }
  }else{
    try {
      obj = JSON.parse(obj);
    } catch{
      return obj;
    }
    if (debug) {
      return obj;
    }
    if (obj.dataType == 'string') {
      content = obj.content;
    } else if (obj.dataType == 'number') {
      content = Number(obj.content);
    } else if (obj.dataType == 'boolean') {
      content = eval(obj.content);
    } else if (obj.dataType == 'object') {
      content = obj.content;
    }
    return content;
  }
}
/**
 * 删除localStorage
 */
export const removeStore = (params = {}) => {
  let {
    name,
    type
  } = params;
  name = keyName + name
  // if (type) {
  //   sessionStorage.removeItem(name);
  // } else {
  //   localStorage.removeItem(name);
  // }
  sessionStorage.removeItem(name);
  localStorage.removeItem(name);
}

/**
 * 获取全部localStorage
 */
export const getAllStore = (params = {}) => {
  let list = [];
  let {
    type
  } = params;
  for (let i = 0; i <= localStorage.length; i++) {
    list.push({
      name: localStorage.key(i),
      content: getStore({
        name: localStorage.key(i),
      })
    })

  }
  // if (type) {
  //   for (let i = 0; i <= sessionStorage.length; i++) {
  //     list.push({
  //       name: sessionStorage.key(i),
  //       content: getStore({
  //         name: sessionStorage.key(i),
  //         type: 'session'
  //       })
  //     })
  //   }
  // } else {
  //   for (let i = 0; i <= localStorage.length; i++) {
  //     list.push({
  //       name: localStorage.key(i),
  //       content: getStore({
  //         name: localStorage.key(i),
  //       })
  //     })

  //   }
  // }
  return list;

}

/**
 * 清空全部localStorage
 */
export const clearStore = (params = {}) => {
  let { type } = params;
  // if (type) {
  //   sessionStorage.clear();
  // } else {
  //   localStorage.clear()
  // }
  sessionStorage.clear();
  localStorage.clear()
}
