import request from "@/router/axios"

// 获取下拉列表
export const getSelectData = (str, method, params, designId) => {
  let temp = {
    url: str,
    method: method ? method : 'get'
  }
  if(params) {
    if(method && method == 'post') {
      temp.data = params
    }else{
      temp.params = params
    }
  }
  if (designId) {
    temp.headers = {
      'designId': designId
    }
  }
  return request(temp)
}
