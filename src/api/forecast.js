import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/dateHandle/forecastShopSale',
    method:'get',
    params:params
  })
}
export function getAnalysis(params) {
  return request({
    url:'/dateHandle/analysisShop',
    method:'get',
    params:params
  })
}
