import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/home/category/fetchList',
    method:'get',
    params:params
  })
}
export function updateStatus(id,params) {
  return request({
    url:'/home/category/update/status/'+id,
    method:'post',
    params:params
  })
}
export function deleteHomeCategory(data) {
  return request({
    url:'/home/category/delete',
    method:'post',
    data:data
  })
}
export function createHomeCategory(data) {
  return request({
    url:'/home/category/create',
    method:'post',
    data:data
  })
}
export function getHomeCategory(id) {
  return request({
    url:'/home/category/'+id,
    method:'get',
  })
}

export function updateHomeCategory(id,data) {
  return request({
    url:'/home/category/update/'+id,
    method:'post',
    data:data
  })
}
