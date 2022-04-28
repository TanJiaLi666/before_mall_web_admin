import request from '@/utils/request'
export function sendComment(params) {
  return request({
    url:'/comment/send',
    method:'post',
    params:params
  })
}
