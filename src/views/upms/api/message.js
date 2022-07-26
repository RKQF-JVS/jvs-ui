import request from "@/router/axios";

// 消息分页
export function getMessage(params) {
  return request({
    url: `/mgr/jvs-auth/message/page`,
    method: "get",
    params: params
  });
}

// 新增消息
export function addMessage(data) {
  return request({
    url: `/mgr/jvs-auth/message`,
    method: "post",
    data: data
  });
}

// 修改消息
 export function editMessage(data) {
  return request({
    url: `/mgr/jvs-auth/message/edit`,
    method: "put",
    data: data
  });
}

// 发送消息
export function sendMessage(id) {
  return request({
    url: `/mgr/jvs-auth/message/send/${id}`,
    method: "get"
  });
}

// 重发消息
export function retryMessage(id) {
  return request({
    url: `/mgr/jvs-auth/message/retry/${id}`,
    method: "get"
  });
}

// 删除消息
export function deleteMessage(id) {
  return request({
    url: ` /mgr/jvs-auth/message/${id}`,
    method: "delete"
  });
}
