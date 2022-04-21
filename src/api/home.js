import request from '@/utils/request'


export function orderStatistics() {
  return request({
    url: '/home/order/order_statistics',
    method: 'get'
  })
}
export function returnOrder() {
  return request({
    url: '/home/order/return_order',
    method: 'get'
  })
}
export function ProductStatistics() {
  return request({
    url: '/home/order/shop_statistics',
    method: 'get'
  })
}
export function UserStatistics() {
  return request({
    url: '/home/order/user_statistics',
    method: 'get'
  })
}
export function mapStatistics(params) {
  return request({
    url:'/home/order/map_statistics',
    method:'get',
    params:params
  })
}
