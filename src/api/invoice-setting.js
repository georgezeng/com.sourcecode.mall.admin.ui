import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/invoice/setting/list', queryInfo)
  },
  load: (id) => {
    return axios.get('/invoice/setting/load/params/' + id)
  },
  save: (obj) => {
    return axios.post('/invoice/setting/save', obj)
  },
  delete: (id) => {
    return axios.get('/invoice/setting/delete/params/' + id)
  }
}
