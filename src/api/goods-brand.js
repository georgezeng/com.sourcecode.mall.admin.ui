import axios from '@/libs/api.request'

export default {
  list: (queryInfo) => {
    return axios.post('/goods/brand/list', queryInfo)
  },
  load: (id) => {
    return axios.get('/goods/brand/load/params/' + id)
  },
  save: (obj) => {
    return axios.post('/goods/brand/save', obj)
  },
  delete: (ids) => {
    return axios.post('/goods/brand/delete', { ids })
  }
}
