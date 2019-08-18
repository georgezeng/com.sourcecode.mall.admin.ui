import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/coupon/cash/setting/list', queryInfo)
  },
  delete: (ids) => {
    return axios.post('/coupon/cash/setting/delete', {ids})
  },
  load: (id) => {
    return axios.get('/coupon/cash/setting/load/params/' + id)
  },
  saveBaseInfo: (obj) => {
    return axios.post('/coupon/cash/setting/save/baseInfo', obj)
  },
  saveZsCondition: (obj) => {
    return axios.post('/coupon/cash/setting/save/condition/zs', obj)
  },
  saveHxCondition: (obj) => {
    return axios.post('/coupon/cash/setting/save/condition/hx', obj)
  },
  listClient: (queryInfo) => {
    return axios.post('/coupon/cash/client/list', queryInfo)
  },
  updateStatus: (ids, status) => {
    return axios.post('/coupon/cash/setting/updateStatus/params/' + status, {ids})
  }
}
