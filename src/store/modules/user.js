import { getStore, setStore } from "@/util/store";
import { isURL } from "@/util/validate";
import {
  loginByUsername,
  logout,
  refreshToken,
  codeLogin,
  wxOpenidLogin
} from "@/api/login";
import { deepClone, encryption } from "@/util/util";
import webiste from "@/const/website";
import { GetMenu } from "@/api/admin/menu";
import {enCodeKey} from "@/const/const"

function addPath(ele, first) {
  const propsConfig = webiste.menu.props;
  const propsDefault = {
    label: propsConfig.label || "label",
    src: propsConfig.src || "src",
    icon: propsConfig.icon || "icon",
    path: propsConfig.path || "path"
  };
  if (first) {
    ele[propsDefault.path] = ele[propsDefault.path] + "/index";
    return;
  }
  // const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0
  // if (!isChild && first) {
  //   ele[propsDefault.path] = ele[propsDefault.path] + '/index'
  //   return
  // }
  // ele[propsDefault.children].forEach(child => {
  //   if (!isURL(child[propsDefault.path])) {
  //     child[propsDefault.path] = `${ele[propsDefault.path]}/${child[propsDefault.path] ? child[propsDefault.path] : 'index'}`
  //   }
  //   addPath(child)
  // })
}

const user = {
  state: {
    userInfo:
      getStore({
        name: "userInfo"
      }) || {},
    permissions: getStore({
      name: "permissions"
    }) || [],
    roles:
      getStore({
        name: "roles"
      }) || [],
    menu:
      getStore({
        name: "menu"
      }) || [],
    menuAll: [],
    expires_in:
      getStore({
        name: "expires_in"
      }) || "",
    access_token:
      getStore({
        name: "access_token"
      }) || "",
    refresh_token:
      getStore({
        name: "refresh_token"
      }) || "",
    tenantId:
      getStore({
        name: "tenantId"
      }) || "",
    jti:
      getStore({
        name: 'jti'
      }) || ''
  },
  actions: {
    // 根据用户名登录
    LoginByUsername({ commit }, userInfo) {
      // console.log(userInfo);
      let user = encryption({
        data: userInfo,
        key: enCodeKey, // "ZnJhbWVmcmFtZQ==",
        param: ["password"]
      });
      return new Promise((resolve, reject) => {
        if (user.loginType === "namepass") {
          loginByUsername(
            user.username,
            user.password,
            user.code,
            user.randomStr
          )
            .then(response => {
              const data = response.data;
              commit("SET_JTI", data.jti);
              commit("SET_ACCESS_TOKEN", data.access_token);
              commit("SET_REFRESH_TOKEN", data.refresh_token);
              commit("SET_EXPIRES_IN", data.expires_in);
              commit("CLEAR_LOCK");
              commit("SET_USER_INFO", data.userDto);
              commit("SET_ROLES", data.roles || []);
              commit("SET_PERMISSIONS", data.permissions || []);

              resolve(data);
            })
            .catch(error => {
              console.log(error);
              reject(error);
            });
        } else if (user.loginType === "phone") {
          let queryData = {}
          if(userInfo.app_client_id) {
            queryData.app_client_id = userInfo.app_client_id
          }
          if(userInfo.call_back_url) {
            queryData.call_back_url = userInfo.call_back_url
          }
          let tp = {
            data: JSON.stringify(Object.assign({ phone: user.phone, code: user.code }, queryData))
          }
          let temp = encryption({
            data: tp,
            key: enCodeKey,
            param: ["data"]
          });
          codeLogin(('phone@'+temp.data))
            .then(response => {
              const data = response.data;
              commit("SET_ACCESS_TOKEN", data.access_token);
              commit("SET_REFRESH_TOKEN", data.refresh_token);
              commit("SET_EXPIRES_IN", data.expires_in);
              commit("CLEAR_LOCK");
              commit("SET_USER_INFO", data.userDto);
              commit("SET_ROLES", data.roles || []);
              commit("SET_PERMISSIONS", data.permissions || []);
              resolve(data);
            })
            .catch(error => {
              console.log(error);
              reject(error);
            });
        }else if(['invite', 'weixin'].indexOf(userInfo.loginType) > -1) {
          let userTempData = JSON.parse(JSON.stringify(userInfo))
          let spiteIcon = 'invite@'
          if(userInfo.loginType == 'weixin') {
            spiteIcon = (userTempData.type + '@')
          }
          delete userTempData.loginType
          let tp = {
            data: JSON.stringify(userTempData)
          }
          let temp = encryption({
            data: tp,
            key: enCodeKey,
            param: ["data"]
          });

          codeLogin((spiteIcon+temp.data)).then(response => {
            const data = response.data;
            commit("SET_ACCESS_TOKEN", data.access_token);
            commit("SET_REFRESH_TOKEN", data.refresh_token);
            commit("SET_EXPIRES_IN", data.expires_in);
            commit("CLEAR_LOCK");
            commit("SET_USER_INFO", data.userDto);
            commit("SET_ROLES", data.roles || []);
            commit("SET_PERMISSIONS", data.permissions || []);
            resolve(data);
          })
          .catch(error => {
            console.log(error);
            reject(error);
          });
        }else if(userInfo.loginType == 'register') {
          let tp = {
            data: JSON.stringify({ realName: user.username, phone: user.phone, code: user.code })
          }
          let temp = encryption({
            data: tp,
            key: enCodeKey,
            param: ["data"]
          });
          codeLogin(('register@'+temp.data)).then(response => {
            const data = response.data;
            commit("SET_ACCESS_TOKEN", data.access_token);
            commit("SET_REFRESH_TOKEN", data.refresh_token);
            commit("SET_EXPIRES_IN", data.expires_in);
            commit("CLEAR_LOCK");
            commit("SET_USER_INFO", data.userDto);
            commit("SET_ROLES", data.roles || []);
            commit("SET_PERMISSIONS", data.permissions || []);
            resolve(data);
          })
          .catch(error => {
            console.log(error);
            reject(error);
          });
        }
      });
    },
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then(res => {
            const data = res.data.data || {};
            commit("SET_USER_INFO", data.sysUser);
            commit("SET_ROLES", data.roles || []);
            commit("SET_PERMISSIONS", data.permissions || []);
            resolve(data);
          })
          .catch(err => {
            reject();
          });
      });
    },
    // 刷新token
    RefreshToken({ commit, state }, tenantId) {
      return new Promise((resolve, reject) => {
        refreshToken(state.refresh_token, tenantId)
          .then(response => {
            const data = response.data;
            commit("SET_ACCESS_TOKEN", data.access_token);
            commit("SET_REFRESH_TOKEN", data.refresh_token);
            commit("SET_EXPIRES_IN", data.expires_in);
            commit("CLEAR_LOCK");
            commit("SET_TENANTId", tenantId);
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 登出
    LogOut({ commit }) {
      commit("SET_MENU", []);
      commit("SET_PERMISSIONS", []);
      commit("SET_USER_INFO", {});
      commit("SET_ACCESS_TOKEN", "");
      commit("SET_REFRESH_TOKEN", "");
      commit("SET_EXPIRES_IN", "");
      commit("SET_ROLES", []);
      commit("DEL_ALL_TAG");
      commit("CLEAR_LOCK");
      commit("SET_SYSTEM", "");
      commit("SET_ACCESS_TOKEN", "");
      commit("SET_TENANTId", "");
      localStorage.removeItem('loginRandom')
      localStorage.removeItem('bindRandom')
    },
    // 注销session
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit("SET_MENU", []);
        commit("SET_PERMISSIONS", []);
        commit("SET_USER_INFO", {});
        commit("SET_ACCESS_TOKEN", "");
        commit("SET_REFRESH_TOKEN", "");
        commit("SET_ROLES", []);
        commit("DEL_ALL_TAG");
        commit("CLEAR_LOCK");
        resolve();
      });
    },
    // 获取收藏菜单列表
    GetMenu({ commit }, type) {
      return new Promise(resolve => {
        // TODO 获取系统菜单
        GetMenu().then(res => {
          const data = res.data.data;
          let menu = deepClone(data);
          menu.forEach(ele => {
            addPath(ele);
          });
          commit("SET_MENU", { type, menu });
          resolve(menu);
        });
      });
    }
  },
  mutations: {
    SET_ACCESS_TOKEN: (state, access_token) => {
      state.access_token = access_token;
      setStore({
        name: "access_token",
        content: state.access_token,
        type: "session"
      });
      setStore({
        name: "access_token",
        content: state.access_token,
        type: ""
      });
    },
    SET_EXPIRES_IN: (state, expires_in) => {
      state.expires_in = expires_in;
      setStore({
        name: "expires_in",
        content: state.expires_in,
        type: "session"
      });
    },
    SET_REFRESH_TOKEN: (state, rfToken) => {
      state.refresh_token = rfToken;
      setStore({
        name: "refresh_token",
        content: state.refresh_token,
        type: "session"
      });
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo;
      setStore({
        name: "userInfo",
        content: state.userInfo,
        type: "session"
      });
      setStore({
        name: "userInfo",
        content: state.userInfo,
        type: ""
      });
    },
    SET_MENU: (state, params = {}) => {
      let { menu, type } = params;
      if (type !== false) state.menu = menu;
      setStore({
        name: "menu",
        content: menu,
        type: "session"
      });
    },
    SET_MENU_ALL: (state, menuAll) => {
      state.menuAll = menuAll;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
      setStore({
        name: "roles",
        content: state.roles,
        type: "session"
      });
    },
    SET_PERMISSIONS: (state, permissions) => {
      // const list = {};
      // for (let i = 0; i < permissions.length; i++) {
      //   list[permissions[i]] = true;
      // }
      // state.permissions = list;
      setStore({
        name: "permissions",
        content: permissions, //state.permissions,
        type: "session"
      });
    },
    SET_JTI: (state, jti) => {
      // state.jti = jti;
      // setStore({
      //   name: "jti",
      //   content: state.jti,
      //   type: "session"
      // });
    },
    SET_SwitchTenant: (state, switchTenant) => {
      state.switchTenant = switchTenant;
      setStore({
        name: "switchTenant",
        content: state.switchTenant,
        type: "session"
      });
    }
  }
};
export default user;
