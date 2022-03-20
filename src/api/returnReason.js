import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/returnReason/list',
    method:'get',
    params:params
  })
}

export function deleteReason(params) {
  return request({
    url:'/returnReason/delete',
    method:'post',
    params:params
  })
}

export function updateStatus(data) {
  return request({
    url:'/returnReason/update/status',
    method:'post',
    params:data
  })
}

export function addReason(data) {
  return request({
    url:'/returnReason/create',
    method:'post',
    data:data
  })
}

export function getReasonDetail(id) {
  return request({
    url:'/returnReason/'+id,
    method:'get'
  })
}

export function updateReason(id,data) {
  return request({
    url:'/returnReason/update/'+id,
    method:'post',
    data:data
  })
}
