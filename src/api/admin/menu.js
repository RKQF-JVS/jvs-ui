import request from "@/router/axios";
const base = "/mgr/jvs-auth";
// 收藏菜单
export const GetMenu = () => {
  return request({
    url: base + "/menu/favorites/list",
    method: "get"
  });
};

// 收藏 菜单
export const favorite = (id) => {
  return request({
    url: base + `/menu/favorites/${id}`,
    method: "put",
  });
};

// 取消收藏 菜单
export const delfavorite = (id) => {
  return request({
    url: base + `/menu/favorites/${id}`,
    method: "delete"
  });
};

// 修改收藏菜单的顺序
export const sortMenuList = data => {
  return request({
    url: base + "/menu/favorites/list",
    method: "patch",
    data: data
  });
};

// 菜单列表
export const GetMenuList = (params) => {
  return request({
    url: base + `/menu/list`,
    method: "get",
    params: params
  });
};
