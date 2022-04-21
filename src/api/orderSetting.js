import request from '@/utils/request'
export function getOrderSetting() {
  return request({
    url:'/orderSetting/',
    method:'get',
  })
}

export function updateOrderSetting(data) {
  return request({
    url:'/orderSetting/update/',
    method:'post',
    data:data
  })
}
