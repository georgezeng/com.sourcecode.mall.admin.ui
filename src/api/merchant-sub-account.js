import axios from '@/libs/api.request'
import qs from 'qs'

export default {
  list: (queryInfo) => {
    return axios.post('/merchant/subAccount/list', queryInfo)
  },
  delete: (ids) => {
    return axios.post('/merchant/subAccount/delete', { ids })
  },
  load: (id) => {
    return axios.get('/merchant/subAccount/one/params/' + id)
  },
  save: (obj) => {
    return axios.post('/merchant/subAccount/save', obj)
  },
  authorities: (queryInfo) => {
    return axios.post('/merchant/subAccount/authorities', queryInfo)
  },
  updateStatus: (ids, status) => {
    return axios.post('/merchant/subAccount/updateStatus/params/' + status, {ids})
  }
}
