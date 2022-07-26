import request from '@/router/axios'
const base = '/mgr/jvs-auth'

// 获取菜单
export const getMenu= () => {
    return request({
        url: `${base}/menu/list`,
        method: 'get'
    })
}

// 新增菜单
export const addMenu= (data) => {
    return request({
        // url: `${base}/menu`,
        url: `/mgr/jvs-auth/menu/menu`,
        method: 'post',
        data: data
    })
}

// 修改菜单
export const editMenu= (data) => {
    return request({
        // url: `${base}/menu`,
      url: `/mgr/jvs-auth/menu/menu`,
        method: 'put',
        data: data
    })
}

// 删除菜单
export const deleteMenu= (id) => {
    return request({
        // url: `${base}/menu/${id}`,
        url: `/mgr/jvs-auth/menu/menu/${id}`,
        method: 'delete'
    })
}

// 获取全部资源数据
export const getPermission= (params) => {
    return request({
        url: `${base}/permission/list`,
        method: 'get',
        params: params
    })
}

// 新增资源
export const addPermission= (data) => {
    return request({
        url: `${base}/permission`,
        method: 'post',
        data: data
    })
}

// 修改资源
export const editPermission= (data) => {
    return request({
        url: `${base}/permission`,
        method: 'put',
        data: data
    })
}

// 将资源数据挂载到菜单上
export const permissionOfMenu= (data) => {
    return request({
        url: `${base}/permission`,
        method: 'put',
        data: data
    })
}

// 删除资源
export const deletePermission= (id) => {
    return request({
        url: `/mgr/jvs-auth/permission/${id}`,
        method: 'delete'
    })
}

// 新增系统
export const addSysntem = (data) => {
    return request({
        url: `${base}/system`,
        method: 'post',
        data: data
    })
}

//获取所有系统列表 (带数据权限)
export const getAllSystemList = (clientId) => {
    return request({
      // url: `/mgr/jvs-auth/system/all`,
      url: `/mgr/jvs-auth/index/menu/${clientId}`,
      method: "get",
      // params: params
    });
};

//获取所有系统列表
export const getAllMenuList = () => {
    return request({
      // url: `/mgr/jvs-auth/system/all`,
      url: `/mgr/jvs-auth/menu/all`,
      method: "get",
      // params: params
    });
};

// 生成密钥
export const securityKey = () => {
    return request({
      url: `/mgr/jvs-auth/system/securityKey`,
      method: "get"
    });
};

// 删除系统
export const deleteSystem = (systemId) => {
    return request({
      url: `/mgr/jvs-auth/system/${systemId}`,
      method: "delete"
    });
};

// 搜索api路径
export const getApiList = () => {
    return request({
      url: `/gateway/handler/mapping`,
      method: "get"
    });
};

// 获取应用list
export const getAppList = () => {
  return request({
    url: `/mgr/jvs-auth//menu/applys`,
    method: "get",
  });
};

// 获取资源list
export const getResourceList = (menuId) => {
  return request({
    url: `/mgr/jvs-auth/permission/all/${menuId}`,
    method: "get",
  });
};

// 修改资源
export const updateResource = (data, menuId) => {
  return request({
    url: `/mgr/jvs-auth/permission/permission/${menuId}`,
    method: 'post',
    data: data
  })
}
