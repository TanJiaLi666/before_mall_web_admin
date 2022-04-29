import request from '@/utils/request'
export function sendComment(params) {
  return request({
    url:'/comment/send',
    method:'post',
    params:params
  })
}
export function sendCommentReply(params) {
  return request({
    url:'/comment/send/in',
    method:'post',
    params:params
  })
}
export function fetchList(params, id) {
  return request({
    url:'/comment/list/'+id,
    method:'get',
    params:params
  })
}
export function updateStatus(data) {
  return request({
    url:'/comment/update/status',
    method:'post',
    params:data
  })
}
export function deleteReply(params) {
  return request({
    url:'/comment/update/delete',
    method:'post',
    params:params
  })
}
export function updateSort(params) {
  return request({
    url:'/comment/update/sort',
    method:'post',
    params:params
  })
}
export function getCommentReply(params,id) {
  return request({
    url:'/comment/get/list/'+id,
    method:'get',
    params:params
  })
}

export function deleteReplyIn(params) {
  return request({
    url:'/comment/update/delete/in',
    method:'post',
    params:params
  })
}
