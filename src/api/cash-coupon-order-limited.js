import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/coupon/cash/orderLimited/setting/list', queryInfo)
  },
  delete: (ids) => {
    return axios.post('/coupon/cash/orderLimited/setting/delete', {ids})
  },
  load: (id) => {
    return axios.get('/coupon/cash/orderLimited/setting/load/params/' + id)
  },
  save: (obj) => {
    return axios.post('/coupon/cash/orderLimited/setting/save', obj)
  }
}
