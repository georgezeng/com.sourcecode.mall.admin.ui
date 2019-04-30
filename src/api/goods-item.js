import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/goods/item/list', queryInfo)
  },
  load: (id) => {
    return axios.get('/goods/item/load/params/' + id)
  },
  save: (obj) => {
    return axios.post('/goods/item/save', obj)
  },
  updateStatus: (ids, status) => {
    return axios.post('/goods/item/updateStatus/params/' + status, { ids })
  },
  delete: (ids) => {
    return axios.post('/goods/item/delete', { ids })
  }
}
