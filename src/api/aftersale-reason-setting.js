import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/afterSale/reason/setting/list', queryInfo)
  },
  load: (id) => {
    return axios.get('/afterSale/reason/setting/load/params/' + id)
  },
  save: (obj) => {
    return axios.post('/afterSale/reason/setting/save', obj)
  },
  delete: (id) => {
    return axios.get('/afterSale/reason/setting/delete/params/' + id)
  }
}
