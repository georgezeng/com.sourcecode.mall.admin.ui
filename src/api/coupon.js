import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/coupon/setting/list', queryInfo)
  },
  delete: (ids) => {
    return axios.post('/coupon/setting/delete', {ids})
  },
  load: (id) => {
    return axios.get('/coupon/setting/load/params/' + id)
  },
  saveBaseInfo: (obj) => {
    return axios.post('/coupon/setting/save/baseInfo', obj)
  },
  saveZsCondition: (obj) => {
    return axios.post('/coupon/setting/save/condition/zs', obj)
  },
  saveHxCondition: (obj) => {
    return axios.post('/coupon/setting/save/condition/hx', obj)
  },
  listClient: (queryInfo) => {
    return axios.post('/coupon/client/list', queryInfo)
  },
  updateStatus: (ids, status) => {
    return axios.post('/coupon/setting/updateStatus/params/' + status, {ids})
  }
}
